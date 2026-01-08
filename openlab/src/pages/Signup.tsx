import { useState } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Lock, Mail, User } from "lucide-react";

type Role = "user" | "lab";

export default function Signup() {
  const [role, setRole] = useState<Role>("user");

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
                  role === "user"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-navy/10 text-navy/70 hover:border-navy/30"
                }`}
                onClick={() => setRole("user")}
                type="button"
              >
                <User className="h-4 w-4" />
                일반 사용자
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
              {role === "user"
                ? "학생/일반 사용자는 프로젝트 참여 이력과 인증서를 관리합니다."
                : "Lab 사용자는 공고 등록, 지원자 평가, 프로젝트 관리를 진행합니다."}
            </div>
          </div>

          <form
            className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm"
            onSubmit={(event) => event.preventDefault()}
          >
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-navy">
                이름
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <User className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="실명 입력"
                    type="text"
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-navy">
                이메일
                <div className="mt-2 flex items-center gap-2 rounded-2xl border border-navy/10 px-4 py-3">
                  <Mail className="h-4 w-4 text-accent" />
                  <input
                    className="w-full text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="name@openlab.io"
                    type="email"
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
                  />
                </div>
              </label>
              <label className="block text-sm font-semibold text-navy">
                비밀번호 확인
                <input
                  className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                  placeholder="비밀번호 재입력"
                  type="password"
                />
              </label>
              {role === "lab" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-navy">
                    연구실명
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="연구실 이름"
                      type="text"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy">
                    담당자명
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="교수/매니저 이름"
                      type="text"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy sm:col-span-2">
                    연구실 공식 이메일
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="lab@university.ac.kr"
                      type="email"
                    />
                  </label>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-navy">
                    학교
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Open University"
                      type="text"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-navy">
                    전공
                    <input
                      className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                      placeholder="Data Science"
                      type="text"
                    />
                  </label>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]" type="submit">
                {role === "lab" ? "Lab 회원가입" : "일반 회원가입"}
              </button>
              <Link className="text-sm font-semibold text-accent" to="/login">
                로그인으로 이동
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
