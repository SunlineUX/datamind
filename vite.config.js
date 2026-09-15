import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'

// 图片始终作为独立文件输出，避免被 base64 打包进 JS 导致 dist 里找不到文件引用
// （只覆盖 png/jpg/jpeg/webp/gif，字体/小 SVG 等仍保留默认内联收益）
const IMAGE_EXT_RE = /\.(png|jpe?g|webp|gif)(\?.*)?$/i;

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'force-image-file-output',
      config() {
        return {
          build: { assetsInlineLimit: (filePath) => IMAGE_EXT_RE.test(filePath) ? 0 : undefined },
        };
      },
    },
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
