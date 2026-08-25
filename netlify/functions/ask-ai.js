const Anthropic = require("@anthropic-ai/sdk");
const { z } = require("zod");
const { zodOutputFormat } = require("@anthropic-ai/sdk/helpers/zod");

const ProjectSuggestionSchema = z.object({
  name: z.string().describe("A concise, professional project name"),
  description: z.string().describe("A one-sentence description of the project"),
  increment: z
    .enum(["6min", "15min", "30min"])
    .describe(
      "Billing increment: 6min for detailed/granular work (e.g. litigation, valuation), 15min for typical professional services, 30min for coarse-grained or high-level engagements"
    ),
  tasks: z
    .array(z.string())
    .min(2)
    .max(6)
    .describe("Short, actionable preliminary tasks to start logging time against"),
});

const SYSTEM_PROMPT =
  "You help a solo professional set up a new project in their personal time & billing tracker, from a short plain-English request. " +
  "Infer a concise project name, a one-sentence description, a sensible billing increment, and a short list of preliminary tasks " +
  "they can start logging time against. Keep names and descriptions concise and professional; keep tasks short and actionable.";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  let prompt;
  try {
    const body = JSON.parse(event.body || "{}");
    prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return jsonResponse(400, { error: "Invalid request body." });
  }

  if (!prompt) {
    return jsonResponse(400, { error: "Describe the project you want to create." });
  }
  if (prompt.length > 2000) {
    return jsonResponse(400, { error: "That description is too long — please shorten it." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonResponse(500, { error: "AI isn't configured on this deployment yet." });
  }

  const client = new Anthropic();

  try {
    const response = await client.messages.parse({
      model: "claude-opus-5",
      max_tokens: 2048,
      output_config: {
        format: zodOutputFormat(ProjectSuggestionSchema),
        effort: "low",
      },
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    if (!response.parsed_output) {
      return jsonResponse(502, { error: "The AI couldn't produce a usable suggestion — try rephrasing." });
    }

    return jsonResponse(200, response.parsed_output);
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      return jsonResponse(500, { error: "AI is misconfigured (invalid API key)." });
    }
    if (err instanceof Anthropic.RateLimitError) {
      return jsonResponse(429, { error: "AI is busy right now — try again in a moment." });
    }
    if (err instanceof Anthropic.APIError) {
      return jsonResponse(502, { error: "The AI request failed — try again." });
    }
    return jsonResponse(500, { error: "Something went wrong." });
  }
};

function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}
