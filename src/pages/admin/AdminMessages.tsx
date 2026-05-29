import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Submission } from "@/types/admin";
import { fadeInUp, staggerFast, pulseDot } from "@/lib/motion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY = "#1C3A52";
const GOLD = "#C4903E";

// ─── Date helpers ─────────────────────────────────────────────────────────────
function formatListDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return raw;
  const dateStr = dt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  const time = `${String(dt.getHours()).padStart(2, "0")}h${String(dt.getMinutes()).padStart(2, "0")}`;
  return `${dateStr} · ${time}`;
}

function formatDetailDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return raw;
  const dateStr = dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const time = `${String(dt.getHours()).padStart(2, "0")}h${String(dt.getMinutes()).padStart(2, "0")}`;
  return `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} à ${time}`;
}

function formatRdvDate(raw: string): string {
  if (!raw) return "";
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const s = dt.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonItem = () => (
  <div className="px-4 py-4 border-b border-slate-100 animate-pulse">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-2 h-2 rounded-full bg-slate-200" />
      <div className="h-3 bg-slate-100 rounded w-20" />
    </div>
    <div className="h-4 bg-slate-100 rounded w-3/4 mb-1" />
    <div className="h-3 bg-slate-100 rounded w-1/2 mb-2" />
    <div className="h-3 bg-slate-100 rounded w-full" />
  </div>
);

// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (
  <motion.div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center"
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <svg className="w-20 h-20 text-slate-200 mb-6" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 19.5v-6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5L12 9l9.75 4.5" />
    </svg>
    <p className="text-lg font-semibold text-slate-400 mb-1">Aucun message reçu</p>
    <p className="text-sm text-slate-300">Les soumissions du formulaire de contact apparaîtront ici.</p>
  </motion.div>
);

// ─── Placeholder détail ───────────────────────────────────────────────────────
const DetailPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
    <svg className="w-14 h-14 text-slate-200 mb-4" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
    </svg>
    <p className="text-slate-400 text-sm">Sélectionnez un message</p>
  </div>
);

// ─── Badge type ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type, size = "sm" }: { type: "contact" | "rdv"; size?: "sm" | "md" }) => {
  const base = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  if (type === "rdv") return <span className={`${base} rounded-full font-semibold tracking-wide text-white`} style={{ backgroundColor: NAVY }}>RDV</span>;
  return <span className={`${base} rounded-full font-semibold tracking-wide bg-slate-100 text-slate-600`}>Contact</span>;
};

// ─── List item ────────────────────────────────────────────────────────────────
interface ListItemProps {
  sub: Submission;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
}

