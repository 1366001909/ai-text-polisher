# 任务清单：AI Text Polisher（CentOS 单机部署）

## 阶段 1：初始化
- [x] [T001] 在 `package.json` 中更新 CentOS 运行脚本（为 `server.mjs` 增加 `start` 脚本）。
- [x] [T002] 在 `package.json` 和 `package-lock.json` 中补充后端运行依赖并同步锁文件。
- [x] [T003] 在 `README.md` 中将 GitHub Pages 发布说明替换为 CentOS 部署指南。
- [x] [T004] 删除 `.github/workflows/deploy-pages.yml` 中的 GitHub Pages 发布流程。
- [x] [T005] 在 `.env.example` 中新增后端环境变量模板（`DEEPSEEK_API_KEY`、`PORT`）。

## 阶段 2：基础能力
- [x] [T006] 在 `server.mjs` 中实现单进程后端入口（静态资源托管 + `/api/chat/completions` 代理）。
- [x] [T007] 在 `server.mjs` 中实现后端超时与错误映射（30 秒超时、504/502 处理）。
- [x] [T008] 在 `vite.config.mjs` 中将开发代理改为本地后端（`/api` -> `http://127.0.0.1:3000`）。
- [x] [T009] 在 `vite.config.mjs` 中移除前端 API Key 注入与构建时密钥绑定逻辑。
- [x] [T010] 在 `.gitignore` 中确保忽略 `.env` 以防止密钥泄露。

## 阶段 3：用户故事 1（P1）- 单页润色流程通过同源后端可用
- [x] [T011] 在 `src/api/deepseekClient.ts` 中重构 API 调用，移除浏览器侧 Authorization 头。
- [x] [T012] 在 `src/api/deepseekClient.ts` 与 `src/api/polishText.ts` 中保持现有请求/响应协议兼容。
- [x] [T013] 在 `src/api/deepseekClient.ts` 中补充后端语义的友好错误文案（401/403/429/504）。
- [x] [T014] 在 `src/config/appConfig.ts` 中调整文案，去除“纯前端”描述。
- [x] [T015] 基于 `src/App.tsx` 现有集成行为验证同源 `/api` 端到端润色流程。

## 阶段 4：用户故事 2（P2）- 在 CentOS 上生产部署（不使用 GitHub Pages）
- [x] [T016] 在 `README.md` 中补充 CentOS 初始化命令与运行变量说明（安装、构建、启动）。
- [x] [T017] 在 `README.md` 中补充进程常驻策略（PM2）。
- [x] [T018] 在 `README.md` 中补充网络端口要求（`3000/TCP`）。
- [x] [T019] 在 `server.mjs` 中验证并确保 SPA 回退路由可从 `dist` 提供页面。

## 阶段 5：用户故事 3（P3）- 规格与规划文档与当前架构一致
- [x] [T020] 在 `specs/ai-text-polisher/spec.md` 中更新为单 Node 托管的架构与部署约束。
- [x] [T021] 在 `specs/ai-text-polisher/spec.md` 中明确 API Key 仅由后端持有。
- [x] [T022] 在 `specs/ai-text-polisher/plan.md` 中发布与 CentOS 单机模型一致的实施规划。

## 阶段 6：收尾
- [x] [T023] 运行 `npm run build` 完成迁移后构建验证，并在 PR 说明中记录结果。
- [x] [T024] 执行 `npm start` 烟雾测试，确认 `server.mjs` 的监听与启动行为正常。
- [x] [T025] 在 `README.md`、`specs/ai-text-polisher/spec.md`、`specs/ai-text-polisher/plan.md` 中完成术语一致性检查（移除 GitHub Pages 生产路径）。

## 依赖关系
- [x] [D001] 完成阶段 1 后再进入阶段 2。
- [x] [D002] 完成 T006-T010 后再执行 T011-T019。
- [x] [D003] 在最终验收前先完成 T020-T022。
- [x] [D004] 所有实现完成后执行 T023-T025。
