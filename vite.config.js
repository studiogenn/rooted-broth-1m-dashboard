import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/rooted-broth-1m-dashboard/',
  server: { host: true },
  preview: { host: true },
})
