import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Inbox,
  MailOpen,
  CalendarDays,
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
  iconBg: string;
  iconColor: string;
  value: number;
  label: string;
  valueColor?: string;
  index: number;
}

function StatCard({ icon: Icon, iconBg, iconColor, value, label, valueColor, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} strokeWidth={1.8} />
      </div>
      <div>
        <p
          className="text-3xl font-bold leading-none mb-1"
          style={{ color: valueColor ?? "#1C3A52" }}
        >
          {value}
        </p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

// ── Message Card (compact) ────────────────────────────────────────────────────

function MessageCard({ sub, onNavigate }: { sub: Submission; onNavigate: () => void }) {
  const isRdv = sub.type === "rdv";
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide"
          style={
            isRdv
              ? { background: "rgba(28,58,82,0.08)", color: "#1C3A52" }
              : { background: "rgba(196,144,62,0.12)", color: "#C4903E" }
          }
        >
          {isRdv ? "RDV" : "Contact"}
        </span>
        <span className="text-xs text-slate-400">{formatShortDateFR(sub.created_at)}</span>
      </div>
      <div>
        <p className="font-semibold text-[#1C3A52] text-sm leading-snug">{sub.name}</p>
        {(sub.subject || sub.service) && (
          <p className="text-slate-400 text-xs mt-0.5 truncate">{sub.subject ?? sub.service}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onNavigate}
        className="self-start mt-1 inline-flex items-center gap-1 text-xs font-semibold text-[#C4903E] hover:text-[#b07d35] transition-colors"
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-start gap-3"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(196,144,62,0.1)" }}>
        <Icon className="w-4.5 h-4.5" style={{ color: "#C4903E" }} strokeWidth={1.8} />
      </div>
      <p className="font-semibold text-[#1C3A52] text-sm leading-snug flex-1">{page.label}</p>
      <button
        type="button"
        onClick={onEdit}
        className="w-full mt-auto py-2 rounded-xl text-xs font-bold text-white transition-opacity hover:opacity-90"
        style={{ background: "#1C3A52" }}
      >
        Éditer
      </button>
    </motion.div>
  );
}

// ── Stats state ───────────────────────────────────────────────────────────────

interface DashboardStats {
  total: number;
  unread: number;
  rdv: number;
  recent: Submission[];
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({ total: 0, unread: 0, rdv: 0, recent: [] });
  const [loading, setLoading] = useState(true);

  // Fetch stats from Supabase
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [
          { count: total },
          { count: unread },
          { count: rdv },
          { data: recent },
        ] = await Promise.all([
          supabase.from("submissions").select("*", { count: "exact", head: true }),
          supabase.from("submissions").select("*", { count: "exact", head: true }).eq("read", false),
          supabase.from("submissions").select("*", { count: "exact", head: true }).eq("type", "rdv"),
          supabase.from("submissions").select("*").order("created_at", { ascending: false }).limit(3),
        ]);
        if (!cancelled) {
          setStats({
            total: total ?? 0,
            unread: unread ?? 0,
            rdv: rdv ?? 0,
            recent: (recent as Submission[]) ?? [],
          });
        }
      } catch {
        if (!cancelled) setStats({ total: 0, unread: 0, rdv: 0, recent: [] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

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
          className="flex flex-col gap-1"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: "#1C3A52" }}
          >
            Bonjour
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500 text-sm">
            Voici un résumé de votre espace admin
          </motion.p>
          <motion.p
            variants={fadeInUp}
            className="text-xs font-semibold uppercase tracking-widest mt-1"
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
              iconBg="rgba(196,144,62,0.14)"
              iconColor="#C4903E"
              value={stats.total}
              label="Messages reçus"
            />
            <StatCard
              index={1}
              icon={MailOpen}
              iconBg={stats.unread > 0 ? "rgba(220,38,38,0.12)" : "rgba(34,197,94,0.12)"}
              iconColor={stats.unread > 0 ? "#dc2626" : "#16a34a"}
              value={stats.unread}
              label="Non lus"
              valueColor={stats.unread > 0 ? "#dc2626" : "#16a34a"}
            />
            <StatCard
              index={2}
              icon={CalendarDays}
              iconBg="rgba(28,58,82,0.1)"
              iconColor="#1C3A52"
              value={stats.rdv}
              label="Demandes RDV"
            />
            <StatCard
              index={3}
              icon={FileText}
              iconBg="rgba(100,116,139,0.1)"
              iconColor="#64748b"
              value={PAGES.length}
              label="Pages du site"
            />
          </div>
        </section>

        {/* ── Recent messages ─────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold" style={{ color: "#1C3A52" }}>
              Derniers messages
            </h2>
            <button
              type="button"
              onClick={() => navigate("/admin/messages")}
              className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
              style={{ color: "#C4903E" }}
            >
              Voir tout <ArrowRight className="w-3.5 h-3.5" />
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
            <h2 className="text-base font-semibold" style={{ color: "#1C3A52" }}>
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
          className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4 flex-wrap"
        >
          <p className="text-xs text-slate-400">
            Hébergé sur GitHub Pages &middot; Repo:{" "}
            <span className="font-medium text-slate-500">
              {GITHUB_OWNER}/{GITHUB_REPO}
            </span>
          </p>
          <a
            href={`https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1C3A52] transition-colors"
          >
            Ouvrir sur GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </motion.footer>

      </div>
    </div>
  );
};

export default AdminDashboard;
