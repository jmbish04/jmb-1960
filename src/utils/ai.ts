import { Buffer } from "node:buffer";
import type { Env } from "../types";
import { getUserProfile, getMessages, getUnansweredQuestions } from "./db";

const GPT_OSS_MODEL = "@cf/openai/gpt-oss-120b";
const WHISPER_MODEL = "@cf/openai/whisper-large-v3-turbo";

const JOE_BISHOP_CONTEXT = `You are a professional recruiter expert helping Joe Bishop, a recently retired Purchasing Manager with 30+ years of experience. Joe worked at:
- Toyota Motor Corporation (Purchasing Manager, 2022-Present; Purchasing Specialist 1999-2022)
- Newell Rubbermaid (Purchasing Manager, 1995-1999)
- O'Sullivan Corporation (Purchasing Supervisor, 1992-1995)
- Atlantic Research Corporation (Senior Buyer, 1989-1992)

Joe has:
- Bachelor's Degree in Business Administration from Georgetown College
- Certified Purchasing Manager (C.P.M.) certification
- Skills: Procurement, Purchasing

Joe is looking for his next job opportunity. Be direct, honest, and brutal when necessary. No fluff - just straight talk. When evaluating job fits, give a clear score (0-100) and explain why. If you need more information to improve the score, ask targeted questions via multiple choice format when possible. Never repeat questions Joe has already answered.`;

/**
 * Transcribes audio using the Whisper-large-v3-turbo model.
 * Accepts either a base64 string or an ArrayBuffer.
 * For large files, automatically chunks them.
 * 
 * @param env - The Cloudflare Worker environment
 * @param audio - Audio data as base64 string or ArrayBuffer
 * @param options - Optional transcription parameters
 * @returns The transcribed text
 */
export async function transcribeAudio(
  env: Env,
  audio: string | ArrayBuffer,
  options?: {
    task?: "transcribe" | "translate";
    language?: string;
    vad_filter?: string;
    initial_prompt?: string;
    prefix?: string;
  }
): Promise<string> {
  let audioBase64: string;
  
  // Convert ArrayBuffer to base64 if needed
  if (audio instanceof ArrayBuffer) {
    audioBase64 = Buffer.from(audio, "binary").toString("base64");
  } else {
    // Assume it's already base64
    audioBase64 = audio;
  }
  
  // For large audio files, we might need to chunk, but for now handle directly
  // If the base64 string is very large (> 1MB), we'd need to chunk it
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  
  // Estimate decoded size (base64 is ~33% larger than binary)
  const estimatedSize = (audioBase64.length * 3) / 4;
  
  if (estimatedSize > CHUNK_SIZE && audio instanceof ArrayBuffer) {
    // Chunk large files
    return await transcribeAudioChunked(env, audio, options);
  }
  
  // Standard transcription for smaller files
  const response = await env.AI.run(WHISPER_MODEL, {
    audio: audioBase64,
    task: options?.task || "transcribe",
    language: options?.language || "en",
    ...(options?.vad_filter && { vad_filter: options.vad_filter }),
    ...(options?.initial_prompt && { initial_prompt: options.initial_prompt }),
    ...(options?.prefix && { prefix: options.prefix }),
  });
  
  return response.text || "";
}

/**
 * Transcribes large audio files by chunking them into smaller pieces.
 * 
 * @param env - The Cloudflare Worker environment
 * @param audioBuffer - Audio data as ArrayBuffer
 * @param options - Optional transcription parameters
 * @returns The full transcribed text
 */
async function transcribeAudioChunked(
  env: Env,
  audioBuffer: ArrayBuffer,
  options?: {
    task?: "transcribe" | "translate";
    language?: string;
    vad_filter?: string;
    initial_prompt?: string;
    prefix?: string;
  }
): Promise<string> {
  const CHUNK_SIZE = 1024 * 1024; // 1MB chunks
  const chunks: ArrayBuffer[] = [];
  
  // Split audio into chunks
  for (let i = 0; i < audioBuffer.byteLength; i += CHUNK_SIZE) {
    const chunk = audioBuffer.slice(i, i + CHUNK_SIZE);
    chunks.push(chunk);
  }
  
  let fullTranscript = "";
  
  // Process each chunk
  for (const chunk of chunks) {
    try {
      const base64 = Buffer.from(chunk, "binary").toString("base64");
      const response = await env.AI.run(WHISPER_MODEL, {
        audio: base64,
        task: options?.task || "transcribe",
        language: options?.language || "en",
        ...(options?.vad_filter && { vad_filter: options.vad_filter }),
        ...(options?.initial_prompt && { initial_prompt: options.initial_prompt }),
        ...(options?.prefix && { prefix: options.prefix }),
      });
      
      const transcript = response.text || "";
      fullTranscript += transcript + " ";
    } catch (error) {
      console.error("Error transcribing chunk:", error);
      fullTranscript += "[Error transcribing chunk] ";
    }
  }
  
  return fullTranscript.trim();
}

/**
 * @deprecated Use ChatHandler.processMessage() instead
 * This function is kept for backward compatibility
 */
export async function generateChatResponse(
  env: Env,
  threadId: string,
  userMessage: string,
  chatStateId: DurableObjectId
): Promise<ReadableStream> {
  const { ChatHandler } = await import("./chat-handler");
  const chatHandler = new ChatHandler(env);
  
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      await chatHandler.processMessage(
        threadId,
        userMessage,
        chatStateId,
        (chunk: string) => {
          writer.write(encoder.encode(chunk));
        }
      );
      writer.close();
    } catch (error) {
      writer.write(encoder.encode("Error processing message"));
      writer.close();
    }
  })();

  return readable;
}

