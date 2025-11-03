/// <reference types="@cloudflare/workers-types" />

/**
 * ChatStateDO is an Actor (Durable Object) that manages chat state for a user.
 * An Actor is stateful and has access to both compute and storage.
 * It stays active when being accessed and sleeps when not in use.
 * 
 * State is persisted to storage to survive evictions.
 * 
 * Implements optimized patterns from Cloudflare Agents SDK reference:
 * - Lifecycle hooks (onStart equivalent)
 * - Automatic state persistence
 * - Efficient state management
 */
export class ChatStateDO {
  // State structure - these will be loaded from storage on initialization
  private currentThreadId?: string;
  private context: Record<string, any> = {};
  private askedQuestions: Set<string> = new Set();
  private answeredQuestions: Set<string> = new Set();
  
  private initialized: boolean = false;
  private initPromise?: Promise<void>;
  
  private readonly STORAGE_KEYS = {
    CURRENT_THREAD_ID: "currentThreadId",
    CONTEXT: "context",
    ASKED_QUESTIONS: "askedQuestions",
    ANSWERED_QUESTIONS: "answeredQuestions",
  };

  constructor(
    private ctx: DurableObjectState,
    private env: Record<string, any>
  ) {
    // Initialize state from storage using blockConcurrencyWhile to ensure
    // state is loaded before any requests are processed
    // This is the equivalent of onStart lifecycle hook
    this.initPromise = this.ctx.blockConcurrencyWhile(async () => {
      await this.onStart();
    });
  }

  /**
   * Lifecycle hook: Called when Actor starts (equivalent to onStart in Agents SDK)
   * Initializes state from storage before any requests are handled
   */
  private async onStart(): Promise<void> {
    if (this.initialized) return;

    try {
      // Load persisted state from storage in parallel for efficiency
      const [currentThreadId, context, askedQuestionsArray, answeredQuestionsArray] = await Promise.all([
        this.ctx.storage.get<string>(this.STORAGE_KEYS.CURRENT_THREAD_ID),
        this.ctx.storage.get<Record<string, any>>(this.STORAGE_KEYS.CONTEXT),
        this.ctx.storage.get<string[]>(this.STORAGE_KEYS.ASKED_QUESTIONS),
        this.ctx.storage.get<string[]>(this.STORAGE_KEYS.ANSWERED_QUESTIONS),
      ]);

      // Restore state efficiently
      if (currentThreadId !== undefined) {
        this.currentThreadId = currentThreadId;
      }
      if (context) {
        this.context = { ...context };
      }
      if (askedQuestionsArray) {
        this.askedQuestions = new Set(askedQuestionsArray);
      }
      if (answeredQuestionsArray) {
        this.answeredQuestions = new Set(answeredQuestionsArray);
      }
    } catch (error) {
      // Continue with default state on error
      // Log in production for debugging
    }

    this.initialized = true;
  }

  /**
   * Wait for initialization to complete
   * Called before handling requests to ensure state is loaded
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized && this.initPromise) {
      await this.initPromise;
    }
    if (!this.initialized) {
      await this.onStart();
    }
  }

  /**
   * Persist state changes to storage efficiently
   * Uses batch put for better performance
   * This ensures state survives Actor evictions
   */
  private async persistState(): Promise<void> {
    try {
      // Batch all state updates in a single put operation
      await this.ctx.storage.put({
        [this.STORAGE_KEYS.CURRENT_THREAD_ID]: this.currentThreadId,
        [this.STORAGE_KEYS.CONTEXT]: this.context,
        [this.STORAGE_KEYS.ASKED_QUESTIONS]: Array.from(this.askedQuestions),
        [this.STORAGE_KEYS.ANSWERED_QUESTIONS]: Array.from(this.answeredQuestions),
      });
    } catch (error) {
      // Silently fail - state will be reloaded on next initialization
      // In production, consider retry logic here
    }
  }

  /**
   * Get current state (thread-safe)
   */
  getState() {
    return {
      currentThreadId: this.currentThreadId,
      context: { ...this.context },
      askedQuestions: Array.from(this.askedQuestions),
      answeredQuestions: Array.from(this.answeredQuestions),
    };
  }

  /**
   * Update state and persist (optimized)
   */
  private async setState(updates: {
    currentThreadId?: string;
    context?: Record<string, any>;
    askedQuestions?: Set<string>;
    answeredQuestions?: Set<string>;
  }): Promise<void> {
    if (updates.currentThreadId !== undefined) {
      this.currentThreadId = updates.currentThreadId;
    }
    if (updates.context) {
      this.context = { ...this.context, ...updates.context };
    }
    if (updates.askedQuestions) {
      this.askedQuestions = new Set(updates.askedQuestions);
    }
    if (updates.answeredQuestions) {
      this.answeredQuestions = new Set(updates.answeredQuestions);
    }
    
    await this.persistState();
  }

  async fetch(request: Request): Promise<Response> {
    // Ensure initialization is complete before handling requests
    await this.ensureInitialized();

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/state") {
      if (request.method === "GET") {
        return Response.json(this.getState());
      } else if (request.method === "POST") {
        const data = await request.json().catch(() => ({})) as {
          currentThreadId?: string;
          context?: Record<string, any>;
        };
        await this.setState({
          currentThreadId: data.currentThreadId,
          context: data.context,
        });
        return Response.json({ success: true });
      }
    }

    if (path === "/questions") {
      if (request.method === "POST") {
        const body = await request.json().catch(() => ({})) as { questionId?: string };
        if (body.questionId) {
          this.askedQuestions.add(body.questionId);
          await this.persistState();
        }
        return Response.json({ success: true });
      } else if (request.method === "GET") {
        return Response.json({
          asked: Array.from(this.askedQuestions),
          answered: Array.from(this.answeredQuestions),
        });
      }
    }

    if (path === "/answers") {
      if (request.method === "POST") {
        const body = await request.json().catch(() => ({})) as { questionId?: string };
        if (body.questionId) {
          this.answeredQuestions.add(body.questionId);
          this.askedQuestions.delete(body.questionId);
          await this.persistState();
        }
        return Response.json({ success: true });
      }
    }

    if (path === "/context") {
      if (request.method === "GET") {
        return Response.json(this.context);
      } else if (request.method === "POST") {
        const updates = await request.json().catch(() => ({}));
        if (updates) {
          await this.setState({ context: updates });
        }
        return Response.json({ success: true });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}
