import { defineConfig } from "vite";

// Relative base so CSS/JS load correctly on GitHub Pages whether the site is at
// /RepoName/, a custom domain root, or another subdirectory (no hard-coded repo path).
export default defineConfig({
  base: "./",
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
  },
});
