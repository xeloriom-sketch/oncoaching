import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, ExternalLink } from "lucide-react";
import { PAGES } from "@/lib/contentSchema";
import type { LucideIcon } from "lucide-react";

// ─── Dynamic Lucide icon resolver ────────────────────────────────────────────
function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const icons = LucideIcons as unknown as Record<string, LucideIcon>;
  const Icon = icons[name] ?? icons["FileText"];
  return <Icon className={className} />;
}

// ─── AdminContent ─────────────────────────────────────────────────────────────
export default function AdminContent() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-[#1C3A52]">Contenu du site</h1>
          <p className="mt-1 text-sm text-slate-500">
            Modifiez les textes de chaque page
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAGES.map((pageDef, i) => (
            <motion.div
              key={pageDef.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(28,58,82,0.10)" }}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col gap-4 cursor-pointer"
              onClick={() => navigate(`/admin/content/${pageDef.key}`)}
            >
              {/* Top row: icon + chevron */}
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#1C3A52] flex items-center justify-center flex-shrink-0">
                  <DynamicIcon name={pageDef.icon} className="w-5 h-5 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 mt-0.5" />
              </div>

              {/* Title + URL */}
              <div className="flex-1">
                <p className="font-semibold text-[#1C3A52] text-base leading-tight">
                  {pageDef.label}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 font-mono">
                  {pageDef.route}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={pageDef.route}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#1C3A52] transition-colors"
                >
                  Voir la page
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/admin/content/${pageDef.key}`);
                  }}
                  className="ml-auto px-4 py-1.5 rounded-full bg-[#C4903E] text-white text-xs font-medium hover:bg-[#b07e34] transition-colors"
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
