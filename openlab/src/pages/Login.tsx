import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, Lock, Mail, User } from "lucide-react";

type Role = "student" | "lab";

import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [labName, setLabName] = useState("");
  const [school, setSchool] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Master credentials (operator use only)
  const MASTER_EMAIL = "openlab@naver.com";
  const MASTER_PASSWORD = "1234";

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();

    // Master credentials
    if (em === MASTER_EMAIL && password === MASTER_PASSWORD) {
      login("master", { email: em, name: "Master", labName: "OpenLab (master)", isMaster: true });
      navigate("/mypage");
      return;
    }

    if (!em || !password) {
      setError("Email and password are required.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: em, password }),
      });
      const j = await res.json();
      if (!res.ok || !j?.success) {
        throw new Error(j?.error || "Login failed.");
      }

      const nextRole = (j.user?.role || role) as Role;
      login(nextRole, {
        email: j.user?.email || em,
        name: j.user?.name || undefined,
        labName: j.user?.labName || undefined,
      });

      if (nextRole === "lab") navigate("/post");
      else navigate("/");
    } catch (err: any) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg-slate py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Login
          </p>
          <h1 className="text-3xl font-semibold text-navy">로그인</h1>
          <p className="text-base text-navy/70">
            일반 사용자와 Lab 사용자 로그인을 분리해 권한에 맞는 화면을 제공합니다.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-navy">로그인 유형 선택</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  role === "student"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-navy/10 text-navy/70 hover:border-navy/30"
                }`}
                onClick={() => setRole("student")}
                type="button"
              >
                <User className="h-4 w-4" />
                학생/일반 사용자
              </button>
              <button
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  role === "lab"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-navy/10 text-navy/70 hover:border-navy/30"
                }`}
                onClick={() => setRole("lab")}
                type="button"
              >
                <FlaskConical className="h-4 w-4" />
                Lab 사용자
              </button>
            </div>
            <div className="mt-6 rounded-2xl bg-slate px-4 py-4 text-sm text-navy/70">
              {role === "student"
                ? "학생/일반 사용자는 공고 탐색과 프로젝트 참여 화면을 이용합니다."
                : "Lab 사용자는 공고 등록과 지원자 관리 화면을 이용합니다."}
            </div>
          </div>

          <form
            className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm"
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-navy">
                이메일
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="name@openlab.io"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-navy">
                비밀번호
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <Lock className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="비밀번호 입력"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </label>
              {role === "lab" ? (
                <label className="block text-sm font-semibold text-navy">
                  연구실명
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="예: OpenLAB Systems"
                    type="text"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                  />
                </label>
              ) : (
                <label className="block text-sm font-semibold text-navy">
                  학교/전공
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="예: Open University · Data Science"
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                  />
                </label>
              )}
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]" type="submit">
                {role === "lab" ? "Lab 로그인" : "학생/일반 로그인"}
              </button>
              <Link className="text-sm font-semibold text-accent" to="/signup">
                회원가입으로 이동
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
