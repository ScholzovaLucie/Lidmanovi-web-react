import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': [
            '@mui/material', 
            '@mui/icons-material', 
            '@emotion/react', 
            '@emotion/styled'
          ],
          'vendor-mui-x': [
            '@mui/x-data-grid', 
            '@mui/x-date-pickers',
            'react-mui-scheduler'
          ],
          'vendor-redux': [
            '@reduxjs/toolkit', 
            'react-redux'
          ],
          'vendor-i18n': [
            'i18next', 
            'react-i18next', 
            'i18next-browser-languagedetector'
          ],
          'vendor-utils': [
            'dayjs',
            'notistack'
          ]
        }
      }
    },
    // Zvětšíme chunk size warning limit
    chunkSizeWarningLimit: 600
  },
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
