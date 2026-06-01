import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronRight,
  Home,
  User,
  GraduationCap,
  Zap,
  Brain,
  Users,
  CreditCard,
  MessageSquare,
  Building2,
  Newspaper,
  Settings,
  FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PAGES } from "@/lib/contentSchema";
import AdminContentEditor from "./AdminContentEditor";

const NAVY = "#1C3A52";
const GOLD = "#C4903E";

// ─── Dynamic icon ─────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Home, User, GraduationCap, Zap, Brain, Users,
  CreditCard, MessageSquare, Building2, Newspaper, Settings, FileText,
};

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] ?? FileText;
  return <Icon className={className} />;
}

// ─── AdminContent ─────────────────────────────────────────────────────────────
export default function AdminContent() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>(PAGES[0]?.key ?? "");
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? PAGES.filter((p) => p.label.toLowerCase().includes(search.toLowerCase()))
    : PAGES;

  const selectedPage = PAGES.find((p) => p.key === selectedKey);

  return (
    <>
      {/* ── DESKTOP layout ────────────────────────────────────────────────── */}
      <div className="hidden lg:block">

        {/*
          Left sidebar: fixed, positioned right after the AdminLayout sidebar (w-60 = 240px).
          w-[220px] wide, full height, scrolls independently.
          z-30 (below AdminLayout's z-40).
        */}
        <aside
          className="fixed top-0 left-60 h-screen w-[220px] flex flex-col z-30 border-r border-slate-200 bg-white"
        >
          {/* Header */}
          <div className="px-4 pt-5 pb-3 shrink-0 border-b border-slate-100">
            <p
              className="text-[10px] font-bold uppercase tracking-widest mb-3"
              style={{ color: "#94a3b8" }}
            >
              {PAGES.length} pages
            </p>
            {/* Search */}
            <div className="relative">
              <Search
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
                style={{ color: "#94a3b8" }}
              />
              <input
                type="text"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 outline-none transition"
                style={{ color: NAVY }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}22`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
            </div>
          </div>

          {/* Page list — scrolls independently */}
          <nav className="flex-1 overflow-y-auto py-1.5">
            <AnimatePresence>
              {filtered.map((pageDef, i) => {
                const isSelected = pageDef.key === selectedKey;
                return (
                  <motion.button
                    key={pageDef.key}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.18, delay: i * 0.025 }}
                    onClick={() => setSelectedKey(pageDef.key)}
                    className="relative w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors group"
                    style={{
                      backgroundColor: isSelected ? `${GOLD}12` : undefined,
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    {/* Gold left bar */}
                    {isSelected && (
                      <span
                        className="absolute inset-y-0 left-0 w-[3px] rounded-r"
                        style={{ backgroundColor: GOLD }}
                      />
                    )}

                    {/* Icon */}
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                      style={{
                        backgroundColor: isSelected ? GOLD : "#f1f5f9",
                        color: isSelected ? "white" : "#64748b",
                      }}
                    >
                      <DynamicIcon name={pageDef.icon} className="w-3.5 h-3.5" />
                    </span>

                    {/* Label */}
                    <span
                      className="text-xs font-medium truncate flex-1"
                      style={{ color: isSelected ? GOLD : NAVY }}
                    >
                      {pageDef.label}
                    </span>

                    {isSelected && (
                      <ChevronRight
                        className="w-3 h-3 shrink-0"
                        style={{ color: GOLD }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>

            {filtered.length === 0 && (
              <p className="px-4 py-8 text-xs text-slate-400 text-center">
                Aucune page trouvée
              </p>
            )}
          </nav>
        </aside>

        {/*
          Right content: margin-left = AdminContent sidebar width (220px).
          The AdminLayout main already has ml-60 (240px), so we only add 220px here.
          Body scrolls naturally — no overflow tricks needed.
        */}
        <div className="ml-[220px] min-h-screen">
          {selectedPage ? (
            <AdminContentEditor pageKey={selectedKey} />
          ) : (
            <div
              className="flex flex-col items-center justify-center min-h-[60vh] gap-3"
              style={{ color: "#94a3b8" }}
            >
              <p className="text-sm">Sélectionnez une page dans le menu</p>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE card grid ──────────────────────────────────────────────── */}
      <div className="lg:hidden max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: NAVY }}>
            Contenu
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sélectionnez une page à modifier
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {PAGES.map((pageDef, i) => (
            <motion.button
              key={pageDef.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: i * 0.04 }}
              onClick={() => navigate(`/admin/content/${pageDef.key}`)}
              className="w-full bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 text-left shadow-sm active:scale-[0.99] transition-transform hover:border-[#C4903E]/40"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: NAVY }}
              >
                <DynamicIcon name={pageDef.icon} className="w-4.5 h-4.5 text-white" />
              </div>
              <span
                className="text-sm font-semibold flex-1 truncate"
                style={{ color: NAVY }}
              >
                {pageDef.label}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
