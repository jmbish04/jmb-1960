-- Threads table for chat conversations
CREATE TABLE IF NOT EXISTS threads (
  id TEXT PRIMARY KEY,
  title TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT -- JSON string for additional data
);

-- Messages table for chat messages
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  thread_id TEXT NOT NULL,
  role TEXT NOT NULL, -- 'user' or 'assistant'
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  metadata TEXT, -- JSON string for additional data
  FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- Jobs table for tracking job applications
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  company_name TEXT,
  job_title TEXT,
  job_description TEXT,
  fit_score INTEGER, -- 0-100
  sentiment TEXT, -- 'positive', 'negative', 'neutral'
  applied_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  metadata TEXT -- JSON string for additional data
);

CREATE INDEX IF NOT EXISTS idx_jobs_applied_at ON jobs(applied_at);
CREATE INDEX IF NOT EXISTS idx_jobs_fit_score ON jobs(fit_score);

-- Questions table for tracking questions asked by AI
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  thread_id TEXT,
  question TEXT NOT NULL,
  question_type TEXT, -- 'multiple_choice', 'text', etc.
  options TEXT, -- JSON string for multiple choice options
  answered_at INTEGER,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_questions_thread_id ON questions(thread_id);
CREATE INDEX IF NOT EXISTS idx_questions_answered_at ON questions(answered_at);

-- Answers table for tracking user answers
CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY,
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_answers_question_id ON answers(question_id);

-- Resumes table for tracking resume versions
CREATE TABLE IF NOT EXISTS resumes (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  original_content TEXT,
  tailored_content TEXT,
  pdf_key TEXT, -- R2 key for PDF storage
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_resumes_job_id ON resumes(job_id);

-- Cover letters table
CREATE TABLE IF NOT EXISTS cover_letters (
  id TEXT PRIMARY KEY,
  job_id TEXT,
  content TEXT,
  pdf_key TEXT, -- R2 key for PDF storage
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_cover_letters_job_id ON cover_letters(job_id);

-- User profile data (Joe's LinkedIn info stored here)
CREATE TABLE IF NOT EXISTS user_profile (
  id TEXT PRIMARY KEY DEFAULT 'joe_bishop',
  linkedin_data TEXT, -- JSON string of LinkedIn profile
  resume_text TEXT,
  preferences TEXT, -- JSON string
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
