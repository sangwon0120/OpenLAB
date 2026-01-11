// @ts-nocheck
import fetch from "node-fetch";

export async function evaluateText({ criteria = "", jobDescription = "", resumeText = "" }: { criteria?: string; jobDescription?: string; resumeText?: string }) {
  const combined = `Evaluation Criteria:\n${criteria}\n\nJob Description:\n${jobDescription}\n\nResume Text:\n${resumeText}`;

  // If OPENAI_API_KEY is available, call OpenAI Chat Completion API
  const apiKey = process.env.OPENAI_API_KEY;
  if (apiKey) {
    try {
      const prompt = `You are an expert recruiter. Based on the following criteria and job description, evaluate the resume text and return a JSON object with the following fields: {"score": number (0-100), "results": [{"criteria": string, "matched": boolean}], "explanation": string }. Return JSON only.`;

      const messages = [
        { role: "system", content: "You evaluate resumes against criteria and job descriptions and return concise JSON responses." },
        { role: "user", content: `${prompt}\n\n${combined}` },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model: "gpt-3.5-turbo", messages, max_tokens: 700, temperature: 0 }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`OpenAI error: ${res.status} ${txt}`);
      }

      const body = await res.json();
      const content = body?.choices?.[0]?.message?.content ?? body?.choices?.[0]?.text ?? "";

      // Try to extract JSON from model response
      const firstBrace = content.indexOf("{");
      const lastBrace = content.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonText = content.slice(firstBrace, lastBrace + 1);
        try {
          const parsed = JSON.parse(jsonText);
          // normalize
          const score = Number(parsed.score || 0);
          const results = Array.isArray(parsed.results) ? parsed.results : [];
          const explanation = parsed.explanation || "";
          return { success: true, score, results, explanation };
        } catch (e) {
          // fallthrough to mock
        }
      }

      // If parsing failed, fallback to mock behavior
    } catch (err) {
      console.error("OpenAI evaluation error:", err.message || err);
      // fallthrough to mock
    }
  }

  // Mock evaluator: simple substring matching for each criteria item
  const items = (criteria || "").split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const lowered = (resumeText || "").toLowerCase();
  const results = items.map((item) => {
    const key = item.toLowerCase();
    const matched = key.split(" ").every((tok) => lowered.includes(tok));
    return { criteria: item, matched };
  });
  const matchedCount = results.filter((r) => r.matched).length;
  const score = items.length ? Math.round((matchedCount / items.length) * 100) : 0;
  const explanation = items.length
    ? `Matched ${matchedCount} of ${items.length} criteria.`
    : "No criteria provided.";

  return { success: true, score, results, explanation };
}
