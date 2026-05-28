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
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
  Monitor,
  Pencil,
  Redo2,
  Save,
  Search,
  Smartphone,
  Undo2,
  X,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { PAGES, getPageDef, type FieldDef } from "@/lib/contentSchema";
import { usePageContent } from "@/hooks/usePageContent";
import { EditModeContext } from "@/contexts/EditModeContext";

// ── Page map ──────────────────────────────────────────────────────────────────

const PAGE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  index:                   lazy(() => import("@/pages/Index")),
  about:                   lazy(() => import("@/pages/About")),
  contact:                 lazy(() => import("@/pages/Contact")),
  "nos-tarifs":            lazy(() => import("@/pages/NosTarifs")),
  partenaires:             lazy(() => import("@/pages/Partenaires")),
  "presse-medias":         lazy(() => import("@/pages/PresseMedias")),
  "coaching-scolaire":     lazy(() => import("@/pages/Services/CoachingScolaire")),
  "coaching-jeunes":       lazy(() => import("@/pages/Services/CoachingJeunes")),
  "coaching-neurofeedback":lazy(() => import("@/pages/Services/CoachingNeurofeedback")),
  "coaching-equipe":       lazy(() => import("@/pages/Services/CoachingEquipe")),
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
    const parts = path.split(".");
    const key = parts[depth];
    const isLast = depth === parts.length - 1;
    const idx = parseInt(key, 10);
    const isArr = !isNaN(idx) && Array.isArray(current);
    if (isLast) {
      if (isArr) (current as unknown[])[idx] = value;
      else (current as Record<string, unknown>)[key] = value;
      return;
    }
    const nextKey = parts[depth + 1];
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

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F1EC]">
      <Loader2 size={28} className="animate-spin" style={{ color: "#1C3A52" }} />
    </div>
  );
}

function Sep() {
  return (
    <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.15)", flexShrink: 0 }} />
  );
}

