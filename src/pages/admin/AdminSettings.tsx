import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Database,
  Info,
  LogOut,
  ExternalLink,
  Check,
  X,
  Bell,
  Loader2,
  Lock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/adminAuth";
import { PAGES } from "@/lib/contentSchema";
import { useToast } from "@/hooks/use-toast";
import { fadeInUp, stagger, VP } from "@/lib/motion";

// ── Design tokens ─────────────────────────────────────────────────────────────

const NAVY = "#1C3A52";
const GOLD = "#C4903E";
const BONE = "#F4F1EC";

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

// ── Compte Section ────────────────────────────────────────────────────────────

function CompteSection() {
  const [email, setEmail] = useState<string>("…");

  useEffect(() => {
    auth.getUser().then((user) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  return (
    <Section delay={0}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: GOLD }} />
          Compte
        </span>
      </SectionTitle>

      <div className="flex flex-col gap-4 max-w-md">
        {/* Email */}
        <div className="rounded-xl px-4 py-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Email</p>
          <p className="text-sm font-medium" style={{ color: NAVY }}>{email}</p>
        </div>

        {/* Password hint */}
        <div
          className="rounded-xl px-4 py-3 text-sm text-slate-600 leading-relaxed"
          style={{ background: `rgba(196,144,62,0.07)`, border: `1px solid ${GOLD}30` }}
        >
          <p>Pour changer votre mot de passe, utilisez le Dashboard Supabase.</p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2 font-semibold hover:underline"
            style={{ color: GOLD }}
          >
            Ouvrir Supabase Dashboard <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </Section>
  );
}

// ── Seed result item ──────────────────────────────────────────────────────────

interface SeedResult {
  page: string;
  ok: boolean;
}

// ── Init Content Section ──────────────────────────────────────────────────────

function InitContentSection() {
  const { toast } = useToast();
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<SeedResult[]>([]);
  const [done, setDone] = useState(false);

  const total = PAGES.length;
  const imported = results.filter((r) => r.ok).length;

  const handleImport = async () => {
    setImporting(true);
    setResults([]);
    setDone(false);

    const newResults = await Promise.all(
      PAGES.map(async (page) => {
        try {
          const json = await fetch(
            `${import.meta.env.BASE_URL}content/${page.key}.json`
          ).then((r) => r.json());
          const { error } = await supabase
            .from("page_content")
            .upsert({ page_key: page.key, content: json }, { onConflict: "page_key" });
          return { page: page.key, ok: !error };
        } catch {
          return { page: page.key, ok: false };
        }
      })
    );

    setResults(newResults);
    setDone(true);
    setImporting(false);

    const failed = newResults.filter((r) => !r.ok).length;
    if (failed === 0) {
      toast({ title: "Import réussi", description: `${total} pages importées dans Supabase.` });
    } else {
      toast({
        title: "Import partiel",
        description: `${imported} pages réussies, ${failed} erreur(s).`,
        variant: "destructive",
      });
    }
  };

  const progressPct = done || results.length > 0 ? Math.round((imported / total) * 100) : 0;

  // Page label lookup
  const pageLabelMap = Object.fromEntries(PAGES.map((p) => [p.key, p.label]));

  return (
    <Section delay={0.06}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Database className="w-4 h-4" style={{ color: GOLD }} />
          Initialiser le contenu
        </span>
      </SectionTitle>

      <div className="flex flex-col gap-5 max-w-xl">
        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed">
          Charge les textes actuels de chaque page depuis les fichiers JSON et les enregistre dans Supabase.{" "}
          <span className="font-semibold" style={{ color: NAVY }}>À faire une seule fois au démarrage.</span>
        </p>

        {/* Import button */}
        <div>
          <motion.button
            type="button"
            onClick={handleImport}
            disabled={importing}
            whileHover={importing ? {} : { scale: 1.03, transition: { type: "spring", stiffness: 450, damping: 20 } }}
            whileTap={importing ? {} : { scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ background: GOLD }}
          >
            {importing ? (
              <>
                <span
                  className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: "white", borderTopColor: "transparent" }}
                />
                Import en cours…
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Importer les {total} pages
              </>
            )}
          </motion.button>
        </div>

        {/* Progress bar */}
        {(importing || done) && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>{imported} / {total} importées</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: progressPct === 100 ? "#16a34a" : GOLD }}
              />
            </div>
          </div>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {results.map((r) => (
              <motion.div
                key={r.page}
                variants={fadeInUp}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                style={{
                  background: r.ok ? "rgba(22,163,74,0.07)" : "rgba(220,38,38,0.07)",
                  border: `1px solid ${r.ok ? "rgba(22,163,74,0.2)" : "rgba(220,38,38,0.2)"}`,
                }}
              >
                {r.ok ? (
                  <Check className="w-3.5 h-3.5 flex-shrink-0 text-green-600" />
                ) : (
                  <X className="w-3.5 h-3.5 flex-shrink-0 text-red-500" />
                )}
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: r.ok ? "#15803d" : "#dc2626" }}
                >
                  {pageLabelMap[r.page] ?? r.page}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </Section>
  );
}

