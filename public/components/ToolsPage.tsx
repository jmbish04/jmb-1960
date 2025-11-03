import React from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Box,
  Stack,
  Grid,
  Card,
  Group,
  Badge,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import {
  IconSearch,
  IconFileText,
  IconMicrophone,
  IconExternalLink,
  IconSparkles,
  IconEdit,
  IconTool,
  IconBulb,
} from "@tabler/icons-react";

interface ToolsPageProps {
  onNavigate: (page: string | null) => void;
}

interface Tool {
  id: string;
  title: string;
  description: string;
  image?: string;
  badge?: string;
  comingSoon?: boolean;
  action: () => void;
  icon: React.ReactNode;
}

export default function ToolsPage({ onNavigate }: ToolsPageProps) {
  const toolsByStage: { stage: string; icon: React.ReactNode; tools: Tool[] }[] = [
    {
      stage: "Search for a Job",
      icon: <IconSearch size={24} />,
      tools: [
        {
          id: "career-dreamer",
          title: "Career Dreamer",
          description:
            "Explore career possibilities using AI. Discover new paths that align with your unique background and skills. Get personalized insights and career recommendations.",
          badge: "Aspirational",
          action: () => {
            window.open("https://grow.google/career-dreamer/home/", "_blank");
          },
          icon: <IconSparkles size={32} />,
        },
        {
          id: "job-feed",
          title: "Job Feed",
          description:
            "Curated job listings tailored to your profile and interests. Coming soon - we're building a smart job feed that learns from your preferences.",
          badge: "Coming Soon",
          comingSoon: true,
          action: () => {},
          icon: <IconSearch size={32} />,
        },
      ],
    },
    {
      stage: "Apply for a Job",
      icon: <IconFileText size={24} />,
      tools: [
        {
          id: "ai-resume",
          title: "AI Resume & Cover Letter Generator",
          description:
            "Ask your AI recruiter to help craft a customized resume and cover letter tailored to specific job postings. Get professional, ATS-optimized documents that highlight your experience.",
          action: () => onNavigate("resume"),
          icon: <IconSparkles size={32} />,
        },
        {
          id: "proofread",
          title: "AI Proofreading & Suggestions",
          description:
            "Get AI-powered proofreading for your resume. Receive suggestions and comments to improve clarity, impact, and effectiveness. Perfect your documents before sending.",
          action: () => onNavigate("chat"),
          icon: <IconEdit size={32} />,
        },
      ],
    },
    {
      stage: "Prepare for an Interview",
      icon: <IconMicrophone size={24} />,
      tools: [
        {
          id: "interview-tips",
          title: "Interview Tips",
          description:
            "Expert guidance for before, during, and after interviews. Learn how to answer behavioral, technical, and background questions. Master the STAR method and ace your next interview.",
          action: () => onNavigate("interview-tips"),
          icon: <IconBulb size={32} />,
        },
        {
          id: "interview-warmup",
          title: "Google Interview Warmup",
          description:
            "Practice answering interview questions with real-time transcription and AI-powered insights. Get feedback on your talking points, job-related terms, and speaking patterns. Build confidence in a judgment-free zone.",
          action: () => onNavigate("interview-prep"),
          icon: <IconMicrophone size={32} />,
        },
      ],
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Box ta="center" py="xl">
          <ThemeIcon size={80} radius="md" variant="light" color="blue" mx="auto" mb="md">
            <IconTool size={40} />
          </ThemeIcon>
          <Title order={1} size="3rem" c="blue" mb="sm" fw={700}>
            Career Tools
          </Title>
          <Text size="xl" c="dimmed" fw={500}>
            Everything you need for your job search journey
          </Text>
        </Box>

        {toolsByStage.map((stage, stageIdx) => (
          <Paper key={stage.stage} p="xl" radius="md" withBorder shadow="sm">
            <Group gap="md" mb="xl">
              <ThemeIcon size={40} radius="md" variant="light" color="blue">
                {stage.icon}
              </ThemeIcon>
              <Title order={2} size="h1" c="blue">
                {stage.stage}
              </Title>
            </Group>

            <Grid>
              {stage.tools.map((tool) => (
                <Grid.Col key={tool.id} span={{ base: 12, md: 6 }}>
                  <Card
                    p="lg"
                    radius="md"
                    withBorder
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      cursor: tool.comingSoon ? "not-allowed" : "pointer",
                      opacity: tool.comingSoon ? 0.7 : 1,
                    }}
                    onClick={tool.comingSoon ? undefined : tool.action}
                  >
                    <Stack gap="md" style={{ flex: 1 }}>
                      <Group justify="space-between">
                        <ThemeIcon size={48} radius="md" variant="light" color="blue">
                          {tool.icon}
                        </ThemeIcon>
                        {tool.badge && (
                          <Badge
                            size="lg"
                            variant={tool.comingSoon ? "outline" : "light"}
                            color={tool.comingSoon ? "gray" : "blue"}
                          >
                            {tool.badge}
                          </Badge>
                        )}
                      </Group>

                      <Box style={{ flex: 1 }}>
                        <Title order={3} size="h3" mb="xs" c="blue">
                          {tool.title}
                        </Title>
                        <Text size="sm" c="dimmed" lh={1.6}>
                          {tool.description}
                        </Text>
                      </Box>

                      {tool.image && (
                        <Box
                          style={{
                            width: "100%",
                            height: "200px",
                            borderRadius: "var(--mantine-radius-sm)",
                            backgroundColor: "var(--mantine-color-gray-1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text size="xs" c="dimmed">
                            Preview Image
                          </Text>
                        </Box>
                      )}

                      <Button
                        fullWidth
                        variant={tool.comingSoon ? "outline" : "filled"}
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!tool.comingSoon) {
                            tool.action();
                          }
                        }}
                        disabled={tool.comingSoon}
                        rightSection={tool.comingSoon ? null : <IconExternalLink size={16} />}
                      >
                        {tool.comingSoon ? "Coming Soon" : "Open Tool"}
                      </Button>
                    </Stack>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
}

