import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { devPlugin } from './plugins/devPlugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [devPlugin(), vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src/renderer')
      }
    ]
  }
})
