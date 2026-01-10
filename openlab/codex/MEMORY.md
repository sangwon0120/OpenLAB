# 2026-01-06
User: # AGENTS.md instructions for C:\Users\변상원\openLab
User: <INSTRUCTIONS>
User: You are an expert Frontend Developer specializing in React and Tailwind CSS.
User: Please build a modern, responsive, and clean landing page for a startup called "OpenLAB".
User: 
User: ## 1. Project Context & Branding
User: - **Name:** OpenLAB
User: - **Slogan:** Unbundling of Research 
User: - **Core Value:** "Light Commitment, Heavy Impact" 
User: - **Concept:** A platform that connects undergraduate students with university research labs by breaking down large research projects into small, skill-based micro-tasks (unbundled tasks). 
User: - **Target Audience:**
User:     1. Students: Want to experience research without heavy commitment (e.g., Degree-based -> Skill-based). 
User:     2. Professors: Need help with simple tasks (e.g., Data Preprocessing). 
User: 
User: ## 2. Design Guidelines (Clean & Tech Startup Vibe)
User: - **Color Palette:**
User:     - Primary: Deep Navy Blue (Trust, Academic).
User:     - Accent: Bright Blue (Tech, Innovation).
User:     - Background: Clean White / Light Gray.
User: - **Typography:** Sans-serif (Inter or Roboto), clean and readable.
User: - **Layout:** Use a grid system, plenty of whitespace, and card-based UI for project listings.
User: - **Icons:** Use 'Lucide-React' for icons.
User: 
User: ## 3. Page Structure & Content Requirements
User: Please implement the following sections in a single-page scrolling layout:
User: 
User: ### A. Hero Section
User: - **Headline:** "OpenLAB: Unbundling of Research"
User: - **Sub-headline:** "Experience graduate-level research with light commitment. Switch from Degree-based to Skill-based specs." 
User: - **CTA Buttons:** "Find a Project" (Primary), "Post a Lab Opening" (Secondary).
User: 
User: ### B. Problem & Solution (Why OpenLAB?)
User: - **Problem:** The "Dilemma of Choice" for students (fear of wrong major choice) and "Labor Shortage" for labs. 
User: - **Solution:** "Micro-projects". Example: Instead of a 1-year commitment, join a 1-month "Data Preprocessing" task. 
User: 
User: ### C. How It Works (4 Steps) 
User: Use a step-by-step visual flow:
User: 1. **OpenLAB Posting:** Labs post unbundled tasks.
User: 2. **AI Screening:** LLM-based Agent analyzes resumes and skills. 
User: 3. **Interview:** Quick interview with the project manager.
User: 4. **Participation:** Join the project and earn a skill-based certificate.
User: 
User: ### D. Featured Projects (Mockup Data)
User: - Display 3 cards as examples.
User: - **Card 1 Example:**
User:     - Title: "Stock Prediction Transformer Model - Data Preprocessing" 
User:     - Lab: Prof. B's Industrial Engineering Lab
User:     - Duration: 1 Month
User:     - Skill: Pandas, Python 
User:     - Tag: "Unbundled Task"
User: 
User: ### E. Business & Trust (Footer area)
User: - Mention "Credentialing" (Certificates) and "SaaS-based Screening". 
User: - Simple footer with copyright.
User: 
User: ## 4. Technical Constraints
User: - Use functional components with React hooks.
User: - Use Tailwind CSS for all styling (no external CSS files).
User: - Make it fully responsive (mobile-friendly).
User: - Use distinct sections with alternating background colors (White / Light Gray).
User: </INSTRUCTIONS>
User: <environment_context>
User:   <cwd>C:\Users\변상원\openLab</cwd>
User:   <approval_policy>on-request</approval_policy>
User:   <sandbox_mode>read-only</sandbox_mode>
User:   <network_access>restricted</network_access>
User:   <shell>powershell</shell>
User: </environment_context>
User: 웹사이트 개발할건데 AGENTS.md 참고해서 프론트만 일단 만들어줘.
Assistant: 지금 `C:\Users\변상원\openLab`에는 `AGENTS.md`/`MEMORY.md`만 있고 React/Tailwind 프로젝트가 없어서 어디에 컴포넌트를 만들어야 할지 판단이 안 돼요. 원하시는 방식 알려주세요. 1) 기존 React+Tailwind 프로젝트 경로를 알려주기 2) 이 폴더에 새 React+Tailwind 프로젝트를 초기화해도 되면 승인 요청할게요 원하시는 번호만 알려주세요.
User: 2번으로 해줘. 새로 처음부터 만들거야. 일단 간단한 페이지만 제작해줘. 세부 UI/UX들은 보면서 순차적으로 추가해나가자. 그리고 우리가 하는 대화를 하나도 빠짐없이 날짜별로 MEMORY.md 에 저장해줘
Assistant: 새 Vite React + Tailwind 프로젝트를 `openlab/`에 만들고, 요청한 섹션으로 단일 랜딩 페이지를 구성했어. Hero/Problem & Solution/How It Works/Featured Projects/Footer를 카드 기반 레이아웃과 alternating 배경으로 넣었고, Lucide 아이콘을 사용했어. `openLab/MEMORY.md`에 오늘 대화 전체를 기록해두었어.
Assistant: 
Assistant: 변경 위치
Assistant: - `openlab/src/App.tsx`: 섹션 구성 및 콘텐츠, Lucide 아이콘, CTA
Assistant: - `openlab/src/main.tsx`: React 엔트리
Assistant: - `openlab/src/style.css`: Tailwind 베이스 및 기본 타이포 설정
Assistant: - `openlab/tailwind.config.js`: 컬러 팔레트/쉐도 확장
Assistant: - `openlab/index.html`: Manrope 폰트 로드, 타이틀, 엔트리 변경
Assistant: - `openlab/vite.config.ts`: React 플러그인
Assistant: 
Assistant: 참고: 폰트는 Manrope로 지정했는데 Inter/Roboto로 바꾸길 원하면 말해줘.
Assistant: 
Assistant: 다음 단계 제안
Assistant: 1) `cd openlab` 후 `npm run dev`로 확인
Assistant: 2) 원하는 섹션/UX 디테일을 알려주면 순차적으로 추가

