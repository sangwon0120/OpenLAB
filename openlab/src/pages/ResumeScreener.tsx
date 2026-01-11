import { useState } from "react";

export default function ResumeScreener() {
  const [jobDescription, setJobDescription] = useState<string>(
    "Data Preprocessing / Research Assistant\n\n- Clean and preprocess tabular data\n- Build reproducible pipelines\n- Basic Python + Pandas required"
  );
  const [criteria, setCriteria] = useState<string>(
    "- Python/Pandas 사용 경험\n- 데이터 전처리 프로젝트 경험\n- 협업/문서화 경험"
  );
  const [resumeText, setResumeText] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setResumeFile(f);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const fd = new FormData();
      fd.append("job_description", jobDescription);
      fd.append("criteria", criteria);
      if (resumeText) fd.append("resume_text", resumeText);
      if (resumeFile) fd.append("resume", resumeFile, resumeFile.name);

      const res = await fetch("http://localhost:8000/analyze-resume", { method: "POST", body: fd });
      const j = await res.json();
      
      if (!j?.success) throw new Error(j?.error || "평가 실패");
      setResult(j);
    } catch (err: any) {
      alert(err.message || "오류가 발생했습니다");
    }

    setLoading(false);
  };

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-2xl font-semibold">Resume Screening </h1>

        <form onSubmit={submit} className="mt-6 grid gap-3">
          <label className="text-sm font-semibold">Job Description</label>
          <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} rows={6} className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" placeholder="직무 기술서를 입력하세요" />

          <label className="text-sm font-semibold">Screening Criteria</label>
          <textarea value={criteria} onChange={(e) => setCriteria(e.target.value)} rows={4} className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" placeholder="예: 관련 프로젝트 경험, Python 숙련도, 논문/보고서 작성 경험" />

          <label className="text-sm font-semibold">Resume Text (선택)</label>
          <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} rows={4} className="rounded-2xl border border-navy/10 px-4 py-3 text-sm outline-none" placeholder="PDF를 바로 올릴 수 없을 때 텍스트로 붙여넣으세요" />

          <label className="text-sm font-semibold">Upload Resume (PDF)</label>
          <input type="file" accept="application/pdf" onChange={handleFile} />

          <div className="flex items-center gap-3">
            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2 text-sm font-semibold text-white">
              {loading ? "평가중…" : "평가 실행"}
            </button>
            <button type="button" onClick={() => { setJobDescription(""); setCriteria("- "); setResumeText(""); setResumeFile(null); setResult(null); }} className="inline-flex items-center gap-2 rounded-full border border-navy/10 px-4 py-2 text-sm font-semibold text-navy/70">초기화</button>
          </div>
        </form>

        {result && (
          <div className="mt-6 rounded-2xl border border-navy/10 p-4 bg-white">
            <h2 className="text-lg font-semibold">Screening Result</h2>
            <p className="mt-2 text-sm text-navy/70">Overall decision: <strong>{result.overall_decision ? "Pass" : "Reject"}</strong></p>
            <p className="mt-1 text-sm text-navy/70">Reasoning: {result.overall_reasoning}</p>

            <div className="mt-4 grid gap-2">
              {result.criteria_decisions?.map((c: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-navy/10 p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">{c.criteria}</div>
                    <div className={`text-sm ${c.decision ? 'text-green-600' : 'text-navy/70'}`}>{c.decision ? 'Matched' : 'Not matched'}</div>
                  </div>
                  <div className="mt-2 text-sm text-navy/70">{c.reasoning}</div>
                </div>
              ))}
            </div>

            <pre className="mt-4 overflow-auto text-xs bg-slate/10 p-3 rounded">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
