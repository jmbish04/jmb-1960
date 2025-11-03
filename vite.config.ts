import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { copyFileSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-to-public",
      closeBundle() {
        // Copy built assets from dist to public after build
        const distDir = path.resolve(__dirname, "dist");
        const publicDir = path.resolve(__dirname, "public");
        
        // Helper to copy assets directory recursively, but exclude nested public directories
        function copyAssetsRecursive(src: string, dest: string) {
          if (!statSync(src, { throwIfNoEntry: false })) return;
          
          const entries = readdirSync(src, { withFileTypes: true });
          
          for (const entry of entries) {
            // Skip nested public directories to avoid creating public/public/
            if (entry.isDirectory() && entry.name === "public") {
              continue;
            }
            
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
              if (!statSync(destPath, { throwIfNoEntry: false })) {
                mkdirSync(destPath, { recursive: true });
              }
              copyAssetsRecursive(srcPath, destPath);
            } else {
              copyFileSync(srcPath, destPath);
            }
          }
        }
        
        try {
          // Find index.html (may be in dist/ or dist/public/)
          const distIndexHtml = path.join(distDir, "index.html");
          const distPublicIndexHtml = path.join(distDir, "public", "index.html");
          
          let actualIndexHtml: string | null = null;
          if (statSync(distIndexHtml, { throwIfNoEntry: false })) {
            actualIndexHtml = distIndexHtml;
          } else if (statSync(distPublicIndexHtml, { throwIfNoEntry: false })) {
            actualIndexHtml = distPublicIndexHtml;
          }
          
          if (actualIndexHtml) {
            // Read the built index.html and clean up duplicates
            let htmlContent = readFileSync(actualIndexHtml, "utf-8");
            
            // Remove duplicate script tags (keep only unique ones)
            const scriptRegex = /<script[^>]*src="([^"]*)"[^>]*><\/script>/g;
            const scripts = new Map<string, string>();
            let match;
            
            while ((match = scriptRegex.exec(htmlContent)) !== null) {
              const src = match[1];
              if (!scripts.has(src)) {
                scripts.set(src, match[0]);
              }
            }
            
            // Replace all script tags with unique ones
            if (scripts.size > 0) {
              htmlContent = htmlContent.replace(scriptRegex, '');
              // Insert unique scripts at the end of head
              const uniqueScripts = Array.from(scripts.values()).join('\n  ');
              htmlContent = htmlContent.replace('</head>', `  ${uniqueScripts}\n</head>`);
            }
            
            // Write directly to avoid appending duplicates
            writeFileSync(path.join(publicDir, "index.html"), htmlContent, "utf-8");
          }
          
          // Copy assets (exclude any nested public directories)
          const distAssets = path.join(distDir, "assets");
          const distPublicAssets = path.join(distDir, "public", "assets");
          
          let actualAssetsDir: string | null = null;
          if (statSync(distAssets, { throwIfNoEntry: false })) {
            actualAssetsDir = distAssets;
          } else if (statSync(distPublicAssets, { throwIfNoEntry: false })) {
            actualAssetsDir = distPublicAssets;
          }
          
          if (actualAssetsDir) {
            const publicAssets = path.join(publicDir, "assets");
            if (!statSync(publicAssets, { throwIfNoEntry: false })) {
              mkdirSync(publicAssets, { recursive: true });
            }
            copyAssetsRecursive(actualAssetsDir, publicAssets);
          }
        } catch (error) {
          console.error("Error copying build files:", error);
        }
      },
    },
  ],
  root: __dirname,
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "public/index.html"),
    },
    // Don't copy publicDir contents - static assets stay in public/ for ASSETS binding
    copyPublicDir: false,
  },
  base: "/",
  publicDir: path.resolve(__dirname, "public"),
});
