import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/reading-passage/',
  plugins: [react()],
  build: {
    outDir: 'docs'
  }
})