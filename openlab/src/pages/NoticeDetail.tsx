import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, ClipboardList } from "lucide-react";
import { notices } from "../data/notices";
import { useAuth } from "../context/AuthContext";
import type { ScreeningResult } from "../lib/openlabStore";
import {
  fileToDataUrl,
  getApplicationsByNoticeId,
  loadPostedNotices,
  loadApplicantProfile,
  saveApplication,
  saveApplicantProfile,
  screenResumeWithPython,
} from "../lib/openlabStore";

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const [remoteNotices, setRemoteNotices] = useState<any[] | null>(null);
  const { auth } = useAuth();

  useEffect(() => {
    let mounted = true;
    fetch('/api/posted-notices').then(r => r.json()).then(j => { if (!mounted) return; if (j?.success && Array.isArray(j.notices)) setRemoteNotices(j.notices); else setRemoteNotices([]); }).catch(() => setRemoteNotices([]));
    return () => { mounted = false; };
  }, []);

  const localPosted = loadPostedNotices();
  const allNotices = remoteNotices !== null ? [...(remoteNotices || []), ...localPosted, ...notices] : [...localPosted, ...notices];
  const notice = allNotices.find((n) => n.id === id);

  const effectiveMode: "student" | "lab" =
    auth.role === "master"
      ? auth.currentMode
      : auth.role === "lab"
        ? "lab"
        : "student";

  const isOwnerLab =
    effectiveMode === "lab" &&
    auth.isLoggedIn &&
    (notice as any)?.ownerEmail &&
    (notice as any).ownerEmail === (auth.user?.email || "");

  const [applying, setApplying] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [screening, setScreening] = useState<ScreeningResult | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const myEmail = (auth.user?.email || "").trim().toLowerCase();
  const normalizedName = name.trim().toLowerCase();
  const alreadyApplied =
    auth.isLoggedIn &&
    effectiveMode === "student" &&
    !!myEmail &&
    !!normalizedName &&
    getApplicationsByNoticeId(String(notice.id)).some(
      (a) =>
        (a.email || "").toLowerCase() === myEmail &&
        (a.name || "").trim().toLowerCase() === normalizedName
    );

  useEffect(() => {
    if (!auth.isLoggedIn) return;
    if (effectiveMode !== "student") return;
    if (!email && auth.user?.email) setEmail(auth.user.email);
    if (!name && auth.user?.email) {
      const prof = loadApplicantProfile(auth.user.email);
      if (prof?.name) setName(prof.name);
      else if (auth.user?.name) setName(auth.user.name);
    }
  }, [auth.isLoggedIn, auth.user?.email, auth.user?.name, effectiveMode, email, name]);

  if (!notice) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-sm text-red-500">공고를 찾을 수 없습니다.</p>
        <Link to="/notices" className="text-accent underline">
          공고 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && !f.type.startsWith("application/pdf")) {
      alert("PDF 파일만 업로드 가능합니다.");
      return;
    }
    setResumeFile(f);
  };

  const submitApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notice) return;
    if (!auth.isLoggedIn) {
      alert("로그인 후 지원할 수 있습니다.");
      return;
    }
    if (effectiveMode !== "student") {
      alert("학생 모드에서만 지원할 수 있습니다.");
      return;
    }
    if (alreadyApplied) {
      alert("이미 지원 완료한 공고입니다.");
      return;
    }
    if (!auth.user?.email) {
      alert("계정 이메일 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }
    if (!resumeFile) {
      alert("이력서(PDF)를 첨부해주세요.");
      return;
    }
    setApplying(true);
    setSuccess(null);
    setScreening(null);

    try {
      const resumeDataUrl = await fileToDataUrl(resumeFile);
      const criteriaText = String((notice as any)?.criteria || "").trim();
      const criteria = criteriaText || "경험\n기술\n프로젝트\n커뮤니케이션";
      const jobDescription = String((notice as any)?.description || "").trim();

      const screeningResult = await screenResumeWithPython({
        resumeFile,
        jobDescription,
        criteria,
      });

      const applicantEmail = String(auth.user.email).trim();
      const applicantName = (name || auth.user.name || "").trim();

      // Persist the last applicant name for stable duplicate checking on refresh
      saveApplicantProfile(applicantEmail, { name: applicantName });

      const app = {
        id: `app-${Date.now().toString().slice(-6)}`,
        noticeId: notice.id,
        name: applicantName || applicantEmail,
        email: applicantEmail,
        message: message || "",
        resumeFilename: resumeFile.name,
        resumeDataUrl,
        screening: screeningResult,
        createdAt: new Date().toISOString(),
      };

      saveApplication(app);

      setSuccess("지원이 정상적으로 접수되었습니다.");
      setScreening(screeningResult);
      setApplying(false);
      setMessage("");
      setResumeFile(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setApplying(false);
      alert(err.message || "지원 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <Link to="/notices" className="text-accent underline text-sm">
            ← 공고 목록으로 돌아가기
          </Link>
        </div>

        <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-accent" />
            <div className="text-xs font-semibold text-navy/70">{notice.id}</div>
          </div>

          <h1 className="mt-4 text-2xl font-semibold text-navy">{notice.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-navy/70">
            <div>{notice.lab}</div>
            <div>{notice.duration}</div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" />
              {notice.deadline}
            </div>
          </div>

          <p className="mt-6 whitespace-pre-line text-sm text-navy/80">{notice.description}</p>

          <div className="mt-8">
            {success && <p className="text-sm text-green-600">{success}</p>}
            {alreadyApplied && !success && (
              <p className="text-sm text-green-700 font-semibold">지원완료</p>
            )}
            {isOwnerLab && (
              <div className="mt-6 rounded-2xl border border-navy/10 bg-slate/30 p-5">
                <p className="text-sm font-semibold text-navy">지원자 목록</p>
                <div className="mt-3 grid gap-3">
                  {getApplicationsByNoticeId(notice.id).length === 0 ? (
                    <p className="text-sm text-navy/70">아직 지원자가 없습니다.</p>
                  ) : (
                    getApplicationsByNoticeId(notice.id).map((a) => (
                      <div key={a.id} className="rounded-2xl bg-white p-4 border border-navy/10">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="text-sm font-semibold text-navy">
                            {a.name} <span className="text-navy/60">({a.email})</span>
                          </div>
                          <a
                            className="text-sm font-semibold text-accent underline"
                            href={a.resumeDataUrl}
                            download={a.resumeFilename}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            이력서 확인
                          </a>
                        </div>
                        {a.message && (
                          <p className="mt-2 text-sm text-navy/70 whitespace-pre-line">{a.message}</p>
                        )}
                        <div className="mt-3 rounded-xl bg-slate/40 p-3">
                          <p className="text-sm font-semibold text-navy">1차 screening 결과</p>
                          {a.screening?.success ? (
                            <>
                              <p className="mt-1 text-sm text-navy/80">
                                판정: <span className="font-semibold">{a.screening.overall_decision ? "통과" : "보류/탈락"}</span>
                              </p>
                              {a.screening.overall_reasoning && (
                                <p className="mt-1 text-sm text-navy/70">{a.screening.overall_reasoning}</p>
                              )}
                            </>
                          ) : (
                            <p className="mt-1 text-sm text-red-600">{a.screening?.error || "결과 없음"}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {effectiveMode === "student" && !applying ? (
              <div className="flex items-center gap-3">
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white hover:bg-[#1557D6]"
                  onClick={() => setApplying(true)}
                  disabled={alreadyApplied}
                >
                  지원하기
                </button>
                <span className="text-sm text-navy/70">지원 전 공고 내용을 꼭 확인하세요.</span>
              </div>
            ) : effectiveMode === "student" ? (
              <form onSubmit={submitApply} className="mt-4 grid gap-3">
                <input
                  className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none"
                  placeholder="이름"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none"
                  placeholder="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={!!auth.user?.email}
                  required
                />
                <textarea
                  className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none"
                  placeholder="간단한 자기소개 / 지원 동기 (선택)"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex items-center gap-3">
                  <input id="apply-resume" type="file" accept="application/pdf" className="hidden" onChange={handleResumeChange} />
                  <label htmlFor="apply-resume" className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-3 py-1 text-xs font-semibold text-navy cursor-pointer hover:border-navy/40">
                    이력서 첨부 (PDF)
                  </label>
                  {resumeFile && <span className="text-sm text-navy/70">{resumeFile.name}</span>}
                </div>

                <div className="flex items-center gap-3">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-semibold text-white hover:bg-navy/90">
                    제출
                  </button>
                  <button type="button" onClick={() => setApplying(false)} className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-4 py-2 text-sm font-semibold text-navy/70">
                    취소
                  </button>
                </div>

                {screening && (
                  <div className="mt-4 rounded-lg bg-slate/30 p-4">
                    <p className="text-sm font-semibold">
                      1차 screening 판정: <span className="text-accent">{screening.overall_decision ? "통과" : "보류/탈락"}</span>
                    </p>
                    {screening.criteria_decisions && screening.criteria_decisions.length > 0 && (
                      <ul className="mt-2 text-sm">
                        {screening.criteria_decisions.map((r, idx) => (
                          <li key={idx} className={r.decision ? "text-green-600" : "text-navy/70"}>
                            {r.criteria} — {r.decision ? "충족" : "부족"}
                          </li>
                        ))}
                      </ul>
                    )}
                    {screening.overall_reasoning && (
                      <p className="mt-2 text-sm text-navy/70">{screening.overall_reasoning}</p>
                    )}
                  </div>
                )}
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
