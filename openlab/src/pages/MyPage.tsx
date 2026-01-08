import { useState } from "react";
import { Briefcase, FileText, GraduationCap, Plus, Save, Sparkles } from "lucide-react";

const initialSkills = ["Python", "Pandas", "Data Preprocessing", "SQL"];

export default function MyPage() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed || skills.includes(trimmed)) {
      setNewSkill("");
      return;
    }
    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");
  };

  const removeSkill = (value: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== value));
  };

  return (
    <section className="bg-slate py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
            My Page
          </p>
          <h1 className="text-3xl font-semibold text-navy">마이페이지</h1>
          <p className="text-base text-navy/70">
            이력서, 학력/경력, 보유 기술 스택을 관리해 공고 매칭 정확도를 높이세요.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <FileText className="h-4 w-4 text-accent" />
                  이력서 관리
                </div>
                <button className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy/70 transition hover:border-navy/40">
                  템플릿 불러오기
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-navy">
                  한 줄 소개
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="연구실 데이터 태스크 경험을 가진 분석가"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy">
                  지원 포지션
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="Data Preprocessing Intern"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy sm:col-span-2">
                  요약
                  <textarea
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="연구 프로젝트 3건 참여, 데이터 정제/피처 엔지니어링 경험 보유"
                    rows={4}
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <GraduationCap className="h-4 w-4 text-accent" />
                학력
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-navy">
                  학교명
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="Open University"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy">
                  전공
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="Data Science"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy">
                  재학 기간
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="2022.03 - 2026.02"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy">
                  GPA
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="4.0 / 4.5"
                    type="text"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Briefcase className="h-4 w-4 text-accent" />
                경력
              </div>
              <div className="mt-4 grid gap-4">
                <label className="text-sm font-semibold text-navy">
                  참여 프로젝트
                  <input
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="AI 기반 주가 예측 데이터 전처리"
                    type="text"
                  />
                </label>
                <label className="text-sm font-semibold text-navy">
                  역할/성과
                  <textarea
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                    placeholder="결측치 처리 파이프라인 구축, 데이터 품질 12% 개선"
                    rows={3}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                  <Sparkles className="h-4 w-4 text-accent" />
                  보유 기술 스택
                </div>
                <button className="rounded-full border border-navy/20 px-4 py-2 text-xs font-semibold text-navy/70 transition hover:border-navy/40">
                  추천 스택 보기
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent transition hover:bg-accent/20"
                    type="button"
                    onClick={() => removeSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <input
                  className="w-full flex-1 rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                  placeholder="새 기술 입력"
                  value={newSkill}
                  onChange={(event) => setNewSkill(event.target.value)}
                />
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy/90"
                  type="button"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4" />
                  추가
                </button>
              </div>
              <p className="mt-3 text-xs text-navy/50">
                스킬 태그를 클릭하면 삭제됩니다.
              </p>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-navy">매칭을 위한 공개 설정</p>
              <div className="mt-4 grid gap-4 text-sm text-navy/70">
                <label className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3">
                  연구실에게 이력서 공개
                  <input className="h-4 w-4 accent-[#1C6BFF]" type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3">
                  매칭 알림 받기
                  <input className="h-4 w-4 accent-[#1C6BFF]" type="checkbox" defaultChecked />
                </label>
                <label className="flex items-center justify-between rounded-2xl border border-navy/10 px-4 py-3">
                  포트폴리오 링크 공개
                  <input className="h-4 w-4 accent-[#1C6BFF]" type="checkbox" />
                </label>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]">
              <Save className="h-4 w-4" />
              마이페이지 저장
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
