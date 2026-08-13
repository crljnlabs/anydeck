import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset paths so the production build also works when the backend
  // serves it from the bundled web/ directory.
  base: './',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In development the frontend runs on its own port. Proxying /api to the
    // backend keeps every request same-origin, so no CORS handling is needed.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8765',
        changeOrigin: true,
      },
    },
  },
})
