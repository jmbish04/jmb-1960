import type { Env } from "../../types";
import puppeteer from "@cloudflare/puppeteer";

interface JobData {
  title?: string;
  company?: string;
  description?: string;
  requirements?: string[];
  location?: string;
  salary?: string;
  url: string;
}

export async function scrapeJobURL(env: Env, jobURL: string): Promise<JobData> {
  try {
    const browser = await puppeteer.launch(env.BROWSER);
    const page = await browser.newPage();

    // Navigate to the job URL
    await page.goto(jobURL, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Extract text content
    const pageText = await page.evaluate(() => {
      // Try to find common job posting selectors
      const selectors = [
        "h1",
        "h2",
        ".job-title",
        ".job-description",
        "[class*='job']",
        "[id*='job']",
        "main",
        "article",
      ];

      let text = "";
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach((el) => {
            text += el.textContent + "\n\n";
          });
          break;
        }
      }

      // Fallback to body if nothing found
      if (!text) {
        text = document.body.textContent || "";
      }

      return text.substring(0, 50000); // Limit text size
    });

    await browser.close();

    // Use AI to extract structured job data
    const response = await env.AI.run("@cf/openai/gpt-oss-120b", {
      messages: [
        {
          role: "system",
          content:
            "You are a job posting parser. Extract structured information from job postings. Return valid JSON only.",
        },
        {
          role: "user",
          content: `Extract the following information from this job posting:

${pageText.substring(0, 10000)}

Return a JSON object with these fields:
- title (string): Job title
- company (string): Company name
- description (string): Full job description
- requirements (array of strings): Key requirements/qualifications
- location (string): Job location
- salary (string): Salary/compensation info if mentioned

Return ONLY valid JSON, no markdown formatting.`,
        },
      ],
      max_tokens: 2000,
    });

    let jobData: JobData = { url: jobURL };

    if (response.response) {
      try {
        // Try to parse AI response (might be in markdown code blocks)
        const responseText = response.response.trim();
        const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [
          null,
          responseText,
        ];
        jobData = JSON.parse(jsonMatch[1]);
        jobData.url = jobURL; // Ensure URL is set
      } catch (e) {
        console.error("Failed to parse AI response:", e);
        // Fallback: use full text as description
        jobData = {
          url: jobURL,
          description: pageText.substring(0, 5000),
        };
      }
    } else {
      // Fallback: use full text as description
      jobData = {
        url: jobURL,
        description: pageText.substring(0, 5000),
      };
    }

    return jobData;
  } catch (error: any) {
    console.error("Error scraping job URL:", error);
    throw new Error(
      `Failed to scrape job URL: ${error.message}. Please copy and paste the job description directly into the chat.`
    );
  }
}

export async function handleScrape(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return new Response("Missing or invalid URL", { status: 400 });
    }

    // Validate URL
    try {
      new URL(url);
    } catch {
      return new Response("Invalid URL format", { status: 400 });
    }

    const jobData = await scrapeJobURL(env, url);
    return Response.json({ success: true, data: jobData });
  } catch (error: any) {
    console.error("Scrape error:", error);
    return Response.json(
      {
        success: false,
        error: error.message || "Failed to scrape job URL",
      },
      { status: 500 }
    );
  }
}

