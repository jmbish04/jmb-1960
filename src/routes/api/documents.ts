import type { Env } from "../../types";
import { generatePDF, savePDFToR2 } from "../../utils/pdf";

export async function handleDocuments(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/documents", "");

  // Save document (resume or cover_letter)
  if (path.match(/^\/(resume|cover_letter)$/) && request.method === "POST") {
    const documentType = path.split("/")[1] as "resume" | "cover_letter";
    const body = await request.json().catch(() => ({})) as {
      content: string;
      jobId?: string;
    };

    if (!body.content) {
      return new Response("Missing content", { status: 400 });
    }

    try {
      const id = crypto.randomUUID();
      const now = Date.now();

      if (documentType === "resume") {
        await env.DB.prepare(
          "INSERT OR REPLACE INTO resumes (id, job_id, tailored_content, pdf_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
          .bind(
            id,
            body.jobId || null,
            body.content,
            null, // pdf_key will be set when exported
            now,
            now
          )
          .run();
      } else {
        await env.DB.prepare(
          "INSERT OR REPLACE INTO cover_letters (id, job_id, content, pdf_key, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
          .bind(
            id,
            body.jobId || null,
            body.content,
            null,
            now,
            now
          )
          .run();
      }

      return Response.json({ success: true, id });
    } catch (error: any) {
      console.error("Error saving document:", error);
      return Response.json(
        { error: error.message || "Failed to save document" },
        { status: 500 }
      );
    }
  }

  // Get document
  if (path.match(/^\/(resume|cover_letter)$/) && request.method === "GET") {
    const documentType = path.split("/")[1] as "resume" | "cover_letter";
    const jobId = url.searchParams.get("jobId");

    try {
      let result;
      if (documentType === "resume") {
        result = await env.DB.prepare(
          jobId
            ? "SELECT * FROM resumes WHERE job_id = ? ORDER BY updated_at DESC LIMIT 1"
            : "SELECT * FROM resumes ORDER BY updated_at DESC LIMIT 1"
        )
          .bind(jobId || undefined)
          .first();
      } else {
        result = await env.DB.prepare(
          jobId
            ? "SELECT * FROM cover_letters WHERE job_id = ? ORDER BY updated_at DESC LIMIT 1"
            : "SELECT * FROM cover_letters ORDER BY updated_at DESC LIMIT 1"
        )
          .bind(jobId || undefined)
          .first();
      }

      return Response.json({ document: result });
    } catch (error: any) {
      console.error("Error loading document:", error);
      return Response.json(
        { error: error.message || "Failed to load document" },
        { status: 500 }
      );
    }
  }

  // Export to PDF
  if (path === "/export" && request.method === "POST") {
    const body = await request.json().catch(() => ({})) as {
      type: "resume" | "cover_letter";
      content: string;
      jobId?: string;
    };

    if (!body.content) {
      return new Response("Missing content", { status: 400 });
    }

    try {
      // Generate PDF using existing utility
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; }
  </style>
</head>
<body>
  ${body.content}
</body>
</html>`;

      const pdfBuffer = await generatePDF(env, htmlContent);
      const pdfKey = `${body.type}s/${body.jobId || "general"}-${Date.now()}.pdf`;

      // Save to R2
      await savePDFToR2(env, pdfBuffer, pdfKey);

      // Generate signed URL (or return key for client to fetch)
      // For now, return the key - client can request download
      return Response.json({
        success: true,
        key: pdfKey,
        url: `/api/documents/download?key=${encodeURIComponent(pdfKey)}`,
      });
    } catch (error: any) {
      console.error("Error exporting PDF:", error);
      return Response.json(
        { error: error.message || "Failed to export PDF" },
        { status: 500 }
      );
    }
  }

  // Download PDF
  if (path === "/download" && request.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response("Missing key", { status: 400 });
    }

    try {
      const object = await env.RESUMES_R2.get(key);
      if (!object) {
        return new Response("PDF not found", { status: 404 });
      }

      return new Response(object.body, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${key.split("/").pop()}"`,
        },
      });
    } catch (error: any) {
      console.error("Error downloading PDF:", error);
      return Response.json(
        { error: error.message || "Failed to download PDF" },
        { status: 500 }
      );
    }
  }

  return new Response("Not Found", { status: 404 });
}

