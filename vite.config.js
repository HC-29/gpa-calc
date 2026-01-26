import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        converter: resolve(__dirname, 'converter.html'),
        about: resolve(__dirname, 'about.html'),
      },
    },
  },
})