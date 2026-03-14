import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy Supabase requests through Vite dev server to avoid SSL issues
      '/supabase': {
        target: 'https://unomkawslyiuobosworq.supabase.co',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/supabase/, ''),
      },
    },
    // Ensure proper host resolution
    host: true,
    port: 5173,
    strictPort: false,
  },
  optimizeDeps: {
    include: ['@supabase/supabase-js'],
  },
})
