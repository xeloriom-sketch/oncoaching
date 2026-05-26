import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/adminAuth";
import { githubApi } from "@/lib/githubApi";
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

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function FieldSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      <div className="h-4 w-32 bg-slate-200 rounded" />
      <div className="h-10 w-full bg-slate-100 rounded-lg" />
    </div>
  );
}

// ─── TokenPromptDialog ────────────────────────────────────────────────────────
interface TokenPromptProps {
  onClose: () => void;
  onSaved: () => void;
}

function TokenPromptDialog({ onClose, onSaved }: TokenPromptProps) {
  const [value, setValue] = useState("");

  function handleSave() {
    if (!value.trim()) return;
    (auth as unknown as { setToken: (t: string) => void }).setToken(value.trim());
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-[#1C3A52]">
          Configurer le token GitHub
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Pour sauvegarder, vous avez besoin d'un Personal Access Token GitHub
          avec les droits{" "}
          <code className="bg-slate-100 px-1 rounded text-xs">repo</code>.
          Créez-en un sur{" "}
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=ON+Coaching+CMS"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C4903E] underline hover:text-[#b07e34]"
          >
            github.com/settings/tokens
          </a>
          .
        </p>

        <input
          type="password"
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
          className="w-full h-10 px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4903E]/40 focus:border-[#C4903E] font-mono"
        />

        <div className="flex justify-end gap-2 pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="px-5 py-2 rounded-full bg-[#C4903E] text-white text-sm font-medium hover:bg-[#b07e34] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </motion.div>
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
  const [originalSha, setOriginalSha] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [tokenPrompt, setTokenPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Token ──────────────────────────────────────────────────────────────────
  const token = auth.isLoggedIn() ? auth.getToken() : "";

  // ── Fetch on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!pageDef) { setLoading(false); return; }

    async function fetchContent() {
      setLoading(true);
      setError(null);
      try {
        const { content, sha } = await githubApi.getFile(
          `public/content/${page}.json`,
          token
        );
        const flat = flattenJson(content);
        setFields(flat);
        setOriginalFields(flat);
        setOriginalJson(content);
        setOriginalSha(sha);
      } catch (err) {
        setError(
          err instanceof Error
            ? `Impossible de charger le fichier : ${err.message}. Vérifiez votre token GitHub.`
            : "Erreur inconnue lors du chargement."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageDef]);

  // ── Field change ───────────────────────────────────────────────────────────
  function handleChange(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSuccess(false);
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    if (!dirty || saving) return;

    if (!token) {
      setTokenPrompt(true);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updated = unflattenJson(fields, originalJson);
      const { sha } = await githubApi.updateFile(
        `public/content/${page}.json`,
        updated,
        originalSha,
        token,
        `Admin : mise à jour du contenu — ${pageDef?.label ?? page}`
      );
      setOriginalSha(sha);
      setOriginalFields({ ...fields });
      setDirty(false);
      setSuccess(true);
      toast({
        title: "Contenu sauvegardé",
        description: `La page "${pageDef?.label}" a été mise à jour.`,
      });
      if (successTimer.current) clearTimeout(successTimer.current);
      successTimer.current = setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erreur lors de la sauvegarde.";
      setError(msg);
      toast({ title: "Erreur", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
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
      if (!sections.has(field.section)) sections.set(field.section, []);
      sections.get(field.section)!.push(field);
    }
  }

  const sectionEntries = Array.from(sections.entries());

  return (
    <>
      {/* Token prompt dialog */}
      {tokenPrompt && (
        <TokenPromptDialog
          onClose={() => setTokenPrompt(false)}
          onSaved={() => {
            // After saving token, retry save
            setTokenPrompt(false);
            handleSave();
          }}
        />
      )}

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

            {/* Token warning */}
            {!token && (
              <button
                onClick={() => setTokenPrompt(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-medium hover:bg-red-200 transition-colors shrink-0"
              >
                <AlertCircle className="w-3 h-3" />
                Token GitHub requis
              </button>
            )}

            {/* Success indicator */}
            {success && (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sauvegardé
              </span>
            )}

            {/* Save button */}
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
          {!loading && sectionEntries.map(([sectionName, sectionFields], sIdx) => (
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
                {sectionFields.map((fieldDef) => {
                  const value = fields[fieldDef.key] ?? "";
                  const originalValue = originalFields[fieldDef.key] ?? "";
                  const isModified = value !== originalValue;
                  const isReadonly = fieldDef.type === "readonly";

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
                      ) : fieldDef.type === "long" ? (
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
                })}
              </div>
            </motion.div>
          ))}
        </main>
      </div>
    </>
  );
}
