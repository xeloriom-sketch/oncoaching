// ─────────────────────────────────────────────────────────────────────────────
// ON Coaching — Edge Function : email + push après soumission formulaire
//
// Secrets Supabase requis :
//   RESEND_API_KEY      — clé API Resend (domaine oncoaching.fr vérifié requis)
//   BREVO_API_KEY       — alt : clé API Brevo (prioritaire si définie)
//   SENDER_EMAIL        — adresse expéditeur vérifiée (ex: contact@oncoaching.fr)
//   VAPID_PRIVATE_KEY   — clé privée VAPID base64url
//   VAPID_PUBLIC_KEY    — clé publique VAPID base64url
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Config ────────────────────────────────────────────────────────────────────

const BRAND = {
  name:    "ON Coaching",
  gold:    "#C4903E",
  navy:    "#1C3A52",
  site:    "https://www.oncoaching.fr",
  phone:   "+33 06 63 04 18 12",
  email:   "contact@oncoaching.fr",
  address: "14 rue des écureuils, 71000 Sancé",
  logo:    "https://www.oncoaching.fr/faviconNoText.png",
};

const SERVICE_LABELS: Record<string, string> = {
  "coaching-de-vie":        "Coaching scolaire & étudiant",
  "coaching-de-carriere":   "Coaching jeunes & jeunes adultes",
  "coaching-d-equipe":      "Coaching & Neurofeedback",
  "coaching-de-dirigeants": "Coaching d'équipe",
  "autre":                  "Autre",
};

const TIME_LABELS: Record<string, string> = {
  "matin":       "Matin (8h–12h)",
  "apres-midi":  "Après-midi (14h–18h)",
  "flexible":    "Flexible",
};

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apikey, x-client-info",
};

// ── Base64url helpers ─────────────────────────────────────────────────────────

const toB64u = (b: Uint8Array) =>
  btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

const fromB64u = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

const concat = (...arrays: Uint8Array[]) => {
  const out = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0));
  let offset = 0;
  for (const a of arrays) { out.set(a, offset); offset += a.length; }
  return out;
};

// ── HKDF (SHA-256) ────────────────────────────────────────────────────────────

async function hmacSha256(key: Uint8Array, data: Uint8Array): Promise<Uint8Array> {
  const k = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", k, data));
}

async function hkdfExpand(prk: Uint8Array, info: Uint8Array, len: number): Promise<Uint8Array> {
  return (await hmacSha256(prk, concat(info, new Uint8Array([1])))).slice(0, len);
}

// ── VAPID JWT (ES256) ─────────────────────────────────────────────────────────

async function vapidJwt(endpoint: string): Promise<string> {
  const enc = new TextEncoder();
  const VAPID_PRIV = Deno.env.get("VAPID_PRIVATE_KEY")!;
  const VAPID_PUB  = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const pub = fromB64u(VAPID_PUB);

  const privKey = await crypto.subtle.importKey(
    "jwk",
    { kty: "EC", crv: "P-256", x: toB64u(pub.slice(1, 33)), y: toB64u(pub.slice(33, 65)), d: VAPID_PRIV, ext: true },
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );

  const { protocol, host } = new URL(endpoint);
  const hdr = toB64u(enc.encode(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const pay = toB64u(enc.encode(JSON.stringify({
    aud: `${protocol}//${host}`,
    exp: Math.floor(Date.now() / 1000) + 43200,
    sub: `mailto:${BRAND.email}`,
  })));

  const sig = new Uint8Array(
    await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, privKey, enc.encode(`${hdr}.${pay}`)),
  );

  return `${hdr}.${pay}.${toB64u(sig)}`;
}

// ── Web Push ──────────────────────────────────────────────────────────────────

async function encryptPush(plain: string, p256dhB64u: string, authB64u: string): Promise<Uint8Array> {
  const enc        = new TextEncoder();
  const recvPub    = fromB64u(p256dhB64u);
  const authSecret = fromB64u(authB64u);

  const senderKP  = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]);
  const senderPub = new Uint8Array(await crypto.subtle.exportKey("raw", senderKP.publicKey));

  const recvKey      = await crypto.subtle.importKey("raw", recvPub, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: "ECDH", public: recvKey }, senderKP.privateKey, 256));

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk1 = await hmacSha256(authSecret, sharedSecret);
  const ikm  = await hkdfExpand(prk1, concat(enc.encode("WebPush: info\x00"), recvPub, senderPub), 32);
  const prk2  = await hmacSha256(salt, ikm);
  const cek   = await hkdfExpand(prk2, enc.encode("Content-Encoding: aes128gcm\x00"), 16);
  const nonce = await hkdfExpand(prk2, enc.encode("Content-Encoding: nonce\x00"), 12);

  const aesKey      = await crypto.subtle.importKey("raw", cek, { name: "AES-GCM", length: 128 }, false, ["encrypt"]);
  const paddedPlain = concat(enc.encode(plain), new Uint8Array([2]));
  const ciphertext  = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv: nonce }, aesKey, paddedPlain));

  const header = new Uint8Array(86);
  header.set(salt);
  new DataView(header.buffer).setUint32(16, paddedPlain.length + 16, false);
  header[20] = 65;
  header.set(senderPub, 21);

  return concat(header, ciphertext);
}

