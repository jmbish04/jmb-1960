import type { Env } from "../../types";
import {
  createJob,
  updateJob,
  getJob,
  listJobs,
} from "../../utils/db";
import { analyzeJobPosting } from "../../utils/ai";

export async function handleJobs(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/jobs", "");

  if (path === "" && request.method === "GET") {
    const jobs = await listJobs(env);
    return Response.json({ jobs });
  }

  if (path === "" && request.method === "POST") {
    const { url: jobUrl, email_content } = await request.json().catch(() => ({}));

    if (!jobUrl && !email_content) {
      return new Response("Missing job URL or email content", { status: 400 });
    }

    let jobUrlToUse = jobUrl;
    let jobDescription = "";

    if (email_content && !jobUrl) {
      const emailAnalysis = await analyzeEmailForJobInfo(env, email_content);
      jobUrlToUse = emailAnalysis.url || "";
      jobDescription = emailAnalysis.description || "";
    }

    if (!jobUrlToUse || jobUrlToUse.includes("linkedin.com")) {
      return new Response(
        JSON.stringify({
          error: "Please provide a job URL from the company website, not LinkedIn. LinkedIn blocks scraping.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const job = await createJob(env, jobUrlToUse);

    try {
      const response = await fetch(jobUrlToUse);
      if (response.ok) {
        jobDescription = await response.text();
      }
    } catch (e) {
      console.error("Error fetching job URL:", e);
    }

    const analysis = await analyzeJobPosting(env, jobUrlToUse, jobDescription);

    await updateJob(env, job.id, {
      job_description: jobDescription.substring(0, 10000),
      fit_score: analysis.fit_score,
      ...analysis,
    });

    if (analysis.questions && analysis.questions.length > 0) {
      const chatStateId = env.CHAT_STATE.idFromName("user-joe");
      const chatState = env.CHAT_STATE.get(chatStateId);
      await chatState.fetch(
        new Request("https://dummy/questions", {
          method: "POST",
          body: JSON.stringify({ questions: analysis.questions }),
        })
      );
    }

    return Response.json({
      job,
      analysis,
      message: analysis.fit_score < 70
        ? `Your fit score is ${analysis.fit_score}/100. I can ask some targeted questions that might help improve this score. Would you like me to proceed?`
        : `Your fit score is ${analysis.fit_score}/100. ${analysis.analysis}`,
    });
  }

  if (path.startsWith("/") && request.method === "GET") {
    const jobId = path.slice(1);
    const job = await getJob(env, jobId);
    if (!job) {
      return new Response("Job not found", { status: 404 });
    }
    return Response.json({ job });
  }

  if (path.startsWith("/") && request.method === "PATCH") {
    const jobId = path.slice(1);
    const updates = await request.json().catch(() => ({}));
    await updateJob(env, jobId, updates);
    return Response.json({ success: true });
  }

  return new Response("Not Found", { status: 404 });
}

async function analyzeEmailForJobInfo(
  env: Env,
  emailContent: string
): Promise<{ url?: string; description?: string }> {
  const prompt = `Extract job information from this email:
${emailContent}

Return JSON:
{
  "url": "<job posting URL if found>",
  "description": "<job description text if found>"
}`;

  try {
    const response = await env.AI.run("@cf/openai/gpt-oss-120b", {
      messages: [{ role: "user", content: prompt }],
    });

    const content = typeof response === "string" ? response : response.response || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Error analyzing email:", e);
  }

  return {};
}
