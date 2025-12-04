# 🌟 大事件内容管理平台前端 (big-event-frontend)

本项目是基于 **Vue 3** 和 **Element Plus** 构建的后台管理界面，旨在为 Spring Boot 后端项目提供一个美观、高效的内容管理操作台，实现完整的文章管理、分类管理和用户设置功能。

---

## ✨ 运行截图

### 1. 登录界面 (Login Page)

现代化的分栏设计，提供注册、登录和“记住我”功能。
<img width="1861" height="913" alt="image" src="https://github.com/user-attachments/assets/c365fe7d-3df8-4222-99e5-488fa8750669" />

### 2. 文章管理工作台 (Dashboard)

文章列表支持多条件筛选、分页和完整的 CRUD 操作。
![153503c12f8517d3d1ebc3fd4891220e](https://github.com/user-attachments/assets/7fb48fc3-43d5-465b-8331-a48536d7a395)
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/516d9ebd-b491-4a82-825c-d8a5680d7c43" />
![bc23e294ca90ee439d548166d49228c6](https://github.com/user-attachments/assets/1e0139ec-3107-4f53-9406-66a47b36a5cb)
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/21f5a7e0-dbc4-475b-828d-14ad2bc22df1" />
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/8b891b9a-40d5-4d93-bbdb-f73c422d56d0" />

---

## 🚀 项目技术栈

| 领域          | 技术栈                   | 说明                                             |
| :------------ | :----------------------- | :----------------------------------------------- |
| **核心框架**  | **Vue 3** (Script Setup) | 渐进式 JavaScript 框架，提升开发效率。           |
| **构建工具**  | **Vite**                 | 极速的现代前端开发与构建工具。                   |
| **UI 组件库** | **Element Plus**         | Vue 3 生态中最受欢迎的 UI 库，用于构建管理后台。 |
| **样式**      | **Sass & CSS 变量**      | 配合自定义的品牌色和样式，提供美观的视觉体验。   |
| **路由管理**  | **Vue Router 4**         | 实现 SPA (单页应用) 导航。                       |
| **请求管理**  | **Axios**                | 封装了 JWT 令牌认证的 HTTP 请求拦截器。          |

---

## 🌟 核心功能

本项目完整实现了后端提供的所有管理功能：

* **用户认证与安全**  
  用户注册、登录、JWT 认证、密码重置。
* **个人中心**  
  修改昵称/邮箱资料、上传头像。
* **文章分类管理**  
  对文章分类进行增、删、改、查操作。
* **文章管理**  
  * 文章列表支持按**分类**和**状态**（已发布/草稿）进行精确搜索和分页。  
  * 支持文章的发布、编辑和删除。

---

## ⚙️ 启动指南

### **步骤 1: 环境准备**

请确保本地环境已安装以下工具：

* Node.js (推荐 v18+)
* npm 或 yarn
* 后端服务 (`big-event-backend`) 正在本地 **`http://localhost:8080`** 端口运行

---

### **步骤 2: 安装依赖**

进入项目目录，安装所有依赖：

```bash
npm install
# 或者使用 yarn
# yarn install
```

### **步骤 3: 配置文件检查 (Vite Proxy)**

本项目依赖 **Vite 开发服务器代理** 来解决跨域问题。  
请确保根目录下的 **`vite.config.js`** 文件包含以下配置，将所有以 `/api` 开头的请求转发到后端 `8080` 端口：

```javascript
// vite.config.js 核心配置示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

**说明：**

- `target`：后端服务地址。
- `changeOrigin`：修改请求源头以避免跨域限制。
- `rewrite`：将 `/api` 前缀去掉，保证后端路由正确匹配。

### **步骤 4: 启动项目**

1. **安装依赖**（如果尚未安装）：

```bash
npm install
# 或者使用 yarn
# yarn install
```

   2.**启动开发服务器**：

```
npm run dev
```

   3.**访问应用**：

启动成功后，打开浏览器访问控制台输出的地址（通常是）：

```
http://localhost:5173
```

应用会自动跳转到 **登录页面**，即可开始使用前端功能。

**提示：**

- 确保后端服务已经运行在 `http://localhost:8080`，否则接口请求会失败。
- 如果端口被占用，可以在启动命令中指定端口：

```
npm run dev -- --port 5174
```

## 📄 参考资料

- Vue 3 官方文档
- [Element Plus 官方文档](https://element-plus.org/)
- [Vite 官方文档](https://vitejs.dev/)
- [Axios 官方文档](https://axios-http.com/)
- [Vue Router 4 官方文档](https://router.vuejs.org/)
