import type { Env, Thread, Message, Job, Question, Answer, Resume, CoverLetter, UserProfile } from "../types";

export async function createThread(env: Env, title?: string): Promise<Thread> {
  const id = crypto.randomUUID();
  const now = Date.now();
  
  await env.DB.prepare(
    "INSERT INTO threads (id, title, created_at, updated_at) VALUES (?, ?, ?, ?)"
  )
    .bind(id, title || null, now, now)
    .run();

  return { id, title, created_at: now, updated_at: now };
}

export async function getThread(env: Env, threadId: string): Promise<Thread | null> {
  const result = await env.DB.prepare(
    "SELECT * FROM threads WHERE id = ?"
  )
    .bind(threadId)
    .first<Thread>();

  return result || null;
}

export async function listThreads(env: Env): Promise<Thread[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM threads ORDER BY updated_at DESC"
  ).all<Thread>();

  return result.results || [];
}

export async function addMessage(
  env: Env,
  threadId: string,
  role: "user" | "assistant",
  content: string,
  metadata?: Record<string, any>
): Promise<Message> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO messages (id, thread_id, role, content, created_at, metadata) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(id, threadId, role, content, now, metadata ? JSON.stringify(metadata) : null)
    .run();

  await env.DB.prepare(
    "UPDATE threads SET updated_at = ? WHERE id = ?"
  )
    .bind(now, threadId)
    .run();

  return { id, thread_id: threadId, role, content, created_at: now, metadata };
}

export async function getMessages(env: Env, threadId: string): Promise<Message[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM messages WHERE thread_id = ? ORDER BY created_at ASC"
  )
    .bind(threadId)
    .all<Message>();

  return result.results || [];
}

export async function createJob(
  env: Env,
  url: string,
  metadata?: Record<string, any>
): Promise<Job> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO jobs (id, url, created_at, updated_at, metadata) VALUES (?, ?, ?, ?, ?)"
  )
    .bind(id, url, now, now, metadata ? JSON.stringify(metadata) : null)
    .run();

  return { id, url, created_at: now, updated_at: now, metadata };
}

export async function updateJob(
  env: Env,
  jobId: string,
  updates: Partial<Job>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];

  if (updates.company_name !== undefined) {
    fields.push("company_name = ?");
    values.push(updates.company_name);
  }
  if (updates.job_title !== undefined) {
    fields.push("job_title = ?");
    values.push(updates.job_title);
  }
  if (updates.job_description !== undefined) {
    fields.push("job_description = ?");
    values.push(updates.job_description);
  }
  if (updates.fit_score !== undefined) {
    fields.push("fit_score = ?");
    values.push(updates.fit_score);
  }
  if (updates.sentiment !== undefined) {
    fields.push("sentiment = ?");
    values.push(updates.sentiment);
  }
  if (updates.applied_at !== undefined) {
    fields.push("applied_at = ?");
    values.push(updates.applied_at);
  }
  if (updates.metadata !== undefined) {
    fields.push("metadata = ?");
    values.push(JSON.stringify(updates.metadata));
  }

  fields.push("updated_at = ?");
  values.push(Date.now());
  values.push(jobId);

  await env.DB.prepare(
    `UPDATE jobs SET ${fields.join(", ")} WHERE id = ?`
  )
    .bind(...values)
    .run();
}

export async function getJob(env: Env, jobId: string): Promise<Job | null> {
  const result = await env.DB.prepare(
    "SELECT * FROM jobs WHERE id = ?"
  )
    .bind(jobId)
    .first<Job>();

  return result || null;
}

export async function listJobs(env: Env): Promise<Job[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM jobs ORDER BY created_at DESC"
  ).all<Job>();

  return result.results || [];
}

export async function createQuestion(
  env: Env,
  question: string,
  threadId?: string,
  questionType?: "multiple_choice" | "text",
  options?: string[]
): Promise<Question> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO questions (id, thread_id, question, question_type, options, created_at) VALUES (?, ?, ?, ?, ?, ?)"
  )
    .bind(
      id,
      threadId || null,
      question,
      questionType || null,
      options ? JSON.stringify(options) : null,
      now
    )
    .run();

  return { id, thread_id: threadId, question, question_type: questionType, options, created_at: now };
}

