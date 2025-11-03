import type { Env } from "../types";
import { getUserProfile, getMessages, getUnansweredQuestions, getResumeData } from "./db";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GPT_OSS_MODEL = "@cf/openai/gpt-oss-120b";

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
 * ChatHandler - Handles all AI chat operations
 * Separated from state management for better organization
 */
export class ChatHandler {
  constructor(private env: Env) {}

  /**
   * Process a user message and generate AI response with streaming support
   */
  async processMessage(
    threadId: string,
    userMessage: string,
    chatStateId: ReturnType<Env["CHAT_STATE"]["idFromName"]>,
    onChunk?: (chunk: string) => void
  ): Promise<{
    content: string;
    toolCalls?: any[];
  }> {
    const messages = await getMessages(this.env, threadId);
    const profile = await getUserProfile(this.env);
    const resumeData = await getResumeData(this.env);
    const unansweredQuestions = await getUnansweredQuestions(this.env, threadId);
    const askedQuestionIds = new Set(unansweredQuestions.map(q => q.id));

    // Get chat state from Durable Object
    // @ts-ignore - Type instantiation depth issue with DurableObject types
    const chatState = this.env.CHAT_STATE.get(chatStateId);
    const stateResponse = await chatState.fetch(new Request("https://dummy/state"));
    const state = await stateResponse.json() as { answeredQuestions?: string[] };

    const messageHistory = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content,
    }));

    const systemPrompt = `${JOE_BISHOP_CONTEXT}

${profile?.linkedin_data ? `LinkedIn Profile Context: ${JSON.stringify(profile.linkedin_data)}` : ""}

Current Resume Data Available:
- Contact Info: ${JSON.stringify(resumeData.contactInfo)}
- Summary: ${resumeData.summary || "Not set"}
- Experiences (${resumeData.experiences.length}): ${resumeData.experiences.map(e => `${e.title} at ${e.organization}`).join(", ")}
- Education (${resumeData.education.length}): ${resumeData.education.map(e => `${e.level} - ${e.fieldOfStudy}`).join(", ")}
- Skills (${resumeData.skills.length}): ${resumeData.skills.join(", ")}

Resume Customization Tools Available:
You have access to read, update, and insert resume data. When helping customize the resume:
1. Analyze the job requirements against current resume data
2. Suggest specific changes (which experiences to emphasize, skills to add/remove, summary updates)
3. Guide the user to make changes or explain what should be modified
4. You can reference experiences, skills, and education by their organization/title/name

Previous Questions Asked (DO NOT repeat these): ${Array.from(askedQuestionIds).join(", ")}
Previous Answers: ${state.answeredQuestions ? state.answeredQuestions.join(", ") : "None"}

Instructions:
- Be direct and honest about job fit scores (0-100)
- Analyze job postings against resume data and provide specific customization recommendations
- Ask follow-up questions only if they would meaningfully improve the fit score
- Use multiple choice format when possible
- Never repeat questions already answered
- Remember context from previous messages
- When customizing resumes, be specific about what to change and why`;

    messageHistory.unshift({ role: "system", content: systemPrompt });
    messageHistory.push({ role: "user", content: userMessage });

    try {
      // Try primary model: gpt-oss-120b uses Responses API with 'input' parameter
      // Convert messages array to a prompt string format
      const inputPrompt = this.convertMessagesToPrompt(messageHistory);
      
      const response = await this.env.AI.run(GPT_OSS_MODEL, {
        input: inputPrompt,
        stream: !!onChunk,
      });

      if (onChunk && response instanceof ReadableStream) {
        return this.handleStreamResponse(response, onChunk);
      }

      if (onChunk) {
        // Fallback: non-streaming but we need streaming
        // gpt-oss-120b Responses API returns response in different format
        const text = this.extractResponseText(response);
        
        // Simulate streaming by chunking the response
        const chunks = text.match(/.{1,50}/g) || [text];
        for (const chunk of chunks) {
          await new Promise(resolve => setTimeout(resolve, 10));
          onChunk(chunk);
        }
        
        return { content: text };
      }

      // Non-streaming response
      const text = this.extractResponseText(response);
      return { content: text };
    } catch (error: any) {
      console.error("Primary AI model (gpt-oss-120b) error:", error);
      
      // Try Gemini as fallback if API key is available
      if (this.env.GEMINI_API_KEY) {
        console.log("Falling back to Gemini model...");
        try {
          return await this.tryGeminiModel(messageHistory, onChunk);
        } catch (geminiError: any) {
          console.error("Gemini fallback also failed:", geminiError);
          throw new Error(
            `Primary model error: ${error.message || error.toString()}. ` +
            `Gemini fallback also failed: ${geminiError?.message || geminiError?.toString() || "Unknown error"}`
          );
        }
      }
      
      // If no Gemini API key, try Responses API format fallback
      if (error.message?.includes("input") || error.message?.includes("requests")) {
        console.log("Trying Responses API format with prompt string...");
        try {
          const prompt = this.convertMessagesToPrompt(messageHistory);
          const response = await this.env.AI.run(GPT_OSS_MODEL, {
            input: prompt,
            stream: !!onChunk,
          });
          
          if (onChunk && response instanceof ReadableStream) {
            return this.handleStreamResponse(response, onChunk);
          }
          
          const text = this.extractResponseText(response);
          if (onChunk) {
            // Simulate streaming
            const chunks = text.match(/.{1,50}/g) || [text];
            for (const chunk of chunks) {
              await new Promise(resolve => setTimeout(resolve, 10));
              onChunk(chunk);
            }
          }
          
          return { content: text };
        } catch (fallbackError: any) {
          console.error("Fallback also failed:", fallbackError);
          throw new Error(`AI model error: ${error.message || error.toString()}. Fallback also failed: ${fallbackError?.message || fallbackError?.toString() || "Unknown error"}`);
        }
      }
      
      throw error;
    }
  }

  /**
   * Try Gemini model as fallback using Vercel AI SDK
   */
  private async tryGeminiModel(
    messageHistory: Array<{ role: string; content: string }>,
    onChunk?: (chunk: string) => void
  ): Promise<{ content: string; toolCalls?: any[] }> {
    if (!this.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    // Create Gemini model using Google Generative AI SDK directly
    // Since @ai-sdk/google expects process.env, we use GoogleGenerativeAI directly
    const genAI = new GoogleGenerativeAI(this.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Convert message history to Gemini format
    // Gemini expects a chat history format with parts
    const systemMessage = messageHistory.find(m => m.role === "system");
    const conversationHistory = messageHistory.filter(m => m.role !== "system").map(msg => {
      if (msg.role === "user") {
        return { role: "user", parts: [{ text: msg.content }] };
      } else {
        return { role: "model", parts: [{ text: msg.content }] };
      }
    });

    // Build chat history for Gemini
    const chat = model.startChat({
      history: conversationHistory.slice(0, -1), // All except the last message
      systemInstruction: systemMessage ? systemMessage.content : undefined,
    });

    const lastUserMessage = conversationHistory[conversationHistory.length - 1];

    if (onChunk) {
      // Streaming response
      const result = await chat.sendMessageStream(lastUserMessage.parts);
      let fullContent = "";
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        if (chunkText) {
          fullContent += chunkText;
          onChunk(chunkText);
        }
      }

      return { content: fullContent };
    } else {
      // Non-streaming response
      const result = await chat.sendMessage(lastUserMessage.parts);
      const response = await result.response;
      const fullContent = response.text();
      return { content: fullContent };
    }
  }

  /**
   * Convert messages to a single prompt string for fallback (if needed)
   * This is used only if the messages format doesn't work
   */
  private convertMessagesToPrompt(
    messages: Array<{ role: string; content: string }>
  ): string {
    return messages
      .map((msg) => {
        const role = msg.role === "system" ? "System" : msg.role === "assistant" ? "Assistant" : "User";
        return `${role}: ${msg.content}`;
      })
      .join("\n\n");
  }

  /**
   * Extract text from gpt-oss-120b response
   * Workers AI can return responses in different formats depending on the API used
   * - Chat Completions: response.response or response.choices[0].message.content
   * - Responses API: response.response or response.text
   */
  private extractResponseText(response: any): string {
    if (typeof response === "string") {
      return response;
    }
    
    // Chat Completions format: response.response (text) or response.choices[0].message.content
    if (response?.response && typeof response.response === "string") {
      return response.response;
    }
    
    if (response?.choices && Array.isArray(response.choices) && response.choices.length > 0) {
      const choice = response.choices[0];
      if (choice?.message?.content) {
        return choice.message.content;
      }
      if (choice?.text) {
        return choice.text;
      }
    }
    
    // Responses API or other formats
    if (response?.text) {
      return response.text;
    }
    
    if (response?.content) {
      return response.content;
    }
    
    if (response?.description) {
      return response.description;
    }
    
    // If response is an object, try to find text content
    if (typeof response === "object") {
      // Check if it's an array with response content
      if (Array.isArray(response) && response.length > 0) {
        return this.extractResponseText(response[0]);
      }
      
      // Try JSON stringify as last resort (but avoid if it's a complex object)
      try {
        const json = JSON.stringify(response);
        // Only return if it's a reasonable length (not a huge object dump)
        if (json.length < 1000) {
          return json;
        }
      } catch (e) {
        // Ignore
      }
    }
    
    console.error("Unable to extract text from response:", response);
    return "Sorry, I couldn't parse the response from the AI model.";
  }

  /**
   * Handle streaming response with proper chunk processing
   */
  private async handleStreamResponse(
    stream: ReadableStream,
    onChunk: (chunk: string) => void
  ): Promise<{ content: string }> {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let fullContent = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        if (chunk) {
          fullContent += chunk;
          onChunk(chunk);
        }
      }
    } finally {
      reader.releaseLock();
    }

    return { content: fullContent };
  }
}
