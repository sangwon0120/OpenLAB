import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlaskConical, Lock, Mail, User } from "lucide-react";

type Role = "student" | "lab";

export default function Signup() {
  const [role, setRole] = useState<Role>("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [labName, setLabName] = useState("");
  const [labManager, setLabManager] = useState("");
  const [labEmail, setLabEmail] = useState("");
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    if (!em || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }
    if (role === "lab" && !labName.trim()) {
      setError("Lab name is required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: em,
          password,
          name: name.trim() || undefined,
          role,
          labName: role === "lab" ? labName.trim() : undefined,
        }),
      });
      const j = await res.json();
      if (!res.ok || !j?.success) {
        throw new Error(j?.error || "Sign up failed.");
      }

      navigate("/login");
    } catch (err: any) {
      setError(err?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-slate py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            Sign Up
          </p>
          <h1 className="text-3xl font-semibold text-navy">회원가입</h1>
          <p className="text-base text-navy/70">
            역할에 맞는 가입 정보를 입력하면 권한별 화면을 제공받게 됩니다.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-navy">가입 유형 선택</p>
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
                ? "학생/일반 사용자는 프로젝트 참여 이력과 인증서를 관리합니다."
                : "Lab 사용자는 공고 등록, 지원자 평가, 프로젝트 관리를 진행합니다."}
            </div>
          </div>

          <form
            className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm"
            onSubmit={onSubmit}
          >
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-navy">
                Name
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <User className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="Full name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-navy">
                Email
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
                Password
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <Lock className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="Enter password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-navy">
                Confirm Password
                <input
                  className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                  placeholder="Re-enter password"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                />
              </label>
              {role === "lab" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-navy">
                    Lab name
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Lab name"
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy">
                    Manager name
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Professor or manager"
                      type="text"
                      value={labManager}
                      onChange={(e) => setLabManager(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy sm:col-span-2">
                    Lab email
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="lab@university.ac.kr"
                      type="email"
                      value={labEmail}
                      onChange={(e) => setLabEmail(e.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-navy">
                    School
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Open University"
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy">
                    Major
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Data Science"
                      type="text"
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </div>

            {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]"
                type="submit"
                disabled={loading}
              >
                {loading ? "Processing..." : role === "lab" ? "Lab sign up" : "Student sign up"}
              </button>
              <Link className="text-sm font-semibold text-accent" to="/login">
                Go to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
