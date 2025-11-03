export interface Env {
  ASSETS: Fetcher;
  AI: Ai;
  BROWSER: Fetcher;
  DB: D1Database;
  JOBS_KV: KVNamespace;
  RESUMES_R2: R2Bucket;
  CHAT_STATE: DurableObjectNamespace<ChatStateDO>;
  DEFAULT_MODEL?: string;
  GEMINI_API_KEY?: string;
}

export interface Thread {
  id: string;
  title?: string;
  created_at: number;
  updated_at: number;
  metadata?: Record<string, any>;
}

export interface Message {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
  metadata?: Record<string, any>;
}

export interface Job {
  id: string;
  url: string;
  company_name?: string;
  job_title?: string;
  job_description?: string;
  fit_score?: number;
  sentiment?: 'positive' | 'negative' | 'neutral';
  applied_at?: number;
  created_at: number;
  updated_at: number;
  metadata?: Record<string, any>;
}

export interface Question {
  id: string;
  thread_id?: string;
  question: string;
  question_type?: 'multiple_choice' | 'text';
  options?: string[];
  answered_at?: number;
  created_at: number;
}

export interface Answer {
  id: string;
  question_id: string;
  answer: string;
  created_at: number;
}

export interface Resume {
  id: string;
  job_id?: string;
  original_content?: string;
  tailored_content?: string;
  pdf_key?: string;
  created_at: number;
  updated_at: number;
}

export interface CoverLetter {
  id: string;
  job_id?: string;
  content: string;
  pdf_key?: string;
  created_at: number;
  updated_at: number;
}

export interface UserProfile {
  id: string;
  linkedin_data?: Record<string, any>;
  resume_text?: string;
  preferences?: Record<string, any>;
  created_at: number;
  updated_at: number;
}
