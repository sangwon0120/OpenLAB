export type PostedNotice = {
  id: string;
  title: string;
  lab: string;
  ownerEmail: string;
  duration: string;
  deadline: string;
  status: string;
  description: string;
  criteria?: string;
  createdAt: string;
};

export type ScreeningResult = {
  success?: boolean;
  criteria_decisions?: Array<{ criteria: string; decision: boolean; reasoning?: string }>;
  overall_decision?: boolean;
  overall_reasoning?: string;
  error?: string;
};

export type Application = {
  id: string;
  noticeId: string;
  name: string;
  email: string;
  message: string;
  resumeFilename: string;
  resumeDataUrl: string;
  screening: ScreeningResult | null;
  createdAt: string;
};

const POSTED_NOTICES_KEY = "openlab_postedNotices_v1";
const APPLICATIONS_KEY = "openlab_applications_v1";
const APPLICANT_PROFILE_KEY_PREFIX = "openlab_applicantProfile_v1:";

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function loadPostedNotices(): PostedNotice[] {
  const list = safeReadJson<PostedNotice[]>(POSTED_NOTICES_KEY, []);
  return Array.isArray(list) ? list : [];
}

export function savePostedNotice(notice: PostedNotice) {
  const list = loadPostedNotices();
  const next = [notice, ...list.filter((n) => n.id !== notice.id)];
  safeWriteJson(POSTED_NOTICES_KEY, next);
}

export function updatePostedNoticeStatus(params: {
  id: string;
  ownerEmail: string;
  status: string;
}): boolean {
  const id = String(params.id || "").trim();
  const ownerEmail = String(params.ownerEmail || "").trim().toLowerCase();
  if (!id || !ownerEmail) return false;

  const list = loadPostedNotices();
  const idx = list.findIndex(
    (n) => n.id === id && String(n.ownerEmail || "").trim().toLowerCase() === ownerEmail
  );
  if (idx === -1) return false;

  const updated: PostedNotice = { ...list[idx], status: params.status };
  const next = [...list];
  next[idx] = updated;
  safeWriteJson(POSTED_NOTICES_KEY, next);
  return true;
}

export function deletePostedNotice(params: { id: string; ownerEmail: string }): boolean {
  const id = String(params.id || "").trim();
  const ownerEmail = String(params.ownerEmail || "").trim().toLowerCase();
  if (!id || !ownerEmail) return false;

  const list = loadPostedNotices();
  const next = list.filter(
    (n) => !(n.id === id && String(n.ownerEmail || "").trim().toLowerCase() === ownerEmail)
  );
  if (next.length === list.length) return false;

  safeWriteJson(POSTED_NOTICES_KEY, next);
  deleteApplicationsByNoticeId(id);
  return true;
}

export function loadApplications(): Application[] {
  const list = safeReadJson<Application[]>(APPLICATIONS_KEY, []);
  const apps = Array.isArray(list) ? list : [];
  return normalizeAndPersistApplications(apps);
}

export function saveApplication(app: Application) {
  const list = loadApplications();

  const key = applicationDedupeKey(app);
  const exists = list.some((a) => applicationDedupeKey(a) === key);
  const next = exists ? list : [app, ...list.filter((a) => a.id !== app.id)];
  safeWriteJson(APPLICATIONS_KEY, next);
  // ensure any pre-existing duplicates are removed
  normalizeAndPersistApplications(next);
}

export function getApplicationsByNoticeId(noticeId: string): Application[] {
  return loadApplications().filter((a) => a.noticeId === noticeId);
}

function deleteApplicationsByNoticeId(noticeId: string) {
  const id = String(noticeId || "").trim();
  if (!id) return;
  const apps = loadApplications();
  const next = apps.filter((a) => String(a.noticeId || "") !== id);
  if (next.length !== apps.length) {
    safeWriteJson(APPLICATIONS_KEY, next);
  }
}

function normalizeAndPersistApplications(apps: Application[]): Application[] {
  // Deduplicate: if (noticeId + name + email) are all the same, keep the earliest (최초 1개)
  const earliestByKey = new Map<string, Application>();
  for (const app of apps) {
    const key = applicationDedupeKey(app);
    const existing = earliestByKey.get(key);
    if (!existing) {
      earliestByKey.set(key, app);
      continue;
    }
    const t1 = Date.parse(existing.createdAt || "");
    const t2 = Date.parse(app.createdAt || "");
    const existingTs = Number.isFinite(t1) ? t1 : Number.POSITIVE_INFINITY;
    const appTs = Number.isFinite(t2) ? t2 : Number.POSITIVE_INFINITY;
    if (appTs < existingTs) {
      earliestByKey.set(key, app);
    }
  }

  const keepIds = new Set(Array.from(earliestByKey.values()).map((a) => a.id));
  const normalized = apps.filter((a) => keepIds.has(a.id));

  // If we removed anything, persist back immediately.
  if (normalized.length !== apps.length) {
    safeWriteJson(APPLICATIONS_KEY, normalized);
  }
  return normalized;
}

function applicationDedupeKey(app: Application): string {
  const noticeId = String(app.noticeId || "").trim();
  const email = String(app.email || "").trim().toLowerCase();
  const name = String(app.name || "").trim().toLowerCase();
  return `${noticeId}::${email}::${name}`;
}

export function loadApplicantProfile(email: string): { name: string } | null {
  const key = `${APPLICANT_PROFILE_KEY_PREFIX}${String(email || "").trim().toLowerCase()}`;
  const v = safeReadJson<{ name: string } | null>(key, null);
  if (!v || typeof v.name !== "string") return null;
  return { name: v.name };
}

export function saveApplicantProfile(email: string, profile: { name: string }) {
  const key = `${APPLICANT_PROFILE_KEY_PREFIX}${String(email || "").trim().toLowerCase()}`;
  safeWriteJson(key, { name: String(profile?.name || "").trim() });
}

export async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });
}

export async function screenResumeWithPython(params: {
  resumeFile: File;
  jobDescription: string;
  criteria: string;
}): Promise<ScreeningResult> {
  try {
    const fd = new FormData();
    fd.append("resume", params.resumeFile, params.resumeFile.name);
    fd.append("job_description", params.jobDescription);
    fd.append("criteria", params.criteria);

    const res = await fetch("http://localhost:8000/analyze-resume", {
      method: "POST",
      body: fd,
    });

    let j: any = null;
    try {
      j = await res.json();
    } catch {
      j = null;
    }

    if (!res.ok || !j?.success) {
      return { success: false, error: j?.error || `스크리닝 실패 (${res.status})` };
    }

    return {
      success: true,
      criteria_decisions: Array.isArray(j.criteria_decisions) ? j.criteria_decisions : [],
      overall_decision: Boolean(j.overall_decision),
      overall_reasoning: String(j.overall_reasoning || ""),
    };
  } catch {
    return {
      success: false,
      error: "스크리닝 서버에 연결할 수 없습니다. (Python 8000 실행 확인)",
    };
  }
}
