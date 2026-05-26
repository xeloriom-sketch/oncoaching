import { useEffect, useState } from "react";
import { Navigate, Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Settings,
  LogOut,
} from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { auth } from "@/lib/adminAuth";
import { githubApi } from "@/lib/githubApi";
import type { Submission } from "@/types/admin";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard",   path: "/admin"           },
  { icon: FileText,        label: "Contenu",     path: "/admin/content"   },
  { icon: Inbox,           label: "Messages",    path: "/admin/messages"  },
  { icon: Settings,        label: "Paramètres",  path: "/admin/settings"  },
];

// ─── AdminLayout ──────────────────────────────────────────────────────────────
const AdminLayout = () => {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch unread submissions count on mount
  useEffect(() => {
    githubApi
      .getRawFile("public/content/submissions.json")
      .then((data) => {
        const submissions = data as Submission[];
        if (Array.isArray(submissions)) {
          setUnreadCount(submissions.filter((s) => !s.read).length);
        }
      })
      .catch(() => {
        // silently ignore — file may not exist yet
      });
  }, []);

  if (!auth.isLoggedIn()) {
    return <Navigate to="/admin/login" replace />;
  }

  const currentLabel =
    NAV_ITEMS.find((item) =>
      item.path === "/admin"
        ? location.pathname === "/admin"
        : location.pathname.startsWith(item.path)
    )?.label ?? "Admin";

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
            onClick={() => {
              auth.logout();
              window.location.href = "/admin/login";
            }}
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
                onClick={() => {
                  auth.logout();
                  window.location.href = "/admin/login";
                }}
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
        className="lg:ml-60 min-h-screen pt-14 lg:pt-0"
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
