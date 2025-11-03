import React, { useState } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Box,
  Stack,
  Card,
  Group,
  Badge,
  ThemeIcon,
  Divider,
  Accordion,
  Grid,
} from "@mantine/core";
import {
  IconMicrophone,
  IconExternalLink,
  IconQuestionMark,
  IconDeviceDesktop,
  IconShield,
  IconBulb,
  IconArrowLeft,
} from "@tabler/icons-react";

interface InterviewPrepPageProps {
  onNavigate: (page: string | null) => void;
}

export default function InterviewPrepPage({ onNavigate }: InterviewPrepPageProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Header with Back Button */}
        <Group mb="md">
          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => onNavigate("tools")}
          >
            Back to Tools
          </Button>
        </Group>

        {/* Hero Section */}
        <Paper
          p="xl"
          radius="md"
          style={{
            background: "linear-gradient(135deg, #4285f4 0%, #34a853 100%)",
            color: "white",
          }}
        >
          <Stack gap="lg" align="center" ta="center">
            <ThemeIcon size={80} radius="md" variant="light" color="white">
              <IconMicrophone size={40} />
            </ThemeIcon>
            <Title order={1} size="3rem" c="white" fw={700}>
              Google Interview Warmup
            </Title>
            <Text size="xl" c="white" opacity={0.95} maw={800}>
              Practice answering interview questions with real-time transcription and AI-powered
              insights. Build confidence in a judgment-free zone.
            </Text>
            <Button
              size="xl"
              variant="white"
              color="blue"
              component="a"
              href="https://www.skills.google/interview_warmup"
              target="_blank"
              rightSection={<IconExternalLink size={20} />}
            >
              Start Practicing Now
            </Button>
          </Stack>
        </Paper>

        {/* Video Canvas - How It Works */}
        <Paper p="xl" radius="md" withBorder shadow="lg">
          <Stack gap="lg">
            <Box ta="center">
              <Title order={2} size="2rem" c="blue" mb="sm">
                See How It Works
              </Title>
              <Text size="lg" c="dimmed" mb="lg">
                Watch these videos to understand why Interview Warmup is so helpful
              </Text>
            </Box>

            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="md">
                    <Title order={4} size="h4" c="blue">
                      Real-Time Practice
                    </Title>
                    <Box
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        backgroundColor: "#000",
                        borderRadius: "var(--mantine-radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text c="white" size="sm">
                        Video: Practice answering questions in real-time
                      </Text>
                    </Box>
                    <Text size="xs" c="dimmed" ta="center">
                      Speak naturally and watch your words appear as you talk
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="md">
                    <Title order={4} size="h4" c="blue">
                      AI Insights & Feedback
                    </Title>
                    <Box
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        backgroundColor: "#000",
                        borderRadius: "var(--mantine-radius-sm)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text c="white" size="sm">
                        Video: See insights about your answers
                      </Text>
                    </Box>
                    <Text size="xs" c="dimmed" ta="center">
                      Discover patterns, job terms, and talking points automatically
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* What It Does Section */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="lg">
            <Title order={2} size="h1" c="blue">
              What It Does
            </Title>
            <Text size="md" lh={1.8}>
              Interview Warmup is a tool that lets anyone practice answering interview questions to
              get more confident and comfortable with the interview process. Your answers are
              transcribed in real time so you can review what you said and discover patterns in your
              responses.
            </Text>

            <Grid mt="md">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs" align="center" ta="center">
                    <ThemeIcon size={50} radius="md" variant="light" color="blue">
                      <IconMicrophone size={24} />
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      Real-Time Transcription
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.5}>
                      Speak your answers and see them transcribed instantly. Review and edit as
                      needed.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs" align="center" ta="center">
                    <ThemeIcon size={50} radius="md" variant="light" color="blue">
                      <IconBulb size={24} />
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      AI-Powered Insights
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.5}>
                      Discover patterns in your answers. See talking points, job-related terms, and
                      word usage.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs" align="center" ta="center">
                    <ThemeIcon size={50} radius="md" variant="light" color="blue">
                      <IconShield size={24} />
                    </ThemeIcon>
                    <Text fw={600} size="sm">
                      Judgment-Free Zone
                    </Text>
                    <Text size="xs" c="dimmed" lh={1.5">
                      Practice as many times as you want. Your audio is never saved or shared.
                      Everything stays private.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* How It Works */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="lg">
            <Title order={2} size="h1" c="blue">
              How It Works
            </Title>

            <Stack gap="md">
              <Card p="md" withBorder radius="md" bg="blue.0">
                <Group gap="md" mb="xs">
                  <Badge size="lg" variant="filled" color="blue">
                    1
                  </Badge>
                  <Text fw={600}>Choose Your Job Category</Text>
                </Group>
                <Text size="sm" c="dark" pl="calc(2.5rem + var(--mantine-spacing-md))">
                  Select the kind of job you're interviewing for. Each category has questions
                  selected by industry experts.
                </Text>
              </Card>

              <Card p="md" withBorder radius="md" bg="blue.0">
                <Group gap="md" mb="xs">
                  <Badge size="lg" variant="filled" color="blue">
                    2
                  </Badge>
                  <Text fw={600}>Practice Answering Questions</Text>
                </Group>
                <Text size="sm" c="dark" pl="calc(2.5rem + var(--mantine-spacing-md))">
                  Click the lightbulb for help with sample answers and keywords, or click "Answer"
                  to start speaking. Your speech is transcribed in real time. You can also type
                  your answer.
                </Text>
              </Card>

              <Card p="md" withBorder radius="md" bg="blue.0">
                <Group gap="md" mb="xs">
                  <Badge size="lg" variant="filled" color="blue">
                    3
                  </Badge>
                  <Text fw={600}>Review & Get Insights</Text>
                </Group>
                <Text size="sm" c="dark" pl="calc(2.5rem + var(--mantine-spacing-md))">
                  After answering, review your transcript and see insights about job-related terms,
                  most-used words, and talking points you covered. Edit and redo answers as many
                  times as you want.
                </Text>
              </Card>
            </Stack>
          </Stack>
        </Paper>

        {/* Question Types */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="lg">
            <Title order={2} size="h1" c="blue">
              Types of Questions
            </Title>
            <Text size="md" lh={1.8} mb="md">
              Interview Warmup asks questions created by industry experts. There are three types:
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs">
                    <Badge variant="light" color="blue" size="lg">
                      Background
                    </Badge>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Cover your past training and experiences. Questions about your education, past
                      jobs, interests, and goals.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs">
                    <Badge variant="light" color="green" size="lg">
                      Situational
                    </Badge>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Cover how you've dealt with situations in the past and how you might deal with
                      situations in the future.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Stack gap="xs">
                    <Badge variant="light" color="orange" size="lg">
                      Technical
                    </Badge>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Cover knowledge and skills specific to your field. Test how you would use
                      technical knowledge to solve problems.
                    </Text>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Insights Section */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="lg">
            <Title order={2} size="h1" c="blue">
              AI-Powered Insights
            </Title>
            <Text size="md" lh={1.8} mb="md">
              Insights help you discover patterns in your answers. They don't "grade" your answer
              or tell you what's right or wrong. They include:
            </Text>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Title order={4} size="h4" mb="xs" c="blue">
                    Job-Related Terms
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.6}>
                    Highlights words you used that are relevant to your field. Click terms to see
                    definitions. Using these terms can help emphasize your role-related knowledge.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Title order={4} size="h4" mb="xs" c="blue">
                    Most-Used Words
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.6}>
                    Highlights words you've used three or more times. Tap any highlighted word to see
                    similar alternatives you could use instead.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="md" withBorder radius="md" h="100%">
                  <Title order={4} size="h4" mb="xs" c="blue">
                    Talking Points
                  </Title>
                  <Text size="sm" c="dimmed" lh={1.6}>
                    Uses machine learning to identify topics you covered, like your skills,
                    experience, and lessons learned. Click "See examples" to learn more.
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* FAQ Section */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="xl">
            <Box ta="center">
              <ThemeIcon size={60} radius="md" variant="light" color="blue" mx="auto" mb="md">
                <IconQuestionMark size={30} />
              </ThemeIcon>
              <Title order={2} size="2rem" c="blue" mb="sm">
                Frequently Asked Questions
              </Title>
            </Box>

            <Accordion value={expandedFaq} onChange={setExpandedFaq}>
              <Accordion.Item value="what-is">
                <Accordion.Control>
                  <Text fw={600}>What is Interview Warmup?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Interview Warmup is a tool that lets anyone practice answering interview
                    questions to get more confident and comfortable with the interview process. Your
                    answers are transcribed in real time so you can review what you said and discover
                    patterns in your responses.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="who-for">
                <Accordion.Control>
                  <Text fw={600}>Who is this for?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    We originally designed Interview Warmup to help Google Career Certificate learners
                    prepare for job interviews, but it's available for anyone to use. It's a
                    judgment-free zone for anyone who wants a little practice interviewing.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="how-use">
                <Accordion.Control>
                  <Text fw={600}>How do I use it?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    To get started, click "Start Practicing" and then choose the kind of job you're
                    interviewing for. You can choose to do a practice interview consisting of five
                    randomly-selected questions, or you can browse all the questions.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    After a question is read aloud, click on the "lightbulb" button to get help or
                    click "Answer" and begin speaking. Your speech will be transcribed in real time.
                    You can also click the keyboard button to type your answer.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Click "Done" when you're finished. Review your answer and insights that identify
                    patterns in what you said. You can redo or edit an answer as many times as you'd
                    like.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="devices">
                <Accordion.Control>
                  <Text fw={600}>What devices does this work on?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    You can practice with Interview Warmup on the latest versions of Chrome on OSX,
                    Windows, and Android, as well as the latest version of Safari on iOS devices.
                    If you are using Chrome on iOS or Firefox, your answer will not be transcribed
                    and you will have to type your answer.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="privacy">
                <Accordion.Control>
                  <Text fw={600}>Does Google have access to my answers?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    No. Your audio is never saved or shared with anyone. All of your Interview Warmup
                    data is private to you, and none of your responses are used to improve machine
                    learning models.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Machine learning is used to transcribe your spoken answers and detect insights,
                    but everything stays private to you.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="insights">
                <Accordion.Control>
                  <Text fw={600}>What are insights for?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    Insights help you discover patterns in your answers. They don't "grade" your
                    answer or tell you what part of your answer is right or wrong. Insights include
                    the job-related terms you use, your most-used words, and the talking points you
                    cover.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Depending on your answer, Interview Warmup might not detect any insights. That
                    doesn't mean there's anything wrong with your answer.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="save-edit">
                <Accordion.Control>
                  <Text fw={600}>How do I save or edit an answer?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    You can save an answer by copying it directly from the expanded answer view. You
                    can also save your full interview transcript at any time or at the end of the
                    interview.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    To edit an answer, click on the answer to reveal the transcript. Then, click the
                    edit button (pencil icon) located at the bottom left corner. From there, you can
                    type directly into the transcript box to make changes.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>

              <Accordion.Item value="hints">
                <Accordion.Control>
                  <Text fw={600}>What are hints and where do they come from?</Text>
                </Accordion.Control>
                <Accordion.Panel>
                  <Text size="sm" c="dimmed" lh={1.7} mb="md">
                    Hints are a collection of tools you may use to help you answer the question. You
                    can access these tools by clicking on the "lightbulb" button located next to
                    answer buttons on a question panel.
                  </Text>
                  <Text size="sm" c="dimmed" lh={1.7}>
                    Today, these include sample answers that were generated by Gemini AI and reviewed
                    by Google experts, as well as a list of terms related to the job category.
                  </Text>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Paper>

        {/* Final CTA */}
        <Paper p="xl" radius="md" style={{ backgroundColor: "var(--mantine-color-blue-0)" }}>
          <Stack gap="lg" align="center">
            <Title order={3} size="h2" ta="center" c="blue">
              Ready to Practice?
            </Title>
            <Button
              size="xl"
              component="a"
              href="https://www.skills.google/interview_warmup"
              target="_blank"
              rightSection={<IconExternalLink size={20} />}
              variant="filled"
              color="blue"
            >
              Start Interview Warmup
            </Button>
            <Text size="sm" c="dimmed" ta="center">
              Free to use. No account required. Your practice stays private.
            </Text>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}

