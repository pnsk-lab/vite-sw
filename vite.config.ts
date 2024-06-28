import { defineConfig } from 'vite'
import { pluginSW } from './lib'

export default defineConfig({
  plugins: [pluginSW()],
})
