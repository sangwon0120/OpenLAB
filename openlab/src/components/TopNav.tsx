import { NavLink, Link } from "react-router-dom";
import { GraduationCap, Sparkles } from "lucide-react";

const navItems = [
  { label: "공고", to: "/notices" },
  { label: "공고 등록", to: "/post" },
  { label: "참여 가이드", to: "/guide" },
  { label: "커뮤니티", to: "/community" },
  { label: "FAQ", to: "/faq" },
];

export default function TopNav() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <Link className="flex items-center gap-3" to="/">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white shadow-glow">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              OpenLAB
            </p>
            <p className="text-xs text-navy/60">Light Commitment, Heavy Impact</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold md:gap-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${
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
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy/70">
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
          <span className="hidden items-center gap-2 text-sm font-medium text-navy/60 md:flex">
            <Sparkles className="h-4 w-4 text-accent" />
            Unbundling of Research
          </span>
        </div>
      </div>
    </div>
  );
}
