import { MantineThemeOverride } from "@mantine/core";

// Shadcn-inspired theme configuration
// Based on MantineHub (https://github.com/RubixCube-Innovations/mantine-theme-builder)
export const shadcnTheme: MantineThemeOverride = {
  primaryColor: "blue",
  defaultRadius: "md", // 8px - shadcn default
  
  colors: {
    // Custom Zinc-inspired color palette
    zinc: [
      "#fafafa", // 0 - lightest
      "#f4f4f5",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#3f3f46",
      "#27272a",
      "#18181b", // 9 - darkest
    ],
    // Custom Slate-inspired color palette
    slate: [
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#cbd5e1",
      "#94a3b8",
      "#64748b",
      "#475569",
      "#334155",
      "#1e293b",
      "#0f172a",
    ],
  },

  // Component styling overrides
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      }),
    },
    
    Paper: {
      defaultProps: {
        radius: "md",
        withBorder: true,
      },
      styles: (theme) => ({
        root: {
          borderColor: theme.colorScheme === "dark" 
            ? theme.colors.dark[4] 
            : theme.colors.gray[2],
          backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.white,
        },
      }),
    },

    Card: {
      defaultProps: {
        radius: "md",
        withBorder: true,
      },
      styles: (theme) => ({
        root: {
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
          transition: "all 0.2s ease",
          "&:hover": {
            borderColor: theme.colorScheme === "dark"
              ? theme.colors.dark[3]
              : theme.colors.gray[3],
          },
        },
      }),
    },

    Input: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        input: {
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
          backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.white,
          transition: "border-color 0.2s ease",
          "&:focus": {
            borderColor: theme.colors.blue[6],
          },
        },
      }),
    },

    TextInput: {
      defaultProps: {
        radius: "md",
      },
    },

    Textarea: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        input: {
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
          backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.white,
          transition: "border-color 0.2s ease",
          "&:focus": {
            borderColor: theme.colors.blue[6],
          },
        },
      }),
    },

    Select: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        input: {
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
          backgroundColor: theme.colorScheme === "dark"
            ? theme.colors.dark[7]
            : theme.white,
          transition: "border-color 0.2s ease",
          "&:focus": {
            borderColor: theme.colors.blue[6],
          },
        },
      }),
    },

    Tabs: {
      styles: (theme) => ({
        tab: {
          fontWeight: 500,
          transition: "all 0.2s ease",
          "&[data-active]": {
            color: theme.colors.blue[6],
            borderBottomColor: theme.colors.blue[6],
          },
        },
      }),
    },

    Badge: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        root: {
          fontWeight: 500,
        },
      }),
    },

    Alert: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        root: {
          borderWidth: 1,
          borderStyle: "solid",
        },
      }),
    },

    Notification: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        root: {
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
        },
      }),
    },

    Accordion: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        item: {
          borderColor: theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2],
        },
        control: {
          "&:hover": {
            backgroundColor: theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          },
        },
      }),
    },

    ActionIcon: {
      defaultProps: {
        radius: "md",
      },
      styles: (theme) => ({
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      }),
    },
  },

  // Typography
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontFamilyMonospace: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
  
  headings: {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontWeight: "600",
  },

  // Shadows - subtle, modern shadows (shadcn-style)
  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  // Default radius for components (Mantine v7 uses string values)
  radius: {
    xs: "4px",
    sm: "6px",
    md: "8px", // shadcn default
    lg: "12px",
    xl: "16px",
  },
};

