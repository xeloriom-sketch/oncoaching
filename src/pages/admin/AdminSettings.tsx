import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Key,
  Info,
  LogOut,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { auth } from "@/lib/adminAuth";
import { GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH } from "@/lib/githubApi";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, stagger, VP } from "@/lib/motion";

// ── Design tokens ─────────────────────────────────────────────────────────────

const NAVY = "#1C3A52";
const GOLD = "#C4903E";

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VP}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white rounded-2xl shadow-sm p-6"
    >
      {children}
    </motion.div>
  );
}

// ── Section title ─────────────────────────────────────────────────────────────

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold mb-2" style={{ color: NAVY }}>
        {children}
      </h2>
      <div className="h-0.5 w-10 rounded-full" style={{ background: GOLD }} />
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  suffix?: React.ReactNode;
}

function SettingsInput({ label, error, suffix, id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          {...props}
          className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-all pr-12"
          style={{
            borderColor: error ? "#ef4444" : "#e2e8f0",
            color: NAVY,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ["--tw-ring-color" as any]: `${GOLD}4d`,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = GOLD;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${GOLD}26`;
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error ? "#ef4444" : "#e2e8f0";
            e.currentTarget.style.boxShadow = "none";
            props.onBlur?.(e);
          }}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Button ────────────────────────────────────────────────────────────────────

function PrimaryBtn({
  children,
  onClick,
  disabled,
  type = "button",
  color = GOLD,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  color?: string;
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.03, transition: { type: "spring", stiffness: 450, damping: 20 } }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-50"
      style={{ background: color }}
    >
      {children}
    </motion.button>
  );
}

// ── Password Section ──────────────────────────────────────────────────────────

function PasswordSection() {
  const { toast } = useToast();
  const [current, setCurrent]       = useState("");
  const [next, setNext]             = useState("");
  const [confirm, setConfirm]       = useState("");
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext]       = useState(false);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (current !== auth.getPassword()) e.current = "Mot de passe actuel incorrect";
    if (next.length < 6) e.next = "Le nouveau mot de passe doit contenir au moins 6 caractères";
    if (next !== confirm) e.confirm = "Les mots de passe ne correspondent pas";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    auth.setPassword(next);
    toast({ title: "Mot de passe mis à jour", description: "Votre nouveau mot de passe est actif." });
    setCurrent(""); setNext(""); setConfirm(""); setErrors({});
  };

  const eyeToggle = (show: boolean, set: (v: boolean) => void) => (
    <button
      type="button"
      onClick={() => set(!show)}
      className="text-slate-400 hover:text-slate-600 transition-colors"
    >
      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );

  return (
    <Section delay={0}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: GOLD }} />
          Changer le mot de passe
        </span>
      </SectionTitle>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <SettingsInput
          id="current-password"
          label="Mot de passe actuel"
          type={showCurrent ? "text" : "password"}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
          error={errors.current}
          suffix={eyeToggle(showCurrent, setShowCurrent)}
        />
        <SettingsInput
          id="new-password"
          label="Nouveau mot de passe"
          type={showNext ? "text" : "password"}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
          error={errors.next}
          suffix={eyeToggle(showNext, setShowNext)}
        />
        <SettingsInput
          id="confirm-password"
          label="Confirmer le mot de passe"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          error={errors.confirm}
        />
        <div className="pt-1">
          <PrimaryBtn type="submit" color={NAVY}>
            <Check className="w-4 h-4" />
            Mettre à jour le mot de passe
          </PrimaryBtn>
        </div>
      </form>
    </Section>
  );
}

// ── GitHub Token Section ──────────────────────────────────────────────────────

function GitHubTokenSection() {
  const { toast } = useToast();
  const [token, setToken]       = useState(auth.getToken());
  const [showToken, setShowToken] = useState(false);
  const hasToken = token.trim().length > 0;

  const handleSave = () => {
    auth.setToken(token.trim());
    toast({ title: "Token GitHub mis à jour", description: "Les modifications seront sauvegardées via ce token." });
  };

  return (
    <Section delay={0.06}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Key className="w-4 h-4" style={{ color: GOLD }} />
          GitHub — Personal Access Token
        </span>
      </SectionTitle>

      <div className="flex flex-col gap-4 max-w-xl">
        {/* Description */}
        <div className="rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed" style={{ background: "rgba(196,144,62,0.07)", border: `1px solid ${GOLD}30` }}>
          <p>Ce token permet de sauvegarder les modifications de contenu directement dans votre repository GitHub.</p>
          <a
            href="https://github.com/settings/tokens/new?scopes=repo&description=ON%20Coaching%20CMS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 font-semibold hover:underline"
            style={{ color: GOLD }}
          >
            Comment créer un token <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2">
          {hasToken ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <Check className="w-3 h-3" />
              Configuré
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
              <AlertCircle className="w-3 h-3" />
              Non configuré
            </span>
          )}
          {!hasToken && (
            <p className="text-xs text-slate-400">Sans token, les modifications ne pourront pas être sauvegardées.</p>
          )}
        </div>

        {/* Token input */}
        <SettingsInput
          id="github-token"
          label="Personal Access Token"
          type={showToken ? "text" : "password"}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
          autoComplete="off"
          suffix={
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
        />

        {/* Scopes info */}
        <div className="text-xs text-slate-400 flex flex-col gap-1">
          <p className="font-semibold text-slate-500">Permissions requises :</p>
          <ul className="list-disc list-inside space-y-0.5 ml-1">
            <li><code className="bg-slate-100 px-1 rounded text-slate-600">repo</code> — lecture et écriture des fichiers</li>
          </ul>
        </div>

        <div className="pt-1">
          <PrimaryBtn onClick={handleSave} color={GOLD}>
            <Check className="w-4 h-4" />
            Mettre à jour le token
          </PrimaryBtn>
        </div>
      </div>
    </Section>
  );
}

// ── Repository Info ───────────────────────────────────────────────────────────

function RepoInfoSection() {
  const repoUrl = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start gap-2 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-28 text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-700 font-medium">{value}</span>
    </div>
  );

  return (
    <Section delay={0.12}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: GOLD }} />
          Informations du repository
        </span>
      </SectionTitle>

      <div className="rounded-xl overflow-hidden" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <div className="p-4 flex flex-col">
          <Row label="Repository" value={`${GITHUB_OWNER}/${GITHUB_REPO}`} />
          <Row label="Branche" value={GITHUB_BRANCH} />
          <Row label="URL du site" value="https://www.oncoaching.fr" />
        </div>
        <div className="px-4 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold transition-colors hover:underline"
            style={{ color: NAVY }}
          >
            Ouvrir sur GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Section>
  );
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

function DangerSection() {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate("/admin/login");
  };

  return (
    <Section delay={0.18}>
      <div
        className="rounded-xl p-5"
        style={{ border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.04)" }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </h3>
            <p className="text-sm text-red-500/80">
              Vous serez redirigé vers la page de connexion.
            </p>
          </div>
          <motion.button
            type="button"
            onClick={handleLogout}
            whileHover={{ scale: 1.04, transition: { type: "spring", stiffness: 450, damping: 20 } }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </motion.button>
        </div>
      </div>
    </Section>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminSettings = () => {
  return (
    <div className="min-h-screen" style={{ background: "#F4F1EC" }}>
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-10 md:py-14 flex flex-col gap-6">

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col gap-1 mb-2"
        >
          <motion.h1
            variants={fadeInUp}
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: NAVY }}
          >
            Paramètres
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-slate-500 text-sm">
            Sécurité, token GitHub et configuration de l'espace admin.
          </motion.p>
        </motion.div>

        {/* Sections */}
        <PasswordSection />
        <GitHubTokenSection />
        <RepoInfoSection />
        <DangerSection />

      </div>
    </div>
  );
};

export default AdminSettings;
