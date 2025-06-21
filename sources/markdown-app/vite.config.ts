import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-oxc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "full-reload-on-hot-update",
      handleHotUpdate({ server }) {
        server.ws.send({ type: "full-reload" });
        return [];
      },
    },
  ],
  build: {
    target: "esnext",
    sourcemap: false,
    minify: true,
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: "react-router", test: "react-router" },
            { name: "react", test: "react|react-dom" },
            { name: "modules", test: "[\\\\/]node_modules" },
          ],
        },
      },
    },
  },
});
