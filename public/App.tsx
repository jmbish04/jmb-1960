import { useState, useEffect } from "react";
import { AppShell, Tabs, Group, ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconHome, IconMessageCircle, IconBriefcase, IconTool, IconBulb, IconFileText, IconMoon, IconSun } from "@tabler/icons-react";
import LandingPage from "./components/LandingPage";
import ChatPage from "./components/ChatPage";
import JobsPage from "./components/JobsPage";
import ToolsPage from "./components/ToolsPage";
import InterviewPrepPage from "./components/InterviewPrepPage";
import InterviewTipsPage from "./components/InterviewTipsPage";
import ResumePage from "./components/ResumePage";

function App() {
  const [activeTab, setActiveTab] = useState<string | null>("home");
  const [subPage, setSubPage] = useState<string | null>(null);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const saved = localStorage.getItem("mantine-color-scheme");
      // Only auto-update if user hasn't manually set a preference
      if (!saved) {
        document.documentElement.setAttribute("data-mantine-color-scheme", mediaQuery.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleNavigation = (page: string | null) => {
    if (!page) {
      return;
    }
    if (page === "tools" || page === "interview-prep" || page === "interview-tips") {
      setActiveTab("tools");
      setSubPage(page === "interview-prep" ? "interview-prep" : page === "interview-tips" ? "interview-tips" : null);
    } else {
      setActiveTab(page);
      setSubPage(null);
    }
  };

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            Career Search Assistant
          </h1>
          <Group gap="md" wrap="nowrap" style={{ flex: 1, justifyContent: "flex-end", minWidth: 0 }}>
            <Tabs 
              value={activeTab} 
              onChange={(value) => {
                setActiveTab(value);
                setSubPage(null);
              }}
              style={{ flex: 1, minWidth: 0 }}
            >
              <Tabs.List style={{ flexWrap: "nowrap", overflowX: "auto", overflowY: "hidden", scrollbarWidth: "thin" }}>
                <Tabs.Tab value="home" leftSection={<IconHome size={16} />}>
                  Home
                </Tabs.Tab>
                <Tabs.Tab value="chat" leftSection={<IconMessageCircle size={16} />}>
                  Chat
                </Tabs.Tab>
                <Tabs.Tab value="jobs" leftSection={<IconBriefcase size={16} />}>
                  Jobs
                </Tabs.Tab>
                <Tabs.Tab value="tools" leftSection={<IconTool size={16} />}>
                  Tools
                </Tabs.Tab>
                <Tabs.Tab value="interview-tips" leftSection={<IconBulb size={16} />}>
                  Tips
                </Tabs.Tab>
                <Tabs.Tab value="resume" leftSection={<IconFileText size={16} />}>
                  Resume
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <ActionIcon
              variant="subtle"
              onClick={toggleColorScheme}
              title={`Switch to ${colorScheme === "light" ? "dark" : "light"} mode`}
              style={{ flexShrink: 0 }}
            >
              {colorScheme === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
            </ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        {activeTab === "home" && <LandingPage onNavigate={handleNavigation} />}
        {activeTab === "chat" && <ChatPage />}
        {activeTab === "jobs" && <JobsPage />}
        {activeTab === "tools" && (
          subPage === "interview-prep" ? (
            <InterviewPrepPage onNavigate={handleNavigation} />
          ) : subPage === "interview-tips" ? (
            <InterviewTipsPage onNavigate={handleNavigation} />
          ) : (
            <ToolsPage onNavigate={handleNavigation} />
          )
        )}
        {activeTab === "interview-tips" && (
          <InterviewTipsPage onNavigate={handleNavigation} />
        )}
        {activeTab === "resume" && <ResumePage />}
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