# 2026-01-08
- OpenLAB landing page sections built (Hero / Problem-Solution / How It Works / Featured Projects / Trust Footer).
- Card-based UI, CTA buttons, icons.
- Local preview: run `npm install` then `vite`.

# 2026-01-11
- Base setup includes Vite + React + TS + Tailwind, Manrope font, Navy/Accent/Slate theme (`openlab/index.html`, `openlab/tailwind.config.js`, `openlab/src/style.css`).
- Routing/layout: TopNav + ProtectedRoute, ComingSoon sections, AuthContext with localStorage login and mode switching (`openlab/src/App.tsx`, `openlab/src/components/TopNav.tsx`, `openlab/src/components/ProtectedRoute.tsx`, `openlab/src/context/AuthContext.tsx`).
- Core screens: Home, Notices list/status management, NoticeDetail apply/applicant view, Login/Signup, MyPage profile/resume/skills, PostNotice, ResumeScreener (`openlab/src/pages/*`).
- Data/storage: static notice seed, localStorage notices/applications with dedupe, applicant profile storage (`openlab/src/data/notices.ts`, `openlab/src/lib/openlabStore.ts`).
- Serverless APIs: notice post/list, application upload + PDF parsing + evaluation, resume-screen Python integration with fallback, OpenAI eval fallback (`openlab/api/*.ts`, `openlab/api/_lib/*.ts`).
- Build/deploy: Vite build, Vercel rewrite, API proxy config (`openlab/vite.config.ts`, `openlab/vercel.json`, `openlab/tsconfig.json`, `openlab/postcss.config.js`, `openlab/package.json`).
- Note: some files show mojibake/encoding damage and may need cleanup (NoticeDetail/PostNotice/ResumeScreener, notices data, API files).
