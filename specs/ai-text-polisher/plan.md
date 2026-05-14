# AI Text Polisher 实施规划（CentOS 单机部署）

## 1. 目标与边界
- 目标：将应用从“前端直连模型/GitHub Pages”迁移为“CentOS 上单 Node 服务同机同源部署”。
- 目标：前端只调用同源 `/api/*`，DeepSeek API Key 仅保留在服务端环境变量。
- 边界：首版不做限流、令牌、验证码；不引入 Nginx；不引入账户系统与历史存储。

## 2. 约束对齐
- 前端栈保持 React 19 + TypeScript strict + Vite + Tailwind v4。
- 不引入 Redux/Zustand/Jotai，不引入路由。
- API 调用仍统一在 `src/api/`，组件层不直接 `fetch`。
- 模型固定为 `deepseek-chat`。
- 后端超时策略固定 30 秒，超时返回友好错误。

## 3. 目标架构
### 3.1 运行形态
- 入口：`http://<server-ip>:3000`
- 单个 Node 进程承担两类职责：
  - 提供 `dist` 静态文件（SPA）
  - 提供 `/api/chat/completions` 代理接口

### 3.2 请求链路
1. 浏览器访问 Node 提供的前端页面。
2. 前端请求同源 `/api/chat/completions`。
3. Node 读取 `DEEPSEEK_API_KEY` 后转发到 DeepSeek。
4. Node 将响应回传前端。

### 3.3 错误处理
- 上游超时（30s） -> 返回 504 及可读错误。
- 上游鉴权失败 -> 返回 401 并提示检查服务端密钥。
- 其他上游失败 -> 返回 4xx/5xx 并给前端友好文案。

## 4. 代码改造规划
### 4.1 前端
- `src/api/deepseekClient.ts`
  - 移除浏览器 `Authorization` 头逻辑。
  - 保留原有请求体结构，调用同源 `/api/chat/completions`。
  - 更新错误提示为“后端侧配置/请求失败”语义。

- `vite.config.mjs`
  - 开发模式将 `/api` 代理到 `http://127.0.0.1:3000`。
  - 移除 GitHub Pages `base` 与前端密钥注入配置。

### 4.2 后端
- 新增 `server.mjs`：
  - `express.static('dist')` 托管前端。
  - `POST /api/chat/completions` 透传请求体到 DeepSeek。
  - 使用 `AbortController` 实现 30 秒超时。
  - SPA 回退路由返回 `dist/index.html`。

### 4.3 配置与文档
- `package.json` 新增 `start` 脚本。
- `README.md` 改为 CentOS 部署指南。
- `.env.example` 使用 `DEEPSEEK_API_KEY` 与 `PORT`。
- 取消 `.github/workflows/deploy-pages.yml`。

## 5. 部署规划（CentOS）
### 5.1 一次性初始化
1. 安装 Node.js 20 与 Git。
2. 拉取仓库并执行 `npm ci`。
3. 构建前端：`npm run build`。

### 5.2 启动与守护
1. 导出环境变量：`DEEPSEEK_API_KEY`、`PORT=3000`。
2. 启动：`npm start`。
3. 生产守护建议：`pm2 start server.mjs --name ai-text-polisher`。

### 5.3 网络配置
- 放行腾讯云安全组 `3000/TCP`。
- 放行系统防火墙 `3000/TCP`。

## 6. 验证计划
### 6.1 功能验证
- 输入文本 -> 选择预设 -> 点击润色 -> 返回结果 -> 复制成功。
- 超过 3000 字阻止提交。
- 模型固定 `deepseek-chat`。

### 6.2 接口验证
- 正常请求：返回 200 且结果可解析。
- 缺失密钥：返回 500 且前端显示友好错误。
- 上游超时：30 秒后返回 504 且前端有超时提示。

### 6.3 构建验证
- 本地 `npm run build` 通过。
- CentOS `npm run build` + `npm start` 正常。

## 7. 风险与缓解
- 风险：无 HTTPS 时仅可 HTTP 访问。
  - 缓解：后续接入域名与 HTTPS，再评估 Nginx。
- 风险：首版无限流，接口可能被滥用。
  - 缓解：短期观察日志，后续迭代接入限流。
- 风险：单进程承载静态与 API。
  - 缓解：使用 PM2 守护并保留后续拆分空间。

## 8. 交付里程碑
1. M1：文档对齐（spec/plan）。
2. M2：代码改造完成并本地联调通过。
3. M3：CentOS 首次部署可访问并完成端到端润色。
4. M4：运维固化（PM2、日志、开机自启）。
