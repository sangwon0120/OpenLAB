import { useEffect, useState } from "react";
import { Calendar, ClipboardList, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { notices } from "../data/notices";
import { useAuth } from "../context/AuthContext";
import {
  deletePostedNotice,
  loadApplications,
  loadPostedNotices,
  savePostedNotice,
  updatePostedNoticeStatus,
} from "../lib/openlabStore";

export default function Notices() {
  const { auth } = useAuth();
  const [posted, setPosted] = useState<any[] | null>(null);
  const [storeVersion, setStoreVersion] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch("/api/posted-notices")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        if (d?.success && Array.isArray(d.notices)) setPosted(d.notices);
        else setPosted([]);
      })
      .catch(() => setPosted([]));
    return () => {
      mounted = false;
    };
  }, []);

  const effectiveMode: "student" | "lab" =
    auth.role === "master"
      ? auth.currentMode
      : auth.role === "lab"
        ? "lab"
        : "student";

  // Demo/seed: allow lab to manage NL-2401 as a posted notice
  useEffect(() => {
    if (!auth.isLoggedIn) return;
    if (effectiveMode !== "lab") return;
    const ownerEmail = auth.user?.email || "";
    const lab = auth.user?.labName || "";
    if (!ownerEmail || !lab) return;

    const existing = loadPostedNotices().find((n) => n.id === "NL-2401" && n.ownerEmail === ownerEmail);
    if (existing) return;

    const base = notices.find((n) => n.id === "NL-2401");
    if (!base) return;

    savePostedNotice({
      id: base.id,
      title: base.title,
      description: base.description,
      duration: base.duration,
      deadline: base.deadline,
      status: base.status,
      criteria: "Python\nPandas\nNumPy\n시계열 데이터 전처리 경험",
      lab,
      ownerEmail,
      createdAt: new Date().toISOString(),
    });
    setStoreVersion((v) => v + 1);
  }, [auth.isLoggedIn, auth.role, auth.currentMode, auth.user?.email, auth.user?.labName, effectiveMode]);

  // storeVersion is used only to force rerender after seeding
  const localPosted = loadPostedNotices();
  void storeVersion;

  // If server returns an empty array, fall back to localStorage posted notices
  const remotePosted = posted && posted.length > 0 ? posted : [];

  const uniqStudent: any[] = [];
  const seen = new Set<string>();
  for (const n of [...remotePosted, ...localPosted, ...notices]) {
    const nid = String(n?.id || "");
    if (!nid) continue;
    if (seen.has(nid)) continue;
    seen.add(nid);
    uniqStudent.push(n);
  }

  const list =
    effectiveMode === "lab"
      ? [...remotePosted, ...localPosted].filter(
          (n: any) => (n?.ownerEmail || "") === (auth.user?.email || "")
        )
      : uniqStudent;

  const applications = loadApplications();
  const applicantCounts = new Map<string, number>();
  for (const a of applications) {
    const nid = String((a as any)?.noticeId || "");
    if (!nid) continue;
    applicantCounts.set(nid, (applicantCounts.get(nid) || 0) + 1);
  }

  const myEmail = (auth.user?.email || "").trim().toLowerCase();
  const isLabView = effectiveMode === "lab";

  return (
    <div className="bg-white text-navy">
      <section className="bg-white py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent">
              Notices
            </p>
            <h1 className="text-3xl font-semibold">
              {effectiveMode === "lab" ? "게시한 공고" : "공고 게시판"}
            </h1>
            <p className="text-base text-navy/70">
              {effectiveMode === "lab"
                ? "내가 등록한 공고와 지원자를 확인할 수 있습니다."
                : "연구실에서 올린 마이크로 태스크 공고를 확인하고 바로 지원하세요."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-navy/10 bg-slate px-4 py-3 text-sm text-navy/70">
            <Search className="h-4 w-4 text-accent" />
            키워드나 연구실명으로 공고를 검색할 수 있습니다.
          </div>
        </div>
      </section>

      <section className="bg-slate py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-sm">
            <div
              className={`hidden gap-4 border-b border-navy/10 bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-navy/50 md:grid ${
                isLabView
                  ? "grid-cols-[1.2fr_2.2fr_1fr_1.2fr_1.2fr_1fr_1fr_1.2fr]"
                  : "grid-cols-[1.2fr_2.2fr_1fr_1.2fr_1.2fr_1fr_1fr]"
              }`}
            >
              <span>번호</span>
              <span>공고 제목</span>
              <span className="text-center">상태</span>
              <span>연구실</span>
              <span>기간</span>
              <span className="text-right">마감일</span>
              <span className="text-right">지원자 현황</span>
              {isLabView && <span className="text-center">관리</span>}
            </div>
            <div className="divide-y divide-navy/10">
              {list.map((notice) => (
                <div
                  key={notice.id}
                  className={`flex flex-col gap-3 px-6 py-5 md:grid ${
                    isLabView
                      ? "md:grid-cols-[1.2fr_2.2fr_1fr_1.2fr_1.2fr_1fr_1fr_1.2fr] md:items-start"
                      : "md:grid-cols-[1.2fr_2.2fr_1fr_1.2fr_1.2fr_1fr_1fr] md:items-center"
                  }`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                    <ClipboardList className="h-4 w-4 text-accent" />
                    {notice.id}
                  </div>
                  <div className="text-base font-semibold text-navy">
                    <Link to={`/notices/${notice.id}`} className="hover:underline">
                      {notice.title}
                    </Link>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-navy/70 md:justify-self-center md:justify-center">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {notice.status}
                    </span>

                    {effectiveMode === "student" &&
                      auth.isLoggedIn &&
                      myEmail &&
                      applications.some(
                        (a: any) =>
                          a.noticeId === notice.id && (a.email || "").toLowerCase() === myEmail
                      ) && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          지원완료
                        </span>
                      )}
                  </div>
                  <div className="text-sm text-navy/70">{notice.lab}</div>
                  <div className="text-sm text-navy/70">{notice.duration}</div>
                  <div className="md:justify-self-end">
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate px-3 py-1 text-xs font-semibold text-navy/70 tabular-nums whitespace-nowrap">
                      <Calendar className="h-4 w-4 text-accent" />
                      {String((notice as any)?.deadline || "").trim() || "-"}
                    </span>
                  </div>

                  <div className="text-sm text-navy/70 md:justify-self-end">
                    <span className="rounded-full bg-slate px-3 py-1 text-xs font-semibold text-navy/70">
                      지원자 {(applicantCounts.get(String(notice.id)) || 0)}명
                    </span>
                  </div>

                  {isLabView && (
                    <div className="text-sm text-navy/70 md:justify-self-center md:self-start">
                      {(notice as any)?.ownerEmail === (auth.user?.email || "") && (
                        <div className="grid w-full grid-cols-1 gap-2">
                          <div className="flex w-full items-center rounded-full border border-accent/20 bg-accent/10 p-0.5">
                            <button
                              type="button"
                              className={`flex-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                                String((notice as any)?.status || "") === "마감"
                                  ? "text-navy/70 hover:text-navy"
                                  : "bg-accent text-white"
                              }`}
                              onClick={() => {
                                const ok = updatePostedNoticeStatus({
                                  id: String(notice.id),
                                  ownerEmail: String(auth.user?.email || ""),
                                  status: "모집중",
                                });
                                if (ok) setStoreVersion((v) => v + 1);
                              }}
                            >
                              Open
                            </button>
                            <button
                              type="button"
                              className={`flex-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition ${
                                String((notice as any)?.status || "") === "마감"
                                  ? "bg-accent text-white"
                                  : "text-navy/70 hover:text-navy"
                              }`}
                              onClick={() => {
                                const ok = updatePostedNoticeStatus({
                                  id: String(notice.id),
                                  ownerEmail: String(auth.user?.email || ""),
                                  status: "마감",
                                });
                                if (ok) setStoreVersion((v) => v + 1);
                              }}
                            >
                              Close
                            </button>
                          </div>

                          <button
                            type="button"
                            className="w-full rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                            onClick={() => {
                              const sure = window.confirm(
                                "공고를 삭제할까요? (지원자 데이터도 함께 제거됩니다)"
                              );
                              if (!sure) return;
                              const ok = deletePostedNotice({
                                id: String(notice.id),
                                ownerEmail: String(auth.user?.email || ""),
                              });
                              if (ok) setStoreVersion((v) => v + 1);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
