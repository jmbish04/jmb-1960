import puppeteer from "@cloudflare/puppeteer";
import type { Env } from "../types";

export async function generatePDF(
  env: Env,
  html: string,
  filename?: string
): Promise<ArrayBuffer> {
  const browser = await puppeteer.launch(env.BROWSER);
  const page = await browser.newPage();

  // Set HTML content - for static HTML, we don't need waitUntil
  await page.setContent(html);

  // Generate PDF with options optimized for resume/cover letter formatting
  const pdf = await page.pdf({
    printBackground: true,
    format: "letter",
    margin: {
      top: "0.5in",
      bottom: "0.5in",
      left: "0.5in",
      right: "0.5in",
    },
  });

  // Close browser since we no longer need it
  await browser.close();

  return pdf;
}

export async function generatePDFFromURL(
  env: Env,
  url: string,
  options?: {
    waitUntil?: "load" | "networkidle0" | "networkidle2";
    format?: "letter" | "A4";
    margin?: { top?: string; bottom?: string; left?: string; right?: string };
  }
): Promise<ArrayBuffer> {
  const browser = await puppeteer.launch(env.BROWSER);
  const page = await browser.newPage();

  // Navigate to URL with wait options
  await page.goto(url, {
    waitUntil: options?.waitUntil || "networkidle0",
  });

  // Generate PDF
  const pdf = await page.pdf({
    printBackground: true,
    format: options?.format || "letter",
    margin: options?.margin || {
      top: "0.5in",
      bottom: "0.5in",
      left: "0.5in",
      right: "0.5in",
    },
  });

  // Close browser since we no longer need it
  await browser.close();

  return pdf;
}

export async function savePDFToR2(
  env: Env,
  pdfBuffer: ArrayBuffer,
  key: string
): Promise<void> {
  await env.RESUMES_R2.put(key, pdfBuffer, {
    httpMetadata: {
      contentType: "application/pdf",
    },
  });
}

export async function getPDFFromR2(
  env: Env,
  key: string
): Promise<ArrayBuffer | null> {
  const object = await env.RESUMES_R2.get(key);
  if (!object) return null;
  return await object.arrayBuffer();
}