const ListItem = ({ sub, isSelected, onClick, onDelete }: ListItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const unread = !sub.read;

  async function quickDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirmingDelete) { setConfirmingDelete(true); return; }
    setDeleting(true);
    const { error } = await supabase.from("submissions").delete().eq("id", sub.id);
    if (error) { alert("Erreur : " + error.message); setDeleting(false); return; }
    onDelete(sub.id);
  }

  return (
    <motion.div
      variants={fadeInUp}
      className="relative border-b border-slate-100"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setConfirmingDelete(false); }}
    >
      <button
        onClick={onClick}
        className="w-full text-left px-4 py-4 transition-colors focus:outline-none"
        style={{
          backgroundColor: isSelected ? `${GOLD}14` : undefined,
          borderLeft: isSelected ? `3px solid ${GOLD}` : "3px solid transparent",
          paddingRight: hovered ? 52 : 16,
        }}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2">
            {unread && <motion.span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" animate={pulseDot.animate} transition={pulseDot.transition} />}
            <TypeBadge type={sub.type} />
          </div>
          <span className="text-[11px] text-slate-400 flex-shrink-0">{formatListDate(sub.created_at)}</span>
        </div>
        <p className={`text-sm font-semibold mb-0.5 ${unread ? "text-slate-800" : "text-slate-600"}`}>{sub.name}</p>
        <p className="text-xs text-slate-500 truncate mb-1">{sub.type === "contact" ? (sub.subject ?? "") : (sub.service ?? "Demande de RDV")}</p>
        {(sub.message || sub.note) && (
          <p className="text-xs text-slate-400 line-clamp-2">{sub.type === "contact" ? sub.message : sub.note}</p>
        )}
      </button>

      {/* Bouton supprimer rapide */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            onClick={quickDelete}
            disabled={deleting}
            title={confirmingDelete ? "Cliquer pour confirmer" : "Supprimer"}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: confirmingDelete ? "#ef4444" : "#fee2e2",
              color: confirmingDelete ? "white" : "#ef4444",
            }}
          >
            {deleting ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {confirmingDelete && <span>Confirmer</span>}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Détail du message ────────────────────────────────────────────────────────
interface DetailProps {
  sub: Submission;
  onBack?: () => void;
  onDeleted?: (id: string) => void;
  onMarkUnread?: (id: string) => void;
}

const MessageDetail = ({ sub, onBack, onDeleted, onMarkUnread }: DetailProps) => {
  const [replyOpen, setReplyOpen]       = useState(false);
  const [replySubject, setReplySubject] = useState("");
  const [replyText, setReplyText]       = useState("");
  const [replying, setReplying]         = useState(false);
  const [replyDone, setReplyDone]       = useState(false);
  const [replyError, setReplyError]     = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting]         = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setReplyOpen(false);
    setReplyDone(false);
    setReplyText("");
    setReplyError(null);
    setConfirmDelete(false);
  }, [sub.id]);

  function openReply() {
    const subject = sub.type === "contact" ? `Re: ${sub.subject ?? "Votre message"}` : "Confirmation de votre rendez-vous";
    setReplySubject(subject);
    setReplyText(`Bonjour ${sub.name.split(" ")[0]},\n\n`);
    setReplyError(null);
    setReplyOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 80);
  }

  async function handleSend() {
    if (!replyText.trim()) return;
    setReplying(true);
    setReplyError(null);
    try {
      const originalMessage = sub.type === "contact"
        ? sub.message ?? ""
        : [
            sub.preferred_date ? `Date souhaitée : ${formatRdvDate(sub.preferred_date)}` : "",
            sub.preferred_time ? `Horaire : ${sub.preferred_time}` : "",
            sub.service ? `Service : ${sub.service}` : "",
            sub.note ? `Note : ${sub.note}` : "",
          ].filter(Boolean).join("\n");

      const { error } = await supabase.functions.invoke("send-confirmation", {
        body: { adminReply: true, to: sub.email, recipientName: sub.name, subject: replySubject, replyText, originalMessage },
      });
      if (error) {
        let detail = error.message;
        try {
          const ctx = (error as { context?: Response }).context;
          if (ctx) { const b = await ctx.json(); if (b?.error) detail = b.error; }
        } catch { /* ignore */ }
        throw new Error(detail);
      }
      setReplyDone(true);
      setReplyOpen(false);
    } catch (err: unknown) {
      setReplyError(err instanceof Error ? err.message : "Erreur lors de l'envoi.");
    } finally {
      setReplying(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const { error } = await supabase.from("submissions").delete().eq("id", sub.id);
    if (error) { alert("Erreur : " + error.message); setDeleting(false); setConfirmDelete(false); return; }
    onDeleted?.(sub.id);
  }

  async function handleMarkUnread() {
    await supabase.from("submissions").update({ read: false }).eq("id", sub.id);
    onMarkUnread?.(sub.id);
  }

  return (
    <motion.div key={sub.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full overflow-y-auto">

      {/* Back button mobile */}
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-2 px-6 pt-5 pb-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors lg:hidden">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>
      )}

      <div className="px-6 py-5 border-b border-slate-100">
        {/* Badge + date */}
        <div className="flex items-center gap-3 mb-3">
          <TypeBadge type={sub.type} size="md" />
          <span className="text-xs text-slate-400">{formatDetailDate(sub.created_at)}</span>
        </div>

        {/* Expéditeur */}
        <h2 className="text-xl font-bold text-slate-800 mb-1 truncate">{sub.name}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <a href={`mailto:${sub.email}`} className="hover:underline truncate" style={{ color: GOLD }}>{sub.email}</a>
          {sub.phone && <span>{sub.phone}</span>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4">
          {/* Répondre */}
          <button onClick={openReply}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Répondre
          </button>

          {/* Marquer non lu */}
          {sub.read && (
            <button onClick={handleMarkUnread}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Non lu
            </button>
          )}

          {/* Supprimer */}
          <button onClick={handleDelete} disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
            style={{
              background: confirmDelete ? "#ef4444" : "#fee2e2",
              color: confirmDelete ? "white" : "#ef4444",
            }}>
            {deleting ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
            {confirmDelete ? "Confirmer la suppression" : "Supprimer"}
          </button>

          {/* Annuler suppression */}
          <AnimatePresence>
            {confirmDelete && !deleting && (
              <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setConfirmDelete(false)}
                className="inline-flex items-center px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Annuler
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Banners */}
        <AnimatePresence>
          {replyDone && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Email envoyé avec succès ✓
            </motion.div>
          )}
        </AnimatePresence>

        {/* Panel de réponse */}
        <AnimatePresence>
          {replyOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1 block">Objet</label>
                  <input type="text" value={replySubject} onChange={e => setReplySubject(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": GOLD } as React.CSSProperties} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1 block">Message</label>
                  <textarea ref={textareaRef} rows={6} value={replyText} onChange={e => setReplyText(e.target.value)}
                    className="w-full text-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 resize-y focus:outline-none focus:ring-2"
                    style={{ "--tw-ring-color": GOLD } as React.CSSProperties} />
                </div>
                {replyError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 break-all">{replyError}</p>
                )}
                <div className="flex gap-2">
                  <button onClick={handleSend} disabled={replying || !replyText.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: GOLD }}>
                    {replying ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>Envoi…</>
                    ) : "Envoyer"}
                  </button>
                  <button onClick={() => setReplyOpen(false)} disabled={replying}
                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50">
                    Annuler
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contenu du message */}
      <div className="px-6 py-5 space-y-5 flex-1">
        {sub.type === "contact" ? (
          <>
            {sub.subject && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Sujet</label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: NAVY }}>{sub.subject}</span>
              </section>
            )}
            {sub.service && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Service</label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">{sub.service}</span>
              </section>
            )}
            {sub.message && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Message</label>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 italic whitespace-pre-wrap leading-relaxed">{sub.message}</p>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <section>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 block">Disponibilités souhaitées</label>
              <div className="space-y-2">
                {sub.preferred_date && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-xl p-3" style={{ backgroundColor: `${GOLD}18` }}>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>1er choix</span>
                    <span className="text-sm font-semibold text-slate-700">{formatRdvDate(sub.preferred_date)}</span>
                    {sub.preferred_time && <span className="text-sm font-bold" style={{ color: GOLD }}>{sub.preferred_time}</span>}
                  </div>
                )}
                {sub.preferred_date2 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-slate-100 rounded-xl p-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">2e choix</span>
                    <span className="text-sm font-semibold text-slate-600">{formatRdvDate(sub.preferred_date2)}</span>
                    {sub.preferred_time2 && <span className="text-sm font-bold text-slate-500">{sub.preferred_time2}</span>}
                  </div>
                )}
              </div>
            </section>
            {sub.session_format && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Format</label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">{sub.session_format}</span>
              </section>
            )}
            {sub.service && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Service souhaité</label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white" style={{ backgroundColor: NAVY }}>{sub.service}</span>
              </section>
            )}
            {sub.note && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">Note</label>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 italic whitespace-pre-wrap leading-relaxed">{sub.note}</p>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
};

