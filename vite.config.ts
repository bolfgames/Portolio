import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // GitHub Pages için base path
  // main branch'ten deploy edildiğinde /Portfolio/ kullanılır
  base: process.env.NODE_ENV === 'production' ? '/Portfolio/' : '/',
  build: {
    outDir: 'docs', // GitHub Pages için docs klasörüne build et
    assetsDir: 'assets',
    // Production'da asset path'lerini optimize et
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },
})