function FieldInput({
  field,
  value,
  onChange,
  isActive,
  divRef,
}: {
  field: FieldDef;
  value: string;
  onChange: (v: string) => void;
  isActive: boolean;
  divRef?: (el: HTMLDivElement | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);
  const isLong = field.type === "long" || field.type === "textarea";

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, [isActive]);

  return (
    <div
      ref={divRef}
      className="scroll-mt-3 rounded-xl transition-all"
      style={{
        padding: "10px 12px",
        background: isActive ? "#FDF6EC" : "white",
        border: `1.5px solid ${isActive ? "#C4903E" : "transparent"}`,
        boxShadow: isActive ? "0 0 0 3px rgba(196,144,62,0.12)" : "0 1px 3px rgba(0,0,0,0.06)",
      }}
    >
      <label
        className="block text-[10px] font-black uppercase tracking-widest mb-1.5 select-none"
        style={{ color: isActive ? "#C4903E" : "#94a3b8" }}
      >
        {field.label}
      </label>
      {field.hint && (
        <p className="text-[11px] leading-snug mb-1.5" style={{ color: "#94a3b8" }}>
          {field.hint}
        </p>
      )}
      {isLong ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          rows={isActive ? 4 : 2}
          className="w-full text-[13px] bg-transparent border-none outline-none resize-none leading-relaxed"
          style={{ color: "#1C3A52" }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="—"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={field.type === "url" ? "url" : "text"}
          className="w-full text-[13px] bg-transparent border-none outline-none"
          style={{ color: "#1C3A52" }}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="—"
        />
      )}
    </div>
  );
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TOOLBAR_H = 54;
const SIDEBAR_W = 340;

const PAGE_ROUTES: Record<string, string> = {
  "index":                   "/",
  "about":                   "/about",
  "contact":                 "/contact",
  "nos-tarifs":              "/nos-tarifs",
  "partenaires":             "/partenaires",
  "presse-medias":           "/presse-medias",
  "coaching-scolaire":       "/coaching-scolaire",
  "coaching-jeunes":         "/coaching-jeunes",
  "coaching-neurofeedback":  "/coaching-neurofeedback",
  "coaching-equipe":         "/coaching-equipe",
};

// ── AdminVisualEditor ─────────────────────────────────────────────────────────

export default function AdminVisualEditor() {
  const { pageKey = "index" } = useParams<{ pageKey: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ── Auth ────────────────────────────────────────────────────────────────────
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
  }, []);

  // ── Active page — toujours synchronisé avec l'URL ───────────────────────────
  const [activePage, setActivePage] = useState(pageKey);
  useEffect(() => {
    if (pageKey !== activePage) {
      setActivePage(pageKey);
      setActiveFieldKey(null);
      setSearch("");
    }
  }, [pageKey]);
  const [pageDropdown, setPageDropdown] = useState(false);

  // ── Content & fields ─────────────────────────────────────────────────────────
  const { content } = usePageContent<Record<string, unknown>>(activePage);
  const pageDef = getPageDef(activePage);
  const editableFields = (pageDef?.fields ?? []).filter(
    f => f.type !== "array" && f.type !== "json" && f.type !== "readonly"
  );

  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const fieldValuesRef = useRef<Record<string, string>>({});
  useEffect(() => { fieldValuesRef.current = fieldValues; }, [fieldValues]);

  useEffect(() => {
    if (!content) return;
    const flat: Record<string, string> = {};
    for (const f of editableFields) {
      flat[f.key] = (getNestedValue(content, f.key) as string) ?? "";
    }
    setFieldValues(flat);
    // Initialize first history checkpoint when content loads
    historyRef.current = [{ ...flat }];
    historyIndexRef.current = 0;
    setHistoryVersion(v => v + 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, activePage]);

  // ── Active field (bidirectionnel : E ↔ sidebar) ──────────────────────────────
  const [activeFieldKey, setActiveFieldKey] = useState<string | null>(null);
  const fieldRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Scroll sidebar to the active field when changed from <E> click
  useEffect(() => {
    if (activeFieldKey) {
      const el = fieldRefs.current.get(activeFieldKey);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      if (!sidebarOpenRef.current) setSidebarOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFieldKey]);

  // Track sidebar open state via ref (avoid stale closure in effect above)
  const sidebarOpenRef = useRef(true);

  // ── Undo / Redo ──────────────────────────────────────────────────────────────
  const historyRef = useRef<Array<Record<string, string>>>([]);
  const historyIndexRef = useRef(-1);
  const [historyVersion, setHistoryVersion] = useState(0);

  const canUndo = historyVersion >= 0 && historyIndexRef.current > 0;
  const canRedo = historyVersion >= 0 && historyIndexRef.current < historyRef.current.length - 1;

  const pushHistory = useCallback((values: Record<string, string>) => {
    const sliced = historyRef.current.slice(0, historyIndexRef.current + 1);
    sliced.push({ ...values });
    if (sliced.length > 30) sliced.shift();
    historyRef.current = sliced;
    historyIndexRef.current = sliced.length - 1;
    setHistoryVersion(v => v + 1);
  }, []);

  // ── Save ────────────────────────────────────────────────────────────────────
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout>>();

  const performSave = useCallback(async (skipHistory = false) => {
    const currentContent = queryClient.getQueryData<Record<string, unknown>>(["page-content", activePage]);
    if (!currentContent) return;
    setSaving(true);
    let newContent: Record<string, unknown> = JSON.parse(JSON.stringify(currentContent));
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
      if (!skipHistory) pushHistory(fieldValuesRef.current);
    } else {
      setSaveStatus("error");
    }
    setSaving(false);
  }, [activePage, queryClient, pushHistory]);

  const updateField = useCallback((fKey: string, value: string) => {
    setFieldValues(prev => ({ ...prev, [fKey]: value }));
    const currentContent = queryClient.getQueryData<Record<string, unknown>>(["page-content", activePage]);
    if (currentContent) {
      queryClient.setQueryData(["page-content", activePage], setNestedValue(currentContent, fKey, value));
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => performSave(), 1500);
  }, [activePage, queryClient, performSave]);

  const getFieldValue = useCallback((fKey: string) => fieldValuesRef.current[fKey] ?? "", []);

  // ── Apply history snapshot ────────────────────────────────────────────────────
  const applySnapshot = useCallback((values: Record<string, string>) => {
    fieldValuesRef.current = values;
    setFieldValues({ ...values });
    const currentContent = queryClient.getQueryData<Record<string, unknown>>(["page-content", activePage]);
    if (currentContent) {
      let newContent = JSON.parse(JSON.stringify(currentContent));
      for (const [k, v] of Object.entries(values)) {
        newContent = setNestedValue(newContent, k, v);
      }
      queryClient.setQueryData(["page-content", activePage], newContent);
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => performSave(true), 600);
  }, [activePage, queryClient, performSave]);

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    setHistoryVersion(v => v + 1);
    applySnapshot(historyRef.current[historyIndexRef.current]);
  }, [applySnapshot]);

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    setHistoryVersion(v => v + 1);
    applySnapshot(historyRef.current[historyIndexRef.current]);
  }, [applySnapshot]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === "s") { e.preventDefault(); performSave(); }
      if (meta && !e.shiftKey && e.key === "z") { e.preventDefault(); undo(); }
      if (meta && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
      if (e.key === "Escape") { setActiveFieldKey(null); setPageDropdown(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [performSave, undo, redo]);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => { sidebarOpenRef.current = sidebarOpen; }, [sidebarOpen]);
  const [previewMode, setPreviewMode] = useState(false);
  const [viewport, setViewport] = useState<"desktop" | "mobile">("desktop");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());

  const toggleSection = (s: string) =>
    setCollapsedSections(prev => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });

  // ── Sections (sidebar) ────────────────────────────────────────────────────────
  const sections = editableFields
    .filter(f =>
      !search ||
      f.label.toLowerCase().includes(search.toLowerCase()) ||
      f.key.toLowerCase().includes(search.toLowerCase())
    )
    .reduce<Record<string, FieldDef[]>>((acc, f) => {
      const s = f.section ?? "Général";
      if (!acc[s]) acc[s] = [];
      acc[s].push(f);
      return acc;
    }, {});

  // ── Context value ─────────────────────────────────────────────────────────────
  const handleSetActiveFieldKey = useCallback((key: string | null) => {
    setActiveFieldKey(key);
    if (key && !sidebarOpenRef.current) setSidebarOpen(true);
  }, []);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  if (session === undefined) return <Spinner />;
  if (session === null) return <Navigate to="/admin/login" replace />;

  const PageComponent = PAGE_MAP[activePage];
  const currentPageDef = PAGES.find(p => p.key === activePage);
  const activeField = editableFields.find(f => f.key === activeFieldKey);

  const ctxValue = {
    isEditMode: true,
    pageKey: activePage,
    activeFieldKey,
    setActiveFieldKey: handleSetActiveFieldKey,
    getFieldValue,
    updateField,
    previewMode,
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <EditModeContext.Provider value={ctxValue}>
      <div style={{ minHeight: "100vh", paddingTop: TOOLBAR_H }}>

        {/* ══ TOOLBAR ══════════════════════════════════════════════════════════ */}
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0,
            height: TOOLBAR_H, background: "#1C3A52", zIndex: 9999,
            display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {/* Back */}
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-sm font-medium flex-shrink-0"
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:block">Admin</span>
          </button>

          <Sep />

          {/* Page selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setPageDropdown(v => !v)}
              className="flex items-center gap-1.5 text-white text-sm font-semibold hover:text-[#C4903E] transition-colors px-2 py-1.5 rounded-lg hover:bg-white/10"
            >
              <span className="max-w-[130px] truncate hidden sm:block">
                {currentPageDef?.label ?? activePage}
              </span>
              <ChevronDown size={12} />
            </button>
            <AnimatePresence>
              {pageDropdown && (
                <>
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 9998 }}
                    onClick={() => setPageDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute", top: "calc(100% + 8px)", left: 0,
                      background: "white", borderRadius: 16,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.22)",
                      minWidth: 230, zIndex: 9999, overflow: "hidden",
                    }}
                  >
                    {PAGES.filter(p => p.key !== "site-settings").map(p => (
                      <button
                        key={p.key}
                        onClick={() => {
                          navigate(`/admin/visual/${p.key}`, { replace: true });
                          setPageDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FDF6EC] transition-colors flex items-center justify-between"
                        style={{
                          color: p.key === activePage ? "#C4903E" : "#1C3A52",
                          fontWeight: p.key === activePage ? 700 : 400,
                          borderBottom: "1px solid #f1f5f9",
                        }}
                      >
                        {p.label}
                        {p.key === activePage && <Check size={13} style={{ color: "#C4903E" }} />}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <Sep />

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={undo} disabled={!canUndo} title="Annuler (⌘Z)"
              className="p-2 rounded-lg transition-colors disabled:opacity-25 hover:bg-white/10 text-white"
            >
              <Undo2 size={15} />
            </button>
            <button
              onClick={redo} disabled={!canRedo} title="Rétablir (⌘⇧Z)"
              className="p-2 rounded-lg transition-colors disabled:opacity-25 hover:bg-white/10 text-white"
            >
              <Redo2 size={15} />
            </button>
          </div>

          <Sep />

          {/* Preview */}
          <button
            onClick={() => setPreviewMode(v => !v)}
            title={previewMode ? "Retour en mode édition" : "Aperçu sans indicateurs"}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-semibold"
            style={{
              background: previewMode ? "rgba(196,144,62,0.25)" : "transparent",
              color: previewMode ? "#C4903E" : "rgba(255,255,255,0.7)",
            }}
          >
            {previewMode ? <EyeOff size={14} /> : <Eye size={14} />}
            <span className="hidden md:block">{previewMode ? "Édition" : "Aperçu"}</span>
          </button>

          {/* Viewport */}
          <div
            className="flex items-center rounded-lg overflow-hidden"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <button
              onClick={() => { setViewport("desktop"); setMobilePreviewOpen(false); }}
              title="Bureau"
              className="p-1.5 transition-colors"
              style={{ background: viewport === "desktop" ? "rgba(255,255,255,0.18)" : "transparent", color: "white" }}
            >
              <Monitor size={14} />
            </button>
            <button
              onClick={() => { setViewport("mobile"); setMobilePreviewOpen(true); }}
              title="Aperçu mobile (390px)"
              className="p-1.5 transition-colors"
              style={{ background: viewport === "mobile" ? "rgba(255,255,255,0.18)" : "transparent", color: "white" }}
            >
              <Smartphone size={14} />
            </button>
          </div>

          <div style={{ flex: 1 }} />

          {/* Save status */}
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.div key="saving" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-white/50 text-xs font-semibold flex-shrink-0">
                <Loader2 size={13} className="animate-spin" />
                <span className="hidden sm:block">Sauvegarde…</span>
              </motion.div>
            ) : saveStatus === "saved" ? (
              <motion.div key="saved" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-xs font-semibold flex-shrink-0" style={{ color: "#4ade80" }}>
                <Check size={13} />
                <span className="hidden sm:block">Sauvegardé</span>
              </motion.div>
            ) : saveStatus === "error" ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-red-400 text-xs font-semibold flex-shrink-0">Erreur</motion.div>
            ) : null}
          </AnimatePresence>

          <Sep />

          {/* Mode badge */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Pencil size={13} style={{ color: "#C4903E" }} />
            <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block" style={{ color: "#C4903E" }}>
              Éditeur
            </span>
          </div>

          <Sep />

          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0"
            style={{ background: sidebarOpen ? "#C4903E" : "rgba(255,255,255,0.12)", color: "white" }}
          >
            <Pencil size={13} />
            <span className="hidden sm:block">Champs</span>
          </button>
        </div>

        {/* ══ PAGE PREVIEW ════════════════════════════════════════════════════ */}
        <div style={{ paddingRight: sidebarOpen ? SIDEBAR_W : 0, transition: "padding-right 0.35s ease" }}>
          {PageComponent ? (
            <Suspense fallback={<Spinner />}>
              <PageComponent key={activePage} />
            </Suspense>
          ) : (
            <div className="flex items-center justify-center min-h-screen">
              <p className="text-slate-400 text-sm">Page inconnue : {activePage}</p>
            </div>
          )}
        </div>

        {/* ══ MOBILE PREVIEW MODAL ════════════════════════════════════════════ */}
        <AnimatePresence>
          {mobilePreviewOpen && (
            <motion.div
              key="mobile-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: "fixed", inset: 0, zIndex: 10000,
                background: "rgba(10,20,35,0.88)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(6px)",
              }}
              onClick={e => { if (e.target === e.currentTarget) { setMobilePreviewOpen(false); setViewport("desktop"); } }}
            >
              {/* Phone frame */}
              <motion.div
                initial={{ scale: 0.88, y: 24 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.88, y: 24 }}
                transition={{ type: "spring", stiffness: 340, damping: 36 }}
                style={{
                  width: 393, height: 780,
                  background: "#111",
                  borderRadius: 52,
                  boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(255,255,255,0.12)",
                  position: "relative",
                  overflow: "hidden",
                  border: "8px solid #1a1a1a",
                }}
              >
                {/* Dynamic island */}
                <div style={{
                  position: "absolute", top: 10, left: "50%",
                  transform: "translateX(-50%)",
                  width: 120, height: 32,
                  background: "#000", borderRadius: 20,
                  zIndex: 10,
                }} />
                {/* Side buttons */}
                <div style={{ position: "absolute", right: -10, top: 120, width: 4, height: 64, background: "#333", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: -10, top: 110, width: 4, height: 36, background: "#333", borderRadius: 2 }} />
                <div style={{ position: "absolute", left: -10, top: 158, width: 4, height: 36, background: "#333", borderRadius: 2 }} />
                {/* Iframe */}
                <iframe
                  src={`${window.location.origin}${import.meta.env.BASE_URL || "/"}${PAGE_ROUTES[activePage]?.replace(/^\//, "") ?? ""}`}
                  style={{ width: "100%", height: "100%", border: "none", borderRadius: 44, paddingTop: 50 }}
                  title={`Aperçu mobile — ${currentPageDef?.label ?? activePage}`}
                />
              </motion.div>

              {/* Close + label */}
              <div style={{ position: "absolute", top: 16, right: 16, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                <button
                  onClick={() => { setMobilePreviewOpen(false); setViewport("desktop"); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                  style={{ background: "rgba(255,255,255,0.12)", color: "white", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                >
                  <X size={14} />
                  Fermer
                </button>
                <p className="text-[11px] text-white/40">Affiche la version sauvegardée</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ SIDEBAR ═════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ x: SIDEBAR_W }}
              animate={{ x: 0 }}
              exit={{ x: SIDEBAR_W }}
              transition={{ type: "spring", stiffness: 380, damping: 40 }}
              style={{
                position: "fixed", top: TOOLBAR_H, right: 0, bottom: 0,
                width: SIDEBAR_W, background: "#F8FAFC", zIndex: 8000,
                boxShadow: "-4px 0 28px rgba(0,0,0,0.1)",
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}
            >
              {/* Header */}
              <div style={{ padding: "14px 14px 10px", background: "#F0F4F8", borderBottom: "1px solid #E2E8F0", flexShrink: 0 }}>
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#C4903E" }}>
                      {currentPageDef?.label ?? activePage}
                    </p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#94a3b8" }}>
                      {editableFields.length} champs éditables
                    </p>
                  </div>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-white"
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Rechercher un champ…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-[#C4903E] transition-colors"
                    style={{ color: "#1C3A52" }}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto" style={{ padding: "12px 12px 24px" }}>

                {/* Active field — pinned at top */}
                {activeField && !search && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4903E" }} />
                      <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: "#C4903E" }}>
                        Champ sélectionné
                      </span>
                      <button
                        onClick={() => setActiveFieldKey(null)}
                        className="ml-auto text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </div>
                    <FieldInput
                      field={activeField}
                      value={fieldValues[activeFieldKey!] ?? ""}
                      onChange={v => updateField(activeFieldKey!, v)}
                      isActive
                    />
                  </div>
                )}

                {/* Loading */}
                {!content && (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 size={22} className="animate-spin" style={{ color: "#C4903E" }} />
                  </div>
                )}

                {/* Sections */}
                {content && Object.entries(sections).map(([sectionName, sectionFields]) => {
                  const isCollapsed = collapsedSections.has(sectionName);
                  return (
                    <div key={sectionName} className="mb-4">
                      <button
                        onClick={() => toggleSection(sectionName)}
                        className="flex items-center gap-2 w-full mb-2 px-1 group"
                      >
                        <ChevronRight
                          size={12}
                          className="transition-transform"
                          style={{ color: "#C4903E", transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)" }}
                        />
                        <span className="text-[10px] font-black uppercase tracking-widest flex-1 text-left" style={{ color: "#C4903E" }}>
                          {sectionName}
                        </span>
                        <span className="text-[10px] text-slate-400">{sectionFields.length}</span>
                      </button>

                      {!isCollapsed && (
                        <div className="flex flex-col gap-1.5 pl-1">
                          {sectionFields.map(field => (
                            <div
                              key={field.key}
                              onClick={() => setActiveFieldKey(field.key === activeFieldKey ? null : field.key)}
                              style={{ cursor: "pointer" }}
                              ref={el => {
                                if (el) fieldRefs.current.set(field.key, el);
                                else fieldRefs.current.delete(field.key);
                              }}
                            >
                              <FieldInput
                                field={field}
                                value={fieldValues[field.key] ?? ""}
                                onChange={v => updateField(field.key, v)}
                                isActive={activeFieldKey === field.key}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* No results */}
                {content && Object.keys(sections).length === 0 && (
                  <p className="text-slate-400 text-sm text-center py-12">
                    {search ? `Aucun champ pour "${search}"` : "Aucun champ texte."}
                  </p>
                )}
              </div>

              {/* Footer — Save button */}
              <div style={{ padding: "10px 12px", borderTop: "1px solid #E2E8F0", background: "#F0F4F8", flexShrink: 0 }}>
                <button
                  onClick={() => performSave()}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "#1C3A52", color: "white", opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  {saving ? "Sauvegarde…" : "Sauvegarder — ⌘S"}
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </EditModeContext.Provider>
  );
}
