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
  Accordion,
  List,
  Divider,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconClock,
  IconMicrophone,
  IconCheck,
  IconBulb,
  IconTarget,
  IconBook,
  IconExternalLink,
} from "@tabler/icons-react";

interface InterviewTipsPageProps {
  onNavigate: (page: string | null) => void;
}

export default function InterviewTipsPage({ onNavigate }: InterviewTipsPageProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>("before");

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
            background: "linear-gradient(135deg, #ea4335 0%, #fbbc04 100%)",
            color: "white",
          }}
        >
          <Stack gap="lg" align="center" ta="center">
            <ThemeIcon size={80} radius="md" variant="light" color="white">
              <IconBulb size={40} />
            </ThemeIcon>
            <Title order={1} size="3rem" c="white" fw={700}>
              Interview Tips
            </Title>
            <Text size="xl" c="white" opacity={0.95} maw={800}>
              Tips for before, during, and after an interview. Master the art of interviewing with
              expert guidance from the Google Career Certificates Employer Consortium.
            </Text>
          </Stack>
        </Paper>

        {/* Main Tips Sections */}
        <Accordion value={expandedSection} onChange={setExpandedSection}>
          {/* Before the Interview */}
          <Accordion.Item value="before">
            <Accordion.Control>
              <Group gap="md">
                <ThemeIcon size={40} radius="md" variant="light" color="blue">
                  <IconClock size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg">
                  Before the Interview
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="lg">
                <Paper p="lg" bg="blue.0" radius="md" withBorder>
                  <Title order={3} size="h3" mb="md" c="blue">
                    Practice, Practice, Practice
                  </Title>
                  <Text size="sm" c="dark" mb="md" lh={1.7}>
                    It's one of the best ways to get more confident and comfortable interviewing. A
                    few tips for practicing:
                  </Text>
                  <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-blue-6)" />}>
                    <List.Item>
                      <Text size="sm" c="dark">
                        Try to turn off your inner critic and answer as authentically as possible.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dark">
                        Review your answers from the perspective of an interviewer. Which parts of
                        your answer capture the things you'd want an interviewer to know about you?
                        Which parts feel less relevant?
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dark">
                        Think about the main ways you'd want to improve your answers. Then try
                        answering again with those improvements in mind.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dark">
                        Identify which questions feel the most challenging. Practicing those will help
                        you learn the fastest.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dark" fw={600}>
                        Most importantly, keep practicing. It's okay if it feels hard. That means
                        you're improving.
                      </Text>
                    </List.Item>
                  </List>
                </Paper>

                <Paper p="lg" withBorder radius="md">
                  <Title order={3} size="h3" mb="md" c="blue">
                    Self-Reflection Questions
                  </Title>
                  <Text size="sm" c="dimmed" mb="md" lh={1.7}>
                    Ask yourself these questions and try to answer them as authentically as possible:
                  </Text>
                  <List size="sm" spacing="xs" type="ordered">
                    <List.Item>
                      <Text size="sm" c="dimmed">How would you describe yourself?</Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">In what areas are you talented?</Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">
                        What are examples of times you've used those talents?
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">
                        How have your talents helped you succeed in different areas of your life?
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">
                        What do you think are your most recurring weaknesses?
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">How do you deal with those weaknesses?</Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">What do you visualize for your career?</Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed">
                        What would be your top priorities in your next role?
                      </Text>
                    </List.Item>
                  </List>
                </Paper>

                <Paper p="lg" withBorder radius="md">
                  <Title order={3} size="h3" mb="md" c="blue">
                    Research & Preparation
                  </Title>
                  <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-blue-6)" />}>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Take some time to research the company, its culture, the team, and the role.
                        You can use resources such as the company website, social media, news
                        articles, and websites with reviews from former employees.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Think about how your talents in your last role could be helpful in this new
                        role.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Prepare questions for your interviewer by thinking critically about your
                        expectations for the role.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Make sure your technology is set up correctly.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        If you use any assistive technologies, set them up ahead of time. If you need
                        any other accommodations, ask your interviewer in advance.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Try to find a quiet, decluttered space. Make sure the light is in front of
                        you and center your camera so others can see you. Be careful using
                        backgrounds as they can be disruptive.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        Take a few moments to focus and get comfortable. Listen to your favorite
                        song, meditate, or just take a few deep breaths.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7} fw={600}>
                        Arrive on time!
                      </Text>
                    </List.Item>
                  </List>
                </Paper>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* During the Interview */}
          <Accordion.Item value="during">
            <Accordion.Control>
              <Group gap="md">
                <ThemeIcon size={40} radius="md" variant="light" color="green">
                  <IconMicrophone size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg">
                  During the Interview
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Paper p="lg" withBorder radius="md">
                  <List size="sm" spacing="md" icon={<IconCheck size={16} color="var(--mantine-color-green-6)" />}>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Listen carefully</strong> to each question. It's okay to take a moment
                        to gather your thoughts before you answer.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        If you're unsure about what's being asked, <strong>ask your interviewer to clarify</strong>.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Emphasize your skills and accomplishments</strong>. Let the interviewer
                        know what your strengths are and what excites you.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Don't be afraid to highlight what's great about yourself</strong>.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Be yourself</strong>. It's important to be honest and authentic in every
                        answer, even if that means expressing dislike for some activities. Not
                        everything has to be positive.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        When answering questions like "Why did you leave your last job?"{" "}
                        <strong>don't speak badly of your former boss, team, or company</strong>.
                        Focus on what you learned from difficult situations and how you grew.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>It's okay to feel nervous</strong>. Instead of letting nerves distract
                        you, think of what's actually happening in your body: your systems are going
                        into overdrive to supercharge your body and brain for peak performance.
                      </Text>
                    </List.Item>
                  </List>
                </Paper>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>

          {/* After the Interview */}
          <Accordion.Item value="after">
            <Accordion.Control>
              <Group gap="md">
                <ThemeIcon size={40} radius="md" variant="light" color="orange">
                  <IconCheck size={20} />
                </ThemeIcon>
                <Text fw={600} size="lg">
                  After the Interview
                </Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Paper p="lg" withBorder radius="md">
                  <List size="sm" spacing="md" icon={<IconCheck size={16} color="var(--mantine-color-orange-6)" />}>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Thank your interviewers</strong> for their time.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        You can ask your interviewers for their email addresses if you'd like to follow
                        up with additional questions or information, or just to send a thank-you
                        note.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        In case you don't get your interviewer's contact info, you can ask your recruiter
                        for it or find it on professional networking sites.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Be sure to personalize any notes you send afterwards</strong>.
                        Reiterate why you're interested in the role and mention something memorable
                        from the interview, whether it was a funny moment or something your
                        interviewer shared about themself.
                      </Text>
                    </List.Item>
                    <List.Item>
                      <Text size="sm" c="dimmed" lh={1.7}>
                        <strong>Ask your interviewer about next steps</strong> in the recruitment
                        process.
                      </Text>
                    </List.Item>
                  </List>
                </Paper>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        {/* Specific Question Types */}
        <Paper p="xl" radius="md" withBorder shadow="sm">
          <Stack gap="xl">
            <Box ta="center">
              <ThemeIcon size={60} radius="md" variant="light" color="blue" mx="auto" mb="md">
                <IconBook size={30} />
              </ThemeIcon>
              <Title order={2} size="2rem" c="blue" mb="sm">
                Tips for Answering Specific Types of Questions
              </Title>
            </Box>

            <Accordion>
              {/* Behavioral Questions */}
              <Accordion.Item value="behavioral">
                <Accordion.Control>
                  <Group gap="md">
                    <Badge size="lg" variant="light" color="blue">
                      Behavioral
                    </Badge>
                    <Text fw={600}>Behavioral Questions</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed" lh={1.7}>
                      Behavioral questions are designed to see how you've used your skills to handle
                      challenging situations in previous roles, and how you would use those skills to
                      handle future situations.
                    </Text>

                    <Card p="md" withBorder radius="md" bg="blue.0">
                      <Title order={4} size="h4" mb="md" c="blue">
                        The STAR Method
                      </Title>
                      <Text size="sm" c="dark" mb="md" lh={1.7}>
                        Structure your responses using this proven technique:
                      </Text>
                      <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-blue-6)" />}>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Situation:</strong> Describe the situation you were in, along with
                            some context and background information.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Task:</strong> Describe what was required of you.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Action:</strong> Describe what you did, how you did it, and the
                            tools you used.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Result:</strong> Describe what your action(s) accomplished.
                          </Text>
                        </List.Item>
                      </List>
                      <Box mt="md">
                        <Button
                          size="xs"
                          variant="subtle"
                          component="a"
                          href="https://www.indeed.com/career-advice/interviewing/how-to-use-the-star-interview-response-technique"
                          target="_blank"
                          rightSection={<IconExternalLink size={14} />}
                        >
                          Learn more about STAR method
                        </Button>
                      </Box>
                    </Card>

                    <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-blue-6)" />}>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          For clarity, structure each answer with a beginning, middle, and end.
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          Practice sharing a mix of "success" and "failure" stories. You could be
                          asked to provide both.
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          Try to demonstrate skills that are relevant to the new role (e.g.
                          adaptability, problem-solving, ownership, teamwork).
                        </Text>
                      </List.Item>
                    </List>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Technical Questions */}
              <Accordion.Item value="technical">
                <Accordion.Control>
                  <Group gap="md">
                    <Badge size="lg" variant="light" color="orange">
                      Technical
                    </Badge>
                    <Text fw={600}>Technical Questions</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed" lh={1.7}>
                      Technical questions are designed to see how you think. Hiring managers want to
                      see you demonstrate thoughtfulness and adaptability when finding solutions.
                    </Text>

                    <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-orange-6)" />}>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          Be prepared for different styles of technical questions. Your interviewer may
                          give you a scenario and ask you to talk through it from start to finish, or
                          they may ask you to go one step at a time, giving you more information after
                          each step.
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          As you answer, tell the interviewer exactly what you're thinking and why.
                          Whenever you make an assumption, tell your interviewer why you made that
                          call.
                        </Text>
                      </List.Item>
                    </List>

                    <Card p="md" withBorder radius="md" bg="orange.0">
                      <Title order={4} size="h4" mb="md" c="orange">
                        Steps for Answering Technical Questions
                      </Title>
                      <List size="sm" spacing="xs" type="ordered">
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Identify the problem</strong> by asking exploratory questions. What
                            happened before this issue occurred? What does the problem look like?
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Evaluate the problem</strong> by considering the potential causes.
                            Share your thoughts aloud as you do.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Think of possible solutions</strong> based on your prior knowledge.
                            Mention resources you might use to look up solutions.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Present your solutions</strong> in the order you'd try them in.
                            Always put the simplest solution first.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Implement your solutions</strong>. If you aren't directly
                            responsible for implementing the solution, clearly describe the
                            instructions you'd give to someone else.
                          </Text>
                        </List.Item>
                        <List.Item>
                          <Text size="sm" c="dark">
                            <strong>Test your solution</strong>. Explain how you'd ensure your solution
                            works.
                          </Text>
                        </List.Item>
                      </List>
                    </Card>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>

              {/* Background Questions */}
              <Accordion.Item value="background">
                <Accordion.Control>
                  <Group gap="md">
                    <Badge size="lg" variant="light" color="green">
                      Background
                    </Badge>
                    <Text fw={600}>Background Questions</Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="md">
                    <Text size="sm" c="dimmed" lh={1.7}>
                      Background questions are designed to help an interviewer understand more about
                      your training, experience, and why you want to work in this role.
                    </Text>

                    <List size="sm" spacing="xs" icon={<IconCheck size={16} color="var(--mantine-color-green-6)" />}>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          When answering broad questions like "Tell me about yourself," consider
                          structuring your answers in terms of the <strong>present, past, and future</strong>.
                          Start with the present, talking about your current role, the scope of it, and
                          a recent accomplishment you've had. Then speak to the past, explaining how
                          you got to your current role, and any other previous experience that's
                          relevant to the role you're applying for. Finally, segue to the future and
                          say what you're looking to do next and how this role would help you achieve
                          that.
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          Research can help answer questions like "Why do you want to work here?"
                          Re-read the job description and think about which aspects are interesting and
                          excite you. Look at the company's website and social media to get a better
                          sense of their values and how they align with yours.
                        </Text>
                      </List.Item>
                      <List.Item>
                        <Text size="sm" c="dimmed" lh={1.7}>
                          <strong>Be true to yourself</strong>. Be honest about what you want and don't
                          want from the role. Don't focus solely on your experiences and accolades.
                          Think about your talents and passions too.
                        </Text>
                      </List.Item>
                    </List>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Paper>

        {/* Footer Note */}
        <Paper p="lg" radius="md" bg="gray.0">
          <Text size="sm" c="dimmed" ta="center" lh={1.7}>
            <strong>Tips provided by the Google Career Certificates Employer Consortium</strong>
          </Text>
        </Paper>
      </Stack>
    </Container>
  );
}

