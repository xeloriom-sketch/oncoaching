import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Save, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getPageDef } from "@/lib/contentSchema";
import type { FieldDef } from "@/lib/contentSchema";
import { useToast } from "@/hooks/use-toast";

// ─── Flatten helpers ──────────────────────────────────────────────────────────
function flattenJson(obj: unknown, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};

  if (obj === null || obj === undefined) return result;

  if (typeof obj === "string" || typeof obj === "number") {
    if (prefix) result[prefix] = String(obj);
    return result;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      const key = prefix ? `${prefix}.${idx}` : String(idx);
      const nested = flattenJson(item, key);
      Object.assign(result, nested);
    });
    return result;
  }

  if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      const nested = flattenJson(v, key);
      Object.assign(result, nested);
    }
    return result;
  }

  return result;
}

function unflattenJson(
  fields: Record<string, string>,
  original: unknown
): unknown {
  // Deep clone the original so we don't mutate it
  const result: unknown = JSON.parse(JSON.stringify(original ?? {}));

  for (const [dotPath, value] of Object.entries(fields)) {
    // Skip virtual keys used for JSON editing
    if (dotPath.endsWith(".__json__")) continue;

    const parts = dotPath.split(".");
    let cursor: unknown = result;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (
        cursor !== null &&
        typeof cursor === "object" &&
        !Array.isArray(cursor)
      ) {
        cursor = (cursor as Record<string, unknown>)[part];
      } else if (Array.isArray(cursor)) {
        cursor = (cursor as unknown[])[Number(part)];
      } else {
        cursor = undefined;
        break;
      }
    }

    const lastPart = parts[parts.length - 1];
    if (cursor !== null && typeof cursor === "object" && !Array.isArray(cursor)) {
      (cursor as Record<string, unknown>)[lastPart] = value;
    } else if (Array.isArray(cursor)) {
      (cursor as unknown[])[Number(lastPart)] = value;
    }
  }

  return result;
}

// ─── Sort flat keys by numeric index segments ─────────────────────────────────
function sortFlatKeys(keys: string[]): string[] {
  return [...keys].sort((a, b) => {
    const pa = a.split(".");
    const pb = b.split(".");
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if (pa[i] === undefined) return -1;
      if (pb[i] === undefined) return 1;
      const na = Number(pa[i]), nb = Number(pb[i]);
      if (!isNaN(na) && !isNaN(nb)) { if (na !== nb) return na - nb; }
      else { if (pa[i] < pb[i]) return -1; if (pa[i] > pb[i]) return 1; }
    }
    return 0;
  });
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function FieldSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 w-32 bg-slate-200 rounded" />
      <div className="h-10 w-full bg-slate-100 rounded-lg" />
    </div>
  );
}

