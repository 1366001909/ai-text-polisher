# AI Text Polisher

项目采用 CentOS 单机部署模式：

- Node 服务端托管前端静态文件（`dist`）
- 同时提供 `/api/chat/completions` 代理接口转发到 DeepSeek
- DeepSeek API Key 仅保存在服务器环境变量中

## 本地开发

1. 启动后端（默认 `3000` 端口）：

```powershell
$env:DEEPSEEK_API_KEY = "your_key"
node server.mjs
```

2. 启动前端开发服务（默认 `5173` 端口）：

```powershell
D:\work\00npm\node-v22.14.0-win-x64\npm.cmd run dev
```

Vite 会把 `/api/*` 请求代理到 `http://127.0.0.1:3000`。

## CentOS 部署

```bash
# 安装 Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs git

# 拉代码
cd /opt
git clone https://github.com/1366001909/ai-text-polisher.git
cd ai-text-polisher

# 安装依赖并构建前端
npm ci
npm run build

# 配置环境变量并启动
export DEEPSEEK_API_KEY='your_real_key'
export PORT=3000
npm start
```

部署后访问：

- `http://<服务器IP>:3000`

## 生产常驻（推荐）

```bash
npm i -g pm2
export DEEPSEEK_API_KEY='your_real_key'
export PORT=3000
pm2 start server.mjs --name ai-text-polisher
pm2 save
pm2 startup
```

别忘了在腾讯云安全组和系统防火墙中放行 `3000/TCP`。
