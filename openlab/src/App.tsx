import { Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Notices from "./pages/Notices";
import NoticeDetail from "./pages/NoticeDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MyPage from "./pages/MyPage";
import TopNav from "./components/TopNav";
import ProtectedRoute from "./components/ProtectedRoute";
import PostNotice from "./pages/PostNotice";
import ResumeScreener from "./pages/ResumeScreener";

function Layout() {
  return (
    <div className="min-h-screen bg-white text-navy">
      <TopNav />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto flex max-w-4xl flex-col gap-4 px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
          Coming Soon
        </p>
        <h1 className="text-3xl font-semibold text-navy">{title}</h1>
        <p className="text-base text-navy/70">{description}</p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="notices" element={<Notices />} />
        <Route path="notices/:id" element={<NoticeDetail />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="post"
          element={
            <ProtectedRoute role="lab">
              <PostNotice />
            </ProtectedRoute>
          }
        />
        <Route
          path="guide"
          element={
            <ComingSoon
              title="참여 가이드"
              description="학생 참여 절차와 체크리스트를 곧 안내드립니다."
            />
          }
        />
        <Route path="resume-screener" element={<ResumeScreener />} />
        <Route
          path="community"
          element={
            <ComingSoon
              title="커뮤니티"
              description="학생과 연구실이 연결되는 커뮤니티를 준비 중입니다."
            />
          }
        />
        <Route
          path="faq"
          element={
            <ComingSoon
              title="FAQ"
              description="자주 묻는 질문을 빠르게 확인할 수 있게 준비 중입니다."
            />
          }
        />
      </Route>
    </Routes>
  );
}
