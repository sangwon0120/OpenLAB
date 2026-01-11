// @ts-nocheck
import { promises as fs } from "fs";
import path from "path";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
    return;
  }

  try {
    const dataDir = path.join(process.cwd(), ".data");
    const filePath = path.join(dataDir, "posted-notices.json");

    let list: any[] = [];
    try {
      const raw = await fs.readFile(filePath, "utf8");
      list = JSON.parse(raw);
      if (!Array.isArray(list)) list = [];
    } catch (e) {
      list = [];
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, notices: list }));
  } catch (err: any) {
    console.error("posted-notices error", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Internal server error" }));
  }
}
