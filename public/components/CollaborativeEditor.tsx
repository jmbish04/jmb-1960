import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Container,
  Paper,
  Stack,
  Button,
  Group,
  Text,
  Badge,
  ActionIcon,
  Popover,
  Box,
  Divider,
  Loader,
  Alert,
  SegmentedControl,
  Grid,
  TextInput,
} from "@mantine/core";
import {
  IconEdit,
  IconCheck,
  IconX,
  IconMessageCircle,
  IconSend,
  IconDeviceFloppy,
  IconFileText,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useEditor, Editor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { useChat } from "ai/react";
import { notifications } from "@mantine/notifications";

interface Suggestion {
  id: string;
  text: string;
  suggestion: string;
  reason: string;
  startPos: number;
  endPos: number;
  status: "pending" | "accepted" | "declined";
}

interface CollaborativeEditorProps {
  documentType: "resume" | "cover_letter";
  initialContent?: string;
  jobId?: string;
}

export default function CollaborativeEditor({
  documentType,
  initialContent = "",
  jobId,
}: CollaborativeEditorProps) {
  const [isRichEditorMode, setIsRichEditorMode] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: `Start writing your ${documentType === "resume" ? "resume" : "cover letter"}...`,
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (isRichEditorMode) {
        setAutoSaveStatus("unsaved");
        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
          clearTimeout(autoSaveTimeoutRef.current);
        }
        // Set new timeout for auto-save (500ms debounce)
        autoSaveTimeoutRef.current = setTimeout(() => {
          handleAutoSave(editor.getHTML());
        }, 500);
      }
    },
  });

  const [aiError, setAiError] = useState<string | null>(null);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
    setMessages,
    error,
  } = useChat({
    api: `/api/chat/threads/${selectedThreadId || "new"}/stream`,
    body: {
      threadId: selectedThreadId || undefined,
    },
    onFinish: async (message) => {
      setAiError(null);
      // Parse suggestions from AI response
      parseSuggestionsFromMessage(message.content);
      // Check if AI made direct changes
      if (message.content.includes("APPLIED_CHANGE:")) {
        applyAIChanges(message.content);
      }
    },
    onError: (error) => {
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

  // Initialize thread
  useEffect(() => {
    async function initThread() {
      try {
        const response = await fetch("/api/chat/threads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `${documentType === "resume" ? "Resume" : "Cover Letter"} Editor - ${new Date().toLocaleDateString()}`,
          }),
        });
        const data = await response.json();
        setSelectedThreadId(data.thread?.id || null);
      } catch (error) {
        console.error("Error creating thread:", error);
      }
    }
    initThread();
  }, [documentType]);

  // Load existing document
  useEffect(() => {
    if (initialContent && editor) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  function parseSuggestionsFromMessage(content: string) {
    // Parse suggestions in format: SUGGESTION: {id} | {text} | {suggestion} | {reason} | {start} | {end}
    const suggestionRegex = /SUGGESTION:\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|\s*(\d+)\s*\|\s*(\d+)/g;
    const newSuggestions: Suggestion[] = [];
    let match;

    while ((match = suggestionRegex.exec(content)) !== null) {
      const [, id, text, suggestion, reason, startPos, endPos] = match;
      newSuggestions.push({
        id: id.trim(),
        text: text.trim(),
        suggestion: suggestion.trim(),
        reason: reason.trim(),
        startPos: parseInt(startPos.trim(), 10),
        endPos: parseInt(endPos.trim(), 10),
        status: "pending",
      });
    }

    if (newSuggestions.length > 0) {
      setSuggestions((prev) => [...prev, ...newSuggestions]);
      highlightSuggestionsInEditor(newSuggestions);
    }
  }

  function highlightSuggestionsInEditor(newSuggestions: Suggestion[]) {
    if (!editor) return;

    // Highlight suggestions with marks
    newSuggestions.forEach((sugg) => {
      const { startPos, endPos, id } = sugg;
      editor
        .chain()
        .setTextSelection({ from: startPos, to: endPos })
        .setMark("highlight", { suggestionId: id })
        .setTextSelection(endPos)
        .run();
    });
  }

  function applyAIChanges(content: string) {
    if (!editor) return;

    // Parse APPLIED_CHANGE: {html}
    const changeRegex = /APPLIED_CHANGE:\s*([\s\S]*?)(?=SUGGESTION:|APPLIED_CHANGE:|$)/;
    const match = content.match(changeRegex);
    if (match) {
      const htmlContent = match[1].trim();
      editor.commands.setContent(htmlContent);
      setAutoSaveStatus("unsaved");
      handleAutoSave(htmlContent);
    }
  }

  async function handleAutoSave(html: string) {
    try {
      setAutoSaveStatus("saving");
      const response = await fetch(`/api/documents/${documentType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: html,
          jobId,
        }),
      });

      if (response.ok) {
        setAutoSaveStatus("saved");
        notifications.show({
          title: "Saved",
          message: "Document saved successfully",
          color: "green",
        });
      } else {
        setAutoSaveStatus("unsaved");
        throw new Error("Save failed");
      }
    } catch (error) {
      console.error("Auto-save error:", error);
      setAutoSaveStatus("unsaved");
      notifications.show({
        title: "Save Failed",
        message: "Could not save document",
        color: "red",
      });
    }
  }

  function handleAcceptSuggestion(suggestion: Suggestion) {
    if (!editor) return;

    // Apply the suggestion
    editor
      .chain()
      .setTextSelection({ from: suggestion.startPos, to: suggestion.endPos })
      .deleteSelection()
      .insertContent(suggestion.suggestion)
      .run();

    // Mark as accepted
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, status: "accepted" } : s))
    );

    // Remove highlight
    editor.commands.unsetMark("highlight");

    // Auto-save
    handleAutoSave(editor.getHTML());
  }

  function handleDeclineSuggestion(suggestion: Suggestion) {
    // Mark as declined
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestion.id ? { ...s, status: "declined" } : s))
    );

    // Remove highlight if still active
    if (editor && activeSuggestionId === suggestion.id) {
      editor.commands.unsetMark("highlight");
      setActiveSuggestionId(null);
    }
  }

  function handleChatSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !editor) return;

    const currentContent = editor.getHTML();
    const prompt = `Current ${documentType} content:\n${currentContent}\n\nUser request: ${input}\n\nPlease provide suggestions in the format: SUGGESTION: {id} | {original_text} | {suggested_text} | {reason} | {start_pos} | {end_pos}\nOr if making direct changes, use: APPLIED_CHANGE: {html_content}`;

    append({
      role: "user",
      content: prompt,
    });
  }

  function handleExportPDF() {
    if (!editor) return;

    // Trigger PDF generation
    fetch("/api/documents/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: documentType,
        content: editor.getHTML(),
        jobId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          window.open(data.url, "_blank");
        }
      })
      .catch((error) => {
        console.error("Export error:", error);
        notifications.show({
          title: "Export Failed",
          message: "Could not export document",
          color: "red",
        });
      });
  }

  const pendingSuggestions = suggestions.filter((s) => s.status === "pending");

  if (!editor) {
    return (
      <Container size="xl" py="xl">
        <Loader />
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        {/* Header Controls */}
        <Paper p="md" withBorder>
          <Group justify="space-between" align="center">
            <Group gap="md">
              <Text fw={600} size="lg">
                {documentType === "resume" ? "Resume" : "Cover Letter"} Editor
              </Text>
              <Badge color={autoSaveStatus === "saved" ? "green" : autoSaveStatus === "saving" ? "blue" : "orange"}>
                {autoSaveStatus === "saved" ? "Saved" : autoSaveStatus === "saving" ? "Saving..." : "Unsaved"}
              </Badge>
              {pendingSuggestions.length > 0 && (
                <Badge color="blue" variant="light">
                  {pendingSuggestions.length} Suggestions
                </Badge>
              )}
            </Group>
            <Group gap="sm">
              <SegmentedControl
                value={isRichEditorMode ? "edit" : "view"}
                onChange={(value) => setIsRichEditorMode(value === "edit")}
                data={[
                  { label: "View Mode", value: "view" },
                  { label: "Rich Editor", value: "edit" },
                ]}
              />
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={() => handleAutoSave(editor.getHTML())}
                disabled={autoSaveStatus === "saved"}
              >
                Save
              </Button>
              <Button
                leftSection={<IconFileText size={16} />}
                variant="light"
                onClick={handleExportPDF}
              >
                Export PDF
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Main Editor Area */}
        <Grid gutter="md" style={{ minHeight: "600px" }}>
          {/* Left: Document Editor */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Paper p="md" withBorder style={{ height: "100%" }}>
              <Stack gap="md" style={{ height: "100%" }}>
                {isRichEditorMode && (
                  <RichTextToolbar editor={editor} />
                )}
                <Box
                  style={{
                    flex: 1,
                    border: "1px solid var(--mantine-color-gray-3)",
                    borderRadius: "var(--mantine-radius-sm)",
                    padding: "16px",
                    overflow: "auto",
                    minHeight: "500px",
                    backgroundColor: "var(--mantine-color-white)",
                  }}
                >
                  {isRichEditorMode ? (
                    <RichEditorContent editor={editor} />
                  ) : (
                    <ViewModeContent editor={editor} suggestions={suggestions} onSuggestionClick={setActiveSuggestionId} />
                  )}
                </Box>
              </Stack>
            </Paper>
          </Grid.Col>

          {/* Right: Chat & Suggestions */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="md">
              {/* Suggestions Panel */}
              {pendingSuggestions.length > 0 && (
                <Paper p="md" withBorder>
                  <Stack gap="sm">
                    <Text fw={600}>Suggestions</Text>
                    {pendingSuggestions.map((suggestion) => (
                      <SuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        isActive={activeSuggestionId === suggestion.id}
                        onAccept={() => handleAcceptSuggestion(suggestion)}
                        onDecline={() => handleDeclineSuggestion(suggestion)}
                        onClick={() => setActiveSuggestionId(suggestion.id)}
                      />
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Chat Interface */}
              <Paper p="md" withBorder style={{ flex: 1 }}>
                <Stack gap="sm" style={{ height: "100%" }}>
                  <Text fw={600}>Chat with AI</Text>
                  <Box style={{ flex: 1, overflow: "auto", minHeight: "200px", maxHeight: "400px" }}>
                    <Stack gap="xs">
                      {messages.map((message) => (
                        <Paper
                          key={message.id}
                          p="xs"
                          withBorder
                          style={{
                            alignSelf: message.role === "user" ? "flex-end" : "flex-start",
                            maxWidth: "85%",
                            backgroundColor: message.role === "user" ? "var(--mantine-color-blue-0)" : undefined,
                          }}
                        >
                          <Text size="xs" c="dimmed" mb={4}>
                            {message.role === "user" ? "You" : "AI"}
                          </Text>
                          <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                            {message.content.replace(/SUGGESTION:.*/g, "").replace(/APPLIED_CHANGE:.*/g, "")}
                          </Text>
                        </Paper>
                      ))}
                      {isLoading && (
                        <Paper p="sm" withBorder style={{ alignSelf: "flex-start", maxWidth: "85%" }}>
                          <Group gap="xs">
                            <Loader type="dots" color="blue" size="sm" />
                            <Text size="sm" c="dimmed">AI is thinking...</Text>
                          </Group>
                        </Paper>
                      )}
                      {aiError && (
                        <Alert color="red" title="AI Error" icon={<IconAlertCircle size={16} />}>
                          <Text size="sm">{aiError}</Text>
                        </Alert>
                      )}
                      {error && (
                        <Alert color="red" title="Connection Error" icon={<IconAlertCircle size={16} />}>
                          <Text size="sm">{error.message || "Failed to connect to AI service"}</Text>
                        </Alert>
                      )}
                    </Stack>
                  </Box>
                  <form onSubmit={handleChatSubmit}>
                    <Group gap="xs" wrap="nowrap">
                      <TextInput
                        placeholder={`Ask AI to improve your ${documentType}...`}
                        value={input}
                        onChange={handleInputChange}
                        style={{ flex: 1 }}
                        disabled={isLoading}
                      />
                      <ActionIcon type="submit" disabled={!input.trim() || isLoading} variant="filled">
                        <IconSend size={16} />
                      </ActionIcon>
                    </Group>
                  </form>
                </Stack>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

// Rich Editor Component (editable Tiptap editor)
function RichEditorContent({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      style={{
        minHeight: "500px",
      }}
    />
  );
}

// View Mode Component (with suggestion highlights)
function ViewModeContent({
  editor,
  suggestions,
  onSuggestionClick,
}: {
  editor: Editor;
  suggestions: Suggestion[];
  onSuggestionClick: (id: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current || !editor) return;

    // Render content with suggestion highlights
    const html = editor.getHTML();
    let processedHtml = html;

    suggestions
      .filter((s) => s.status === "pending")
      .forEach((suggestion) => {
        // Escape HTML in suggestion text to avoid breaking regex
        const escapedText = escapeRegex(suggestion.text.replace(/<[^>]*>/g, ""));
        if (!escapedText.trim()) return;
        
        // Create a more specific regex that matches the text in context
        const regex = new RegExp(`(${escapedText})`, "gi");
        processedHtml = processedHtml.replace(
          regex,
          (match) => {
            // Check if already wrapped in a mark
            if (match.includes('<mark')) return match;
            return `<mark data-suggestion-id="${suggestion.id}" style="background-color: #fef08a; cursor: pointer; padding: 2px 4px; border-radius: 2px;" data-suggestion-text="${escapeHtml(suggestion.suggestion)}" data-suggestion-reason="${escapeHtml(suggestion.reason)}">${match}</mark>`;
          }
        );
      });

    contentRef.current.innerHTML = processedHtml;

    // Add click handlers to marks
    const marks = contentRef.current.querySelectorAll('mark[data-suggestion-id]');
    marks.forEach((mark) => {
      mark.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = mark.getAttribute('data-suggestion-id');
        if (id) onSuggestionClick(id);
      });
    });
  }, [editor, suggestions, onSuggestionClick]);

  return (
    <div
      ref={contentRef}
      className="prose prose-sm max-w-none"
      style={{
        minHeight: "500px",
      }}
    />
  );
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function SuggestionCard({
  suggestion,
  isActive,
  onAccept,
  onDecline,
  onClick,
}: {
  suggestion: Suggestion;
  isActive: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClick: () => void;
}) {
  return (
    <Paper
      p="sm"
      withBorder
      style={{
        borderColor: isActive ? "var(--mantine-color-blue-6)" : undefined,
        borderWidth: isActive ? 2 : 1,
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <Stack gap="xs">
        <Group gap="xs" justify="space-between">
          <Text size="xs" c="dimmed">
            Original: "{suggestion.text}"
          </Text>
        </Group>
        <Text size="sm" fw={500}>
          Suggestion: "{suggestion.suggestion}"
        </Text>
        <Text size="xs" c="dimmed">
          {suggestion.reason}
        </Text>
        <Group gap="xs" mt="xs">
          <Button
            size="xs"
            leftSection={<IconCheck size={14} />}
            color="green"
            onClick={(e) => {
              e.stopPropagation();
              onAccept();
            }}
          >
            Accept
          </Button>
          <Button
            size="xs"
            leftSection={<IconX size={14} />}
            color="red"
            variant="light"
            onClick={(e) => {
              e.stopPropagation();
              onDecline();
            }}
          >
            Decline
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Rich Text Editor Toolbar
function RichTextToolbar({ editor }: { editor: Editor }) {
  if (!editor) return null;

  return (
    <Group gap="xs" p="xs" style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }} wrap="nowrap">
      <Button
        variant={editor.isActive("bold") ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleBold().run()}
        leftSection={<Text fw={700}>B</Text>}
      >
        Bold
      </Button>
      <Button
        variant={editor.isActive("italic") ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        leftSection={<Text style={{ fontStyle: "italic" }}>I</Text>}
      >
        Italic
      </Button>
      <Button
        variant={editor.isActive("underline") ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        leftSection={<Text style={{ textDecoration: "underline" }}>U</Text>}
      >
        Underline
      </Button>
      <Divider orientation="vertical" />
      <Button
        variant={editor.isActive("heading", { level: 1 }) ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 2 }) ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </Button>
      <Button
        variant={editor.isActive("heading", { level: 3 }) ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        H3
      </Button>
      <Divider orientation="vertical" />
      <Button
        variant={editor.isActive("bulletList") ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullet List
      </Button>
      <Button
        variant={editor.isActive("orderedList") ? "filled" : "subtle"}
        size="xs"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Numbered List
      </Button>
      <Divider orientation="vertical" />
      <Button
        variant="subtle"
        size="xs"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        Undo
      </Button>
      <Button
        variant="subtle"
        size="xs"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        Redo
      </Button>
    </Group>
  );
}

