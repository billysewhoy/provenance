import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Works on GitHub Pages even when the repo name is part of the URL.
  base: '/provenance/',
})