// ── Info Section ──────────────────────────────────────────────────────────────

function InfoSection() {
  const Row = ({ label, value, href }: { label: string; value: string; href?: string }) => (
    <div className="flex items-start gap-2 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-32 text-xs font-semibold text-slate-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline inline-flex items-center gap-1"
          style={{ color: NAVY }}
        >
          {value} <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
      ) : (
        <span className="text-sm text-slate-700 font-medium">{value}</span>
      )}
    </div>
  );

  return (
    <Section delay={0.12}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4" style={{ color: GOLD }} />
          Informations
        </span>
      </SectionTitle>

      <div className="rounded-xl overflow-hidden" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
        <div className="p-4 flex flex-col">
          <Row
            label="Supabase URL"
            value="suikwvrlfyupzpzhqoln.supabase.co"
            href="https://supabase.com/dashboard/project/suikwvrlfyupzpzhqoln"
          />
          <Row
            label="Site"
            value="xeloriom-sketch.github.io/oncoaching"
            href="https://xeloriom-sketch.github.io/oncoaching/"
          />
          <Row
            label="Repo GitHub"
            value="xeloriom-sketch/oncoaching"
            href="https://github.com/xeloriom-sketch/oncoaching"
          />
        </div>
      </div>
    </Section>
  );
}

// ── Danger Zone ───────────────────────────────────────────────────────────────

function DangerSection() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.logout();
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

// ── Push Notifications Section ────────────────────────────────────────────────

function PushSection() {
  const { toast } = useToast();
  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled]     = useState(false);
  const [pushLoading, setPushLoading]     = useState(false);

  useEffect(() => {
    setPushSupported('serviceWorker' in navigator && 'PushManager' in window);
    // Vérifie si déjà souscrit
    navigator.serviceWorker?.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setPushEnabled(!!sub);
      });
    });
  }, []);

  async function handleTogglePush() {
    setPushLoading(true);
    try {
      const reg = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`,
        { scope: import.meta.env.BASE_URL }
      );
      await navigator.serviceWorker.ready;

      const existing = await reg.pushManager.getSubscription();

      if (pushEnabled && existing) {
        // Désabonner
        await existing.unsubscribe();
        await supabase.from('push_subscriptions').delete().eq('endpoint', existing.endpoint);
        setPushEnabled(false);
        toast({ title: 'Notifications désactivées' });
      } else {
        // Abonner
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          toast({ title: 'Permission refusée', description: 'Autorisez les notifications dans les paramètres du navigateur.', variant: 'destructive' });
          return;
        }
        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!vapidKey) {
          toast({ title: 'Configuration manquante', description: 'La clé VAPID publique (VITE_VAPID_PUBLIC_KEY) est absente.', variant: 'destructive' });
          return;
        }
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidKey,
        });
        const json = sub.toJSON();
        await supabase.from('push_subscriptions').upsert({
          endpoint: json.endpoint,
          p256dh:   (json.keys as Record<string,string>).p256dh,
          auth:     (json.keys as Record<string,string>).auth,
        }, { onConflict: 'endpoint' });
        setPushEnabled(true);
        toast({ title: '🔔 Notifications activées', description: 'Vous recevrez une notification à chaque nouveau message.' });
      }
    } catch (err) {
      toast({ title: 'Erreur', description: err instanceof Error ? err.message : 'Erreur inconnue', variant: 'destructive' });
    } finally {
      setPushLoading(false);
    }
  }

  return (
    <Section delay={0.15}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: GOLD }} />
          Notifications push
        </span>
      </SectionTitle>

      {!pushSupported ? (
        <p className="text-sm text-slate-500">Votre navigateur ne supporte pas les notifications push.</p>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-700">
              {pushEnabled ? '🔔 Notifications activées' : '🔕 Notifications désactivées'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              {pushEnabled
                ? 'Vous recevrez une notification sur cet appareil à chaque nouveau message.'
                : "Activez pour être notifié instantanément sur ce téléphone ou PC."}
            </p>
          </div>
          <button
            onClick={handleTogglePush}
            disabled={pushLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors disabled:opacity-50 ${
              pushEnabled
                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                : 'bg-[#1C3A52] text-white hover:bg-[#16304a]'
            }`}
          >
            {pushLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {pushEnabled ? 'Désactiver' : 'Activer'}
          </button>
        </div>
      )}
    </Section>
  );
}

