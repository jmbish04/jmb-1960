import React, { useState } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  Button,
  Box,
  Stack,
  Badge,
  Grid,
  Image,
  Card,
  Group,
  ThemeIcon,
  Divider,
} from "@mantine/core";
import { IconExternalLink, IconSparkles, IconTarget, IconRocket, IconQuestionMark, IconDeviceDesktop, IconShield, IconWorld } from "@tabler/icons-react";

interface LandingPageProps {
  onNavigate: (tab: string | null) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [showSteps, setShowSteps] = useState(false);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <Box ta="center" py="xl">
          <Title order={1} size="3rem" c="blue" mb="sm" fw={700}>
            Turn 30 Years of Experience Into Your Next Big Thing
          </Title>
          <Text size="xl" c="dimmed" fw={500}>
            Google's Career Dreamer Tool + Your Personal AI Recruiter
          </Text>
        </Box>

        {/* Benefits Section - Large and Prominent */}
        <Paper
          p="xl"
          radius="md"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Stack gap="xl">
            <Box ta="center">
              <Title order={2} size="2.5rem" mb="md" c="white">
                Why This Matters
              </Title>
              <Text size="lg" c="white" opacity={0.95}>
                Three powerful reasons to invest 30 minutes
              </Text>
            </Box>

            <Grid>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="lg" radius="md" style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <ThemeIcon size={60} radius="md" variant="light" color="white" mb="md">
                    <IconTarget size={30} />
                  </ThemeIcon>
                  <Title order={3} size="h3" c="white" mb="sm">
                    1. Stand Out from the Crowd
                  </Title>
                  <Text size="sm" c="white" opacity={0.9}>
                    Your 30+ years in Procurement and Purchasing at Toyota, TEMA, and Newell Rubbermaid is incredible experience. This tool translates that into the exact words modern recruiters are searching for. Beat the screening software that filters out 95% of resumes.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="lg" radius="md" style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <ThemeIcon size={60} radius="md" variant="light" color="white" mb="md">
                    <IconSparkles size={30} />
                  </ThemeIcon>
                  <Title order={3} size="h3" c="white" mb="sm">
                    2. Build an Impressive Resume (with AI)
                  </Title>
                  <Text size="sm" c="white" opacity={0.9}>
                    Forget spreadsheets. This tool uses AI to help you write a professional, modern resume that looks sharp and is formatted perfectly. Mentioning you used AI shows you're on top of new technology—a big plus for any company.
                  </Text>
                </Card>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card p="lg" radius="md" style={{ backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                  <ThemeIcon size={60} radius="md" variant="light" color="white" mb="md">
                    <IconRocket size={30} />
                  </ThemeIcon>
                  <Title order={3} size="h3" c="white" mb="sm">
                    3. Discover Jobs You Haven't Thought Of
                  </Title>
                  <Text size="sm" c="white" opacity={0.9}>
                    The best part: it creates a "Dream Career Graph." Takes all your skills (like your C.P.M.) and interests, showing you a visual map of new career paths. Perfect fits in logistics, operations consulting, or supply chain strategy—not just "Purchasing Manager."
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Paper>

        {/* Compelling Explore Paths Section with Video */}
        <Paper p="xl" radius="md" withBorder shadow="lg">
          <Stack gap="lg">
            <Box ta="center">
              <Title order={2} size="2rem" c="blue" mb="sm">
                The Game Changer: Explore Paths
              </Title>
              <Badge size="lg" variant="light" color="blue" mb="md">
                Most Powerful Feature
              </Badge>
            </Box>

            {/* Video Player */}
            <Box
              style={{
                position: "relative",
                width: "100%",
                borderRadius: "var(--mantine-radius-md)",
                overflow: "hidden",
                border: "2px solid var(--mantine-color-blue-2)",
                backgroundColor: "#000",
              }}
            >
              <video
                src="https://grow.google/career-dreamer/home/videos/Explore_Paths.mp4"
                autoPlay
                loop
                muted
                playsInline
                controls
                style={{
                  width: "100%",
                  height: "auto",
                  display: "block",
                  maxHeight: "600px",
                }}
                onError={(e) => {
                  console.error("Video load error:", e);
                }}
              >
                Your browser does not support the video tag.
              </video>
            </Box>

            {/* Fallback Image */}
            <Image
              src="/images/step_6_explore_paths.png"
              alt="Explore Paths - Career Discovery"
              radius="md"
              mb="lg"
              style={{ border: "2px solid var(--mantine-color-blue-2)" }}
            />

            <Paper p="lg" bg="blue.0" radius="md">
              <Text size="md" lh={1.8} c="dark">
                In <strong>Explore Paths</strong>, you can explore different careers that connect to the profile you created in the Career Identity section. You can use these results as reference points to help you brainstorm and explore possible paths forward. Some may pique your interest, while others might seem completely out of left field. Remember: <strong>you are the best judge of what works for you</strong>, so feel free to disregard anything that doesn't feel useful.
              </Text>
              <Divider my="md" />
              <Text size="md" lh={1.8} c="dark">
                Modifying your profile will update your results, and you can even explore careers based on specific profile sections if you want. You'll find two kinds of results in Explore Paths. <strong>Careers marked with blue dots</strong> are sourced from a database of US occupations. You can click into each one to learn more about it, including a description of the role, average salary, educational requirements, and a handful of personalized insights. <strong>Careers marked with green dots</strong> represent generated ideas from Gemini, Google's most capable AI model. These careers don't come with all the same detailed info as the database results, but you can chat with Gemini to learn more.
              </Text>
            </Paper>
          </Stack>
        </Paper>

        {/* Call to Action */}
        <Box ta="center" py="xl">
          <Button
            size="xl"
            onClick={() => setShowSteps(!showSteps)}
            variant="gradient"
            gradient={{ from: "blue", to: "cyan", deg: 90 }}
            leftSection={<IconRocket size={24} />}
            mb="xl"
          >
            {showSteps ? "Hide Instructions" : "Show Me How to Use It!"}
          </Button>
        </Box>

        {/* Step-by-Step Guide */}
        {showSteps && (
          <Stack gap="xl">
            <Paper p="xl" radius="md" withBorder shadow="sm">
              <Title order={2} size="2rem" ta="center" mb="xl" c="blue">
                How to Use Career Dreamer
              </Title>

              <Stack gap="xl">
                {/* Step 1 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 1: Enter Your Last Job
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    Start by entering information about your most recent position. This helps the tool understand your current role and responsibilities.
                  </Text>
                  <Image
                    src="/images/step_1_enter_last_job.png"
                    alt="Step 1 - Enter Last Job"
                    radius="md"
                    mb="xs"
                  />
                </Card>

                {/* Step 2 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 2: Enter Your Last Company
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    Provide details about the company where you last worked. This context helps the AI understand your work environment and industry.
                  </Text>
                  <Image
                    src="/images/step_2_enter_last_company.png"
                    alt="Step 2 - Enter Last Company"
                    radius="md"
                    mb="xs"
                  />
                </Card>

                {/* Step 3 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 3: Confirm Your Last Job Details
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    Review and confirm the information about your most recent position. Make sure everything is accurate.
                  </Text>
                  <Image
                    src="/images/step_3_confirm_last_job.png"
                    alt="Step 3 - Confirm Last Job"
                    radius="md"
                    mb="xs"
                  />
                </Card>

                {/* Step 4 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 4: Confirm Your Skills
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    This is critical—confirm your skills like Procurement, Purchasing, and your C.P.M. certification. This helps the tool match you to the right opportunities.
                  </Text>
                  <Image
                    src="/images/step_4_confirm_skills_last_job.png"
                    alt="Step 4 - Confirm Skills"
                    radius="md"
                    mb="xs"
                  />
                </Card>

                {/* Step 5 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 5: Enter Details for All Your Experience
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    Add information about your career history—your roles at Toyota, Newell Rubbermaid, and other companies. The more detail, the better the recommendations.
                  </Text>
                  <Image
                    src="/images/step_5_enter_details_all_time.png"
                    alt="Step 5 - Enter All Experience"
                    radius="md"
                    mb="xs"
                  />
                </Card>

                {/* Step 6 - Already shown above, but can reference */}
                <Card p="md" withBorder radius="md" style={{ borderColor: "var(--mantine-color-blue-4)", borderWidth: 2 }}>
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 6: Explore Paths (The Best Part!)
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    This is where the magic happens. See the visual career graph above for what this looks like—it's the most powerful feature for discovering new opportunities.
                  </Text>
                </Card>

                {/* Step 7 */}
                <Card p="md" withBorder radius="md">
                  <Text size="lg" fw={600} mb="md" c="blue">
                    Step 7: Chat with Gemini AI
                  </Text>
                  <Text size="sm" c="dimmed" mb="md" lh={1.6}>
                    Use Gemini, Google's AI, to learn more about careers marked with green dots. Ask questions, get insights, and explore possibilities.
                  </Text>
                  <Image
                    src="/images/step_7_use_gemini.png"
                    alt="Step 7 - Use Gemini"
                    radius="md"
                    mb="xs"
                  />
                </Card>
              </Stack>
            </Paper>

            {/* Final CTA */}
            <Paper p="xl" radius="md" style={{ backgroundColor: "var(--mantine-color-blue-0)" }}>
              <Stack gap="lg" align="center">
                <Title order={3} size="h2" ta="center" c="blue">
                  Ready to Get Started?
                </Title>
                <Group gap="md">
                  <Button
                    size="lg"
                    component="a"
                    href="https://grow.google/career-dreamer/home/"
                    target="_blank"
                    rightSection={<IconExternalLink size={18} />}
                    variant="filled"
                    color="blue"
                  >
                    Open Career Dreamer Tool
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => onNavigate("chat")}
                    variant="light"
                    color="blue"
                  >
                    Or Chat with Your AI Recruiter
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        )}

        {/* Alternative: If steps not shown, show direct CTA */}
        {!showSteps && (
          <Box ta="center" py="xl">
            <Button
              size="xl"
              component="a"
              href="https://grow.google/career-dreamer/home/"
              target="_blank"
              rightSection={<IconExternalLink size={20} />}
              variant="filled"
              color="blue"
            >
              Open Career Dreamer Tool Now
            </Button>
          </Box>
        )}

        {/* FAQ Section */}
        <Paper p="xl" radius="md" withBorder shadow="sm" mt="xl">
          <Stack gap="xl">
            <Box ta="center">
              <ThemeIcon size={60} radius="md" variant="light" color="blue" mx="auto" mb="md">
                <IconQuestionMark size={30} />
              </ThemeIcon>
              <Title order={2} size="2rem" c="blue" mb="sm">
                Frequently Asked Questions
              </Title>
              <Text size="lg" c="dimmed">
                Everything you need to know about Career Dreamer
              </Text>
            </Box>

            <Stack gap="md">
              <Card p="md" withBorder radius="md">
                <Title order={4} size="h4" mb="xs" c="blue">
                  What is Career Dreamer?
                </Title>
                <Text size="sm" c="dimmed" lh={1.6}>
                  Career Dreamer is an early-stage experiment that uses AI to help people explore career possibilities. It helps you discover new paths based on your unique skills and experiences.
                </Text>
              </Card>

              <Card p="md" withBorder radius="md">
                <Title order={4} size="h4" mb="xs" c="blue">
                  Who is this for?
                </Title>
                <Text size="sm" c="dimmed" lh={1.6}>
                  Career Dreamer is for anyone exploring new career possibilities, connecting the dots between past roles, considering how existing skills could apply to new fields, or simply looking for a fun and easy way to get started exploring their potential. If you're curious about your career options and want to leverage your unique experiences, Career Dreamer is for you!
                </Text>
              </Card>

              <Card p="md" withBorder radius="md" style={{ borderColor: "var(--mantine-color-blue-4)", borderWidth: 2 }}>
                <Title order={4} size="h4" mb="sm" c="blue">
                  How do I use it?
                </Title>
                <Stack gap="sm">
                  <Box>
                    <Text size="sm" fw={600} mb="xs" c="blue">1. Shape your professional story</Text>
                    <Text size="sm" c="dimmed" lh={1.6} pl="md">
                      Create a Career Identity Statement that showcases the unique skills and experiences you bring to the workforce, and add it to your resume or professional profile.
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm" fw={600} mb="xs" c="blue">2. Explore career possibilities</Text>
                    <Text size="sm" c="dimmed" lh={1.6} pl="md">
                      Uncover a variety of careers that might align with your unique background and delve deeper into those that interest you to see where your skills could take you.
                    </Text>
                  </Box>
                  <Box>
                    <Text size="sm" fw={600} mb="xs" c="blue">3. Take the next step</Text>
                    <Text size="sm" c="dimmed" lh={1.6} pl="md">
                      Collaborate with Gemini to refine your resume, craft a compelling cover letter, and take the first steps toward your career goals.
                    </Text>
                  </Box>
                </Stack>
              </Card>

              <Grid>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Card p="md" withBorder radius="md">
                    <Group gap="xs" mb="xs">
                      <IconDeviceDesktop size={20} color="var(--mantine-color-blue-6)" />
                      <Title order={4} size="h4" c="blue">
                        Device Compatibility
                      </Title>
                    </Group>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Career Dreamer is still in early development. For now, it's officially supported on Google Chrome for desktop and mobile.
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Card p="md" withBorder radius="md">
                    <Group gap="xs" mb="xs">
                      <IconWorld size={20} color="var(--mantine-color-blue-6)" />
                      <Title order={4} size="h4" c="blue">
                        Availability
                      </Title>
                    </Group>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Career Dreamer is currently only available in the US.
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Card p="md" withBorder radius="md">
                    <Group gap="xs" mb="xs">
                      <IconShield size={20} color="var(--mantine-color-blue-6)" />
                      <Title order={4} size="h4" c="blue">
                        Privacy & Login
                      </Title>
                    </Group>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      No account needed! Your session is saved locally in your browser. This site uses Google Analytics to monitor aggregated activity. For information about how the Gemini API collects data, see the Gemini API Additional Terms of Service.
                    </Text>
                  </Card>
                </Grid.Col>

                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <Card p="md" withBorder radius="md">
                    <Title order={4} size="h4" mb="xs" c="blue">
                      How It Was Built
                    </Title>
                    <Text size="sm" c="dimmed" lh={1.6}>
                      Career Dreamer was built using Google's publicly available AI developer tools, including Gemini for personalized career insights.
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
