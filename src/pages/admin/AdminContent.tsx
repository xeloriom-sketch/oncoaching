import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ExternalLink } from "lucide-react";
import { PAGES } from "@/lib/contentSchema";
import type { LucideIcon } from "lucide-react";
import AdminContentEditor from "./AdminContentEditor";

// ─── Dynamic Lucide icon resolver ────────────────────────────────────────────
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const Icon = icons[name] ?? icons["FileText"];
  return <Icon className={className} />;
}

// ─── AdminContent ─────────────────────────────────────────────────────────────
export default function AdminContent() {
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState<string>(PAGES[0]?.key ?? "");

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1C3A52]">Contenu du site</h1>
          <p className="mt-1 text-sm text-slate-500">
            Modifiez les textes de chaque page
          </p>
        </div>
      </div>

      {/* ── Desktop: two-panel layout ─────────────────────────────────────── */}
      <div className="hidden md:flex max-w-7xl mx-auto h-[calc(100vh-89px)]">
        {/* Left panel — page list */}
        <aside className="w-[260px] shrink-0 bg-white border-r border-slate-200 overflow-y-auto">
          <nav className="py-3">
            {PAGES.map((pageDef, i) => {
              const isSelected = pageDef.key === selectedKey;
              return (
                <motion.button
                  key={pageDef.key}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04, ease: "easeOut" }}
                  onClick={() => setSelectedKey(pageDef.key)}
                  className={[
                    "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors relative",
                    isSelected
                      ? "bg-[#FDF6EC] text-[#C4903E]"
                      : "text-slate-600 hover:bg-slate-50 hover:text-[#1C3A52]",
                  ].join(" ")}
                >
                  {/* Gold left border when selected */}
                  {isSelected && (
                    <span className="absolute inset-y-0 left-0 w-[3px] bg-[#C4903E] rounded-r" />
                  )}

                  {/* Icon */}
                  <span
                    className={[
                      "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#C4903E] text-white"
                        : "bg-slate-100 text-slate-500",
                    ].join(" ")}
                  >
                    <DynamicIcon name={pageDef.icon} className="w-4 h-4" />
                  </span>

                  {/* Label + route */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={[
                        "text-sm font-medium truncate",
                        isSelected ? "text-[#C4903E]" : "text-[#1C3A52]",
                      ].join(" ")}
                    >
                      {pageDef.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {pageDef.route}
                    </p>
                  </div>
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* Right panel — inline editor */}
        <main className="flex-1 overflow-y-auto bg-[#F4F1EC]">
          {selectedKey ? (
            <AdminContentEditor pageKey={selectedKey} />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
              Sélectionnez une page
            </div>
          )}
        </main>
      </div>

      {/* ── Mobile: card grid navigating to route ─────────────────────────── */}
      <div className="md:hidden max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 gap-4">
          {PAGES.map((pageDef, i) => (
            <motion.div
              key={pageDef.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(28,58,82,0.10)" }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4 cursor-pointer"
              onClick={() => navigate(`/admin/content/${pageDef.key}`)}
            >
              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-[#1C3A52] flex items-center justify-center shrink-0">
                <DynamicIcon name={pageDef.icon} className="w-5 h-5 text-white" />
              </div>

              {/* Title + URL */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1C3A52] text-base leading-tight truncate">
                  {pageDef.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 font-mono truncate">
                  {pageDef.route}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={pageDef.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#1C3A52] transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/content/${pageDef.key}`);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[#C4903E] text-white text-xs font-medium hover:bg-[#b07e34] transition-colors"
                >
                  Modifier
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