// ── Change Password Section ───────────────────────────────────────────────────

function ChangePasswordSection() {
  const { toast } = useToast();
  const [pwForm, setPwForm] = useState({ newPw: '', confirmPw: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');

    if (pwForm.newPw.length < 8) {
      setPwError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirmPw) {
      setPwError('Les mots de passe ne correspondent pas.');
      return;
    }

    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.newPw });
    setPwLoading(false);

    if (error) {
      setPwError(error.message);
    } else {
      setPwForm({ newPw: '', confirmPw: '' });
      toast({ title: 'Mot de passe mis à jour', description: 'Votre mot de passe a été modifié avec succès.' });
    }
  };

  return (
    <Section delay={0.09}>
      <SectionTitle>
        <span className="flex items-center gap-2">
          <Lock className="w-4 h-4" style={{ color: GOLD }} />
          Changer le mot de passe
        </span>
      </SectionTitle>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        {/* Nouveau mot de passe */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Nouveau mot de passe
          </label>
          <input
            type="password"
            value={pwForm.newPw}
            onChange={(e) => setPwForm((f) => ({ ...f, newPw: e.target.value }))}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4903E]/30 focus:border-[#C4903E]"
          />
        </div>

        {/* Confirmer le mot de passe */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Confirmer le mot de passe
          </label>
          <input
            type="password"
            value={pwForm.confirmPw}
            onChange={(e) => setPwForm((f) => ({ ...f, confirmPw: e.target.value }))}
            placeholder="••••••••"
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C4903E]/30 focus:border-[#C4903E]"
          />
        </div>

        {/* Inline error */}
        {pwError && (
          <p className="text-sm text-red-600 font-medium">{pwError}</p>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={pwLoading}
          whileHover={pwLoading ? {} : { scale: 1.02, transition: { type: 'spring', stiffness: 450, damping: 20 } }}
          whileTap={pwLoading ? {} : { scale: 0.97 }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity disabled:opacity-60"
          style={{ background: GOLD }}
        >
          {pwLoading ? (
            <>
              <span
                className="w-4 h-4 border-2 rounded-full animate-spin"
                style={{ borderColor: 'white', borderTopColor: 'transparent' }}
              />
              Mise à jour…
            </>
          ) : (
            'Mettre à jour'
          )}
        </motion.button>
      </form>
    </Section>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const AdminSettings = () => {
  return (
    <div className="min-h-screen" style={{ background: BONE }}>
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
            Compte Supabase et configuration de l'espace admin.
          </motion.p>
        </motion.div>

        {/* Sections */}
        <CompteSection />
        <ChangePasswordSection />
        <InitContentSection />
        <InfoSection />
        <PushSection />
        <DangerSection />

      </div>
    </div>
  );
};

export default AdminSettings;
