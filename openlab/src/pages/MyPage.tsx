import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Briefcase, FileText, GraduationCap, Plus, Save, Sparkles, Download, Trash2, User } from "lucide-react";

const initialSkills = ["Python", "Pandas", "Data Preprocessing", "SQL"];

export default function MyPage() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeURL, setResumeURL] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  // Personal info
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female" | "other">("");

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setPhotoError("파일 크기는 5MB 이하만 허용됩니다.");
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotoFile(file);
    setPhotoURL(url);
  };

  const removePhoto = () => {
    if (photoURL) URL.revokeObjectURL(photoURL);
    setPhotoFile(null);
    setPhotoURL(null);
    setPhotoError(null);
  }; 

  useEffect(() => {
    return () => {
      if (resumeURL) URL.revokeObjectURL(resumeURL);
      if (photoURL) URL.revokeObjectURL(photoURL);
    };
  }, [resumeURL, photoURL]);

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setResumeError(null);
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setResumeError("PDF 파일만 업로드할 수 있습니다.");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setResumeError("파일 크기는 5MB 이하만 허용됩니다.");
      return;
    }
    const url = URL.createObjectURL(file);
    setResumeFile(file);
    setResumeURL(url);
  };

  const removeResume = () => {
    if (resumeURL) URL.revokeObjectURL(resumeURL);
    setResumeFile(null);
    setResumeURL(null);
    setResumeError(null);
  };

  const { auth, logout, switchMode } = useAuth();
  const navigate = useNavigate();

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

        {auth.role === "master" && (
          <div className="rounded-3xl border border-navy/10 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-navy">Master 모드 전환</p>
            <p className="mt-2 text-sm text-navy/70">
              현재 모드: <span className="font-semibold text-navy">{auth.currentMode === "student" ? "학생" : "연구실"}</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => switchMode("student")}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  auth.currentMode === "student"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-navy/20 text-navy/70 hover:border-navy/40"
                }`}
              >
                학생 모드
              </button>
              <button
                type="button"
                onClick={() => switchMode("lab")}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition ${
                  auth.currentMode === "lab"
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-navy/20 text-navy/70 hover:border-navy/40"
                }`}
              >
                연구실 모드
              </button>
            </div>
          </div>
        )}

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

              <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto] items-start">
                <div>
                  <p className="text-sm font-semibold text-navy">개인정보</p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm font-semibold text-navy">
                      이름
                      <input
                        className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                        placeholder="홍길동"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                      />
                    </label>
                    <label className="text-sm font-semibold text-navy">
                      나이
                      <input
                        className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40"
                        placeholder="24"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        type="number"
                      />
                    </label>
                    <label className="text-sm font-semibold text-navy sm:col-span-2">
                      성별
                      <div className="mt-2 flex items-center gap-4">
                        <label className="inline-flex items-center gap-2 text-sm text-navy/80">
                          <input type="radio" name="gender" value="male" checked={gender === "male"} onChange={() => setGender("male")} />
                          남성
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-navy/80">
                          <input type="radio" name="gender" value="female" checked={gender === "female"} onChange={() => setGender("female")} />
                          여성
                        </label>
                        <label className="inline-flex items-center gap-2 text-sm text-navy/80">
                          <input type="radio" name="gender" value="other" checked={gender === "other"} onChange={() => setGender("other")} />
                          기타
                        </label>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-navy/5 overflow-hidden border border-navy/10">
                    {photoURL ? (
                      <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-navy/40">
                        <User className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                    <label htmlFor="photo-upload" className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-3 py-1 text-xs font-semibold text-navy cursor-pointer hover:border-navy/40">
                      사진 업로드
                    </label>
                    {photoFile && (
                      <button type="button" onClick={removePhoto} className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-3 py-1 text-xs font-semibold text-navy/70">
                        삭제
                      </button>
                    )}
                  </div>
                  {photoError && <p className="text-xs text-red-500">{photoError}</p>}
                </div>
              </div>

              <div className="mt-4 grid gap-4 grid-cols-1 items-start">
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

                <label className="text-sm font-semibold text-navy">
                  요약
                  <textarea
                    className="mt-2 w-full rounded-2xl border border-navy/10 px-4 py-3 text-sm text-navy outline-none placeholder:text-navy/40 h-full"
                    placeholder="연구 프로젝트 3건 참여, 데이터 정제/피처 엔지니어링 경험 보유"
                    rows={4}
                  />
                </label>

                <label className="text-sm font-semibold text-navy col-span-1">
                  이력서 업로드 (PDF)
                  <div className="mt-2 flex items-center gap-3">
                    <input id="resume-upload" type="file" accept="application/pdf" className="hidden" onChange={handleResumeChange} />
                    <label htmlFor="resume-upload" className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-4 py-2 text-sm font-semibold text-navy cursor-pointer hover:border-navy/40">
                      파일 선택
                    </label>

                    {resumeFile && (
                      <div className="inline-flex items-center gap-3">
                        <a href={resumeURL ?? undefined} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm underline text-accent">
                          <Download className="h-4 w-4" />
                          {resumeFile.name}
                        </a>

                        <button type="button" onClick={removeResume} className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-3 py-1 text-xs font-semibold text-navy/70">
                          <Trash2 className="h-4 w-4" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  {resumeError && <p className="text-xs text-red-500 mt-2">{resumeError}</p>}
                  <p className="text-xs text-navy/50 mt-1">PDF 파일만 업로드 가능합니다. 최대 5MB.</p>
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

            <div className="flex gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-[#1557D6]">
                <Save className="h-4 w-4" />
                마이페이지 저장
              </button>

              <button type="button" onClick={() => { logout(); navigate('/'); }} className="inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-3 text-sm font-semibold text-red-600 hover:bg-red-100">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
