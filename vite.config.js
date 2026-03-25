import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Optimalizace pro development
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      '@mui/material',
      '@mui/icons-material'
    ]
  }
}));
