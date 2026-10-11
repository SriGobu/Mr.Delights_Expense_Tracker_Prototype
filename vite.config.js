import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // different from the ERP (5173) so both can run side by side
    // When the ERP backend is connected later, proxy /api like the ERP does:
    // proxy: { "/api": { target: "http://localhost:5011", changeOrigin: true } },
  },
  build: { chunkSizeWarningLimit: 1600 },
});