// ─── Render a single field def ────────────────────────────────────────────────
function renderField(
  fieldDef: FieldDef,
  fields: Record<string, string>,
  originalFields: Record<string, string>,
  handleChange: (key: string, value: string) => void
): React.ReactNode {
  const value = fields[fieldDef.key] ?? "";
  const originalValue = originalFields[fieldDef.key] ?? "";
  const isModified = value !== originalValue;
  const isReadonly = fieldDef.type === "readonly";

  // ── Array type ──────────────────────────────────────────────────────────────
  if (fieldDef.type === "array") {
    const prefix = fieldDef.key + ".";
    const subKeys = sortFlatKeys(
      Object.keys(fields).filter(k => k.startsWith(prefix))
    );

    if (subKeys.length === 0) {
      return (
        <div key={fieldDef.key} className="px-6 py-5 space-y-2">
          <label className="text-sm font-medium text-slate-700">{fieldDef.label}</label>
          <p className="text-xs text-slate-400 italic">Aucun élément (page non seedée ?)</p>
        </div>
      );
    }

    // Group sub-keys by their first numeric index
    const groups = new Map<string, string[]>();
    for (const k of subKeys) {
      const rel = k.slice(prefix.length); // e.g. "0.value", "0.label", "1.q"
      const parts = rel.split(".");
      const groupKey = parts[0]; // "0", "1", "2"...
      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey)!.push(k);
    }

    return (
      <div key={fieldDef.key} className="px-6 py-5 space-y-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">{fieldDef.label}</label>
          <span className="text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
            {groups.size} élément{groups.size > 1 ? "s" : ""}
          </span>
        </div>
        <div className="space-y-3">
          {Array.from(groups.entries()).map(([groupIdx, groupKeys]) => (
            <div key={groupIdx} className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-1.5 border-b border-slate-200">
                <span className="text-xs font-medium text-slate-500">#{Number(groupIdx) + 1}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {groupKeys.map(subKey => {
                  const rel = subKey.slice(prefix.length);
                  const subParts = rel.split(".");
                  // Label: the last non-numeric segment
                  const labelPart = subParts.filter(p => isNaN(Number(p))).pop() ?? subParts[subParts.length - 1];
                  const subLabel = labelPart
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, s => s.toUpperCase())
                    .replace("Desc", "Description")
                    .replace("Num", "Numéro")
                    .replace("Btn", "Bouton");
                  const val = fields[subKey] ?? "";
                  const orig = originalFields[subKey] ?? "";
                  const modified = val !== orig;
                  const isLong = val.length > 80
                    || subLabel.toLowerCase().includes("desc")
                    || subLabel.toLowerCase().includes("message")
                    || subLabel.toLowerCase().includes("paragraph");
                  return (
                    <div key={subKey} className="px-4 py-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-medium text-slate-600 capitalize">{subLabel}</label>
                        {modified && <span className="inline-block w-2 h-2 rounded-full bg-[#C4903E]" />}
                      </div>
                      {isLong ? (
                        <textarea
                          value={val}
                          onChange={e => handleChange(subKey, e.target.value)}
                          rows={3}
                          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] transition-colors"
                        />
                      ) : (
                        <input
                          type="text"
                          value={val}
                          onChange={e => handleChange(subKey, e.target.value)}
                          className="w-full h-9 rounded-lg border border-slate-300 px-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] transition-colors"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── JSON type ───────────────────────────────────────────────────────────────
  if (fieldDef.type === "json") {
    const virtualKey = fieldDef.key + ".__json__";
    const jsonVal = fields[virtualKey] ?? "";
    const jsonModified = jsonVal !== (originalFields[virtualKey] ?? "");
    return (
      <div key={fieldDef.key} className="px-6 py-5 space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700">{fieldDef.label}</label>
          {jsonModified && <span className="inline-block w-2 h-2 rounded-full bg-[#C4903E]" />}
        </div>
        <p className="text-xs text-slate-400 italic">Format JSON — modifiez directement les valeurs</p>
        <textarea
          value={jsonVal}
          onChange={e => handleChange(virtualKey, e.target.value)}
          rows={8}
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] transition-colors"
        />
      </div>
    );
  }

  // ── Default types ───────────────────────────────────────────────────────────
  return (
    <div key={fieldDef.key} className="px-6 py-5 space-y-2">
      {/* Label row */}
      <div className="flex items-center gap-2">
        <label
          htmlFor={fieldDef.key}
          className="text-sm font-medium text-slate-700"
        >
          {fieldDef.label}
        </label>
        {isModified && (
          <span
            title="Champ modifié"
            className="inline-block w-2 h-2 rounded-full bg-[#C4903E]"
          />
        )}
      </div>

      {/* Hint */}
      {fieldDef.hint && (
        <p className="text-xs italic text-slate-400">
          {fieldDef.hint}
        </p>
      )}

      {/* Input */}
      {isReadonly ? (
        <p className="text-sm text-slate-400 italic bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          {value || "—"}
        </p>
      ) : fieldDef.type === "long" || fieldDef.type === "textarea" ? (
        <textarea
          id={fieldDef.key}
          value={value}
          onChange={(e) => handleChange(fieldDef.key, e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] transition-colors"
        />
      ) : (
        <input
          id={fieldDef.key}
          type={fieldDef.type === "url" ? "url" : "text"}
          value={value}
          onChange={(e) => handleChange(fieldDef.key, e.target.value)}
          className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] transition-colors"
        />
      )}
    </div>
  );
}

// ─── AdminContentEditor ───────────────────────────────────────────────────────
export default function AdminContentEditor() {
  const { page = "" } = useParams<{ page: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const pageDef = getPageDef(page);

  // ── State ──────────────────────────────────────────────────────────────────
  const [fields, setFields] = useState<Record<string, string>>({});
  const [originalFields, setOriginalFields] = useState<Record<string, string>>({});
  const [originalJson, setOriginalJson] = useState<unknown>(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notSeeded, setNotSeeded] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Build flat state including virtual JSON keys ────────────────────────────
  function buildFlatWithJsonKeys(
    content: Record<string, unknown>,
    currentPageDef: NonNullable<ReturnType<typeof getPageDef>>
  ): Record<string, string> {
    const flat = flattenJson(content);
    // Add virtual __json__ keys for json-type fields
    for (const fieldDef of currentPageDef.fields) {
      if (fieldDef.type === "json") {
        const nested = content[fieldDef.key];
        if (nested !== undefined) {
          flat[fieldDef.key + ".__json__"] = JSON.stringify(nested, null, 2);
        }
      }
    }
    return flat;
  }

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pageDef) { setLoading(false); return; }

    async function fetchContent() {
      setLoading(true);
      setError(null);
      setNotSeeded(false);

      const { data, error: fetchError } = await supabase
        .from("page_content")
        .select("content")
        .eq("page_key", page)
        .single();

      if (fetchError) {
        // PGRST116 = no rows found
        if (fetchError.code === "PGRST116") {
          setNotSeeded(true);
        } else {
          setError(`Impossible de charger la page : ${fetchError.message}`);
        }
        setLoading(false);
        return;
      }

      const content = data.content as Record<string, unknown>;
      const flat = buildFlatWithJsonKeys(content, pageDef!);
      setFields(flat);
      setOriginalFields(flat);
      setOriginalJson(content);
      setLoading(false);
    }

    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageDef]);

  // ── Initialize page from JSON ──────────────────────────────────────────────
  async function handleInitialize() {
    setInitializing(true);
    setError(null);

    try {
      const json = await fetch(
        `${import.meta.env.BASE_URL}content/${page}.json`
      ).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Record<string, unknown>>;
      });

      const { error: upsertError } = await supabase
        .from("page_content")
        .upsert({ page_key: page, content: json });

      if (upsertError) throw new Error(upsertError.message);

      const flat = buildFlatWithJsonKeys(json, pageDef!);
      setFields(flat);
      setOriginalFields(flat);
      setOriginalJson(json);
      setNotSeeded(false);
      toast({
        title: "Page initialisée",
        description: `"${pageDef?.label}" a été chargée depuis le JSON public.`,
      });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erreur lors de l'initialisation.";
      setError(msg);
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setInitializing(false);
    }
  }

  // ── Field change ───────────────────────────────────────────────────────────
  function handleChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSuccess(false);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!dirty || saving) return;

    setSaving(true);
    setError(null);

    // Process fields: handle virtual __json__ keys for json-type fields
    const processedFields = { ...fields };
    if (pageDef) {
      for (const fieldDef of pageDef.fields) {
        if (fieldDef.type === "json") {
          const virtualKey = fieldDef.key + ".__json__";
          if (processedFields[virtualKey] !== undefined) {
            try {
              const parsed = JSON.parse(processedFields[virtualKey]);
              // Remove virtual key, then flatten the parsed JSON back into real keys
              delete processedFields[virtualKey];
              const flattened = flattenJson(parsed, fieldDef.key);
              Object.assign(processedFields, flattened);
            } catch {
              const msg = `Le champ "${fieldDef.label}" contient du JSON invalide.`;
              setError(msg);
              toast({ title: "JSON invalide", description: msg, variant: "destructive" });
              setSaving(false);
              return;
            }
          }
        }
      }
    }

    const updated = unflattenJson(processedFields, originalJson);

    const { error: saveError } = await supabase
      .from("page_content")
      .update({ content: updated as Record<string, unknown> })
      .eq("page_key", page);

    if (saveError) {
      const msg = `Erreur lors de la sauvegarde : ${saveError.message}`;
      setError(msg);
      toast({ title: "Erreur", description: msg, variant: "destructive" });
      setSaving(false);
      return;
    }

    setOriginalJson(updated);
    const newFlat = buildFlatWithJsonKeys(
      updated as Record<string, unknown>,
      pageDef!
    );
    setOriginalFields(newFlat);
    setFields(newFlat);
    setDirty(false);
    setSuccess(true);
    toast({
      title: "Contenu sauvegardé",
      description: `La page "${pageDef?.label}" a été mise à jour.`,
    });
    if (successTimer.current) clearTimeout(successTimer.current);
    successTimer.current = setTimeout(() => setSuccess(false), 3000);
    setSaving(false);
  }

  // ── 404 ────────────────────────────────────────────────────────────────────
  if (!pageDef && !loading) {
    return (
      <div className="min-h-screen bg-[#F4F1EC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-[#1C3A52] font-semibold text-lg">Page introuvable</p>
          <p className="text-slate-500 text-sm">La clé « {page} » n'existe pas dans le schéma.</p>
          <button
            onClick={() => navigate("/admin/content")}
            className="mt-2 px-5 py-2 rounded-full bg-[#1C3A52] text-white text-sm hover:bg-[#16304a] transition-colors"
          >
            Retour au contenu
          </button>
        </div>
      </div>
    );
  }

  // ── Group fields by section ────────────────────────────────────────────────
  const sections: Map<string, FieldDef[]> = new Map();
  if (pageDef) {
    for (const field of pageDef.fields) {
      const sectionKey = field.section ?? "Général";
      if (!sections.has(sectionKey)) sections.set(sectionKey, []);
      sections.get(sectionKey)!.push(field);
    }
  }

  const sectionEntries = Array.from(sections.entries());

  return (
    <div className="min-h-screen bg-[#F4F1EC]">
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 bg-[#F4F1EC] border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3 flex-wrap">
          {/* Back */}
          <button
            onClick={() => navigate("/admin/content")}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-[#1C3A52] transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Contenu</span>
          </button>

          {/* Title */}
          <h1 className="text-base font-bold text-[#1C3A52] flex-1 min-w-0 truncate">
            Éditer — {pageDef?.label ?? "…"}
          </h1>

          {/* External link */}
          {pageDef && (
            <a
              href={pageDef.route}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#1C3A52] transition-colors shrink-0"
            >
              Voir la page
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {/* Success indicator */}
          {success && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Sauvegardé
            </span>
          )}

          {/* Save button */}
          {!notSeeded && (
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C4903E] text-white text-sm font-medium hover:bg-[#b07e34] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">{saving ? "Sauvegarde…" : "Sauvegarder"}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Not seeded — initialize prompt */}
        {notSeeded && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 flex flex-col items-center text-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertCircle className="w-7 h-7 text-[#C4903E]" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-semibold text-[#1C3A52]">
                Cette page n'est pas encore seedée dans Supabase
              </p>
              <p className="text-sm text-slate-500">
                Cliquez ci-dessous pour charger le contenu depuis le fichier JSON public.
              </p>
            </div>
            <button
              onClick={handleInitialize}
              disabled={initializing}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#C4903E] text-white text-sm font-semibold hover:bg-[#b07e34] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {initializing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {initializing ? "Initialisation…" : "Initialiser depuis le JSON"}
            </button>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        {!loading && !notSeeded && sectionEntries.map(([sectionName, sectionFields], sIdx) => (
          <motion.div
            key={sectionName}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sIdx * 0.07, ease: "easeOut" }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <span className="font-semibold text-[#1C3A52] text-sm">
                {sectionName}
              </span>
              <span className="text-xs text-slate-400 bg-white border border-slate-200 rounded-full px-2.5 py-0.5">
                {sectionFields.length} champ{sectionFields.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Fields */}
            <div className="divide-y divide-slate-100">
              {sectionFields.map((fieldDef) =>
                renderField(fieldDef, fields, originalFields, handleChange)
              )}
            </div>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
