import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LogoMark } from "@/components/Logo";
import { auth } from "@/lib/adminAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    if (auth.login(password)) {
      navigate("/admin");
    } else {
      setError(true);
      setPassword("");
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
                className="rounded-xl py-3 px-4 text-white outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "white",
                }}
              />
            </div>

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
                  Mot de passe incorrect. Veuillez réessayer.
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full rounded-full py-3 font-semibold text-white transition-opacity hover:opacity-90 active:opacity-75"
              style={{ backgroundColor: "#C4903E" }}
            >
              Se connecter
            </button>
          </form>
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
