import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { auth } from "@/lib/adminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await auth.login(email, password);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      navigate("/admin");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{ backgroundColor: "#F4F1EC" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-6 w-full px-4"
        style={{ maxWidth: 420 }}
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center gap-3">
          <LogoMark size={48} />
          <h1
            className="serif text-3xl font-semibold tracking-wide"
            style={{ color: "#1C3A52", fontFamily: "Cormorant Garamond, serif" }}
          >
            Administration
          </h1>
        </div>

        {/* Card */}
        <div
          className="w-full rounded-3xl p-10"
          style={{ backgroundColor: "#1C3A52", maxWidth: 380 }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-email"
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="admin@example.com"
                required
                className="rounded-xl py-3 px-4 outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="admin-pwd"
                className="text-sm font-medium"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Mot de passe
              </label>
              <input
                id="admin-pwd"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="••••••••••••"
                required
                className="rounded-xl py-3 px-4 outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-red-400 text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75 disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ backgroundColor: "#C4903E" }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Connexion…
                </>
              ) : (
                "Connexion →"
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="mt-6 text-xs text-center" style={{ color: "rgba(255,255,255,0.35)" }}>
            Compte créé dans Supabase Dashboard → Authentication → Users
          </p>
        </div>

        {/* Back link */}
        <a
          href="/"
          className="text-sm transition-opacity hover:opacity-70"
          style={{ color: "#1C3A52" }}
        >
          ← Retour au site
        </a>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