async function sendPushToOne(
  endpoint: string, p256dh: string, auth: string, payload: Record<string, string>,
): Promise<number> {
  const VAPID_PUB = Deno.env.get("VAPID_PUBLIC_KEY")!;
  const body = await encryptPush(JSON.stringify(payload), p256dh, auth);
  const jwt  = await vapidJwt(endpoint);
  const resp = await fetch(endpoint, {
    method:  "POST",
    headers: {
      "Authorization":    `vapid t=${jwt},k=${VAPID_PUB}`,
      "Content-Type":     "application/octet-stream",
      "Content-Encoding": "aes128gcm",
      "TTL":              "60",
    },
    body,
  });
  return resp.status;
}

// ── Email (Brevo prioritaire, Resend fallback) ────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; error?: string }> {
  const brevoKey  = Deno.env.get("BREVO_API_KEY");
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const sender    = Deno.env.get("SENDER_EMAIL") ?? BRAND.email;

  if (brevoKey) {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method:  "POST",
      headers: { "api-key": brevoKey, "Content-Type": "application/json" },
      body:    JSON.stringify({
        sender:      { name: BRAND.name, email: sender },
        to:          [{ email: to }],
        replyTo:     { email: BRAND.email },
        subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) return { ok: false, error: `Brevo error ${res.status}: ${await res.text()}` };
    return { ok: true };
  }

  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method:  "POST",
      headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ from: `${BRAND.name} <${sender}>`, to: [to], reply_to: BRAND.email, subject, html }),
    });
    if (!res.ok) return { ok: false, error: `Resend error ${res.status}: ${await res.text()}` };
    return { ok: true };
  }

  return { ok: false, error: "No email provider configured (set BREVO_API_KEY or RESEND_API_KEY)" };
}

// ── HTML helpers ──────────────────────────────────────────────────────────────

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function row(label: string, value?: string): string {
  if (!value) return "";
  return `<tr>
    <td style="padding:5px 0;font-size:12px;font-weight:600;color:#9ca3af;width:120px;vertical-align:top;">${label}</td>
    <td style="padding:5px 0;font-size:13px;color:#1C3A52;font-weight:500;">${esc(value)}</td>
  </tr>`;
}

function rowLong(label: string, value?: string): string {
  if (!value) return "";
  return `<tr><td colspan="2" style="padding:10px 0 4px;font-size:12px;font-weight:600;color:#9ca3af;">${label}</td></tr>
  <tr><td colspan="2" style="padding:0 0 6px;font-size:13px;color:#374151;line-height:1.6;">${esc(value).replace(/\n/g, "<br>")}</td></tr>`;
}

function stepHtml(num: number, title: string, desc: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
  <tr>
    <td width="36" valign="top" style="padding-top:2px;">
      <div style="width:28px;height:28px;border-radius:50%;background:#C4903E;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">${num}</div>
    </td>
    <td style="padding-left:12px;">
      <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1C3A52;">${title}</p>
      <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">${desc}</p>
    </td>
  </tr></table>`;
}

function baseLayout(content: string, preheader: string): string {
  const { name, gold, navy, site, phone, email, address, logo } = BRAND;
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${name}</title></head>
<body style="margin:0;padding:0;background:#F4F1EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<span style="display:none;font-size:1px;color:#F4F1EC;max-height:0;overflow:hidden;">${preheader}</span>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F1EC;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
      <tr><td style="background:${navy};border-radius:24px 24px 0 0;padding:36px 40px 28px;text-align:center;">
        <img src="${logo}" width="48" height="48" alt="${name}" style="margin-bottom:16px;border-radius:12px;"/>
        <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${gold};">ON COACHING</p>
        <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;">MÂCON · SAÔNE-ET-LOIRE</p>
      </td></tr>
      <tr><td style="background:#fff;padding:40px 40px 32px;">${content}</td></tr>
      <tr><td style="background:#F4F1EC;border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:1px solid #e8e4de;">
        <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
          <a href="tel:${phone.replace(/\s/g,"")}" style="color:${navy};text-decoration:none;font-weight:600;">${phone}</a>
          &nbsp;·&nbsp;<a href="mailto:${email}" style="color:${navy};text-decoration:none;font-weight:600;">${email}</a>
        </p>
        <p style="margin:0;font-size:12px;color:#c4c4c4;">${address}</p>
        <p style="margin:12px 0 0;font-size:11px;"><a href="${site}" style="color:${gold};text-decoration:none;">${site}</a></p>
      </td></tr>
    </table>
  </td></tr>
</table></body></html>`;
}

