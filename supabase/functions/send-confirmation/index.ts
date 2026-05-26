// ─────────────────────────────────────────────────────────────────────────────
// ON Coaching — Edge Function : envoi email de confirmation
// Déclenchée par un Database Webhook sur INSERT dans submissions
// Variables d'environnement requises :
//   RESEND_API_KEY  — clé API Resend (https://resend.com)
//   FROM_EMAIL      — ex: "ON Coaching <noreply@oncoaching.fr>"
// ─────────────────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  type: "contact" | "rdv";
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject?: string;
  message?: string;
  preferred_date?: string;
  preferred_time?: string;
  created_at: string;
}

const BRAND = {
  name:    "ON Coaching",
  color:   "#C4903E",
  navy:    "#1C3A52",
  site:    "https://www.oncoaching.fr",
  phone:   "+33 06 63 04 18 12",
  email:   "contact@oncoaching.fr",
  address: "14 rue des écureuils, 71000 Sancé",
  logo:    "https://xeloriom-sketch.github.io/oncoaching/faviconNoText.png",
};

const SERVICE_LABELS: Record<string, string> = {
  "coaching-de-vie":      "Coaching scolaire & étudiant",
  "coaching-de-carriere": "Coaching jeunes & jeunes adultes",
  "coaching-d-equipe":    "Coaching & Neurofeedback",
  "coaching-de-dirigeants": "Coaching d'équipe",
  "autre":                "Autre",
};

const TIME_LABELS: Record<string, string> = {
  matin:       "Matin (8h–12h)",
  "apres-midi": "Après-midi (14h–18h)",
  flexible:    "Flexible",
};

// ── Templates HTML ─────────────────────────────────────────────────────────────

function baseLayout(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND.name}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#F4F1EC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <!-- Preheader invisible -->
  <span style="display:none;font-size:1px;color:#F4F1EC;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F1EC;min-height:100vh;">
    <tr><td align="center" style="padding:40px 16px;">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

        <!-- Header Navy -->
        <tr>
          <td style="background:${BRAND.navy};border-radius:24px 24px 0 0;padding:36px 40px 28px;text-align:center;">
            <img src="${BRAND.logo}" width="48" height="48" alt="${BRAND.name}" style="margin-bottom:16px;border-radius:12px;" />
            <p style="margin:0;font-size:13px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${BRAND.color};">ON COACHING</p>
            <p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.4);letter-spacing:1px;">MÂCON · SAÔNE-ET-LOIRE</p>
          </td>
        </tr>

        <!-- Body White -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F4F1EC;border-radius:0 0 24px 24px;padding:24px 40px;text-align:center;border-top:1px solid #e8e4de;">
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
              <a href="tel:${BRAND.phone.replace(/\s/g,'')}" style="color:${BRAND.navy};text-decoration:none;font-weight:600;">${BRAND.phone}</a>
              &nbsp;·&nbsp;
              <a href="mailto:${BRAND.email}" style="color:${BRAND.navy};text-decoration:none;font-weight:600;">${BRAND.email}</a>
            </p>
            <p style="margin:0;font-size:12px;color:#c4c4c4;">${BRAND.address}</p>
            <p style="margin:12px 0 0;font-size:11px;color:#d1d5db;">
              <a href="${BRAND.site}" style="color:${BRAND.color};text-decoration:none;">${BRAND.site}</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "À définir";
  try {
    return new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(dateStr + "T12:00:00"));
  } catch {
    return dateStr;
  }
}

