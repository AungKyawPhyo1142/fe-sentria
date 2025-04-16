import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    port: parseInt(process.env.PORT ?? '8080'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@config': path.resolve(__dirname, './config'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@zustand': path.resolve(__dirname, './src/services/zustand'),
      '@routes': path.resolve(__dirname, './src/services/routes'),
      '@formik': path.resolve(__dirname, './src/services/formik'),
      '@network': path.resolve(__dirname, './src/services/network'),
      '@storage': path.resolve(__dirname, './src/services/storage'),
      '@hooks': path.resolve(__dirname, './src/services/hooks'),
    },
  },
})
