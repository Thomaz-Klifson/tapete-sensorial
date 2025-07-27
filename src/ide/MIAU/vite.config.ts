import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: './src/renderer',
  base: './',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/renderer/index.html'
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src/renderer/src'),
      '@renderer': resolve(__dirname, './src/renderer/src')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  define: {
    global: 'globalThis'
  }
})