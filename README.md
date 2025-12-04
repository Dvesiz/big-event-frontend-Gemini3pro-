⚙️ 启动指南
步骤 1：环境准备

请确保本地已安装：

Node.js（推荐 v18+）

npm 或 yarn

后端服务 (big-event-backend) 正在本地 http://localhost:8080 运行

步骤 2：安装依赖

进入项目目录并安装依赖：

npm install
# 或者：
# yarn install

步骤 3：检查代理配置（Vite Proxy）

本项目使用 Vite 开发服务器代理 来解决跨域问题。

请确认根目录下的 vite.config.js 中包含如下配置，使所有 /api 开头的请求转发到后端 8080：

// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

步骤 4：启动项目

运行开发服务器：

npm run dev


启动后，打开浏览器访问控制台输出的地址（通常为）：

http://localhost:5173


应用会自动跳转到登录页。