export async function answerQuestion(
  env: Env,
  questionId: string,
  answer: string
): Promise<Answer> {
  const id = crypto.randomUUID();
  const now = Date.now();

  await env.DB.prepare(
    "INSERT INTO answers (id, question_id, answer, created_at) VALUES (?, ?, ?, ?)"
  )
    .bind(id, questionId, answer, now)
    .run();

  await env.DB.prepare(
    "UPDATE questions SET answered_at = ? WHERE id = ?"
  )
    .bind(now, questionId)
    .run();

  return { id, question_id: questionId, answer, created_at: now };
}

export async function getUnansweredQuestions(env: Env, threadId?: string): Promise<Question[]> {
  const query = threadId
    ? "SELECT * FROM questions WHERE thread_id = ? AND answered_at IS NULL ORDER BY created_at ASC"
    : "SELECT * FROM questions WHERE answered_at IS NULL ORDER BY created_at ASC";
  
  const bindings = threadId ? [threadId] : [];

  const result = await env.DB.prepare(query)
    .bind(...bindings)
    .all<Question>();

  return result.results || [];
}

export async function getUserProfile(env: Env): Promise<UserProfile | null> {
  const result = await env.DB.prepare(
    "SELECT * FROM user_profile WHERE id = 'joe_bishop'"
  ).first<UserProfile>();

  return result || null;
}

export async function updateUserProfile(env: Env, updates: Partial<UserProfile>): Promise<void> {
  const existing = await getUserProfile(env);
  const now = Date.now();

  if (existing) {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.linkedin_data !== undefined) {
      fields.push("linkedin_data = ?");
      values.push(JSON.stringify(updates.linkedin_data));
    }
    if (updates.resume_text !== undefined) {
      fields.push("resume_text = ?");
      values.push(updates.resume_text);
    }
    if (updates.preferences !== undefined) {
      fields.push("preferences = ?");
      values.push(JSON.stringify(updates.preferences));
    }

    fields.push("updated_at = ?");
    values.push(now);

    await env.DB.prepare(
      `UPDATE user_profile SET ${fields.join(", ")} WHERE id = 'joe_bishop'`
    )
      .bind(...values)
      .run();
  } else {
    await env.DB.prepare(
      "INSERT INTO user_profile (id, linkedin_data, resume_text, preferences, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(
        "joe_bishop",
        updates.linkedin_data ? JSON.stringify(updates.linkedin_data) : null,
        updates.resume_text || null,
        updates.preferences ? JSON.stringify(updates.preferences) : null,
        now,
        now
      )
      .run();
  }
}

// Resume Data CRUD Functions

export interface ResumeExperience {
  id: string;
  title: string;
  organization: string;
  tasks: string[];
  is_deleted: number;
  created_at: number;
  updated_at: number;
}

export interface ResumeEducation {
  id: string;
  level: string;
  field_of_study: string;
  location: string | null;
  is_deleted: number;
  created_at: number;
  updated_at: number;
}

export interface ResumeSkill {
  id: string;
  name: string;
  basis: string | null;
  rationale: string | null;
  manual: number;
  is_deleted: number;
  created_at: number;
  updated_at: number;
}

export async function getResumeExperiences(env: Env): Promise<ResumeExperience[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM resume_experiences WHERE is_deleted = 0 ORDER BY created_at DESC"
  ).all<ResumeExperience>();
  return result.results || [];
}

export async function createResumeExperience(
  env: Env,
  experience: { title: string; organization: string; tasks: string[] }
): Promise<ResumeExperience> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO resume_experiences (id, title, organization, tasks, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)"
  )
    .bind(id, experience.title, experience.organization, JSON.stringify(experience.tasks), now, now)
    .run();
  const result = await env.DB.prepare("SELECT * FROM resume_experiences WHERE id = ?")
    .bind(id)
    .first<ResumeExperience>();
  return result!;
}

