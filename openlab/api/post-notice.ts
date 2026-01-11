// @ts-nocheck
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
    return;
  }

  try {
    const { title, description, duration, roles, criteria, id, status, deadline } = req.body || {};

    if (!title || !description) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, error: "Missing required fields" }));
      return;
    }

    const notice = {
      id: id || `NL-${Date.now().toString().slice(-6)}`,
      title,
      description,
      duration: duration || "",
      roles: Array.isArray(roles) ? roles : typeof roles === "string" ? roles.split(",").map((r: string) => r.trim()).filter(Boolean) : [],
      criteria: criteria || "",
      status: status || "모집중",
      deadline: deadline || "",
      createdAt: new Date().toISOString(),
    };

    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "posted-notices.json");

    await fs.mkdir(dataDir, { recursive: true });

    let list: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf8");
      list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      // file might not exist yet
      list = [];
    }

    list.unshift(notice);

    await fs.writeFile(filePath, JSON.stringify(list, null, 2), "utf8");

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, notice }));
  } catch (err: any) {
    console.error("post-notice error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Internal server error" }));
  }
}
