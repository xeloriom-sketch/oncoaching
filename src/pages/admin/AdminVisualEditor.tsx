import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { PAGES, getPageDef, type FieldDef } from "@/lib/contentSchema";
import { usePageContent } from "@/hooks/usePageContent";
import { EditModeContext } from "@/contexts/EditModeContext";

// ── Page map ──────────────────────────────────────────────────────────────────

const PAGE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType>> =
  {
    index: lazy(() => import("@/pages/Index")),
    about: lazy(() => import("@/pages/About")),
    contact: lazy(() => import("@/pages/Contact")),
    "nos-tarifs": lazy(() => import("@/pages/NosTarifs")),
    partenaires: lazy(() => import("@/pages/Partenaires")),
    "presse-medias": lazy(() => import("@/pages/PresseMedias")),
    "coaching-scolaire": lazy(
      () => import("@/pages/Services/CoachingScolaire")
    ),
    "coaching-jeunes": lazy(() => import("@/pages/Services/CoachingJeunes")),
    "coaching-neurofeedback": lazy(
      () => import("@/pages/Services/CoachingNeurofeedback")
    ),
    "coaching-equipe": lazy(() => import("@/pages/Services/CoachingEquipe")),
  };

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split(".").reduce((acc: unknown, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    const idx = parseInt(key, 10);
    if (!isNaN(idx) && Array.isArray(acc)) return (acc as unknown[])[idx];
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const result: unknown = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");

  function set(current: unknown, depth: number): void {
    const key = keys[depth];
    const isLast = depth === keys.length - 1;
    const idx = parseInt(key, 10);
    const isArr = !isNaN(idx) && Array.isArray(current);
    const target = isArr
      ? (current as unknown[])[idx]
      : (current as Record<string, unknown>)[key];

    if (isLast) {
      if (isArr) (current as unknown[])[idx] = value;
      else (current as Record<string, unknown>)[key] = value;
    } else {
      if (target == null || typeof target !== "object") {
        const next = !isNaN(parseInt(keys[depth + 1], 10)) ? [] : {};
        if (isArr) (current as unknown[])[idx] = next;
        else (current as Record<string, unknown>)[key] = next;
        set(next, depth + 1);
      } else {
        set(target, depth + 1);
      }
    }
  }

  set(result, 0);
  return result as Record<string, unknown>;
}

function findMatchingField(
  el: Element,
  content: Record<string, unknown>,
  pageKey: string
): FieldDef | null {
  const pageDef = getPageDef(pageKey);
  if (!pageDef) return null;

  const editableFields = pageDef.fields.filter(
    (f) => f.type !== "array" && f.type !== "json" && f.type !== "readonly"
  );

  let current: Element | null = el;
  let depth = 0;

  while (current && depth < 10) {
    const text = (current.textContent ?? "").trim();
    if (text.length >= 2 && text.length <= 800) {
      for (const field of editableFields) {
        const fv = getNestedValue(content, field.key);
        if (typeof fv === "string" && fv.trim() === text) {
          return field;
        }
      }
    }
    current = current.parentElement;
    depth++;
  }
  return null;
}

function findElementForField(
  startEl: Element,
  fieldKey: string,
  content: Record<string, unknown>
): Element {
  const fv = ((getNestedValue(content, fieldKey) as string) ?? "").trim();
  let current: Element | null = startEl;
  let depth = 0;
  let best = startEl;

  while (current && depth < 10) {
    if ((current.textContent ?? "").trim() === fv) {
      best = current;
      break;
    }
    current = current.parentElement;
    depth++;
  }
  return best;
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC]">
      <Loader2 size={28} className="animate-spin" style={{ color: "#1C3A52" }} />
    </div>
  );
}

// ── Field Input ───────────────────────────────────────────────────────────────

