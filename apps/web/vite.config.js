import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // @haciendola/shared is CommonJS (so the API can require it) and linked from
  // the workspace, so Vite has to be told to convert it in dev and in builds.
  optimizeDeps: {
    include: ['@haciendola/shared'],
  },
  build: {
    commonjsOptions: {
      include: [/packages\/shared/, /node_modules/],
    },
  },
})
