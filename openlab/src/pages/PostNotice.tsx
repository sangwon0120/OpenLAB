import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { savePostedNotice } from "../lib/openlabStore";

export default function PostNotice() {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [deadline, setDeadline] = useState("");
  const [roles, setRoles] = useState("");
  const [criteria, setCriteria] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { auth } = useAuth();

  const validate = () => {
    if (!title.trim()) return "프로젝트명을 입력하세요.";
    if (!description.trim()) return "직무 설명을 입력하세요.";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    const ownerEmail = auth.user?.email || "";
    const lab = auth.user?.labName || "";
    if (!ownerEmail || !lab) {
      setError("연구실 계정 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const payload = {
      id: `NL-${Date.now().toString().slice(-6)}`,
      title,
      duration,
      roles: roles.split(",").map((r) => r.trim()).filter(Boolean),
      criteria,
      description,
      status: "모집중",
      deadline,
    };

    // Vite(5173) 단독 실행에서도 동작하도록 localStorage에 저장
    savePostedNotice({
      id: payload.id,
      title: payload.title,
      description: payload.description,
      duration: payload.duration,
      deadline: payload.deadline,
      status: payload.status,
      criteria: payload.criteria,
      lab,
      ownerEmail,
      createdAt: new Date().toISOString(),
    });

    try {
      const res = await fetch("/api/post-notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      // /api가 없는 Vite 단독 환경에서는 실패할 수 있으니 무시
      if (!res.ok) {
        // ignore
      }
      setSuccess("공고가 등록되었습니다.");
      setTimeout(() => navigate(`/notices/${payload.id}`), 800);
    } catch (err: any) {
      // ignore: localStorage 저장은 이미 완료
      setSuccess("공고가 등록되었습니다.");
      setTimeout(() => navigate(`/notices/${payload.id}`), 800);
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-2xl font-semibold text-navy">공고 등록</h1>
        <p className="mt-2 text-sm text-navy/70">연구실 전용 공고 등록 폼입니다. 필요한 항목을 입력 후 등록하세요.</p>

        <form onSubmit={submit} className="mt-6 grid gap-4">
          <label className="text-sm font-semibold text-navy">
            공고 프로젝트명
            <input className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>

          <label className="text-sm font-semibold text-navy">
            기간
            <input className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="예: 2주, 1개월" />
          </label>

          <label className="text-sm font-semibold text-navy">
            마감일
            <input
              type="date"
              className={`mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none ${
                deadline ? "text-navy" : "text-navy/50"
              }`}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>

          <label className="text-sm font-semibold text-navy">
            직무
            <input className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" value={roles} onChange={(e) => setRoles(e.target.value)} placeholder="예: 데이터 전처리, 모델 평가" />
          </label>

          <label className="text-sm font-semibold text-navy">
            평가 기준
            <textarea className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" rows={3} value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="예: 데이터 정제 능력, 코드 문서화" />
          </label>

          <label className="text-sm font-semibold text-navy">
            직무 설명
            <textarea className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="프로젝트의 세부 설명과 기대 역할을 적어주세요." />
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-[#1557D6]">등록</button>
            <button type="button" onClick={() => { setTitle(""); setDuration(""); setDeadline(""); setRoles(""); setCriteria(""); setDescription(""); }} className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-4 py-2 text-sm font-semibold text-navy/70">초기화</button>
          </div>
        </form>
      </div>
    </section>
  );
}