function FieldInput({
  field,
  value,
  onChange,
  isActive,
  elRef,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  isActive: boolean;
  elRef: (el: HTMLDivElement | null) => void;
}) {
  const isLong = field.type === "long" || field.type === "textarea";
  const base =
    "w-full border rounded-xl px-3 py-2 text-sm focus:outline-none transition-colors bg-white resize-none";
  const ring = isActive
    ? "border-[#C4903E] ring-2 ring-[#C4903E]/20"
    : "border-slate-200 focus:border-[#C4903E] focus:ring-2 focus:ring-[#C4903E]/20";

  return (
    <div
      ref={elRef}
      className={`rounded-xl p-3 transition-colors scroll-mt-4 ${
        isActive ? "bg-[#FDF6EC] ring-1 ring-[#C4903E]/30" : "bg-white"
      }`}
    >
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
        {field.label}
      </label>
      {field.hint && (
        <p className="text-xs text-slate-400 mb-1.5">{field.hint}</p>
      )}
      {isLong ? (
        <textarea
          rows={3}
          className={`${base} ${ring}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={field.type === "url" ? "url" : "text"}
          className={`${base} ${ring}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const BAR_H = 56; // bottom toolbar height

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminVisualEditor() {
  const { pageKey = "index" } = useParams<{ pageKey: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Auth ────────────────────────────────────────────────────────────────────
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // ── Active page ─────────────────────────────────────────────────────────────
  const [activePage, setActivePage] = useState(pageKey);
  const [pageDropdown, setPageDropdown] = useState(false);

  // ── Content ─────────────────────────────────────────────────────────────────
  const { content } = usePageContent<Record<string, unknown>>(activePage);
  const pageDef = getPageDef(activePage);
  const editableFields = (pageDef?.fields ?? []).filter(
    (f) => f.type !== "array" && f.type !== "json" && f.type !== "readonly"
  );

  // ── Field values (local state) ───────────────────────────────────────────────
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const fieldValuesRef = useRef<Record<string, string>>({});
  useEffect(() => {
    fieldValuesRef.current = fieldValues;
  }, [fieldValues]);

  useEffect(() => {
    if (!content) return;
    const flat: Record<string, string> = {};
    for (const f of editableFields) {
      flat[f.key] = (getNestedValue(content, f.key) as string) ?? "";
    }
    setFieldValues(flat);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, activePage]);

  // ── Save ────────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle"
  );
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const performSave = useCallback(async () => {
    const currentContent =
      queryClient.getQueryData<Record<string, unknown>>([
        "page-content",
        activePage,
      ]);
    if (!currentContent) return;
    setSaving(true);

    let newContent: Record<string, unknown> = JSON.parse(
      JSON.stringify(currentContent)
    );
    for (const [key, value] of Object.entries(fieldValuesRef.current)) {
      newContent = setNestedValue(newContent, key, value);
    }

    const { error } = await supabase
      .from("page_content")
      .update({ content: newContent })
      .eq("page_key", activePage);

    if (!error) {
      queryClient.setQueryData(["page-content", activePage], newContent);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } else {
      setSaveStatus("error");
    }
    setSaving(false);
  }, [activePage, queryClient]);

  const handleFieldChange = useCallback(
    (fieldKey: string, value: string) => {
      setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(performSave, 1500);
    },
    [performSave]
  );

  // ── Drawer ─────────────────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ── Hover highlight ─────────────────────────────────────────────────────────
  const [hoveredEl, setHoveredEl] = useState<Element | null>(null);
  const [hoveredRect, setHoveredRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!hoveredEl) return;
    const update = () => setHoveredRect(hoveredEl.getBoundingClientRect());
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [hoveredEl]);

  // ── Event listeners ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!content) return;

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        drawerRef.current?.contains(target) ||
        toolbarRef.current?.contains(target)
      ) {
        setHoveredEl(null);
        setHoveredRect(null);
        return;
      }
      const field = findMatchingField(target, content, activePage);
      if (field) {
        const el = findElementForField(target, field.key, content);
        setHoveredEl(el);
        setHoveredRect(el.getBoundingClientRect());
      } else {
        setHoveredEl(null);
        setHoveredRect(null);
      }
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (
        drawerRef.current?.contains(target) ||
        toolbarRef.current?.contains(target)
      )
        return;

      const field = findMatchingField(target, content, activePage);
      if (field) {
        e.preventDefault();
        e.stopPropagation();
        setActiveFieldKey(field.key);
        setDrawerOpen(true);
        setTimeout(() => {
          const el = fieldRefs.current.get(field.key);
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 320);
      }
    };

    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [content, activePage]);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (session === undefined) return <Spinner />;
  if (session === null) return <Navigate to="/admin/login" replace />;

  const PageComponent = PAGE_MAP[activePage];
  const currentPageDef = PAGES.find((p) => p.key === activePage);

  const sections = editableFields.reduce<Record<string, FieldDef[]>>(
    (acc, f) => {
      const s = f.section ?? "Général";
      if (!acc[s]) acc[s] = [];
      acc[s].push(f);
      return acc;
    },
    {}
  );

  return (
    <EditModeContext.Provider value={{ isEditMode: true }}>
      <div style={{ position: "relative", minHeight: "100vh", paddingBottom: BAR_H }}>

        {/* ── Page preview ───────────────────────────────────────────── */}
        {PageComponent ? (
          <Suspense fallback={<Spinner />}>
            <PageComponent />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-400">Page inconnue : {activePage}</p>
          </div>
        )}

        {/* ── Hover highlight ────────────────────────────────────────── */}
        <AnimatePresence>
          {hoveredRect && (
            <motion.div
              key="highlight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{
                position: "fixed",
                top: hoveredRect.top - 3,
                left: hoveredRect.left - 3,
                width: hoveredRect.width + 6,
                height: hoveredRect.height + 6,
                border: "2px dashed #C4903E",
                borderRadius: 6,
                pointerEvents: "none",
                zIndex: 8000,
              }}
            >
              <span
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 4px)",
                  left: 0,
                  background: "#C4903E",
                  color: "white",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  lineHeight: 1.6,
                }}
              >
                <Pencil size={8} />
                Cliquer pour modifier
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Side drawer ────────────────────────────────────────────── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawerOpen(false)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 8500,
                  background: "rgba(0,0,0,0.18)",
                  backdropFilter: "blur(1px)",
                }}
              />

              {/* Drawer panel */}
              <motion.div
                key="drawer"
                ref={drawerRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 420, damping: 42 }}
                style={{
                  position: "fixed",
                  top: 0,
                  right: 0,
                  bottom: BAR_H,
                  width: 360,
                  background: "#F8F9FA",
                  zIndex: 8600,
                  boxShadow: "-6px 0 32px rgba(0,0,0,0.14)",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                }}
              >
                {/* Drawer header */}
                <div
                  style={{
                    background: "#1C3A52",
                    padding: "14px 18px",
                    flexShrink: 0,
                  }}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {currentPageDef?.label ?? activePage}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">
                      Modifiez les textes — sauvegarde auto
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
                    aria-label="Fermer le panneau"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Fields list */}
                <div
                  className="flex-1 overflow-y-auto"
                  style={{ padding: "12px 14px", paddingBottom: 24 }}
                >
                  {!content ? (
                    <div className="flex items-center justify-center py-16">
                      <Loader2
                        size={24}
                        className="animate-spin"
                        style={{ color: "#C4903E" }}
                      />
                    </div>
                  ) : Object.keys(sections).length === 0 ? (
                    <p className="text-slate-400 text-sm text-center py-12">
                      Aucun champ texte pour cette page.
                    </p>
                  ) : (
                    Object.entries(sections).map(([sectionName, sectionFields]) => (
                      <div key={sectionName} className="mb-5">
                        <p
                          className="text-[10px] font-black uppercase tracking-widest mb-2 px-1"
                          style={{ color: "#C4903E" }}
                        >
                          {sectionName}
                        </p>
                        <div className="flex flex-col gap-2">
                          {sectionFields.map((field) => (
                            <FieldInput
                              key={field.key}
                              field={field}
                              value={fieldValues[field.key] ?? ""}
                              onChange={(v) => handleFieldChange(field.key, v)}
                              isActive={activeFieldKey === field.key}
                              elRef={(el) => {
                                if (el)
                                  fieldRefs.current.set(field.key, el);
                                else fieldRefs.current.delete(field.key);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Bottom toolbar ─────────────────────────────────────────── */}
        <div
          ref={toolbarRef}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: BAR_H,
            background: "#1C3A52",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Back to admin */}
          <button
            onClick={() => navigate("/admin/content")}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors flex-shrink-0 text-sm font-semibold"
          >
            <ArrowLeft size={15} />
            Admin
          </button>

          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.18)",
              height: 22,
              flexShrink: 0,
            }}
          />

          {/* Page selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setPageDropdown((v) => !v)}
              className="flex items-center gap-1.5 text-white text-sm font-semibold hover:text-[#C4903E] transition-colors"
            >
              <span className="max-w-[140px] truncate">
                {currentPageDef?.label ?? activePage}
              </span>
              <ChevronDown size={13} />
            </button>

            <AnimatePresence>
              {pageDropdown && (
                <motion.div
                  key="pdrop"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: 0,
                    background: "white",
                    borderRadius: 14,
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    minWidth: 210,
                    zIndex: 10000,
                  }}
                >
                  {PAGES.filter((p) => p.key !== "site-settings").map((p) => (
                    <button
                      key={p.key}
                      onClick={() => {
                        setActivePage(p.key);
                        setActiveFieldKey(null);
                        setDrawerOpen(false);
                        setPageDropdown(false);
                        navigate(`/admin/visual/${p.key}`, { replace: true });
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FDF6EC] transition-colors"
                      style={{
                        color:
                          p.key === activePage ? "#C4903E" : "#1C3A52",
                        fontWeight: p.key === activePage ? 700 : 400,
                        borderBottom: "1px solid #f1f5f9",
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ flex: 1 }} />

          {/* Save status */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {saving ? (
              <>
                <Loader2 size={13} className="animate-spin text-white/50" />
                <span className="text-white/50 text-xs font-semibold">
                  Sauvegarde…
                </span>
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check size={13} className="text-green-400" />
                <span className="text-green-400 text-xs font-semibold">
                  Sauvegardé
                </span>
              </>
            ) : saveStatus === "error" ? (
              <span className="text-red-400 text-xs font-semibold">
                Erreur
              </span>
            ) : null}
          </div>

          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.18)",
              height: 22,
              flexShrink: 0,
            }}
          />

          {/* Edit mode badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Eye size={13} className="text-[#C4903E]" />
            <span
              className="text-[10px] font-black uppercase tracking-widest hidden sm:block"
              style={{ color: "#C4903E" }}
            >
              Mode Édition
            </span>
          </div>

          {/* Modifier button */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ background: "#C4903E", color: "white" }}
          >
            <Pencil size={13} />
            {drawerOpen ? "Fermer" : "Champs"}
          </button>
        </div>
      </div>
    </EditModeContext.Provider>
  );
}
