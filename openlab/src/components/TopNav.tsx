import { NavLink, Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const studentNavItems = [
  { label: "공고 게시판", to: "/notices" },
  { label: "참여 가이드", to: "/guide" },
  { label: "커뮤니티", to: "/community" },
  { label: "resume screening", to: "/resume-screener" },
  { label: "마이페이지", to: "/mypage" },
  { label: "FAQ", to: "/faq" },
];

const labNavItems = [
  { label: "게시한 공고", to: "/notices" },
  { label: "공고 등록", to: "/post" },
  { label: "참여 가이드", to: "/guide" },
  { label: "커뮤니티", to: "/community" },
  { label: "resume screening", to: "/resume-screener" },
  { label: "마이페이지", to: "/mypage" },
  { label: "FAQ", to: "/faq" },
];

import { useAuth } from "../context/AuthContext";

export default function TopNav() {
  const { auth } = useAuth();

  const effectiveMode: "student" | "lab" =
    auth.role === "master"
      ? auth.currentMode
      : auth.role === "lab"
        ? "lab"
        : "student";

  const navItems = auth.isLoggedIn
    ? effectiveMode === "lab"
      ? labNavItems
      : studentNavItems
    : studentNavItems;

  const getInitials = (name?: string | undefined, email?: string | undefined) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
    }
    if (email) return email.trim()[0].toUpperCase();
    return "U";
  };

  return (
    <div className="bg-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start gap-4 px-8 py-5 md:flex-row md:flex-nowrap md:items-center md:justify-between md:gap-6">
        <Link className="flex items-center gap-3 md:flex-shrink-0" to="/">
          <Sparkles className="h-7 w-7 text-accent" />
          <div className="space-y-1">
            <p className="text-2xl font-extrabold tracking-[0.05em] text-accent">
              OpenLAB
            </p>
            <p className="whitespace-nowrap text-xs text-navy/60">Unbundling of Research</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold md:flex-1 md:justify-center md:gap-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-4 py-2 transition ${
                  isActive
                    ? "bg-slate text-navy"
                    : "text-navy/70 hover:bg-slate hover:text-navy"
                }`
              }
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-2 text-sm font-semibold text-navy/70 md:flex-shrink-0 md:items-end md:self-center">
          <div className="flex items-center gap-3 md:gap-4">
            {auth.isLoggedIn ? (
              <Link to="/mypage" className="inline-flex items-center gap-3 rounded-full px-2 py-1 hover:opacity-90">
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold">
                  {getInitials(auth.user?.name, auth.user?.email)}
                </div>
                <span className="hidden md:inline text-sm text-navy">{auth.user?.name ?? auth.user?.email}</span>
              </Link>
            ) : (
              <>
                <Link
                  className="rounded-full border border-navy/20 px-4 py-2 transition hover:border-navy/40"
                  to="/login"
                >
                  로그인
                </Link>
                <Link
                  className="rounded-full bg-accent px-4 py-2 text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]"
                  to="/signup"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
