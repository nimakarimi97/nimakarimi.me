import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
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