// ── Email contact ──────────────────────────────────────────────────────────────
function contactEmail(s: Submission): { subject: string; html: string } {
  const service = SERVICE_LABELS[s.service ?? ""] ?? s.service ?? "";

  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND.navy};line-height:1.2;">
      Message bien reçu,<br/><span style="color:${BRAND.color};">${s.name.split(" ")[0]} !</span>
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Merci pour votre message. Nous vous répondrons dans les <strong style="color:${BRAND.navy};">24 heures</strong>.
    </p>

    <!-- Récap -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;border-bottom:1px solid #f0ece6;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.color};">Récapitulatif</p>
      </td></tr>
      <tr><td style="padding:16px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row("Nom", s.name)}
          ${row("Email", s.email)}
          ${s.phone ? row("Téléphone", s.phone) : ""}
          ${service ? row("Service", service) : ""}
          ${s.subject ? row("Sujet", s.subject) : ""}
          ${s.message ? rowLong("Message", s.message) : ""}
        </table>
      </td></tr>
    </table>

    <!-- CTA -->
    <div style="text-align:center;margin-bottom:28px;">
      <a href="${BRAND.site}/contact" style="display:inline-block;background:${BRAND.navy};color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;">
        Visiter notre site
      </a>
    </div>

    <!-- Badge RDV gratuit -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:linear-gradient(135deg,#1C3A52,#2a4f6e);border-radius:16px;overflow:hidden;">
      <tr><td style="padding:20px 24px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.color};">Le saviez-vous ?</p>
        <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.85);line-height:1.5;">
          Votre <strong style="color:#ffffff;">1er rendez-vous est offert</strong>, sans engagement. C'est l'occasion de faire connaissance et de définir ensemble votre programme.
        </p>
      </td></tr>
    </table>
  `;

  return {
    subject: `✅ Votre message a bien été reçu — ${BRAND.name}`,
    html: baseLayout(content, `Merci ${s.name.split(" ")[0]}, nous vous répondrons dans les 24h.`),
  };
}

// ── Email RDV ──────────────────────────────────────────────────────────────────
function rdvEmail(s: Submission): { subject: string; html: string } {
  const service  = SERVICE_LABELS[s.service ?? ""] ?? s.service ?? "";
  const timeSlot = TIME_LABELS[s.preferred_time ?? ""] ?? s.preferred_time ?? "Flexible";
  const dateStr  = formatDate(s.preferred_date);

  const content = `
    <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:${BRAND.navy};line-height:1.2;">
      Demande reçue,<br/><span style="color:${BRAND.color};">${s.name.split(" ")[0]} !</span>
    </h1>
    <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
      Votre demande de rendez-vous a bien été enregistrée. Nous vous confirmons le créneau dans les <strong style="color:${BRAND.navy};">24 heures</strong>.
    </p>

    <!-- Créneau mis en avant -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.navy};border-radius:16px;overflow:hidden;margin-bottom:24px;">
      <tr><td style="padding:24px 28px;">
        <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.color};">Créneau souhaité</p>
        <p style="margin:0;font-size:20px;font-weight:800;color:#ffffff;line-height:1.3;text-transform:capitalize;">${dateStr}</p>
        <p style="margin:4px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">${timeSlot}</p>
      </td></tr>
    </table>

    <!-- Récap -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F9F7F4;border-radius:16px;overflow:hidden;margin-bottom:28px;">
      <tr><td style="padding:20px 24px;border-bottom:1px solid #f0ece6;">
        <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${BRAND.color};">Vos coordonnées</p>
      </td></tr>
      <tr><td style="padding:16px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          ${row("Nom", s.name)}
          ${row("Email", s.email)}
          ${s.phone ? row("Téléphone", s.phone) : ""}
          ${service ? row("Programme", service) : ""}
          ${s.message ? rowLong("Note", s.message) : ""}
        </table>
      </td></tr>
    </table>

    <!-- Étapes suivantes -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
      <tr><td>
        <p style="margin:0 0 14px;font-size:13px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND.navy};">Prochaines étapes</p>
      </td></tr>
      <tr><td>
        ${step("1", "Confirmation sous 24h", "Nous vérifions nos disponibilités et vous confirmons le rendez-vous par email ou téléphone.")}
        ${step("2", "Consultation gratuite", "Votre 1er rendez-vous de 45 min est entièrement offert, sans engagement de votre part.")}
        ${step("3", "Programme sur mesure", "Ensemble, nous définissons un accompagnement adapté à vos besoins et objectifs.")}
      </td></tr>
    </table>

    <!-- CTA appel direct -->
    <div style="text-align:center;margin-bottom:8px;">
      <a href="tel:${BRAND.phone.replace(/\s/g,'')}" style="display:inline-block;background:${BRAND.color};color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.3px;">
        📞 Appeler directement
      </a>
    </div>
    <p style="text-align:center;font-size:12px;color:#9ca3af;margin:8px 0 0;">Ou répondez simplement à cet email</p>
  `;

  return {
    subject: `📅 Demande de RDV confirmée — ${BRAND.name}`,
    html: baseLayout(content, `Votre rendez-vous du ${dateStr} est en cours de confirmation.`),
  };
}

// ── Helpers layout ─────────────────────────────────────────────────────────────
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:5px 0;font-size:12px;font-weight:600;color:#9ca3af;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:5px 0;font-size:13px;color:#1C3A52;font-weight:500;">${value}</td>
    </tr>`;
}

function rowLong(label: string, value: string): string {
  return `
    <tr>
      <td colspan="2" style="padding:10px 0 4px;font-size:12px;font-weight:600;color:#9ca3af;">${label}</td>
    </tr>
    <tr>
      <td colspan="2" style="padding:0 0 6px;font-size:13px;color:#374151;line-height:1.6;white-space:pre-wrap;">${value}</td>
    </tr>`;
}

function step(num: string, title: string, desc: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;">
      <tr>
        <td width="36" valign="top" style="padding-top:2px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#C4903E;text-align:center;line-height:28px;font-size:12px;font-weight:800;color:#fff;">${num}</div>
        </td>
        <td style="padding-left:12px;">
          <p style="margin:0 0 2px;font-size:13px;font-weight:700;color:#1C3A52;">${title}</p>
          <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">${desc}</p>
        </td>
      </tr>
    </table>`;
}

// ── Handler principal ──────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Supabase DB Webhook envoie un POST avec { type, table, record, ... }
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  const FROM_EMAIL    = Deno.env.get("FROM_EMAIL") ?? `${BRAND.name} <noreply@${BRAND.email.split("@")[1]}>`;

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY manquant");
    return new Response("RESEND_API_KEY not set", { status: 500 });
  }

  let body: { record?: Submission };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const submission = body.record;
  if (!submission?.email || !submission?.name) {
    return new Response("Missing fields", { status: 400 });
  }

  const { subject, html } =
    submission.type === "rdv"
      ? rdvEmail(submission)
      : contactEmail(submission);

  // Envoyer via Resend
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:    FROM_EMAIL,
      to:      [submission.email],
      reply_to: BRAND.email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return new Response(`Resend error: ${err}`, { status: 500 });
  }

  const data = await res.json();
  console.log("Email envoyé:", data.id, "→", submission.email);

  return new Response(JSON.stringify({ ok: true, id: data.id }), {
    headers: { "Content-Type": "application/json" },
  });
});
