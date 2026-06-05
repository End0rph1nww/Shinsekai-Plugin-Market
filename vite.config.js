import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import sitemap from 'vite-plugin-sitemap'
import externalSitemaps from './sitemaps.config.js'

export default defineConfig({
  plugins: [
    vue(),
    sitemap({
      hostname: process.env.VITE_SITE_URL || 'https://localhost:3000',
      dynamicRoutes: ['/submit'],
      externalSitemaps,
      generateRobotsTxt: true,
      readable: true
    })
  ],
  base: './',
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 3000
    }
  }
})
