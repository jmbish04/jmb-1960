import type { Env } from "../../types";
import {
  getResumeExperiences,
  createResumeExperience,
  updateResumeExperience,
  softDeleteResumeExperience,
  getResumeEducation,
  createResumeEducation,
  updateResumeEducation,
  softDeleteResumeEducation,
  getResumeSkills,
  createResumeSkill,
  updateResumeSkill,
  softDeleteResumeSkill,
  getResumeData,
} from "../../utils/db";

export async function handleResumeData(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace("/api/resume-data", "");

  // Get all resume data (for rendering)
  if (path === "" && request.method === "GET") {
    const data = await getResumeData(env);
    return Response.json(data);
  }

  // Experiences CRUD
  if (path === "/experiences") {
    if (request.method === "GET") {
      const experiences = await getResumeExperiences(env);
      return Response.json({ experiences });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const experience = await createResumeExperience(env, body);
      return Response.json({ experience });
    }
  }

  if (path.startsWith("/experiences/")) {
    const id = path.split("/")[2];
    if (request.method === "PUT") {
      const body = await request.json();
      await updateResumeExperience(env, id, body);
      return Response.json({ success: true });
    }
    if (request.method === "DELETE") {
      await softDeleteResumeExperience(env, id);
      return Response.json({ success: true });
    }
  }

  // Education CRUD
  if (path === "/education") {
    if (request.method === "GET") {
      const education = await getResumeEducation(env);
      return Response.json({ education });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const edu = await createResumeEducation(env, body);
      return Response.json({ education: edu });
    }
  }

  if (path.startsWith("/education/")) {
    const id = path.split("/")[2];
    if (request.method === "PUT") {
      const body = await request.json();
      await updateResumeEducation(env, id, body);
      return Response.json({ success: true });
    }
    if (request.method === "DELETE") {
      await softDeleteResumeEducation(env, id);
      return Response.json({ success: true });
    }
  }

  // Skills CRUD
  if (path === "/skills") {
    if (request.method === "GET") {
      const skills = await getResumeSkills(env);
      return Response.json({ skills });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const skill = await createResumeSkill(env, body);
      return Response.json({ skill });
    }
  }

  if (path.startsWith("/skills/")) {
    const id = path.split("/")[2];
    if (request.method === "PUT") {
      const body = await request.json();
      await updateResumeSkill(env, id, body);
      return Response.json({ success: true });
    }
    if (request.method === "DELETE") {
      await softDeleteResumeSkill(env, id);
      return Response.json({ success: true });
    }
  }

  return new Response("Not Found", { status: 404 });
}

