import { useMemo } from "react";
import {
  BadgeCheck,
  BrainCircuit,
  ClipboardList,
  GraduationCap,
  LineChart,
  MessageCircle,
  Sparkles,
  UserSquare2,
} from "lucide-react";

const steps = [
  {
    title: "OpenLAB Posting",
    description:
      "연구실이 실제 연구 프로젝트를 작은 단위로 쪼개 Unbundled Micro Task를 게시합니다.",
    icon: ClipboardList,
  },
  {
    title: "AI Screening",
    description:
      "LLM 기반 에이전트가 이력과 스킬을 분석해 빠르게 매칭합니다.",
    icon: BrainCircuit,
  },
  {
    title: "Interview",
    description: "프로젝트 매니저와 짧고 명확한 인터뷰로 목표를 맞춥니다.",
    icon: MessageCircle,
  },
  {
    title: "Participation",
    description: "프로젝트에 참여하고 스킬 기반 인증서를 받습니다.",
    icon: BadgeCheck,
  },
];

const projects = [
  {
    title: "Stock Prediction Transformer Model - Data Preprocessing",
    lab: "B 교수 산업공학 연구실",
    duration: "1개월",
    skill: "Pandas, Python",
    tag: "언번들드 태스크",
  },
  {
    title: "Bio-Signal Classification - Feature Extraction",
    lab: "NeuroTech 연구그룹",
    duration: "3주",
    skill: "NumPy, Signal Processing",
    tag: "마이크로 프로젝트",
  },
  {
    title: "Smart Campus Energy Forecasting - Data Labeling",
    lab: "스마트 시스템 연구실",
    duration: "2주",
    skill: "Labeling, Excel",
    tag: "빠른 참여",
  },
];

