import { useEffect, useState } from "react";
import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Settings,
  LogOut,
  Loader2,
  Eye,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { LogoMark } from "@/components/Logo";
import { auth } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/admin"                },
  { icon: Eye,             label: "Éditeur visuel",  path: "/admin/visual"         },
  { icon: FileText,        label: "Contenu",         path: "/admin/content"        },
  { icon: Inbox,           label: "Messages",        path: "/admin/messages"       },
  { icon: Settings,        label: "Paramètres",      path: "/admin/settings"       },
];

// ─── FullScreenSpinner ────────────────────────────────────────────────────────
function FullScreenSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F4F1EC" }}
    >
      <Loader2
        size={32}
        className="animate-spin"
        style={{ color: "#1C3A52" }}
      />
    </div>
  );
}

// ─── AdminLayout ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const location = useLocation();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch { /* not supported */ }
  };

  // ── Session guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Unread count from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    if (!session) return;
    supabase
      .from("submissions")
      .select("*", { count: "exact", head: true })
      .eq("read", false)
      .then(({ count }) => {
        if (typeof count === "number") setUnreadCount(count);
      });
  }, [session]);

  if (session === undefined) return <FullScreenSpinner />;
  if (session === null) return <Navigate to="/admin/login" replace />;

  const currentLabel =
    NAV_ITEMS.find((item) =>
      item.path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.path)
    )?.label ?? "Admin";

  const handleLogout = async () => {
    await auth.logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F4F1EC" }}>
      {/* ── Desktop sidebar ───────────────────────────────────────────── */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-60 z-40"
        style={{ backgroundColor: "#1C3A52" }}
      >
        {/* Top: Logo */}
        <div className="flex items-center gap-2 px-6 py-5">
          <LogoMark size={28} />
          <span className="font-semibold text-white text-sm tracking-wide">Admin</span>
        </div>

        {/* Separator */}
        <div className="mx-4 h-px" style={{ backgroundColor: "#C4903E" }} />

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
            const isActive =
              path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(path);
            const isMessages = label === "Messages";

            return (
              <NavLink
                key={path}
                to={path}
                end={path === "/admin"}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive
                    ? "rgba(255,255,255,0.12)"
                    : undefined,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                      "transparent";
                }}
              >
                {/* Active gold bar */}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ backgroundColor: "#C4903E" }}
                  />
                )}
                <span className="relative">
                  <Icon size={18} />
                  {isMessages && unreadCount > 0 && (
                    <span
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                      style={{ backgroundColor: "#ef4444" }}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                <span className="text-sm">{label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: site name + logout */}
        <div className="px-4 py-5 border-t border-white/10">
          <p className="text-xs text-white/40 mb-3 truncate">ON Coaching</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors w-full"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile header ─────────────────────────────────────────────── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 shadow-sm"
        style={{ backgroundColor: "#F4F1EC" }}
      >
        <div className="flex items-center gap-2">
          <LogoMark size={28} />
          <span
            className="font-semibold text-sm"
            style={{ color: "#1C3A52" }}
          >
            {currentLabel}
          </span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg transition-colors ml-auto mr-1"
          style={{ color: "#1C3A52" }}
          aria-label={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {isFullscreen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25M9 15H4.5M9 15v4.5M9 15l-5.25 5.25" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
        </button>
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: "#1C3A52" }}
          aria-label="Menu"
        >
          <div className="flex flex-col gap-1">
            <span className="w-5 h-0.5 rounded" style={{ backgroundColor: "#1C3A52" }} />
            <span className="w-5 h-0.5 rounded" style={{ backgroundColor: "#1C3A52" }} />
            <span className="w-5 h-0.5 rounded" style={{ backgroundColor: "#1C3A52" }} />
          </div>
        </button>
      </header>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full flex flex-col"
            style={{ backgroundColor: "#1C3A52" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-2">
                <LogoMark size={28} />
                <span className="font-semibold text-white text-sm">Admin</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/60 hover:text-white"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="mx-4 h-px" style={{ backgroundColor: "#C4903E" }} />
            <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
              {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
                const isActive =
                  path === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(path);
                const isMessages = label === "Messages";
                return (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === "/admin"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-white"
                    style={{
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.12)"
                        : undefined,
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                        style={{ backgroundColor: "#C4903E" }}
                      />
                    )}
                    <span className="relative">
                      <Icon size={18} />
                      {isMessages && unreadCount > 0 && (
                        <span
                          className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center px-1"
                          style={{ backgroundColor: "#ef4444" }}
                        >
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </span>
                    <span className="text-sm">{label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="px-4 py-5 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </div>
          </div>
          {/* Backdrop */}
          <div className="flex-1 bg-black/40" />
        </div>
      )}

      {/* ── Main content ──────────────────────────────────────────────── */}
      <main
        className="lg:ml-60 min-h-screen pt-14 pb-20 lg:pt-0 lg:pb-0"
        style={{ backgroundColor: "#F4F1EC" }}
      >
        <Outlet />
      </main>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 flex">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => {
          const isActive =
            path === "/admin"
              ? location.pathname === "/admin"
              : location.pathname.startsWith(path);
          const isMessages = label === "Messages";
          return (
            <NavLink
              key={path}
              to={path}
              end={path === "/admin"}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5"
            >
              <span className="relative">
                <Icon
                  size={20}
                  style={{ color: isActive ? "#C4903E" : "#94a3b8" }}
                />
                {isMessages && unreadCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5"
                    style={{ backgroundColor: "#ef4444" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </span>
              <span
                className="text-[10px] font-medium"
                style={{ color: isActive ? "#C4903E" : "#94a3b8" }}
              >
                {label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminLayout;
