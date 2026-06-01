import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Inbox,
  MailOpen,
  CalendarDays,
  CheckCircle2,
  FileText,
  Home,
  User,
  Mail,
  CreditCard,
  Newspaper,
  Handshake,
  BookOpen,
  Users,
  Brain,
  ExternalLink,
  ArrowRight,
  AlertTriangle,
  Trash2,
  Database,
  Pencil,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PAGES } from "@/lib/contentSchema";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubApi";
import { fadeInUp, stagger, VP } from "@/lib/motion";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  type: "contact" | "rdv";
  created_at: string;
  read: boolean;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  subject?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
}

// ── Icon map ──────────────────────────────────────────────────────────────────

const PAGE_ICONS: Record<string, React.ElementType> = {
  Home,
  User,
  Mail,
  CreditCard,
  Newspaper,
  Handshake,
  BookOpen,
  Users,
  Brain,
};

// Quick-action pages (5 most common)
const QUICK_PAGES = [
  { key: "index",    label: "Accueil" },
  { key: "contact",  label: "Contact" },
  { key: "nos-tarifs", label: "Tarifs" },
  { key: "about",    label: "À propos" },
  { key: "coaching-scolaire", label: "Scolaire" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateFR(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatShortDateFR(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  value: number;
  label: string;
  valueColor?: string;
  index: number;
}

function StatCard({ icon: Icon, gradient, iconColor, value, label, valueColor, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 border border-transparent hover:border-slate-200 transition-colors"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: gradient }}
      >
        <Icon className="w-6 h-6" style={{ color: iconColor }} strokeWidth={1.8} />
      </div>
      <div>
        <p
          className="text-4xl font-extrabold leading-none mb-1.5 tabular-nums"
          style={{ color: valueColor ?? "#1C3A52" }}
        >
          {value}
        </p>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Message Card ──────────────────────────────────────────────────────────────

function MessageCard({ sub, onNavigate }: { sub: Submission; onNavigate: () => void }) {
  const isRdv = sub.type === "rdv";
  const excerpt = sub.message ?? sub.subject ?? sub.service ?? null;

  return (
    <div
      className="bg-white rounded-2xl shadow-sm p-5 flex flex-col gap-3 border-l-4 transition-shadow hover:shadow-md"
      style={{ borderLeftColor: isRdv ? "#C4903E" : "#64748b" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
          style={
            isRdv
              ? { background: "rgba(196,144,62,0.12)", color: "#b07d35" }
              : { background: "rgba(28,58,82,0.08)", color: "#1C3A52" }
          }
        >
          {isRdv ? "RDV" : "Contact"}
        </span>
        <span className="text-[11px] text-slate-400 font-medium">{formatShortDateFR(sub.created_at)}</span>
      </div>

      <div className="flex-1">
        <p className="font-semibold text-[#1C3A52] text-sm leading-snug">{sub.name}</p>
        {excerpt && (
          <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-1">{excerpt}</p>
        )}
      </div>

      <button
        type="button"
        onClick={onNavigate}
        className="self-start mt-auto inline-flex items-center gap-1.5 text-xs font-bold transition-colors"
        style={{ color: "#C4903E" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#b07d35")}
        onMouseLeave={e => (e.currentTarget.style.color = "#C4903E")}
      >
        Voir <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Page Quick Link ───────────────────────────────────────────────────────────

function PageCard({
  page,
  onEdit,
  index,
}: {
  page: (typeof PAGES)[number];
  onEdit: () => void;
  index: number;
}) {
  const Icon = PAGE_ICONS[page.icon] ?? FileText;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-start gap-3 transition-all duration-200"
      style={{
        border: hovered ? "1px solid #C4903E" : "1px solid transparent",
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(196,144,62,0.12)" }}
      >
        <Icon className="w-[18px] h-[18px]" style={{ color: "#C4903E" }} strokeWidth={1.8} />
      </div>
      <p className="font-semibold text-[#1C3A52] text-xs leading-snug flex-1">{page.label}</p>
      <button
        type="button"
        onClick={onEdit}
        className="w-full py-1.5 rounded-xl text-[11px] font-bold text-white transition-opacity hover:opacity-85"
        style={{ background: "#1C3A52" }}
      >
        Éditer
      </button>
    </motion.div>
  );
}

// ── Quick Actions Strip ───────────────────────────────────────────────────────

function QuickActions({ onNavigate }: { onNavigate: (key: string) => void }) {
  return (
    <section>
      <h2 className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>
        Accès rapide
      </h2>
      <div className="flex gap-2 flex-wrap">
        {QUICK_PAGES.map((p, i) => (
          <motion.button
            key={p.key}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            type="button"
            onClick={() => onNavigate(p.key)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white transition-all hover:opacity-85 active:scale-95"
            style={{ background: "#1C3A52" }}
          >
            <Pencil className="w-3 h-3 opacity-75" strokeWidth={2.5} />
            {p.label}
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ── Storage Banner ────────────────────────────────────────────────────────────

const WARN_THRESHOLD = 200;
const DANGER_THRESHOLD = 400;

interface StorageBannerProps {
  total: number;
  readCount: number;
  onClean: () => void;
  onCancelClean: () => void;
  confirming: boolean;
  cleaning: boolean;
}

function StorageBanner({ total, readCount, onClean, onCancelClean, confirming, cleaning }: StorageBannerProps) {
  if (total < 50) return null;

  const isDanger = total >= DANGER_THRESHOLD;

  const bg      = isDanger ? "rgba(220,38,38,0.08)"   : "rgba(234,179,8,0.10)";
  const border  = isDanger ? "#fca5a5"                : "#fde68a";
  const iconCol = isDanger ? "#dc2626"                : "#b45309";
  const title   = isDanger
    ? `Attention — ${total} messages stockés`
    : `${total} messages dans la base de données`;
  const desc = isDanger
    ? "La base de données commence à s'alourdir. Supprimez les messages déjà lus pour libérer de l'espace."
    : "Pensez à faire un peu de ménage de temps en temps en supprimant les messages lus.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center gap-4"
      style={{ background: bg, borderColor: border }}
    >
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5">
          {isDanger
            ? <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: iconCol }} strokeWidth={2} />
            : <Database className="w-5 h-5 flex-shrink-0" style={{ color: iconCol }} strokeWidth={1.8} />
          }
        </div>
        <div>
          <p className="text-sm font-semibold leading-snug" style={{ color: isDanger ? "#991b1b" : "#78350f" }}>
            {title}
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: isDanger ? "#b91c1c" : "#92400e" }}>
            {desc}
          </p>
        </div>
      </div>

      {readCount > 0 && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {confirming && !cleaning && (
            <button
              type="button"
              onClick={onCancelClean}
              className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors px-2 py-1"
            >
              Annuler
            </button>
          )}
          <button
            type="button"
            onClick={onClean}
            disabled={cleaning}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: confirming ? "#dc2626" : isDanger ? "#dc2626" : "#b45309" }}
          >
            {cleaning ? (
              <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
            )}
            {confirming
              ? "Confirmer la suppression"
              : `Supprimer ${readCount} message${readCount > 1 ? "s" : ""} lu${readCount > 1 ? "s" : ""}`
            }
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Stats state ───────────────────────────────────────────────────────────────

interface DashboardStats {
  total: number;
  unread: number;
  rdv: number;
  readCount: number;
  recent: Submission[];
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({ total: 0, unread: 0, rdv: 0, readCount: 0, recent: [] });
  const [loading, setLoading] = useState(true);
  const [cleaning, setCleaning] = useState(false);
  const [cleanConfirming, setCleanConfirming] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  const fetchStats = async (cancelled?: { current: boolean }) => {
    try {
      const [
        { count: total },
        { count: unread },
        { count: rdv },
        { count: readCount },
        { data: recent },
      ] = await Promise.all([
        supabase.from("submissions").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("read", false),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("type", "rdv"),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("read", true),
        supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(3),
      ]);
      if (!cancelled?.current) {
        setStats({
          total: total ?? 0,
          unread: unread ?? 0,
          rdv: rdv ?? 0,
          readCount: readCount ?? 0,
          recent: (recent as Submission[]) ?? [],
        });
      }
    } catch {
      if (!cancelled?.current) setStats({ total: 0, unread: 0, rdv: 0, readCount: 0, recent: [] });
    }
  };

  useEffect(() => {
    const ref = { current: false };

    // Fetch admin email
    supabase.auth.getSession().then(({ data }) => {
      if (!ref.current) setAdminEmail(data.session?.user?.email ?? null);
    });

    fetchStats(ref).finally(() => { if (!ref.current) setLoading(false); });
    return () => { ref.current = true; };
  }, []);

  const handleClean = async () => {
    if (!cleanConfirming) { setCleanConfirming(true); return; }
    setCleanConfirming(false);
    setCleaning(true);
    await supabase.from("submissions").delete().eq("read", true);
    await fetchStats();
    setCleaning(false);
  };

  const today = formatDateFR(new Date());

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: "#F4F1EC" }}>
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-10 md:py-14 flex flex-col gap-10">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col gap-1.5"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-extrabold tracking-tight leading-none"
            style={{ color: "#1C3A52" }}
          >
            Bonjour
          </motion.h1>
          {adminEmail && (
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium"
              style={{ color: "#64748b" }}
            >
              {adminEmail}
            </motion.p>
          )}
          <motion.p
            variants={fadeInUp}
            className="text-xs font-bold uppercase tracking-widest mt-1.5 capitalize"
            style={{ color: "#C4903E" }}
          >
            {today}
          </motion.p>
        </motion.div>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              index={0}
              icon={Inbox}
              gradient="linear-gradient(135deg, rgba(196,144,62,0.18) 0%, rgba(196,144,62,0.08) 100%)"
              iconColor="#C4903E"
              value={stats.total}
              label="Messages reçus"
            />
            <StatCard
              index={1}
              icon={MailOpen}
              gradient={
                stats.unread > 0
                  ? "linear-gradient(135deg, rgba(220,38,38,0.16) 0%, rgba(220,38,38,0.07) 100%)"
                  : "linear-gradient(135deg, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.07) 100%)"
              }
              iconColor={stats.unread > 0 ? "#dc2626" : "#16a34a"}
              value={stats.unread}
              label="Non lus"
              valueColor={stats.unread > 0 ? "#dc2626" : "#16a34a"}
            />
            <StatCard
              index={2}
              icon={CalendarDays}
              gradient="linear-gradient(135deg, rgba(28,58,82,0.14) 0%, rgba(28,58,82,0.06) 100%)"
              iconColor="#1C3A52"
              value={stats.rdv}
              label="Demandes RDV"
            />
            <StatCard
              index={3}
              icon={CheckCircle2}
              gradient="linear-gradient(135deg, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.07) 100%)"
              iconColor="#16a34a"
              value={stats.readCount}
              label="Messages lus"
              valueColor="#16a34a"
            />
          </div>
        </section>

        {/* ── Quick actions strip ─────────────────────────────────────── */}
        <QuickActions onNavigate={(key) => navigate(`/admin/content/${key}`)} />

        {/* ── Storage banner ──────────────────────────────────────────── */}
        {!loading && (
          <StorageBanner
            total={stats.total}
            readCount={stats.readCount}
            onClean={handleClean}
            onCancelClean={() => setCleanConfirming(false)}
            confirming={cleanConfirming}
            cleaning={cleaning}
          />
        )}

        {/* ── Recent messages ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "#1C3A52" }}>
              Derniers messages
            </h2>
            <button
              type="button"
              onClick={() => navigate("/admin/messages")}
              className="text-xs font-bold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: "#C4903E" }}
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: "#C4903E", borderTopColor: "transparent" }}
              />
            </div>
          ) : stats.recent.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
            >
              <Inbox className="w-8 h-8 mx-auto mb-3 text-slate-300" strokeWidth={1.5} />
              <p className="text-slate-400 text-sm">Aucun message pour l'instant.</p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {stats.recent.map((sub) => (
                <motion.div key={sub.id} variants={fadeInUp}>
                  <MessageCard sub={sub} onNavigate={() => navigate("/admin/messages")} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </section>

        {/* ── Quick edit pages ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "#1C3A52" }}>
              Modifier le contenu
            </h2>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
            {PAGES.map((page, i) => (
              <PageCard
                key={page.key}
                page={page}
                index={i}
                onEdit={() => navigate(`/admin/content/${page.key}`)}
              />
            ))}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VP}
          className="pt-4 border-t border-slate-200/70 flex items-center justify-between gap-4 flex-wrap"
        >
          <p className="text-[11px] text-slate-400">
            {GITHUB_OWNER}/{GITHUB_REPO} &middot; GitHub Pages
          </p>
          <a
            href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#1C3A52] transition-colors"
          >
            GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.footer>

      </div>
    </div>
  );
};

export default AdminDashboard;
