/**
 * Utility functions for creating streaming responses
 */

/**
 * Create a streaming response with proper headers
 */
export function createStreamResponse(readable: ReadableStream): Response {
  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no", // Disable buffering for nginx proxies
    },
  });
}

/**
 * Create a text encoder for streaming
 */
export function createEncoder(): TextEncoder {
  return new TextEncoder();
}

/**
 * Create a message object with timestamp and ID
 */
export function createMessage(
  role: "user" | "assistant",
  content: string,
  metadata?: Record<string, any>
): {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  metadata?: Record<string, any>;
} {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    ...(metadata && { metadata }),
  };
}
