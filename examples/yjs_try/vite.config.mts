import path from "node:path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import react from "@vitejs/plugin-react"; // Adicione esta linha

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [
    nodePolyfills({
      overrides: {},
    }),
    react(), // Adicione o plugin do React aqui
  ],
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  resolve: {
    alias: {
      "@topology-foundation": path.resolve(__dirname, "../../packages"),
    },
  },
});