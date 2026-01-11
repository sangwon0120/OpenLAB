// @ts-nocheck
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";
import { evaluateText } from "./_lib/evaluator";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
    return;
  }

  try {
    console.log("/api/apply called");
    // parse multipart/form-data with formidable
    const form = formidable({ multiples: false, maxFileSize: 5 * 1024 * 1024 });

    const parsed: any = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("form.parse error", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = parsed;
    console.log("apply fields:", { noticeId: fields.noticeId, name: fields.name, email: fields.email });
    if (files && files.resume) {
      console.log("resume uploaded: ", Array.isArray(files.resume) ? files.resume.length : 1);
    }

    const noticeId = fields.noticeId as string;
    const name = fields.name as string;
    const email = fields.email as string;
    const message = fields.message as string;

    if (!noticeId || !name || !email) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, error: "Missing required fields" }));
      return;
    }

    // find notice (prefer posted notices)
    let notice = null;
    try {
      const dataDir = path.join(process.cwd(), ".data");
      const postedPath = path.join(dataDir, "posted-notices.json");
      const raw = await fs.readFile(postedPath, "utf8");
      const list = JSON.parse(raw);
      notice = Array.isArray(list) ? list.find((n: any) => n.id === noticeId) : null;
    } catch (e) {
      // ignore (file may not exist)
    }

    if (!notice) {
      // fallback to static notices
      try {
        const { notices } = await import("../src/data/notices");
        notice = notices.find((n: any) => n.id === noticeId) || null;
      } catch (e) {
        notice = null;
      }
    }

    // handle resume file if provided
    let resumeText = "";
    let resumeStoredPath = null;
    let resumeFilename = null;

    if (files?.resume) {
      const file = files.resume as any;
      const buffer = await fs.readFile(file.filepath);
      // ensure upload dir
      const dataDir = path.join(process.cwd(), ".data");
      const uploadsDir = path.join(dataDir, "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const safeName = `${Date.now().toString().slice(-6)}-${(file.originalFilename || file.name).replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const dest = path.join(uploadsDir, safeName);
      await fs.writeFile(dest, buffer);
      resumeStoredPath = dest;
      resumeFilename = file.originalFilename || file.name;

      // extract text using pdf-parse
      try {
        const pdfParse = require("pdf-parse");
        const parseRes = await pdfParse(buffer);
        resumeText = String(parseRes?.text || "").trim();
      } catch (e) {
        console.error("pdf parse error", e);
      }
    }

    // Prepare evaluation inputs
    const criteria = notice?.criteria || fields.criteria || "";
    const jobDescription = notice?.description || "";

    const evalRes = await evaluateText({ criteria, jobDescription, resumeText });

    // persist application
    const app = {
      id: `app-${Date.now().toString().slice(-6)}`,
      noticeId,
      name,
      email,
      message: message || "",
      resumeFilename,
      resumePath: resumeStoredPath,
      resumeTextSnippet: (resumeText || "").slice(0, 200),
      evaluation: evalRes,
      createdAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), ".data");
    await fs.mkdir(dataDir, { recursive: true });
    const appsPath = path.join(dataDir, "applications.json");

    let list: any[] = [];
    try {
      const raw = await fs.readFile(appsPath, "utf8");
      list = JSON.parse(raw) || [];
    } catch (e) {
      list = [];
    }

    list.unshift(app);
    await fs.writeFile(appsPath, JSON.stringify(list, null, 2), "utf8");

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, application: app }));
  } catch (err: any) {
    console.error("apply error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: err?.message || "Internal server error" }));
  }
}
