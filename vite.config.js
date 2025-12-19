import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['gsap', 'lenis', 'lucide-react', 'sonner'],
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
