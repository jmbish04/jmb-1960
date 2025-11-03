import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextInput,
  Button,
  Grid,
  Paper,
  Stack,
  Text,
  Group,
  Loader,
  Alert,
  Box,
  SegmentedControl,
} from "@mantine/core";
import { IconAlertCircle, IconExternalLink, IconSend, IconEdit } from "@tabler/icons-react";
import { useChat, Message } from "ai/react";
import { notifications } from "@mantine/notifications";
import CollaborativeEditor from "./CollaborativeEditor";

interface ResumeData {
  contactInfo: {
    name: string;
    location?: string;
    phone?: string;
    email?: string;
    linkedin?: string;
    linkedinShort?: string;
  };
  summary: string;
  experiences: Array<{
    title: string;
    organization: string;
    tasks: string[];
  }>;
  education: Array<{
    level: string;
    fieldOfStudy: string;
    location?: string;
  }>;
  skills: string[];
}

export default function ResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobURL, setJobURL] = useState("");
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeError, setScrapeError] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"view" | "collaborative">("view");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [aiError, setAiError] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    append,
    stop,
    error,
  } = useChat({
    api: `/api/chat/threads/${selectedThreadId || "new"}/stream`,
    body: {
      threadId: selectedThreadId || undefined,
    },
    onFinish: async (message: Message) => {
      setAiError(null);
      // Refresh resume when AI suggests changes
      if (message.content.toLowerCase().includes("resume updated") || 
          message.content.toLowerCase().includes("i've updated")) {
        await loadResume();
      }
    },
    onError: (error: Error) => {
      console.error("AI Error:", error);
      const errorMessage = error.message || error.toString() || "AI service is currently unavailable. Please try again later.";
      setAiError(errorMessage);
      notifications.show({
        title: "AI Error",
        message: errorMessage,
        color: "red",
      });
    },
    streamProtocol: "sse",
  });

  useEffect(() => {
    loadResume();
  }, []);

  async function loadResume() {
    try {
      setIsLoadingResume(true);
      const response = await fetch("/api/resume-data");
      const data = await response.json();
      setResumeData(data);
      
      // Render resume in iframe
      if (iframeRef.current && iframeRef.current.contentWindow) {
        renderResumeInIframe(data);
      }
    } catch (error) {
      console.error("Error loading resume:", error);
      notifications.show({
        title: "Error",
        message: "Failed to load resume data",
        color: "red",
      });
    } finally {
      setIsLoadingResume(false);
    }
  }

  function renderResumeInIframe(data: ResumeData) {
    if (!iframeRef.current?.contentWindow) return;

    const html = generateResumeHTML(data);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;
  }

  function generateResumeHTML(data: ResumeData): string {
    const contactLine1 = [
      data.contactInfo.location,
      data.contactInfo.phone,
      data.contactInfo.email ? `<a href="mailto:${data.contactInfo.email}">${data.contactInfo.email}</a>` : null,
    ]
      .filter(Boolean)
      .join(" | ");

    const contactLine2 = data.contactInfo.linkedin
      ? `<a href="${data.contactInfo.linkedin}" target="_blank">${data.contactInfo.linkedinShort || data.contactInfo.linkedin}</a>`
      : "";

    const experiencesHTML = data.experiences
      .map(
        (exp) => `
        <article>
          <h3>${exp.title} — <strong>${exp.organization}</strong></h3>
          <ul>
            ${exp.tasks.map((task) => `<li>${task}</li>`).join("")}
          </ul>
        </article>
      `
      )
      .join("");

    const educationHTML = data.education
      .map(
        (edu) => `
        <p>
          <strong>${edu.level}</strong><br />
          ${edu.fieldOfStudy}
        </p>
      `
      )
      .join("");

    const skillsHTML = data.skills.map((skill) => `<li>${skill}</li>`).join("");

    return `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Resume - ${data.contactInfo.name}</title>
    <style>
        :root {
            --text: #222;
            --muted: #555;
            --rule: #eee;
            --accent: #1a73e8;
            --bg: #fff;
        }
        
        html, body {
            margin: 0;
            padding: 0;
            background: #f4f4f5;
            font: 400 16px/1.65 system-ui, -apple-system, "Inter", Segoe UI, Roboto, Helvetica, Arial;
            color: var(--text);
        }
        .resume {
            max-width: 816px;
            min-height: 1056px;
            margin: 40px auto;
            padding: 40px 48px;
            background: var(--bg);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            border-radius: 8px;
        }
        .resume header {
            margin-bottom: 16px;
            text-align: center;
            border-bottom: 1px solid var(--rule);
            padding-bottom: 24px;
        }
        .resume h1 {
            margin: 0 0 6px;
            font-size: 40px;
            font-weight: 750;
            letter-spacing: 0.2px;
        }
        .resume header p {
            margin: 0;
            color: var(--muted);
            font-size: 15px;
            line-height: 1.7;
        }
        .resume a {
            color: var(--accent);
            text-decoration: none;
        }
        .resume a:hover {
            text-decoration: underline;
        }
        .resume h2 {
            margin: 28px 0 10px;
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.9px;
            color: var(--text);
            border-bottom: 2px solid var(--rule);
            padding-bottom: 8px;
        }
        .resume article {
            margin: 24px 0;
        }
        .resume h3 {
            margin: 0;
            font-size: 17px;
            font-weight: 650;
        }
        .resume article em {
            display: inline-block;
            margin: 4px 0 10px;
            color: var(--muted);
            font-style: normal;
            font-size: 15px;
        }
        #resume-summary-content {
            margin: 0;
            padding: 0;
            color: var(--text);
            line-height: 1.7;
        }
        #resume-education-container p {
            margin: 10px 0;
        }
        .resume ul {
            margin: 0;
            padding-left: 20px;
        }
        #resume-skills-list {
            column-count: 3;
            column-gap: 32px;
            padding-left: 20px;
        }
        .resume li {
            margin: 8px 0;
            line-height: 1.6;
            break-inside: avoid-column;
        }
        .resume strong {
            font-weight: 650;
        }
    </style>
</head>
<body>
    <main class="resume">
        <header>
            <h1>${data.contactInfo.name}</h1>
            <p>${contactLine1}</p>
            ${contactLine2 ? `<p>${contactLine2}</p>` : ""}
        </header>

        ${data.summary ? `
        <section>
            <h2>Professional Summary</h2>
            <p id="resume-summary-content">${data.summary}</p>
        </section>
        ` : ""}

        <section>
            <h2>Professional Experience</h2>
            ${experiencesHTML}
        </section>

        <section>
            <h2>Education</h2>
            <div id="resume-education-container">
                ${educationHTML}
            </div>
        </section>

        <section>
            <h2>Skills</h2>
            <ul id="resume-skills-list">
                ${skillsHTML}
            </ul>
        </section>
    </main>
</body>
</html>`;
  }

  async function handleScrapeJob() {
    if (!jobURL.trim()) {
      notifications.show({
        title: "Error",
        message: "Please enter a job URL",
        color: "red",
      });
      return;
    }

    try {
      setIsScraping(true);
      setScrapeError(null);

      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: jobURL }),
      });

      const result = await response.json();

      if (!result.success) {
        setScrapeError(
          result.error ||
            "Failed to scrape job URL. Please copy and paste the job description directly into the chat."
        );
        notifications.show({
          title: "Scraping Failed",
          message: result.error || "Please paste the job description into the chat",
          color: "orange",
        });
        return;
      }

      // Create a new thread for this job
      const threadResponse = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${result.data.company || "Job"} - ${result.data.title || "Position"}`,
        }),
      });

      const threadData = await threadResponse.json();
      setSelectedThreadId(threadData.thread?.id || null);

      // Send initial message to AI with job data
      const jobAnalysisPrompt = `I've found a job posting:

