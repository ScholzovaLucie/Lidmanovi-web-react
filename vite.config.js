import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: "/Lidmanovi-web-react/", // Pages vs lokál
}));
