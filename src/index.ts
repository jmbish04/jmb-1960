import { ChatStateDO } from "./durable-objects/chat-state";
import { handleChat } from "./routes/api/chat";
import { handleJobs } from "./routes/api/jobs";
import { handleResume } from "./routes/api/resume";
import { handleResumeData } from "./routes/api/resume-data";
import { handleScrape } from "./routes/api/scrape";
import { handleDocuments } from "./routes/api/documents";
import type { Env, UserProfile } from "./types";
import { updateUserProfile } from "./utils/db";
import { transcribeAudio } from "./utils/ai";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/chat")) {
      return handleChat(request, env);
    }

    if (url.pathname.startsWith("/api/jobs")) {
      return handleJobs(request, env);
    }

    if (url.pathname.startsWith("/api/resume")) {
      return handleResume(request, env);
    }

    if (url.pathname.startsWith("/api/resume-data")) {
      return handleResumeData(request, env);
    }

    if (url.pathname.startsWith("/api/scrape")) {
      return handleScrape(request, env);
    }

    if (url.pathname.startsWith("/api/documents")) {
      return handleDocuments(request, env);
    }

    if (url.pathname.startsWith("/api/profile") && request.method === "POST") {
      const data = await request.json().catch(() => ({})) as Partial<UserProfile>;
      await updateUserProfile(env, data);
      return Response.json({ success: true });
    }

    if (url.pathname.startsWith("/api/transcribe") && request.method === "POST") {
      const contentType = request.headers.get("content-type") || "";
      
      let audioData: string | ArrayBuffer;
      
      if (contentType.includes("application/json")) {
        // JSON request with base64 audio
        const body = await request.json().catch(() => ({})) as { audio?: string };
        if (!body.audio) {
          return new Response("Missing audio", { status: 400 });
        }
        audioData = body.audio;
      } else if (contentType.includes("audio/") || contentType.includes("multipart/form-data")) {
        // Direct audio file upload
        const formData = await request.formData().catch(() => null);
        if (formData) {
          const fileEntry = formData.get("audio");
          if (!fileEntry) {
            return new Response("Missing audio file", { status: 400 });
          }
          // Check if it's a File (not a string)
          if (typeof fileEntry === "string") {
            return new Response("Expected file, got string", { status: 400 });
          }
          const file = fileEntry as File;
          audioData = await file.arrayBuffer();
        } else {
          // Raw audio data
          audioData = await request.arrayBuffer();
        }
      } else {
        return new Response("Unsupported content type", { status: 400 });
      }
      
      try {
        const text = await transcribeAudio(env, audioData, {
          task: "transcribe",
          language: "en",
        });
        
        return Response.json({ text });
      } catch (error: any) {
        console.error("Transcription error:", error);
        return Response.json(
          { error: error.message || "Failed to transcribe audio" },
          { status: 500 }
        );
      }
    }

    // Serve static assets - ASSETS binding handles MIME types automatically
    // But we ensure JS files have the correct type for ES modules
    const response = await env.ASSETS.fetch(request);
    
    if (!response.ok) {
      return response;
    }
    
    const pathname = url.pathname;
    
    // Ensure proper MIME types
    const headers = new Headers(response.headers);
    
    // Set MIME type for JavaScript modules
    if (pathname.endsWith('.js')) {
      headers.set('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Ensure PNG images have correct MIME type
    else if (pathname.endsWith('.png')) {
      headers.set('Content-Type', 'image/png');
    }
    // Ensure other image types have correct MIME types
    else if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg')) {
      headers.set('Content-Type', 'image/jpeg');
    }
    else if (pathname.endsWith('.gif')) {
      headers.set('Content-Type', 'image/gif');
    }
    else if (pathname.endsWith('.webp')) {
      headers.set('Content-Type', 'image/webp');
    }
    else if (pathname.endsWith('.svg')) {
      headers.set('Content-Type', 'image/svg+xml');
    }
    // Ensure video files have correct MIME type
    else if (pathname.endsWith('.mp4')) {
      headers.set('Content-Type', 'video/mp4');
    }
    
    // Set cache headers for images and static assets
    if (pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2|ttf|eot)$/)) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
    
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
  },
};

export { ChatStateDO };
