import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/base_url': {
        target: 'http://localhost:8090',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/base_url/, ''),
      },
    },
  },
  define: {
    __DEFAULT_EMPLOYEES_PER_PAGE__: 25,
    __DEFAULT_CURRENT_PAGE__: 1,
    __SHOW_ALL_EMPLOYEES__: 9999999,
    __DEFAULT_TOTAL_EMPLOYEES__: 0,
    __USER_IMAGE_API__: '"/base_url/api/files/users/"',
    __EMPLOYEE_IMAGE_API__: '"/base_url/api/files/employees/"',
  },
})
