import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        resolvers: [ElementPlusResolver()]
      })
    ],

    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        // 本地开发环境通过代理实现跨域，生产环境使用 nginx 转发
        // 正则表达式写法
        '^/sanLing/token': {
          target: 'http://192.168.1.254:53010', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/sanLing\/token/, '')
        },
        '^/sanLing': {
          target: 'http://192.168.1.254:8888', // 后端服务实际地址
          changeOrigin: true, //开启代理
          rewrite: (path) => path.replace(/^\/sanLing/, '')
        }
      }
    }
  }
})
