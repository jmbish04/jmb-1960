import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  TextInput,
  Button,
  Stack,
  Group,
  Text,
  Badge,
  Modal,
  Textarea,
  Progress,
  Card,
  ActionIcon,
  Tooltip,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconFileText, IconMail, IconTrash } from "@tabler/icons-react";

interface Job {
  id: string;
  url: string;
  company_name?: string;
  job_title?: string;
  fit_score?: number;
  sentiment?: string;
  applied_at?: number;
  created_at: number;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [jobUrl, setJobUrl] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Error loading jobs:", error);
    }
  }

  async function handleAddJob() {
    if (!jobUrl && !emailContent) {
      notifications.show({
        title: "Error",
        message: "Please provide either a job URL or email content",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: jobUrl,
          email_content: emailContent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add job");
      }

      notifications.show({
        title: "Job Added",
        message: data.message || "Job analyzed successfully",
        color: "green",
      });

      setModalOpened(false);
      setJobUrl("");
      setEmailContent("");
      await loadJobs();
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to add job",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateResume(jobId: string, type: "resume" | "cover_letter") {
    try {
      const res = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, type }),
      });

      const data = await res.json();

      if (res.ok) {
        window.open(data.pdf_url, "_blank");
        notifications.show({
          title: "Success",
          message: `${type === "resume" ? "Resume" : "Cover letter"} generated successfully`,
          color: "green",
        });
      } else {
        throw new Error(data.error || "Failed to generate");
      }
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to generate document",
        color: "red",
      });
    }
  }

  function getScoreColor(score?: number): string {
    if (!score) return "gray";
    if (score >= 80) return "green";
    if (score >= 60) return "yellow";
    return "red";
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2}>Job Applications</Title>
          <Button leftSection={<IconPlus size={16} />} onClick={() => setModalOpened(true)}>
            Add Job
          </Button>
        </Group>

        {jobs.length === 0 ? (
          <Paper p="xl" ta="center">
            <Text c="dimmed">No jobs added yet. Add a job posting to get started.</Text>
          </Paper>
        ) : (
          <Stack gap="md">
            {jobs.map((job) => (
              <Card key={job.id} p="md" withBorder shadow="sm">
                <Stack gap="sm">
                  <Group justify="space-between">
                    <div>
                      <Text fw={600} size="lg">
                        {job.job_title || "Untitled Position"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {job.company_name || "Unknown Company"}
                      </Text>
                    </div>
                    {job.fit_score !== undefined && (
                      <Badge color={getScoreColor(job.fit_score)} size="lg">
                        {job.fit_score}/100
                      </Badge>
                    )}
                  </Group>

                  {job.url && (
                    <Text size="xs" c="dimmed" component="a" href={job.url} target="_blank">
                      {job.url}
                    </Text>
                  )}

                  <Group>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconFileText size={14} />}
                      onClick={() => handleGenerateResume(job.id, "resume")}
                    >
                      Generate Resume
                    </Button>
                    <Button
                      size="xs"
                      variant="light"
                      leftSection={<IconFileText size={14} />}
                      onClick={() => handleGenerateResume(job.id, "cover_letter")}
                    >
                      Generate Cover Letter
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}

        <Modal
          opened={modalOpened}
          onClose={() => setModalOpened(false)}
          title="Add Job Posting"
          size="lg"
        >
          <Stack gap="md">
            <TextInput
              label="Job URL"
              placeholder="https://company.com/careers/job..."
              description="Note: Must be from company website, not LinkedIn"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
            <Text c="dimmed" size="sm" ta="center">OR</Text>
            <Textarea
              label="Email Content"
              placeholder="Paste recruiter email here..."
              description="Forward recruiter emails here for easier job analysis"
              rows={6}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
            <Button onClick={handleAddJob} loading={loading} fullWidth>
              Analyze Job
            </Button>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}
