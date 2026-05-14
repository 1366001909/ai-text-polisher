# AI Text Polisher

这个项目可以直接发布到 GitHub Pages（测试用途）。

## 一次性配置

1. 在 GitHub 仓库中进入 `Settings -> Pages`。
2. `Build and deployment` 的 `Source` 选择 `GitHub Actions`。
3. 在仓库 `Settings -> Secrets and variables -> Actions` 新建仓库机密：
   - 名称：`VITE_DEEPSEEK_API_KEY`
   - 值：你的 DeepSeek API Key

## 发布方式

- 推送到 `main` 分支会自动触发发布。
- 也可以在 `Actions` 页面手动运行 `Deploy To GitHub Pages`。

## 发布地址

部署完成后访问：

- `https://<你的GitHub用户名>.github.io/<仓库名>/`

例如仓库名是 `writeHelper`，则地址是：

- `https://<你的GitHub用户名>.github.io/writeHelper/`

## 本地构建检查

```powershell
D:\work\00npm\node-v22.14.0-win-x64\npm.cmd run build -- --base=/writeHelper/
```

如果需要在本地预览构建产物：

```powershell
D:\work\00npm\node-v22.14.0-win-x64\npm.cmd run preview -- --host 0.0.0.0 --port 5173
```
