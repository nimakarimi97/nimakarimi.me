import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    proxy: {
      // Proxy downloader API to the local backend (tools/downloader/server.mjs)
      '/api/downloader': {
        target: 'http://localhost:8787',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/downloader/, '/api'),
      },
      // Proxy Instagram API to bypass CORS in local dev and attach session cookies
      '/api/instagram': {
        target: 'https://www.instagram.com',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api\/instagram/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            const session = req.headers['x-ig-session']
            const userId = req.headers['x-ig-user-id']
            const csrf = req.headers['x-ig-csrf']
            const cookieParts = []
            if (session) {
              cookieParts.push(`sessionid=${session}`)
            }
            if (userId) {
              cookieParts.push(`ds_user_id=${userId}`)
            }
            if (csrf) {
              cookieParts.push(`csrftoken=${csrf}`)
            }
            if (cookieParts.length > 0) {
              proxyReq.setHeader('Cookie', cookieParts.join('; '))
            }
            proxyReq.setHeader('Origin', 'https://www.instagram.com')
            proxyReq.setHeader('Referer', 'https://www.instagram.com/')
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
            proxyReq.setHeader('X-IG-App-ID', '936619743392459')
            proxyReq.setHeader('X-Requested-With', 'XMLHttpRequest')
          })
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router') || id.includes('vue-chartjs')) {
              return 'vue'
            }
            if (
              id.includes('bootstrap')
              || id.includes('swiper')
              || id.includes('chart.js')
              || id.includes('@fortawesome')
            ) {
              return 'vendor'
            }
            return 'dependencies'
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        quietDeps: true,
        silenceDeprecations: ['color-functions', 'import', 'global-builtin', 'legacy-js-api'],
      },
    },
  },
})
