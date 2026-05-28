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

  function set(current: unknown, depth: number): void {
    const key = path.split(".")[depth];
    const isLast = depth === path.split(".").length - 1;
    const idx = parseInt(key, 10);
    const isArr = !isNaN(idx) && Array.isArray(current);

    if (isLast) {
      if (isArr) (current as unknown[])[idx] = value;
      else (current as Record<string, unknown>)[key] = value;
      return;
    }

    const nextKey = path.split(".")[depth + 1];
    const nextIsArr = !isNaN(parseInt(nextKey, 10));
    const child = isArr
      ? (current as unknown[])[idx]
      : (current as Record<string, unknown>)[key];

    if (child == null || typeof child !== "object") {
      const next = nextIsArr ? [] : {};
      if (isArr) (current as unknown[])[idx] = next;
      else (current as Record<string, unknown>)[key] = next;
      set(next, depth + 1);
    } else {
      set(child, depth + 1);
    }
  }

  set(result, 0);
  return result as Record<string, unknown>;
}

// ── Spinner ───────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC]">
      <Loader2 size={28} className="animate-spin" style={{ color: "#1C3A52" }} />
    </div>
  );
}

// ── Sidebar field input ───────────────────────────────────────────────────────

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

const BAR_H = 54;

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

  // ── Content (loads via React Query — same cache as page component) ──────────
  const { content } = usePageContent<Record<string, unknown>>(activePage);

  // ── Field values (flat state — source of truth for <E> popover) ────────────
  const pageDef = getPageDef(activePage);
  const editableFields = (pageDef?.fields ?? []).filter(
    (f) => f.type !== "array" && f.type !== "json" && f.type !== "readonly"
  );

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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const performSave = useCallback(async () => {
    const currentContent = queryClient.getQueryData<Record<string, unknown>>([
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

  // Called by <E> on each keystroke — updates local state + React Query cache instantly
  const updateField = useCallback(
    (fieldKey: string, value: string) => {
      setFieldValues((prev) => ({ ...prev, [fieldKey]: value }));

      // Optimistic update → page re-renders live while typing
      const currentContent = queryClient.getQueryData<Record<string, unknown>>([
        "page-content",
        activePage,
      ]);
      if (currentContent) {
        const newContent = setNestedValue(currentContent, fieldKey, value);
        queryClient.setQueryData(["page-content", activePage], newContent);
      }

      // Debounced Supabase save
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(performSave, 1500);
    },
    [activePage, queryClient, performSave]
  );

  const getFieldValue = useCallback(
    (fieldKey: string) => fieldValuesRef.current[fieldKey] ?? "",
    []
  );

  // ── Sidebar (for array/json fields not covered by <E>) ─────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const sections = editableFields.reduce<Record<string, FieldDef[]>>(
    (acc, f) => {
      const s = f.section ?? "Général";
      if (!acc[s]) acc[s] = [];
      acc[s].push(f);
      return acc;
    },
    {}
  );

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (session === undefined) return <Spinner />;
  if (session === null) return <Navigate to="/admin/login" replace />;

  const PageComponent = PAGE_MAP[activePage];
  const currentPageDef = PAGES.find((p) => p.key === activePage);

  // Context value provided to all <E> components inside the page
  const ctxValue = {
    isEditMode: true,
    pageKey: activePage,
    getFieldValue,
    updateField,
  };

  return (
    <EditModeContext.Provider value={ctxValue}>
      <div style={{ position: "relative", minHeight: "100vh", paddingBottom: BAR_H }}>

        {/* ── Page (with live <E> wrappers) ─────────────────────────── */}
        {PageComponent ? (
          <Suspense fallback={<Spinner />}>
            <PageComponent />
          </Suspense>
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <p className="text-slate-400">Page inconnue : {activePage}</p>
          </div>
        )}

        {/* ── Side panel (all text fields) ───────────────────────────── */}
        <AnimatePresence>
          {drawerOpen && (
            <>
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
                }}
              />
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
                <div
                  style={{ background: "#1C3A52", padding: "14px 18px", flexShrink: 0 }}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {currentPageDef?.label ?? activePage}
                    </p>
                    <p className="text-white/50 text-xs mt-0.5">
                      Tous les champs — ou cliquez sur la page
                    </p>
                  </div>
                  <button
                    onClick={() => setDrawerOpen(false)}
                    className="text-white/50 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 flex-shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

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
                      Aucun champ texte.
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
                              onChange={(v) => updateField(field.key, v)}
                              isActive={activeFieldKey === field.key}
                              elRef={(el) => {
                                if (el) fieldRefs.current.set(field.key, el);
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
          }}
        >
          {/* Back */}
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
              background: "rgba(255,255,255,0.2)",
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
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
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
                        color: p.key === activePage ? "#C4903E" : "#1C3A52",
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
          {saving ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Loader2 size={13} className="animate-spin text-white/50" />
              <span className="text-white/50 text-xs font-semibold">
                Sauvegarde…
              </span>
            </div>
          ) : saveStatus === "saved" ? (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Check size={13} className="text-green-400" />
              <span className="text-green-400 text-xs font-semibold">
                Sauvegardé
              </span>
            </div>
          ) : saveStatus === "error" ? (
            <span className="text-red-400 text-xs font-semibold flex-shrink-0">
              Erreur
            </span>
          ) : null}

          <div
            style={{
              width: 1,
              background: "rgba(255,255,255,0.2)",
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

          {/* All fields button */}
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-opacity hover:opacity-90 flex-shrink-0"
            style={{ background: "#C4903E", color: "white" }}
          >
            <Pencil size={13} />
            Tous les champs
          </button>
        </div>
      </div>
    </EditModeContext.Provider>
  );
}