**Title:** ${result.data.title || "N/A"}
**Company:** ${result.data.company || "N/A"}
**Location:** ${result.data.location || "N/A"}
**Description:**
${result.data.description || "N/A"}

${result.data.requirements ? `**Requirements:**\n${result.data.requirements.map((r: string) => `- ${r}`).join("\n")}` : ""}

Please analyze this job against my resume data (which you have access to) and provide:
1. A fit score (0-100) with honest assessment
2. Specific recommendations for customizing my resume
3. Ask me targeted questions if you need more information to improve the fit score

Start by giving me the fit score and your initial recommendations.`;

      // Wait a moment for the thread to be properly set in state
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      // Use append to send the message with the job analysis
      append({
        role: "user",
        content: jobAnalysisPrompt,
      });
    } catch (error: any) {
      console.error("Error scraping job:", error);
      setScrapeError(error.message || "Failed to scrape job URL");
      notifications.show({
        title: "Error",
        message: error.message || "Failed to scrape job URL",
        color: "red",
      });
    } finally {
      setIsScraping(false);
    }
  }

  // Show collaborative editor if enabled
  if (editorMode === "collaborative") {
    return (
      <CollaborativeEditor
        documentType="resume"
        initialContent={resumeData ? generateResumeHTML(resumeData) : ""}
      />
    );
  }

  return (
    <Container size="xl" py="xl" h="calc(100vh - 120px)">
      <Stack gap="md" h="100%">
        {/* Mode Toggle */}
        <Paper p="md" withBorder>
          <Group justify="space-between">
            <Text fw={600} size="lg">
              Resume Customization
            </Text>
            <SegmentedControl
              value={editorMode}
              onChange={(value) => setEditorMode(value as "view" | "collaborative")}
              data={[
                { label: "Classic View", value: "view" },
                { label: "Collaborative Editor", value: "collaborative", leftSection: <IconEdit size={16} /> },
              ]}
            />
          </Group>
        </Paper>

        {/* URL Input Section */}
        <Paper p="md" withBorder>
          <Stack gap="sm">
            <Text fw={600} size="lg">
              Enter Job URL to Customize Resume
            </Text>
            <Text size="sm" c="dimmed">
              For best results, use a job URL from the company's website. LinkedIn URLs may be
              restricted from scraping.
            </Text>
            <Group gap="sm" wrap="nowrap">
              <TextInput
                placeholder="https://example.com/jobs/12345"
                value={jobURL}
                onChange={(e) => setJobURL(e.target.value)}
                style={{ flex: 1 }}
                disabled={isScraping}
              />
              <Button
                onClick={handleScrapeJob}
                loading={isScraping}
                leftSection={<IconExternalLink size={16} />}
              >
                Go
              </Button>
            </Group>
            {scrapeError && (
              <Alert icon={<IconAlertCircle size={16} />} title="Scraping Failed" color="orange">
                {scrapeError}
                <Text size="sm" mt="xs">
                  Please copy and paste the job description directly into the chat window below.
                </Text>
              </Alert>
            )}
          </Stack>
        </Paper>

        {/* Split View: Chat Left, Resume Right */}
        <Grid gutter="md" style={{ flex: 1, minHeight: 0 }}>
          {/* Left: Chat Interface */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              p="md"
              withBorder
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Stack gap="md" style={{ flex: 1, minHeight: 0 }}>
                <Text fw={600} size="lg">
                  AI Resume Assistant
                </Text>

                <Box style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
                  <Stack gap="sm">
                    {messages.length === 0 && (
                      <Paper p="md" bg="blue.0" radius="md">
                        <Text size="sm" c="dimmed">
                          Enter a job URL above or start chatting to customize your resume. I'll
                          help you tailor it for specific positions.
                        </Text>
                      </Paper>
                    )}

                    {messages.map((message) => (
                      <Paper
                        key={message.id}
                        p="sm"
                        withBorder
                        style={{
                          alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "85%",
                          backgroundColor:
                            message.role === "user" ? "var(--mantine-color-blue-0)" : undefined,
                        }}
                      >
                        <Text size="xs" c="dimmed" mb="xs">
                          {message.role === "user" ? "You" : "AI"}
                        </Text>
                        <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                          {message.content}
                        </Text>
                      </Paper>
                    ))}

                    {isLoading && (
                      <Paper p="sm" withBorder style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                        <Group gap="xs">
                          <Loader type="dots" color="blue" size="sm" />
                          <Text size="sm" c="dimmed">
                            AI is thinking...
                          </Text>
                        </Group>
                      </Paper>
                    )}
                    {(error || aiError) && (
                      <Alert color="red" title="AI Error" icon={<IconAlertCircle size={16} />}>
                        <Text size="sm">{error?.message || aiError || "Failed to connect to AI service"}</Text>
                      </Alert>
                    )}
                  </Stack>
                </Box>

                <form onSubmit={handleSubmit}>
                  <Group gap="xs" wrap="nowrap">
                    <TextInput
                      placeholder="Ask me to customize your resume..."
                      value={input}
                      onChange={handleInputChange}
                      style={{ flex: 1 }}
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      leftSection={<IconSend size={16} />}
                    >
                      Send
                    </Button>
                  </Group>
                </form>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Right: Resume Preview */}
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper
              p="md"
              withBorder
              style={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Stack gap="sm" style={{ flex: 1, minHeight: 0 }}>
                <Text fw={600} size="lg">
                  Resume Preview
                </Text>
                {isLoadingResume ? (
                  <Box style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Loader />
                  </Box>
                ) : (
                  <Box
                    style={{
                      flex: 1,
                      border: "1px solid var(--mantine-color-gray-3)",
                      borderRadius: "var(--mantine-radius-sm)",
                      overflow: "hidden",
                    }}
                  >
                    <iframe
                      ref={iframeRef}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                      }}
                      title="Resume Preview"
                      onLoad={() => {
                        if (resumeData && iframeRef.current) {
                          renderResumeInIframe(resumeData);
                        }
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