export default function App() {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="bg-white text-navy">
      <section id="home" className="relative overflow-hidden bg-white">
        <div className="absolute -top-40 right-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-10 left-0 h-56 w-56 rounded-full bg-navy/10 blur-3xl" />
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-16 pt-10 md:pt-16">
          <header className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white shadow-glow">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
                  OpenLAB
                </p>
                <p className="text-xs text-navy/60">Light Commitment, Heavy Impact</p>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-navy/70 md:gap-4">
              <a
                className="rounded-full px-4 py-2 transition hover:bg-slate hover:text-navy"
                href="#projects"
              >
                공고
              </a>
              <a
                className="rounded-full px-4 py-2 transition hover:bg-slate hover:text-navy"
                href="#home"
              >
                공고 등록
              </a>
              <a
                className="rounded-full px-4 py-2 transition hover:bg-slate hover:text-navy"
                href="#how"
              >
                참여 가이드
              </a>
              <a
                className="rounded-full px-4 py-2 transition hover:bg-slate hover:text-navy"
                href="#trust"
              >
                커뮤니티
              </a>
              <a
                className="rounded-full px-4 py-2 transition hover:bg-slate hover:text-navy"
                href="#why"
              >
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-3 text-sm text-navy/70">
              <Sparkles className="h-4 w-4" />
              Unbundling of Research
            </div>
          </header>

          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-slate px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-navy/70">
                <LineChart className="h-4 w-4 text-accent" />
                스킬 중심 연구 경험
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                OpenLAB: Unbundling of Research
              </h1>
              <p className="text-lg text-navy/70">
                가벼운 참여로도 학부 연구를 경험하세요. 전공 중심에서 스킬 중심으로
                전환합니다.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]">
                  프로젝트 찾기
                </button>
                <button className="rounded-full border border-navy/20 px-6 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:border-navy/40">
                  랩 공고 등록
                </button>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-navy/60">
                <div className="flex items-center gap-2">
                  <UserSquare2 className="h-4 w-4 text-accent" />
                  학생은 바로 참여 가능한 마이크로 태스크
                </div>
                <div className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-accent" />
                  스킬 기반 인증서
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-navy/10 bg-slate p-8 shadow-xl">
              <div className="space-y-6">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    진행 중 프로젝트
                  </p>
                  <h3 className="mt-2 text-lg font-semibold">
                    Stock Prediction Transformer Model
                  </h3>
                  <p className="mt-2 text-sm text-navy/60">
                    B 교수 연구실과 함께하는 1개월 데이터 전처리 스프린트입니다.
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-navy/60">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-accent">
                      언번들드 태스크
                    </span>
                    <span>Python · Pandas</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-5 text-sm text-navy/70 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      For Students
                    </p>
                    <p className="mt-2">
                      1개월도 안 되는 기간으로 연구를 경험할 수 있습니다.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white p-5 text-sm text-navy/70 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      For Labs
                    </p>
                    <p className="mt-2">
                      검증된 인력을 빠르게 연구에 연결합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="why" className="bg-slate py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Why OpenLAB?
            </p>
            <h2 className="text-3xl font-semibold">Solve the Dilemma of Choice</h2>
            <p className="text-base text-navy/70">
              학생은 전공 선택의 불확실성과 연구실은 반복 업무 인력 부족을
              동시에 겪고 있습니다.
            </p>
            <div className="rounded-2xl border border-navy/10 bg-white p-5 text-sm text-navy/70 shadow-sm">
              <p className="font-semibold text-navy">The Problem</p>
              <p className="mt-2">
                잘못된 전공 선택의 두려움 + 연구 보조 인력 부족
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                The Solution
              </p>
              <h3 className="mt-2 text-2xl font-semibold">Micro-projects</h3>
              <p className="mt-2 text-sm text-navy/70">
                1년 대신 1개월 단위의 데이터 전처리 태스크에 참여해 실제 연구
                스킬을 빠르게 습득합니다.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 text-sm text-navy/70 shadow-sm">
                <p className="font-semibold text-navy">Students</p>
                <p className="mt-2">
                  전공이 아닌 스킬 기준으로 연구를 탐색합니다.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-5 text-sm text-navy/70 shadow-sm">
                <p className="font-semibold text-navy">Professors</p>
                <p className="mt-2">
                  검증된 인력을 필요한 태스크에 빠르게 투입합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                How It Works
              </p>
              <h2 className="text-3xl font-semibold">Four steps to impact</h2>
              <p className="text-base text-navy/70">
                연구의 진행 속도와 학생의 학습 기회를 동시에 끌어올립니다.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-navy/60">
              <Sparkles className="h-4 w-4 text-accent" />
              LLM 스크리닝 + 빠른 인터뷰
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group rounded-2xl border border-navy/10 bg-slate p-6 shadow-sm transition hover:-translate-y-1 hover:bg-white"
                >
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-accent" />
                    <span className="text-xs font-semibold text-navy/40">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-navy/70">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="projects" className="bg-slate py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
                Featured Projects
              </p>
              <h2 className="text-3xl font-semibold">
                집중형 마이크로 태스크로 시작하세요
              </h2>
            </div>
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
              더 많은 프로젝트 보기
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex h-full flex-col justify-between rounded-3xl border border-navy/10 bg-white p-6 shadow-sm"
              >
                <div className="space-y-4">
                  <span className="inline-flex w-fit items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    {project.tag}
                  </span>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-navy/70">{project.lab}</p>
                </div>
                <div className="mt-6 space-y-2 text-sm text-navy/60">
                  <div className="flex items-center justify-between">
                    <span>기간</span>
                    <span className="font-semibold text-navy">
                      {project.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>기술</span>
                    <span className="font-semibold text-navy">{project.skill}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer id="trust" className="bg-navy py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em]">
                  OpenLAB
                </p>
                <p className="text-xs text-white/60">Unbundling of Research</p>
              </div>
            </div>
            <p className="text-sm text-white/70">
              검증된 인증서와 SaaS 기반 스크리닝으로 연구실과 학생을 연결합니다.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 h-4 w-4 text-accent" />
              <div>
                <p className="font-semibold text-white">Credentialing</p>
                <p className="text-white/60">
                  실제 연구 성과를 증명하는 인증서를 제공합니다.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <LineChart className="mt-1 h-4 w-4 text-accent" />
              <div>
                <p className="font-semibold text-white">SaaS Screening</p>
                <p className="text-white/60">
                  AI 기반 스킬 매칭으로 빠른 채용을 지원합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 px-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© {year} OpenLAB. 모든 권리 보유.</p>
          <p>Light Commitment, Heavy Impact.</p>
        </div>
      </footer>
    </div>
  );
}
