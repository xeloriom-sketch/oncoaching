import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import type { Submission } from "@/types/admin";
import { fadeInUp, staggerFast, pulseDot } from "@/lib/motion";

// ─── Design tokens ────────────────────────────────────────────────────────────
const NAVY = "#1C3A52";
const GOLD = "#C4903E";

// ─── Date helpers ──────────────────────────────────────────────────────────────
/** ISO string  →  "12 jan. 2025 · 14h30" */
function formatListDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return raw;
  const dateStr = dt.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = `${String(dt.getHours()).padStart(2, "0")}h${String(dt.getMinutes()).padStart(2, "0")}`;
  return `${dateStr} · ${time}`;
}

/** ISO string  →  "Dimanche 12 janvier 2025 à 14h30" */
function formatDetailDate(raw: string): string {
  if (!raw) return raw;
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return raw;
  const dateStr = dt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = `${String(dt.getHours()).padStart(2, "0")}h${String(dt.getMinutes()).padStart(2, "0")}`;
  const capitalized = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  return `${capitalized} à ${time}`;
}

/** "2025-01-12"  →  "Lundi 12 janvier 2025" */
function formatRdvDate(raw: string): string {
  if (!raw) return "";
  const [y, m, d] = raw.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dateStr = dt.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

// ─── Mailto builder ────────────────────────────────────────────────────────────
function buildMailto(s: Submission): string {
  if (s.type === "contact") {
    const subject = encodeURIComponent(`Re: ${s.subject ?? "Votre message"}`);
    const body = encodeURIComponent(`Bonjour ${s.name},\n\n`);
    return `mailto:${s.email}?subject=${subject}&body=${body}`;
  } else {
    const subject = encodeURIComponent("Confirmation de votre demande de rendez-vous");
    const rdvDate = s.preferred_date ? formatRdvDate(s.preferred_date) : "";
    const body = encodeURIComponent(
      `Bonjour ${s.name},\n\nNous avons bien reçu votre demande de rendez-vous pour le ${rdvDate}.\n\n`
    );
    return `mailto:${s.email}?subject=${subject}&body=${body}`;
  }
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
  <motion.div
    className="flex flex-col items-center justify-center h-full py-24 px-8 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <svg
      className="w-20 h-20 text-slate-200 mb-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 13.5V6.75A2.25 2.25 0 014.5 4.5h15a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 19.5v-6z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5L12 9l9.75 4.5" />
    </svg>
    <p className="text-lg font-semibold text-slate-400 mb-1">Aucun message reçu</p>
    <p className="text-sm text-slate-300">
      Les soumissions du formulaire de contact apparaîtront ici.
    </p>
  </motion.div>
);

// ─── Placeholder détail ───────────────────────────────────────────────────────
const DetailPlaceholder = () => (
  <div className="flex flex-col items-center justify-center h-full py-24 px-8 text-center">
    <svg
      className="w-14 h-14 text-slate-200 mb-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.981l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z"
      />
    </svg>
    <p className="text-slate-400 text-sm">Sélectionnez un message</p>
  </div>
);

// ─── Badge type ───────────────────────────────────────────────────────────────
const TypeBadge = ({ type, size = "sm" }: { type: "contact" | "rdv"; size?: "sm" | "md" }) => {
  const base = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  if (type === "rdv") {
    return (
      <span
        className={`${base} rounded-full font-semibold tracking-wide text-white`}
        style={{ backgroundColor: NAVY }}
      >
        RDV
      </span>
    );
  }
  return (
    <span className={`${base} rounded-full font-semibold tracking-wide bg-slate-100 text-slate-600`}>
      Contact
    </span>
  );
};

// ─── Liste item ───────────────────────────────────────────────────────────────
interface ListItemProps {
  sub: Submission;
  isSelected: boolean;
  onClick: () => void;
}

const ListItem = ({ sub, isSelected, onClick }: ListItemProps) => {
  const unread = !sub.read;
  return (
    <motion.button
      variants={fadeInUp}
      onClick={onClick}
      className="w-full text-left px-4 py-4 border-b border-slate-100 transition-colors focus:outline-none"
      style={{
        backgroundColor: isSelected ? `${GOLD}14` : undefined,
        borderLeft: isSelected ? `3px solid ${GOLD}` : "3px solid transparent",
      }}
      whileHover={isSelected ? undefined : { backgroundColor: "#F8FAFC" }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          {unread && (
            <motion.span
              className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"
              animate={pulseDot.animate}
              transition={pulseDot.transition}
            />
          )}
          <TypeBadge type={sub.type} />
        </div>
        <span className="text-[11px] text-slate-400 flex-shrink-0">
          {formatListDate(sub.created_at)}
        </span>
      </div>

      {/* Name */}
      <p className={`text-sm font-semibold mb-0.5 ${unread ? "text-slate-800" : "text-slate-600"}`}>
        {sub.name}
      </p>

      {/* Subject / service */}
      <p className="text-xs text-slate-500 truncate mb-1">
        {sub.type === "contact" ? (sub.subject ?? "") : (sub.service ?? "Demande de RDV")}
      </p>

      {/* Message excerpt */}
      {(sub.message || sub.note) && (
        <p className="text-xs text-slate-400 line-clamp-2">
          {sub.type === "contact" ? sub.message : sub.note}
        </p>
      )}
    </motion.button>
  );
};

// ─── Détail du message ────────────────────────────────────────────────────────
interface DetailProps {
  sub: Submission;
  onBack?: () => void;
}

const MessageDetail = ({ sub, onBack }: DetailProps) => {
  return (
    <motion.div
      key={sub.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-full overflow-y-auto"
    >
      {/* Back button (mobile) */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 pt-5 pb-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors lg:hidden"
        >
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
        <h2 className="text-xl font-bold text-slate-800 mb-1">{sub.name}</h2>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <a
            href={`mailto:${sub.email}`}
            className="hover:underline"
            style={{ color: GOLD }}
          >
            {sub.email}
          </a>
          {sub.phone && <span>{sub.phone}</span>}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={buildMailto(sub)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: GOLD }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10l9-7 9 7v11a1 1 0 01-1 1H4a1 1 0 01-1-1V10z" />
              <polyline stroke="currentColor" strokeWidth={2} points="9,22 9,12 15,12 15,22" />
            </svg>
            Répondre par email
          </a>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors"
            disabled
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8l1 12a2 2 0 002 2h8a2 2 0 002-2L19 8" />
            </svg>
            Archiver
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5 flex-1">
        {sub.type === "contact" ? (
          <>
            {sub.subject && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Sujet
                </label>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  {sub.subject}
                </span>
              </section>
            )}

            {sub.service && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Service
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                  {sub.service}
                </span>
              </section>
            )}

            {sub.message && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Message
                </label>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 italic whitespace-pre-wrap leading-relaxed">
                    {sub.message}
                  </p>
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <section>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3 block">
                Disponibilités souhaitées
              </label>
              <div className="space-y-2">
                {/* Créneau 1 */}
                {sub.preferred_date && (
                  <div
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 rounded-xl p-3"
                    style={{ backgroundColor: `${GOLD}18` }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: GOLD }}
                    >
                      1er choix
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      {formatRdvDate(sub.preferred_date)}
                    </span>
                    {sub.preferred_time && (
                      <span
                        className="text-sm font-bold"
                        style={{ color: GOLD }}
                      >
                        {sub.preferred_time}
                      </span>
                    )}
                  </div>
                )}

                {/* Créneau 2 */}
                {sub.preferred_date2 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 bg-slate-100 rounded-xl p-3">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                      2e choix
                    </span>
                    <span className="text-sm font-semibold text-slate-600">
                      {formatRdvDate(sub.preferred_date2)}
                    </span>
                    {sub.preferred_time2 && (
                      <span className="text-sm font-bold text-slate-500">
                        {sub.preferred_time2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>

            {sub.session_format && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Format
                </label>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                  {sub.session_format}
                </span>
              </section>
            )}

            {sub.service && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Service souhaité
                </label>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  {sub.service}
                </span>
              </section>
            )}

            {sub.note && (
              <section>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2 block">
                  Note
                </label>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-sm text-slate-700 italic whitespace-pre-wrap leading-relaxed">
                    {sub.note}
                  </p>
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

  // ── Fetch submissions ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("AdminMessages: fetch error", error);
          setSubmissions([]);
        } else {
          setSubmissions((data ?? []) as Submission[]);
        }
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // ── Mark as read via Supabase ──────────────────────────────────────────────
  async function markRead(s: Submission) {
    if (s.read) return;

    await supabase
      .from("submissions")
      .update({ read: true })
      .eq("id", s.id);

    // Update local state
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === s.id ? { ...sub, read: true } : sub))
    );
    // Also update selected if it's the same submission
    setSelected((prev) => (prev?.id === s.id ? { ...prev, read: true } : prev));
  }

  // ── Helpers ────────────────────────────────────────────────────────────────
  const handleSelect = (s: Submission) => {
    markRead(s);
    setSelected(s);
    setMobileView("detail");
  };

  const handleBack = () => {
    setMobileView("list");
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = submissions.filter((s) => {
    if (filter === "contact") return s.type === "contact";
    if (filter === "rdv")     return s.type === "rdv";
    if (filter === "unread")  return !s.read;
    return true;
  });

  const unreadCount = submissions.filter((s) => !s.read).length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 px-6 pt-8 pb-4 border-b border-slate-100"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            Messages
          </h1>
          {!loading && submissions.length > 0 && (
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full text-white"
              style={{ backgroundColor: GOLD }}
            >
              {submissions.length} message{submissions.length > 1 ? "s" : ""}
            </span>
          )}
          {!loading && unreadCount > 0 && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500 text-white">
              {unreadCount} non lu{unreadCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={
                  active
                    ? { backgroundColor: NAVY, color: "#fff" }
                    : { backgroundColor: "transparent", color: "#64748B", border: "1px solid #E2E8F0" }
                }
              >
                {f.label}
                {f.key === "unread" && unreadCount > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Body split ─────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Liste (desktop: always visible / mobile: conditional) ── */}
        <div
          className={`
            flex-shrink-0 overflow-y-auto border-r border-slate-100
            lg:block lg:w-[380px]
            ${mobileView === "list" ? "block w-full" : "hidden"}
          `}
        >
          {loading ? (
            <>
              {[...Array(5)].map((_, i) => <SkeletonItem key={i} />)}
            </>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={staggerFast}
              initial="hidden"
              animate="visible"
            >
              {filtered.map((s) => (
                <ListItem
                  key={s.id}
                  sub={s}
                  isSelected={selected?.id === s.id}
                  onClick={() => handleSelect(s)}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* ── Détail (desktop: always visible / mobile: conditional) ── */}
        <div
          className={`
            flex-1 overflow-hidden
            lg:block
            ${mobileView === "detail" ? "block w-full" : "hidden"}
          `}
        >
          <AnimatePresence mode="wait">
            {selected ? (
              <MessageDetail
                key={selected.id}
                sub={selected}
                onBack={handleBack}
              />
            ) : (
              <motion.div
                key="placeholder"
                className="flex h-full items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DetailPlaceholder />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
