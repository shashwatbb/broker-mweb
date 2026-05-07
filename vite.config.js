import { defineConfig } from "vite";

// GitHub Pages project URL: https://<user>.github.io/<repo>/
// Must match the repository name in the path (change "BrokerBuddy" if you rename the repo).
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/BrokerBuddy/" : "/",
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
}));
