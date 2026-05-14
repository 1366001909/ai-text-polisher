# CentOS / OpenCloudOS 部署指南

> 本文档基于首次部署 AI Text Polisher 到腾讯云 OpenCloudOS 9.4 服务器的实际经验整理。

---

## 快速命令集合（首次部署）

> 按顺序执行以下命令即可完成完整部署。

```bash
# 1. 安装 nvm 和 Node 20
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
nvm alias default 20

# 2. 拉取代码
cd /root/deployed
git clone -b 001-deployed-bankend https://github.com/1366001909/ai-text-polisher.git
cd ai-text-polisher

# 3. 安装依赖（注意：不要用 npm ci，必须先删除锁文件再 npm install）
rm -rf node_modules package-lock.json
npm install

# 4. 构建前端
npm run build

# 5. 安装 PM2
npm install -g pm2

# 6. 配置环境变量并启动服务
export DEEPSEEK_API_KEY='你的真实key'
export PORT=3000
pm2 start server.mjs --name ai-text-polisher

# 7. 配置开机自启
pm2 save
pm2 startup
```

---

## 快速命令集合（更新代码重新部署）

```bash
cd /root/deployed/ai-text-polisher
git pull
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart ai-text-polisher
```

---

## 环境信息

| 项目 | 版本 |
|------|------|
| 服务器系统 | OpenCloudOS 9.4（腾讯云，基于 RHEL 9） |
| Node.js | v20.x（通过 nvm 安装） |
| 包管理器 | npm |
| 进程守护 | PM2 |

---

## 一、安装 Node.js

### ❌ 踩坑：NodeSource RPM 脚本识别失败

OpenCloudOS 的 `ID` 字段为 `opencloudos`，NodeSource 官方 RPM 脚本无法识别，会报错：

```
Error: This script is intended for RPM-based systems. Please run it on an RPM-based system. (Exit Code: 1)
```

### ✅ 正确方法：使用 nvm

```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 重新加载 shell 配置
source ~/.bashrc

# 安装 Node 20 LTS
nvm install 20
nvm use 20
nvm alias default 20

# 验证
node -v   # v20.x.x
npm -v
```

---

## 二、拉取代码

```bash
mkdir -p /root/deployed
cd /root/deployed
git clone -b 001-deployed-bankend https://github.com/1366001909/ai-text-polisher.git
cd ai-text-polisher
```

---

## 三、安装依赖

### ❌ 踩坑：npm ci 导致 PostCSS 原生绑定缺失

使用 `npm ci` 时，npm 的 optional dependencies bug 会导致 PostCSS 原生绑定未正确安装，`npm run build` 报错：

```
[vite:css] Failed to load PostCSS config: Error: Loading PostCSS Plugin failed:
Cannot find native binding. npm has a bug related to optional dependencies
(https://github.com/npm/cli/issues/4828).
Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

### ✅ 正确方法：删除锁文件重新安装

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 四、配置环境变量

```bash
# 设置 DeepSeek API Key（替换为真实的 key）
export DEEPSEEK_API_KEY='sk-xxxxxxxxxxxxxxxxxxxxxxxx'
export PORT=3000
```

> **注意**：以上 export 只在当前 shell 会话有效。持久化方式见第七节 PM2 生态文件。

---

## 五、构建前端

```bash
npm run build
```

构建成功后会生成 `dist/` 目录。

---

## 六、安装 PM2

```bash
npm install -g pm2
```

---

## 七、启动服务

### 方式一：直接启动（临时，会话结束后失效）

```bash
pm2 start server.mjs --name ai-text-polisher
```

### 方式二：通过生态文件启动（推荐，携带环境变量）

创建 `ecosystem.config.cjs`：

```js
module.exports = {
  apps: [
    {
      name: 'ai-text-polisher',
      script: 'server.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        DEEPSEEK_API_KEY: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
      },
    },
  ],
};
```

启动：

```bash
pm2 start ecosystem.config.cjs
```

---

## 八、配置开机自启

```bash
# 生成 systemd 服务文件并启用
pm2 startup

# 按照输出提示执行对应命令（通常已自动执行，显示 Command successfully executed）

# 保存当前进程列表
pm2 save
```

---

## 九、验证部署

```bash
# 查看进程状态（status 应为 online）
pm2 list

# 查看实时日志
pm2 logs ai-text-polisher --lines 50

# 本地 curl 测试
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/
# 预期输出：200
```

浏览器访问 `http://<服务器公网IP>:3000` 确认页面正常。

---

## 十、腾讯云安全组配置

如果浏览器无法访问，需在腾讯云控制台开放端口：

1. 进入**云服务器 > 安全组**
2. 添加**入站规则**：
   - 协议：TCP
   - 端口：3000
   - 来源：0.0.0.0/0

---

## 十一、常用运维命令

```bash
# 查看所有进程
pm2 list

# 重启服务
pm2 restart ai-text-polisher

# 停止服务
pm2 stop ai-text-polisher

# 查看日志
pm2 logs ai-text-polisher

# 清空日志
pm2 flush

# 更新代码后重新部署
cd /root/deployed/ai-text-polisher
git pull
rm -rf node_modules package-lock.json
npm install
npm run build
pm2 restart ai-text-polisher
```

---

## 十二、常见问题汇总

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| NodeSource RPM 脚本报错 | OpenCloudOS 系统 ID 不被识别 | 改用 nvm 安装 Node |
| `npm run build` PostCSS 找不到原生绑定 | npm optional dependencies bug | 删除 `node_modules` 和 `package-lock.json` 后重新 `npm install` |
| 浏览器无法访问 3000 端口 | 云服务器安全组未开放 | 腾讯云控制台添加 TCP 3000 入站规则 |
| 重启服务器后服务消失 | PM2 未配置开机自启 | 执行 `pm2 startup` + `pm2 save` |
| API 返回 500 missing key | 环境变量 `DEEPSEEK_API_KEY` 未设置 | 使用 ecosystem.config.cjs 持久化环境变量 |