// ── Email templates ───────────────────────────────────────────────────────────

interface Sub {
  type: string; name: string; email: string; phone?: string; service?: string;
  subject?: string; message?: string; preferred_date?: string; preferred_time?: string;
}

function formatDate(d?: string): string {
  if (!d) return "À définir";
  try {
    const s = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(d + "T12:00:00"));
    return s.charAt(0).toUpperCase() + s.slice(1);
  } catch { return d; }
}

function contactEmailHtml(s: Sub): string {
  const svc = SERVICE_LABELS[s.service ?? ""] ?? s.service ?? "";
  const firstName = s.name.split(" ")[0];
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND.navy};line-height:1.2;">
      Message bien reçu,<br/><span style="color:${BRAND.gold};">${esc(firstName)} !</span>
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Merci pour votre message. Nous vous répondrons dans les <strong style="color:${BRAND.navy};">24 heures</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;border-bottom:1px solid #f0ece6;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};">Récapitulatif</p>
      </td></tr>
      <tr><td style="padding:16px 24px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row("Nom", s.name)}${row("Email", s.email)}${row("Téléphone", s.phone)}${row("Service", svc)}${row("Sujet", s.subject)}${rowLong("Message", s.message)}
      </table></td></tr>
    </table>
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BRAND.site}/contact" style="display:inline-block;background:${BRAND.navy};color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">Visiter notre site</a>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1C3A52,#2a4f6e);border-radius:16px;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};">Le saviez-vous ?</p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.5;">
          Votre <strong style="color:#fff;">1er rendez-vous est offert</strong>, sans engagement.
        </p>
      </td></tr>
    </table>`;
  return baseLayout(content, `Merci ${firstName}, nous vous répondrons dans les 24h.`);
}

function rdvEmailHtml(s: Sub): string {
  const svc   = SERVICE_LABELS[s.service ?? ""] ?? s.service ?? "";
  const time  = TIME_LABELS[s.preferred_time ?? ""] ?? "Flexible";
  const date  = formatDate(s.preferred_date);
  const firstName = s.name.split(" ")[0];
  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND.navy};line-height:1.2;">
      Demande reçue,<br/><span style="color:${BRAND.gold};">${esc(firstName)} !</span>
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Votre demande de rendez-vous a bien été enregistrée. Nous vous confirmons dans les <strong style="color:${BRAND.navy};">24 heures</strong>.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.navy};border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};">Créneau souhaité</p>
        <p style="margin:0;font-size:20px;font-weight:800;color:#fff;line-height:1.3;">${date}</p>
        <p style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">${time}</p>
      </td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;border-bottom:1px solid #f0ece6;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.gold};">Vos coordonnées</p>
      </td></tr>
      <tr><td style="padding:16px 24px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${row("Nom", s.name)}${row("Email", s.email)}${row("Téléphone", s.phone)}${row("Programme", svc)}${rowLong("Note", s.message)}
      </table></td></tr>
    </table>
    <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND.navy};">Prochaines étapes</p>
    ${stepHtml(1, "Confirmation sous 24h", "Nous vérifions nos disponibilités et vous confirmons le rendez-vous par email ou téléphone.")}
    ${stepHtml(2, "Consultation gratuite", "Votre 1er rendez-vous de 45 min est entièrement offert, sans engagement de votre part.")}
    ${stepHtml(3, "Programme sur mesure", "Ensemble, nous définissons un accompagnement adapté à vos besoins et objectifs.")}
    <div style="text-align:center;margin:24px 0 8px;">
      <a href="tel:${BRAND.phone.replace(/\s/g,"")}" style="display:inline-block;background:${BRAND.gold};color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">📞 Appeler directement</a>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin:8px 0 0;">Ou répondez simplement à cet email</p>`;
  return baseLayout(content, `Votre RDV du ${date} est en cours de confirmation.`);
}

