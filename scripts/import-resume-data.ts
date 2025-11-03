/**
 * Script to import resume.json data into D1 database
 * Run with: wrangler d1 execute DB --remote --file=./scripts/import-resume-data.ts
 * Or use: pnpm run import:resume
 */

import resumeData from "../public/resume_data/resume.json";

interface Experience {
  title: string;
  organization: string;
  tasks: string[];
}

interface Education {
  level: string;
  fieldOfStudy: string;
}

interface Skill {
  name: string;
  basis?: string;
  rationale?: string;
  manual?: boolean;
}

function generateId(): string {
  return crypto.randomUUID();
}

function getCurrentTimestamp(): number {
  return Date.now();
}

// This would be executed in a Worker context
export async function importResumeData(env: { DB: D1Database }) {
  const now = getCurrentTimestamp();

  // Import experiences
  if (resumeData.experiences && Array.isArray(resumeData.experiences)) {
    for (const exp of resumeData.experiences as Experience[]) {
      const id = generateId();
      await env.DB.prepare(
        `INSERT INTO resume_experiences (id, title, organization, tasks, is_deleted, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, ?, ?)`
      )
        .bind(
          id,
          exp.title,
          exp.organization,
          JSON.stringify(exp.tasks),
          now,
          now
        )
        .run();
      console.log(`Imported experience: ${exp.title} at ${exp.organization}`);
    }
  }

  // Import education
  if (resumeData.education && Array.isArray(resumeData.education)) {
    for (const edu of resumeData.education as Education[]) {
      const id = generateId();
      await env.DB.prepare(
        `INSERT INTO resume_education (id, level, field_of_study, location, is_deleted, created_at, updated_at)
         VALUES (?, ?, ?, ?, 0, ?, ?)`
      )
        .bind(
          id,
          edu.level,
          edu.fieldOfStudy,
          null,
          0,
          now,
          now
        )
        .run();
      console.log(`Imported education: ${edu.level} - ${edu.fieldOfStudy}`);
    }
  }

  // Import skills
  if (resumeData.skills && Array.isArray(resumeData.skills)) {
    for (const skill of resumeData.skills as Skill[]) {
      const id = generateId();
      await env.DB.prepare(
        `INSERT OR REPLACE INTO resume_skills (id, name, basis, rationale, manual, is_deleted, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?)`
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
      console.log(`Imported skill: ${skill.name}`);
    }
  }

  console.log("Resume data import complete!");
}

