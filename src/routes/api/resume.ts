import type { Env } from "../../types";
import { generateResume, generateCoverLetter } from "../../utils/ai";
import { generatePDF, savePDFToR2 } from "../../utils/pdf";

export async function handleResume(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/resume", "");

  if (path === "/generate" && request.method === "POST") {
    const { jobId, type } = await request.json().catch(() => ({}));

    if (!jobId) {
      return new Response("Missing jobId", { status: 400 });
    }

    const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ?")
      .bind(jobId)
      .first();

    if (!job || !job.job_description) {
      return new Response("Job not found or missing description", { status: 404 });
    }

    let html: string;
    let pdfKey: string;

    if (type === "cover_letter") {
      html = await generateCoverLetter(env, jobId, job.job_description);
      pdfKey = `cover-letters/${jobId}-${Date.now()}.pdf`;
    } else {
      html = await generateResume(env, jobId, job.job_description);
      pdfKey = `resumes/${jobId}-${Date.now()}.pdf`;
    }

    const pdfBuffer = await generatePDF(env, html);
    await savePDFToR2(env, pdfBuffer, pdfKey);

    if (type === "cover_letter") {
      await env.DB.prepare(
        "INSERT INTO cover_letters (id, job_id, content, pdf_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(
          crypto.randomUUID(),
          jobId,
          html,
          pdfKey,
          Date.now(),
          Date.now()
        )
        .run();
    } else {
      await env.DB.prepare(
        "INSERT INTO resumes (id, job_id, tailored_content, pdf_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
        .bind(
          crypto.randomUUID(),
          jobId,
          html,
          pdfKey,
          Date.now(),
          Date.now()
        )
        .run();
    }

    return Response.json({
      success: true,
      html,
      pdf_key: pdfKey,
      pdf_url: `/api/resume/pdf/${encodeURIComponent(pdfKey)}`,
    });
  }

  if (path.startsWith("/pdf/") && request.method === "GET") {
    const pdfKey = decodeURIComponent(path.replace("/pdf/", ""));
    const pdfBuffer = await env.RESUMES_R2.get(pdfKey);

    if (!pdfBuffer) {
      return new Response("PDF not found", { status: 404 });
    }

    return new Response(await pdfBuffer.arrayBuffer(), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfKey.split("/").pop()}"`,
      },
    });
  }

  return new Response("Not Found", { status: 404 });
}
