import { NavLink, Link } from "react-router-dom";
import { GraduationCap, Sparkles } from "lucide-react";

const navItems = [
  { label: "공고", to: "/notices" },
  { label: "공고 등록", to: "/post" },
  { label: "참여 가이드", to: "/guide" },
  { label: "커뮤니티", to: "/community" },
  { label: "마이페이지", to: "/mypage" },
  { label: "FAQ", to: "/faq" },
];

export default function TopNav() {
  return (
    <div className="bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 py-5 md:flex-row md:flex-nowrap md:items-center md:gap-6">
        <Link className="flex items-center" to="/">
          <div className="space-y-1">
            <p className="text-2xl font-extrabold tracking-[0.1em] text-accent">
              OpenLAB
            </p>
            <p className="flex items-center gap-2 text-xs text-navy/60">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Unbundling of Research
            </p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold md:flex-nowrap md:gap-3 md:pr-10">
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
        <div className="flex flex-col gap-2 text-sm font-semibold text-navy/70 md:ml-auto md:items-end md:pr-2 md:self-center">
          <div className="flex items-center gap-3 md:gap-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