function adminEmailHtml(s: Sub): string {
  const svc      = SERVICE_LABELS[s.service ?? ""] ?? s.service ?? "";
  const time     = TIME_LABELS[s.preferred_time ?? ""] ?? "Flexible";
  const date     = formatDate(s.preferred_date);
  const label    = s.type === "rdv" ? "📅 Nouveau RDV" : "💬 Nouveau message";
  const now      = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date());
  const adminUrl = `${BRAND.site}/admin/messages`;

  const rows = row("Nom", s.name) + row("Email", s.email) + row("Téléphone", s.phone) + row("Service", svc)
    + (s.type === "rdv" ? row("Date souhaitée", date) + row("Créneau", time) : row("Sujet", s.subject))
    + rowLong("Message", s.message);

  const content = `
    <h1 style="margin:0 0 8px;font-size:24px;font-weight:800;color:${BRAND.navy};">${label}</h1>
    <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Reçu le ${now}</p>
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:16px 24px 4px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table></td></tr>
    </table>
    <div style="text-align:center;">
      <a href="${adminUrl}" style="display:inline-block;background:${BRAND.gold};color:#fff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;">Voir dans l'admin</a>
    </div>`;
  return baseLayout(content, `${label} de ${s.name}`);
}

function adminReplyHtml(recipientName: string, replyText: string): string {
  const firstName = recipientName.split(" ")[0];
  const content = `
    <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.7;white-space:pre-wrap;">${esc(replyText)}</p>
    <hr style="border:none;border-top:1px solid #f0ece6;margin:24px 0;"/>
    <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
      Pour répondre à ce message, répondez simplement à cet email.<br/>
      Votre réponse arrivera directement dans notre boîte mail.
    </p>`;
  return baseLayout(content, `Réponse de ON Coaching pour ${firstName}`);
}

// ── Helper : réponse JSON avec CORS ──────────────────────────────────────────

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function err(msg: string, status = 500): Response {
  console.error(`[send-confirmation] ${status} — ${msg}`);
  return json({ error: msg }, status);
}

// ── Handler principal ─────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST")    return err("Method Not Allowed", 405);

  let body: { record?: Sub; adminReply?: boolean; to?: string; recipientName?: string; subject?: string; replyText?: string };
  try { body = await req.json(); } catch { return err("Invalid JSON", 400); }

  try {

    // ── Réponse admin → client ────────────────────────────────────────────────
    if (body.adminReply) {
      const { to, recipientName = "", subject = "Réponse de ON Coaching", replyText = "" } = body;
      if (!to) return err("Missing 'to'", 400);

      const result = await sendEmail(to, subject, adminReplyHtml(recipientName, replyText));
      if (!result.ok) return err(result.error ?? "Email send failed", 500);
      return json({ ok: true });
    }

    // ── Nouvelle soumission formulaire ────────────────────────────────────────
    const s = body.record ?? (body as unknown as Sub);
    if (!s?.email || !s?.name) return err("Missing fields: email or name", 400);

    const time = TIME_LABELS[s.preferred_time ?? ""] ?? "Flexible";
    const date = formatDate(s.preferred_date);

    // 1 — Email de confirmation au client
    const clientSubject = s.type === "rdv"
      ? `📅 Demande de RDV confirmée — ${BRAND.name}`
      : `✅ Votre message a bien été reçu — ${BRAND.name}`;
    const clientResult = await sendEmail(s.email, clientSubject, s.type === "rdv" ? rdvEmailHtml(s) : contactEmailHtml(s));
    if (!clientResult.ok) console.error("Client email failed:", clientResult.error);

    // 2 — Email de notification à l'admin
    const adminResult = await sendEmail(
      BRAND.email,
      (s.type === "rdv" ? "📅 Nouveau RDV" : "💬 Nouveau message") + ` — ${s.name}`,
      adminEmailHtml(s),
    );
    if (!adminResult.ok) console.error("Admin email failed:", adminResult.error);

    // 3 — Notifications push admin
    const VAPID_PRIV = Deno.env.get("VAPID_PRIVATE_KEY");
    if (VAPID_PRIV) {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );
      const { data: subs } = await supabase.from("push_subscriptions").select("endpoint,p256dh,auth");

      await Promise.all(
        (subs ?? []).map(async (sub: { endpoint: string; p256dh: string; auth: string }) => {
          try {
            const status = await sendPushToOne(sub.endpoint, sub.p256dh, sub.auth, {
              title: s.type === "rdv" ? `📅 Nouveau RDV — ${s.name}` : `💬 Nouveau message — ${s.name}`,
              body:  s.type === "rdv" ? `${date} · ${time}` : (s.subject || (s.message ?? "").slice(0, 80) || "Nouveau contact"),
              url:   "/admin/messages",
            });
            if (status === 410 || status === 404) {
              await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
            }
          } catch (e) {
            console.error("Push error:", e);
          }
        }),
      );
    }

    return json({ ok: true });

  } catch (e: unknown) {
    return err(e instanceof Error ? e.message : String(e), 500);
  }
});
