-- Resume data tables for storing experiences, education, skills
-- These tables store the base resume data that can be customized per job

-- Experiences table
CREATE TABLE IF NOT EXISTS resume_experiences (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  organization TEXT NOT NULL,
  tasks TEXT NOT NULL, -- JSON array of task strings
  is_deleted INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resume_experiences_deleted ON resume_experiences(is_deleted);
CREATE INDEX IF NOT EXISTS idx_resume_experiences_created_at ON resume_experiences(created_at);

-- Education table
CREATE TABLE IF NOT EXISTS resume_education (
  id TEXT PRIMARY KEY,
  level TEXT NOT NULL, -- e.g., "Bachelor's Degree", "Professional Certification"
  field_of_study TEXT NOT NULL,
  location TEXT,
  is_deleted INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resume_education_deleted ON resume_education(is_deleted);

-- Skills table
CREATE TABLE IF NOT EXISTS resume_skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  basis TEXT, -- Which organization/role this skill is based on
  rationale TEXT, -- Why this skill is relevant
  manual INTEGER DEFAULT 0, -- Whether this was manually added (1) or extracted (0)
  is_deleted INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resume_skills_deleted ON resume_skills(is_deleted);
CREATE INDEX IF NOT EXISTS idx_resume_skills_name ON resume_skills(name);

-- Contact info stored in user_profile table (already exists)
-- But we'll add contact info fields if not present
-- Note: Contact info is already in user_profile table