// ─── Filtre tabs ──────────────────────────────────────────────────────────────
type Filter = "all" | "contact" | "rdv" | "unread";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all",     label: "Tous"    },
  { key: "contact", label: "Contact" },
  { key: "rdv",     label: "RDV"     },
  { key: "unread",  label: "Non lus" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminMessages() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<Filter>("all");
  const [selected, setSelected]       = useState<Submission | null>(null);
  const [mobileView, setMobileView]   = useState<"list" | "detail">("list");

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase.from("submissions").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) { console.error("AdminMessages:", error); setSubmissions([]); }
        else setSubmissions((data ?? []) as Submission[]);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ── Realtime ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("submissions-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "submissions" }, payload => {
        setSubmissions(prev => [payload.new as Submission, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Actions ────────────────────────────────────────────────────────────────
  async function markRead(s: Submission) {
    if (s.read) return;
    await supabase.from("submissions").update({ read: true }).eq("id", s.id);
    setSubmissions(prev => prev.map(x => x.id === s.id ? { ...x, read: true } : x));
    setSelected(prev => prev?.id === s.id ? { ...prev, read: true } : prev);
  }

  function handleDeleted(id: string) {
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (selected?.id === id) { setSelected(null); setMobileView("list"); }
  }

  function handleMarkUnread(id: string) {
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, read: false } : s));
    setSelected(prev => prev?.id === id ? { ...prev, read: false } : prev);
  }

  const handleSelect = (s: Submission) => { markRead(s); setSelected(s); setMobileView("detail"); };

  const filtered = submissions.filter(s => {
    if (filter === "contact") return s.type === "contact";
    if (filter === "rdv")     return s.type === "rdv";
    if (filter === "unread")  return !s.read;
    return true;
  });

  const unreadCount = submissions.filter(s => !s.read).length;

  return (
    <div className="flex flex-col bg-white font-sans h-full min-h-[calc(100svh-3.5rem-5rem)] lg:min-h-0 lg:h-screen">

      {/* Header */}
      <header className="flex-shrink-0 px-6 pt-8 pb-4 border-b border-slate-100" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold truncate" style={{ color: NAVY }}>Messages</h1>
          {!loading && submissions.length > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white flex-shrink-0" style={{ backgroundColor: GOLD }}>
              {submissions.length} message{submissions.length > 1 ? "s" : ""}
            </span>
          )}
          {!loading && unreadCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white flex-shrink-0">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 scrollbar-none">
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex-shrink-0"
                style={active ? { backgroundColor: NAVY, color: "#fff" } : { backgroundColor: "transparent", color: "#64748B", border: "1px solid #E2E8F0" }}>
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">{unreadCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body split */}
      <div className="flex flex-1 overflow-hidden">

        {/* Liste */}
        <div className={`flex-shrink-0 overflow-y-auto border-r border-slate-100 lg:block lg:w-[380px] ${mobileView === "list" ? "block w-full" : "hidden"}`}>
          {loading ? (
            [...Array(5)].map((_, i) => <SkeletonItem key={i} />)
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div variants={staggerFast} initial="hidden" animate="visible">
              {filtered.map(s => (
                <ListItem key={s.id} sub={s} isSelected={selected?.id === s.id}
                  onClick={() => handleSelect(s)} onDelete={handleDeleted} />
              ))}
            </motion.div>
          )}
        </div>

        {/* Détail */}
        <div className={`flex-1 overflow-hidden lg:block ${mobileView === "detail" ? "block w-full" : "hidden"}`}>
          <AnimatePresence mode="wait">
            {selected ? (
              <MessageDetail key={selected.id} sub={selected} onBack={() => setMobileView("list")}
                onDeleted={handleDeleted} onMarkUnread={handleMarkUnread} />
            ) : (
              <motion.div key="placeholder" className="flex h-full items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <DetailPlaceholder />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
