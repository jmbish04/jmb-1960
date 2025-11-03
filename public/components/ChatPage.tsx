import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Paper,
  Button,
  Stack,
  Group,
  ScrollArea,
  Select,
  Badge,
  ActionIcon,
  Text,
  Loader,
  Code,
  Box,
  Alert,
  Card,
} from "@mantine/core";
import { IconMicrophone, IconSend, IconX, IconSparkles, IconAlertCircle, IconInfoCircle } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useChat, Message } from "ai/react";

// Type definitions for speech recognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  length: number;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

interface Thread {
  id: string;
  title?: string;
  created_at: number;
}

export default function ChatPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [chatError, setChatError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use a dynamic API endpoint key to force re-initialization when thread changes
  const apiEndpoint = `/api/chat/threads/${selectedThreadId || "new"}/stream`;

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
    error,
  } = useChat({
    api: apiEndpoint,
    body: {
      threadId: selectedThreadId || undefined,
    },
    onFinish: async (message: Message) => {
      setChatError(null);
      setIsSubmitting(false);
      await loadThreads();
    },
    onError: (error: Error) => {
      setIsSubmitting(false);
      const errorMessage = 
        error?.message || 
        error?.toString() || 
        "Failed to send message. Please check your connection and try again.";
      
      setChatError(errorMessage);
      
      notifications.show({
        title: "Chat Error",
        message: errorMessage,
        color: "red",
        autoClose: 10000,
        icon: <IconAlertCircle size={18} />,
      });
      
      console.error("Chat error from useChat:", error);
      console.error("Error stack:", error?.stack);
    },
    streamProtocol: "sse",
    keepLastMessageOnError: true,
  });

  // Load messages when thread changes
  useEffect(() => {
    if (selectedThreadId) {
      loadMessagesForThread(selectedThreadId);
    } else {
      // Clear messages if no thread is selected
      setMessages([]);
    }
  }, [selectedThreadId]);

  // Suppress webcomponents error from Vite devtools overlay
  useEffect(() => {
    // Suppress the webcomponents error by catching it before it bubbles
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("mce-autosize-textarea") ||
        event.message?.includes("custom element") ||
        event.error?.message?.includes("mce-autosize-textarea")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  useEffect(() => {
    if (selectedThreadId) {
      loadMessagesForThread(selectedThreadId);
    }
  }, [selectedThreadId]);

  async function loadMessagesForThread(threadId: string) {
    try {
      const res = await fetch(`/api/chat/threads/${threadId}/messages`);
      const data = await res.json();
      const formattedMessages: Message[] = (data.messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content,
      }));
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  }

  useEffect(() => {
    loadThreads();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

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
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = async (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        handleInputChange({ target: { value: transcript } } as any);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        notifications.show({
          title: "Speech Recognition Error",
          message: "Could not transcribe audio. Please try typing instead.",
          color: "red",
        });
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

  async function createNewThread(): Promise<Thread> {
    try {
      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Conversation" }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create thread: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      if (!data.thread || !data.thread.id) {
        throw new Error("Invalid thread response from server");
      }

      setThreads([data.thread, ...threads]);
      setSelectedThreadId(data.thread.id);
      return data.thread;
    } catch (error: any) {
      console.error("Error creating thread:", error);
      const errorMessage = error?.message || "Failed to create new conversation thread.";
      setChatError(errorMessage);
      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: 5000,
      });
      throw error;
    }
  }

  async function handleChatSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!input.trim() || isLoading || isSubmitting) {
      return;
    }

    const messageText = input.trim();
    setChatError(null);
    setIsSubmitting(true);

    try {
      // Ensure we have a thread before sending
      let threadIdToUse = selectedThreadId;
      if (!threadIdToUse) {
        const thread = await createNewThread();
        threadIdToUse = thread.id;
        setSelectedThreadId(threadIdToUse);
        // Reload threads list
        await loadThreads();
      }

      // Use append which will call the API endpoint
      await append({
        role: "user",
        content: messageText,
      }, {
        body: {
          threadId: threadIdToUse,
        },
      });

      // Clear input immediately after successful submission
      // The input is handled by useChat hook
    } catch (error: any) {
      setIsSubmitting(false);
      const errorMessage = 
        error?.message || 
        error?.toString() || 
        "Failed to send message. Please check your connection and try again.";
      
      setChatError(errorMessage);
      
      notifications.show({
        title: "Error Sending Message",
        message: errorMessage,
        color: "red",
        autoClose: 10000,
        icon: <IconAlertCircle size={18} />,
      });
      
      console.error("Error submitting chat:", error);
      console.error("Error details:", {
        message: error?.message,
        stack: error?.stack,
        threadId: selectedThreadId,
      });
    }
  }

  return (
    <Container size="lg" py="xl" h="calc(100vh - 120px)">
      <Stack gap="md" h="100%">
        <Group justify="space-between">
          <Select
            placeholder="Select or create a thread"
            data={threads.map((t) => ({ value: t.id, label: t.title || `Thread ${t.id.slice(0, 8)}` }))}
            value={selectedThreadId}
            onChange={(value) => setSelectedThreadId(value)}
            searchable
          />
          <Button onClick={createNewThread}>New Thread</Button>
        </Group>

        <Paper p="md" withBorder style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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

              {(error || chatError) && (
                <Card
                  p="lg"
                  withBorder
                  radius="md"
                  style={{
                    borderColor: "var(--mantine-color-red-6)",
                    borderWidth: 2,
                    backgroundColor: "var(--mantine-color-red-0)",
                  }}
                >
                  <Alert
                    icon={<IconAlertCircle size={20} />}
                    title="Error Sending Message"
                    color="red"
                    variant="light"
                  >
                    <Stack gap="xs">
                      <Text size="sm" c="red" fw={500}>
                        {error?.message || chatError || "An unknown error occurred"}
                      </Text>
                      <Text size="xs" c="dimmed">
                        If this problem persists, please refresh the page and try again. You can also check the browser console for more details.
                      </Text>
                      <Group gap="xs" mt="xs">
                        <Button
                          size="xs"
                          variant="light"
                          color="red"
                          onClick={() => {
                            setChatError(null);
                            window.location.reload();
                          }}
                        >
                          Refresh Page
                        </Button>
                        <Button
                          size="xs"
                          variant="subtle"
                          color="red"
                          onClick={() => {
                            setChatError(null);
                            if (selectedThreadId) {
                              loadMessagesForThread(selectedThreadId);
                            }
                          }}
                        >
                          Retry
                        </Button>
                      </Group>
                    </Stack>
                  </Alert>
                </Card>
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
                    <Loader type="dots" color="blue" size="sm" />
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
                disabled={!input.trim() || isLoading || isSubmitting}
                leftSection={<IconSend size={16} />}
                loading={isLoading || isSubmitting}
              >
                Send
              </Button>
              {(isLoading || isSubmitting) && (
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