export async function analyzeJobPosting(
  env: Env,
  jobUrl: string,
  jobDescription?: string
): Promise<{ fit_score: number; analysis: string; questions?: string[] }> {
  const profile = await getUserProfile(env);

  const prompt = `${JOE_BISHOP_CONTEXT}

Analyze this job posting and provide:
1. A fit score from 0-100 (be brutal and honest)
2. A brief analysis explaining the score
3. Up to 3 targeted questions (as JSON array) that would help improve the score if answered

Job URL: ${jobUrl}
${jobDescription ? `Job Description: ${jobDescription}` : ""}

${profile?.linkedin_data ? `Joe's Profile: ${JSON.stringify(profile.linkedin_data)}` : ""}

Return your response as JSON:
{
  "fit_score": <number 0-100>,
  "analysis": "<string>",
  "questions": ["<question 1>", "<question 2>", "<question 3>"]
}`;

  const response = await env.AI.run(GPT_OSS_MODEL, {
    messages: [{ role: "user", content: prompt }],
  });

  try {
    const content = typeof response === "string" ? response : response.response || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("No JSON found in response");
  } catch (e) {
    return {
      fit_score: 50,
      analysis: content || "Unable to analyze. Please review manually.",
      questions: [],
    };
  }
}

export async function generateResume(
  env: Env,
  jobId: string,
  jobDescription: string
): Promise<string> {
  const profile = await getUserProfile(env);

  const prompt = `${JOE_BISHOP_CONTEXT}

Generate a tailored resume for Joe based on this job posting. Use Joe's LinkedIn profile information and format it professionally.

Job Description:
${jobDescription}

${profile?.linkedin_data ? `Joe's Profile: ${JSON.stringify(profile.linkedin_data)}` : ""}
${profile?.resume_text ? `Current Resume: ${profile.resume_text}` : ""}

Generate a professional resume in HTML format optimized for PDF conversion. Include:
- Professional styling with clean typography
- Proper page margins and spacing
- Print-friendly colors (dark text on light background)
- Well-organized sections (Contact, Summary, Experience, Education, Skills)
- Use inline CSS within <style> tags
- Ensure all content fits on standard letter-size pages

Return ONLY valid HTML with embedded CSS styles.`;

  const response = await env.AI.run(GPT_OSS_MODEL, {
    messages: [{ role: "user", content: prompt }],
  });

  let html = typeof response === "string" ? response : response.response || "";
  
  // Ensure HTML is properly wrapped if needed
  if (!html.trim().startsWith("<!DOCTYPE")) {
    // Extract body content if HTML already has body tags
    let bodyContent = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      bodyContent = bodyMatch[1];
    }
    
    // Extract style tags if present
    let styleContent = "";
    const styleMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    if (styleMatch) {
      styleContent = styleMatch[1];
    }
    
    const defaultStyles = `
    @media print {
      body { margin: 0; }
    }
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      padding: 20px;
      max-width: 8.5in;
      margin: 0 auto;
    }`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${styleContent || defaultStyles}</style>
</head>
<body>
${bodyContent || html}
</body>
</html>`;
  }
  
  return html;
}

export async function generateCoverLetter(
  env: Env,
  jobId: string,
  jobDescription: string
): Promise<string> {
  const profile = await getUserProfile(env);
  const job = await env.DB.prepare("SELECT * FROM jobs WHERE id = ?").bind(jobId).first();

  const prompt = `${JOE_BISHOP_CONTEXT}

Generate a tailored cover letter for Joe based on this job posting.

Job Title: ${job?.job_title || "Position"}
Company: ${job?.company_name || "Company"}
Job Description:
${jobDescription}

${profile?.linkedin_data ? `Joe's Profile: ${JSON.stringify(profile.linkedin_data)}` : ""}

Generate a professional cover letter in HTML format optimized for PDF conversion. Include:
- Professional business letter format
- Proper date, recipient address, salutation, body, closing
- Clean typography with appropriate spacing
- Print-friendly styling (dark text on white background)
- Use inline CSS within <style> tags
- Ensure content fits on standard letter-size pages

Return ONLY valid HTML with embedded CSS styles.`;

  const response = await env.AI.run(GPT_OSS_MODEL, {
    messages: [{ role: "user", content: prompt }],
  });

  let html = typeof response === "string" ? response : response.response || "";
  
  // Ensure HTML is properly wrapped if needed
  if (!html.trim().startsWith("<!DOCTYPE")) {
    // Extract body content if HTML already has body tags
    let bodyContent = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      bodyContent = bodyMatch[1];
    }
    
    // Extract style tags if present
    let styleContent = "";
    const styleMatch = html.match(/<style[^>]*>([\s\S]*)<\/style>/i);
    if (styleMatch) {
      styleContent = styleMatch[1];
    }
    
    const defaultStyles = `
    @media print {
      body { margin: 0; }
    }
    body {
      font-family: Arial, sans-serif;
      color: #333;
      line-height: 1.8;
      padding: 20px;
      max-width: 8.5in;
      margin: 0 auto;
    }`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${styleContent || defaultStyles}</style>
</head>
<body>
${bodyContent || html}
</body>
</html>`;
  }
  
  return html;
}
