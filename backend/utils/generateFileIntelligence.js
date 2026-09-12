const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";
const REQUEST_TIMEOUT_MS = 7000;

function heuristicTags(name, category, mimeType, sizeBytes) {
  const tags = [category];
  const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "";

  if (extension) tags.push(extension);

  if (sizeBytes > 100 * 1024 * 1024) tags.push("large file");
  else if (sizeBytes < 100 * 1024) tags.push("small file");

  const lowerName = name.toLowerCase();
  if (lowerName.includes("screenshot")) tags.push("screenshot");
  if (lowerName.includes("invoice") || lowerName.includes("receipt")) tags.push("finance");
  if (lowerName.includes("resume") || lowerName.includes("cv")) tags.push("resume");
  if (lowerName.includes("report")) tags.push("report");

  return {
    tags: Array.from(new Set(tags)).slice(0, 5),
    insight: "Automatically categorized as " + category + " based on file type.",
  };
}

function formatSize(bytes) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(1) + " " + units[i];
}

async function generateFileIntelligence(fileMeta) {
  const { name, category, mimeType, sizeBytes } = fileMeta;
  const fallback = heuristicTags(name, category, mimeType, sizeBytes);

  if (!process.env.GROQ_API_KEY) {
    return fallback;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(function () {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const prompt =
      "A user uploaded a file with these details: name \"" +
      name +
      "\", type " +
      mimeType +
      ", category " +
      category +
      ", size " +
      formatSize(sizeBytes) +
      ". Based only on the filename and metadata, respond with ONLY valid JSON in this exact shape: " +
      "{\"tags\": [\"tag1\", \"tag2\", \"tag3\"], \"insight\": \"one short useful sentence about this file\"}. " +
      "Tags should be lowercase, relevant, at most 5. Do not include any text outside the JSON.";

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.GROQ_API_KEY,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 200,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const raw = data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (!Array.isArray(parsed.tags) || typeof parsed.insight !== "string") {
      return fallback;
    }

    return {
      tags: parsed.tags.slice(0, 5).map(function (t) {
        return String(t).toLowerCase();
      }),
      insight: parsed.insight.slice(0, 200),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    return fallback;
  }
}

export default generateFileIntelligence;
