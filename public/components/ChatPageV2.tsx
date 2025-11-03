import React, { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import {
  Container,
  Paper,
  Button,
  Stack,
  Group,
  ScrollArea,
  Select,
  ActionIcon,
  Text,
  Badge,
  Loader,
} from "@mantine/core";
import { IconMicrophone, IconSend, IconX, IconSparkles } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { Message } from "ai";

interface Thread {
  id: string;
  title?: string;
  created_at: number;
}

export default function ChatPageV2() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
    setMessages,
    append,
    stop,
  } = useChat({
    api: `/api/chat/threads/${selectedThreadId || "new"}/stream`,
    body: {
      threadId: selectedThreadId || undefined,
    },
    onFinish: async (message: Message) => {
      await loadThreads();
    },
    onError: (error: Error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to send message",
        color: "red",
      });
    },
  });

  useEffect(() => {
    loadThreads();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (selectedThreadId) {
      loadMessagesForThread(selectedThreadId);
    }
  }, [selectedThreadId]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  async function loadMessagesForThread(threadId: string) {
    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`);
      const data = await res.json();
      const formattedMessages: Message[] = (data.messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  async function loadThreads() {
    try {
      const res = await fetch("/api/chat/threads");
      const data = await res.json();
      setThreads(data.threads || []);
      if (data.threads?.length > 0 && !selectedThreadId) {
        setSelectedThreadId(data.threads[0].id);
      }
    } catch (error) {
      console.error("Error loading threads:", error);
    }
  }

  function initializeSpeechRecognition() {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        handleInputChange({ target: { value: transcript } } as any);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        if (event.error !== "no-speech") {
          notifications.show({
            title: "Speech Recognition Error",
            message: "Could not transcribe audio. Please try typing instead.",
            color: "red",
          });
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognition);
    }
  }

  async function startRecording() {
    if (!recognition) {
      notifications.show({
        title: "Not Supported",
        message: "Speech recognition is not supported in your browser.",
        color: "orange",
      });
      return;
    }

    try {
      setIsRecording(true);
      recognition.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setIsRecording(false);
    }
  }

  async function stopRecording() {
    if (recognition) {
      recognition.stop();
      setIsRecording(false);
    }
  }

  async function createNewThread() {
    try {
      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });
      const data = await res.json();
      setThreads([data.thread, ...threads]);
      setSelectedThreadId(data.thread.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  }

  async function handleChatSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim()) {
      return;
    }

    if (!selectedThreadId) {
      await createNewThread();
      // Wait a moment for thread creation, then submit
      setTimeout(() => {
        handleSubmit(e);
      }, 100);
      return;
    }

    handleSubmit(e);
  }

  return (
    <Container size="lg" py="xl" h="calc(100vh - 120px)">
      <Stack gap="md" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Select
            placeholder="Select conversation"
            data={threads.map((t) => ({
              value: t.id,
              label: t.title || `Thread ${t.id.slice(0, 8)}`,
            }))}
            value={selectedThreadId}
            onChange={(value) => {
              setSelectedThreadId(value);
              setMessages([]);
            }}
            searchable
            style={{ flex: 1 }}
          />
          <Button onClick={createNewThread} leftSection={<IconSparkles size={16} />}>
            New Chat
          </Button>
        </Group>

        <Paper
          p={0}
          withBorder
          style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
        >
          <ScrollArea style={{ flex: 1 }} viewportRef={viewportRef}>
            <Stack gap="md" p="md">
              {messages.length === 0 && (
                <Paper p="xl" withBorder style={{ backgroundColor: "var(--mantine-color-blue-0)" }}>
                  <Stack gap="xs" align="center">
                    <IconSparkles size={48} color="var(--mantine-color-blue-6)" />
                    <Text size="lg" fw={600} c="blue">
                      Your AI Recruiter is Ready
                    </Text>
                    <Text size="sm" c="dimmed" ta="center">
                      Ask about job searching, resume tips, or share a job posting link for analysis.
                      I'll give you direct, honest feedback.
                    </Text>
                  </Stack>
                </Paper>
              )}

              {messages.map((message) => (
                <Paper
                  key={message.id}
                  p="md"
                  withBorder
                  style={{
                    alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                    maxWidth: "85%",
                    backgroundColor:
                      message.role === "user"
                        ? "var(--mantine-color-blue-0)"
                        : "var(--mantine-color-gray-0)",
                  }}
                >
                  <Group gap="xs" mb="xs">
                    <Badge
                      size="sm"
                      variant={message.role === "user" ? "filled" : "light"}
                      color={message.role === "user" ? "blue" : "gray"}
                    >
                      {message.role === "user" ? "You" : "AI Recruiter"}
                    </Badge>
                  </Group>
                  <Text
                    size="sm"
                    style={{
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {message.content}
                  </Text>
                </Paper>
              ))}

              {isLoading && (
                <Paper
                  p="md"
                  withBorder
                  style={{ alignSelf: "flex-start", maxWidth: "85%" }}
                >
                  <Group gap="xs">
                    <Loader size="xs" />
                    <Text size="sm" c="dimmed">
                      AI Recruiter is thinking...
                    </Text>
                  </Group>
                </Paper>
              )}
            </Stack>
          </ScrollArea>

          <form onSubmit={handleChatSubmit}>
            <Group gap="xs" p="md" wrap="nowrap">
              <textarea
                ref={textareaRef}
                placeholder="Type your message or use voice..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e as any);
                  }
                }}
                disabled={isLoading}
                style={{
                  flex: 1,
                  padding: "var(--mantine-spacing-sm)",
                  borderRadius: "var(--mantine-radius-sm)",
                  border: "1px solid var(--mantine-color-gray-4)",
                  fontFamily: "inherit",
                  fontSize: "var(--mantine-font-size-sm)",
                  resize: "vertical",
                  minHeight: "60px",
                  maxHeight: "200px",
                }}
              />
              <ActionIcon
                size="lg"
                variant={isRecording ? "filled" : "light"}
                color={isRecording ? "red" : "blue"}
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isLoading}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                <IconMicrophone size={18} />
              </ActionIcon>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                leftSection={<IconSend size={16} />}
              >
                Send
              </Button>
              {isLoading && (
                <ActionIcon color="red" onClick={stop} title="Stop generation">
                  <IconX size={18} />
                </ActionIcon>
              )}
            </Group>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}

