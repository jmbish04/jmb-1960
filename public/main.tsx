import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@tiptap/core/styles.css";
import "@tiptap/extension-placeholder/styles.css";
import "@tiptap/extension-highlight/styles.css";
import "@tiptap/starter-kit/styles.css";
import App from "./App";
import { shadcnTheme } from "./theme";

function Root() {
  useEffect(() => {
    // Suppress webcomponents duplicate registration errors (from Mantine Textarea)
    const handleError = (event: ErrorEvent) => {
      if (
        event.message?.includes("mce-autosize-textarea") ||
        event.message?.includes("custom element") ||
        event.error?.message?.includes("mce-autosize-textarea") ||
        event.message?.includes("already been defined")
      ) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }
    };

    window.addEventListener("error", handleError);
    
    // Auto-detect browser color scheme preference and set initial theme
    const saved = localStorage.getItem("mantine-color-scheme") as "light" | "dark" | null;
    if (!saved) {
      // Auto-detect from browser
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.setAttribute("data-mantine-color-scheme", prefersDark ? "dark" : "light");
    }

    return () => {
      window.removeEventListener("error", handleError);
    };
  }, []);

  return (
    <MantineProvider theme={shadcnTheme}>
      <Notifications />
      <App />
    </MantineProvider>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <ColorSchemeScript />
    <Root />
  </React.StrictMode>
);
