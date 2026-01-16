import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/flowise': {
        target: 'https://cloud.flowiseai.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/flowise/, ''),
      },
    },
  },
})
