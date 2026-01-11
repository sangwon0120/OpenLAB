// @ts-nocheck
import { IncomingMessage, ServerResponse } from "http";
import { promises as fs } from "fs";
import path from "path";
import formidable from "formidable";
import pdfParse from "pdf-parse";
import { screenResume } from "./_lib/resumeScreener";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
    return;
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("form parse err", err);
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: false, error: "Form parse error" }));
        return;
      }

      const jobDescription = (fields.jobDescription || "").toString();
      const criteria = (fields.criteria || "").toString();
      let resumeText = (fields.resumeText || "").toString();

      if (files.resume) {
        try {
          const f = Array.isArray(files.resume) ? files.resume[0] : files.resume;
          const tmpPath = f.filepath || f.path || f.file;
          const buf = await fs.readFile(tmpPath);
          const parsed = await pdfParse(buf);
          resumeText = (resumeText || "") + "\n" + (parsed.text || "");
        } catch (e) {
          console.warn("pdf parse failed", e.message || e);
        }
      }

      // If a Python Resume Screener service is configured, forward the JSON (resume text) to it.
      const pyUrl = process.env.PY_SCREENER_URL || process.env.PY_SCREENER || null;
      if (pyUrl) {
        try {
          const resp = await fetch(pyUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobDescription, criteria, resumeText }),
            timeout: 20000,
          });
          const j = await resp.json();
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(j));
          return;
        } catch (e: any) {
          console.warn("Failed to forward to Python screener, falling back:", e.message || e);
        }
      }

      const result = await screenResume({ jobDescription, criteria, resumeText });

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(result));
    });
  } catch (err: any) {
    console.error("resume-screen error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Internal server error" }));
  }
}