export async function updateResumeExperience(
  env: Env,
  id: string,
  updates: Partial<{ title: string; organization: string; tasks: string[] }>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  if (updates.title !== undefined) {
    fields.push("title = ?");
    values.push(updates.title);
  }
  if (updates.organization !== undefined) {
    fields.push("organization = ?");
    values.push(updates.organization);
  }
  if (updates.tasks !== undefined) {
    fields.push("tasks = ?");
    values.push(JSON.stringify(updates.tasks));
  }
  fields.push("updated_at = ?");
  values.push(Date.now());
  values.push(id);
  await env.DB.prepare(`UPDATE resume_experiences SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function softDeleteResumeExperience(env: Env, id: string): Promise<void> {
  await env.DB.prepare("UPDATE resume_experiences SET is_deleted = 1, updated_at = ? WHERE id = ?")
    .bind(Date.now(), id)
    .run();
}

export async function getResumeEducation(env: Env): Promise<ResumeEducation[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM resume_education WHERE is_deleted = 0 ORDER BY created_at DESC"
  ).all<ResumeEducation>();
  return result.results || [];
}

export async function createResumeEducation(
  env: Env,
  education: { level: string; field_of_study: string; location?: string | null }
): Promise<ResumeEducation> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO resume_education (id, level, field_of_study, location, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)"
  )
    .bind(id, education.level, education.field_of_study, education.location || null, now, now)
    .run();
  const result = await env.DB.prepare("SELECT * FROM resume_education WHERE id = ?")
    .bind(id)
    .first<ResumeEducation>();
  return result!;
}

export async function updateResumeEducation(
  env: Env,
  id: string,
  updates: Partial<{ level: string; field_of_study: string; location: string | null }>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  if (updates.level !== undefined) {
    fields.push("level = ?");
    values.push(updates.level);
  }
  if (updates.field_of_study !== undefined) {
    fields.push("field_of_study = ?");
    values.push(updates.field_of_study);
  }
  if (updates.location !== undefined) {
    fields.push("location = ?");
    values.push(updates.location);
  }
  fields.push("updated_at = ?");
  values.push(Date.now());
  values.push(id);
  await env.DB.prepare(`UPDATE resume_education SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function softDeleteResumeEducation(env: Env, id: string): Promise<void> {
  await env.DB.prepare("UPDATE resume_education SET is_deleted = 1, updated_at = ? WHERE id = ?")
    .bind(Date.now(), id)
    .run();
}

export async function getResumeSkills(env: Env): Promise<ResumeSkill[]> {
  const result = await env.DB.prepare(
    "SELECT * FROM resume_skills WHERE is_deleted = 0 ORDER BY name ASC"
  ).all<ResumeSkill>();
  return result.results || [];
}

export async function createResumeSkill(
  env: Env,
  skill: { name: string; basis?: string | null; rationale?: string | null; manual?: boolean }
): Promise<ResumeSkill> {
  const id = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT OR REPLACE INTO resume_skills (id, name, basis, rationale, manual, is_deleted, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 0, ?, ?)"
  )
    .bind(
      id,
      skill.name,
      skill.basis || null,
      skill.rationale || null,
      skill.manual ? 1 : 0,
      now,
      now
    )
    .run();
  const result = await env.DB.prepare("SELECT * FROM resume_skills WHERE id = ? OR name = ?")
    .bind(id, skill.name)
    .first<ResumeSkill>();
  return result!;
}

export async function updateResumeSkill(
  env: Env,
  id: string,
  updates: Partial<{ name: string; basis: string | null; rationale: string | null }>
): Promise<void> {
  const fields: string[] = [];
  const values: any[] = [];
  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.basis !== undefined) {
    fields.push("basis = ?");
    values.push(updates.basis);
  }
  if (updates.rationale !== undefined) {
    fields.push("rationale = ?");
    values.push(updates.rationale);
  }
  fields.push("updated_at = ?");
  values.push(Date.now());
  values.push(id);
  await env.DB.prepare(`UPDATE resume_skills SET ${fields.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();
}

export async function softDeleteResumeSkill(env: Env, id: string): Promise<void> {
  await env.DB.prepare("UPDATE resume_skills SET is_deleted = 1, updated_at = ? WHERE id = ?")
    .bind(Date.now(), id)
    .run();
}

// Get all resume data for generating resume
export async function getResumeData(env: Env) {
  const profile = await getUserProfile(env);
  const experiences = await getResumeExperiences(env);
  const education = await getResumeEducation(env);
  const skills = await getResumeSkills(env);

  return {
    contactInfo: profile?.linkedin_data?.contactInfo || {
      name: "Joe M. Bishop",
      location: "Union KY 41091",
      phone: "859-801-2378",
      email: "jbishop2378@gmail.com",
      linkedin: "https://www.linkedin.com/in/joe-bishop-61712387/",
      linkedinShort: "linkedin.com/in/joe-bishop-61712387",
    },
    experiences: experiences.map((exp) => ({
      title: exp.title,
      organization: exp.organization,
      tasks: typeof exp.tasks === "string" ? JSON.parse(exp.tasks) : exp.tasks,
    })),
    education: education.map((edu) => ({
      level: edu.level,
      fieldOfStudy: edu.field_of_study,
      location: edu.location,
    })),
    skills: skills.map((skill) => skill.name),
    summary: profile?.resume_text || "",
  };
}
