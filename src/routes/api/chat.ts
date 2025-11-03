import type { Env } from "../../types";
import { transcribeAudio } from "../../utils/ai";
import {
  createThread,
  getThread,
  addMessage,
  getMessages,
  listThreads,
} from "../../utils/db";
import { ChatHandler } from "../../utils/chat-handler";
import { createStreamResponse, createEncoder } from "../../utils/stream-utils";

interface CreateThreadBody {
  title?: string;
}

interface ChatStreamBody {
  message?: string;
  audio?: string;
  messages?: Array<{ role: string; content: string }>;
}

/**
 * Optimized chat routing with session-based pattern
 * Supports both legacy and new routing patterns
 */
export async function handleChat(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/chat", "");

  if (path === "/threads" && request.method === "GET") {
    const threads = await listThreads(env);
    return Response.json({ threads });
  }

  if (path === "/threads" && request.method === "POST") {
    const body = await request.json().catch(() => ({})) as CreateThreadBody;
    const thread = await createThread(env, body.title);
    return Response.json({ thread });
  }

  if (path.startsWith("/threads/") && path.endsWith("/messages")) {
    const threadId = path.split("/")[2];
    if (request.method === "GET") {
      const messages = await getMessages(env, threadId);
      return Response.json({ messages });
    }
  }

  if (path.startsWith("/threads/") && path.includes("/stream")) {
    let threadId = path.split("/")[2];
    
    if (threadId === "new" || !threadId) {
      const thread = await createThread(env);
      threadId = thread.id;
    }

    const body = await request.json().catch(() => ({})) as ChatStreamBody;
    const { message, audio, messages: clientMessages } = body;

    // Get message from body or from messages array (Vercel AI SDK format)
    let userMessage: string | undefined = message || clientMessages?.[clientMessages.length - 1]?.content;

    if (audio && !userMessage) {
      userMessage = await transcribeAudio(env, audio);
    }

    if (!userMessage) {
      return new Response("Missing message", { status: 400 });
    }

    // TypeScript now knows userMessage is string here due to the check above
    await addMessage(env, threadId, "user", userMessage as string);

    const chatStateId = env.CHAT_STATE.idFromName(`user-joe-${threadId}`);
    const chatHandler = new ChatHandler(env);

    // Stream in Vercel AI SDK SSE format
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        
        try {
          // Send initial data event
          controller.enqueue(encoder.encode("0:" + JSON.stringify({ content: "" }) + "\n"));
          
          await chatHandler.processMessage(
            threadId,
            userMessage as string, // TypeScript: guaranteed to be string after validation above
            chatStateId,
            (chunk: string) => {
              fullResponse += chunk;
              // Vercel AI SDK SSE format: "0:" prefix with JSON content
              const data = JSON.stringify({ content: chunk });
              controller.enqueue(encoder.encode(`0:${data}\n`));
            }
          );

          await addMessage(env, threadId, "assistant", fullResponse);
          
          // Send done event
          controller.enqueue(encoder.encode("d:[DONE]\n"));
          controller.close();
        } catch (error: any) {
          console.error("Stream error:", error);
          const errorMessage = 
            error.message || 
            error.toString() || 
            "Sorry, I encountered an error processing your request. Please try again.";
          
          // Send error in SSE format
          const errorData = JSON.stringify({ 
            content: `Error: ${errorMessage}`,
            error: true 
          });
          controller.enqueue(encoder.encode(`0:${errorData}\n`));
          
          // Save error message to DB
          try {
            await addMessage(env, threadId, "assistant", `Error: ${errorMessage}`);
          } catch (dbError) {
            console.error("Failed to save error message to DB:", dbError);
          }
          
          controller.enqueue(encoder.encode("d:[DONE]\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  return new Response("Not Found", { status: 404 });
}
