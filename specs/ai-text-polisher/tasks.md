# 任务列表：AI Text Polisher

**输入**：来自 `/specs/ai-text-polisher/` 的设计文档
**前置条件**：[plan.md](specs/ai-text-polisher/plan.md)、[spec.md](specs/ai-text-polisher/spec.md)

**组织方式**：任务按阶段分组，确保每个阶段都可以独立完成并独立验证。

## 格式：`[ID] [P] 描述`

- **[P]**：可与同阶段其他任务并行执行
- 每条任务描述都要包含准确的文件路径
- 每个任务都必须产出一个明确的结果物

---

## 第 1 阶段：项目初始化与基础样式

**目的**：建立 Vite + React + TypeScript + Tailwind 基础，并开启严格类型检查。

- [x] T001 在 package.json、tsconfig.json、vite.config.mjs 中搭建 Vite React 19 项目基础，并启用 TypeScript strict mode；产出：一个可以构建的锁定技术栈项目骨架。
- [x] T002 [P] 在 src/index.css 中配置全局 Tailwind CSS v4 入口样式，并确保 src/main.tsx 引入该样式表；产出：全局可用的 Tailwind 工具类，不使用 CSS Modules 或 styled-components。
- [x] T003 [P] 在 src/types/preset.ts、src/types/prompt.ts、src/types/api.ts、src/types/ui.ts 中创建共享类型定义；产出：预设、提示词、API 载荷和 UI 状态的类型契约，且不含 any。
- [x] T004 通过运行 npm run build 验证第 1 阶段，确认基础项目可以成功编译。

---

## 第 2 阶段：核心配置与 AI 集成层

**目的**：构建应用级常量、预设/提示词来源，以及 DeepSeek 请求层。

- [x] T005 在 vite.config.mjs 中配置 Vite 开发代理，使 /api/* 通过 changeOrigin: true 和去除 /api 前缀的 rewrite 规则转发到 https://api.deepseek.com/*；产出：开发时可直接使用的跨域代理路由。
- [x] T006 [P] 在 src/config/appConfig.ts 中创建固定运行时常量 maxTextLength = 3000、modelName = 'deepseek-chat'、apiBasePath = '/api'；产出：应用级参数的单一来源。
- [x] T007 [P] 在 src/config/presets.ts 中创建 6 个预设定义（学术润色、商务邮件、社交媒体、技术文档、创意写作、翻译优化），包含稳定的 id、label 和 promptKey；产出：类型化的预设注册表。
- [x] T008 [P] 在 src/config/prompts.ts 中创建 6 套提示词模板，并附带通用约束块，统一说明保留原意、语言风格和格式规则；产出：与 UI 分离的提示词文本。
- [x] T009 在 src/api/deepseekClient.ts 中实现读取 import.meta.env.VITE_DEEPSEEK_API_KEY、附加授权头、通过 /api/* 调用 DeepSeek 端点，并将 HTTP/网络失败映射为友好错误；产出：可复用的类型化 API 客户端。
- [x] T010 在 src/api/polishText.ts 中实现接收原始文本与预设 id、从 src/config/prompts.ts 选择对应提示词、以 model = 'deepseek-chat' 组装 DeepSeek 请求载荷，并返回标准化结果对象；产出：供 UI 调用的润色函数。
- [x] T011 通过运行 npm run build 验证第 2 阶段，确认配置与 API 层代码可以干净编译。

---

## 第 3 阶段：可复用 UI 组件与页面骨架

**目的**：构建小而可复用的组件层，确保一个组件一个文件。

- [x] T012 在 src/components/PresetSelector.tsx 中创建预设切换器，渲染 6 个场景并输出当前选中的 preset id；产出：可复用的预设选择组件。
- [x] T013 [P] 在 src/components/TextInputPanel.tsx 中创建原始文本输入区，包含 3000 字符计数与超限反馈；产出：带长度感知的可复用输入组件。
- [x] T014 [P] 在 src/components/ResultPanel.tsx 中创建只读结果面板，用于展示润色后的输出；产出：可复用的结果展示组件。
- [x] T015 [P] 在 src/components/ActionBar.tsx 中创建润色操作区，渲染“润色”按钮及“润色中...”之类的加载状态文案；产出：可复用的操作区域组件。
- [x] T016 [P] 在 src/components/CopyButton.tsx 中创建复制按钮，用于复制当前结果并展示成功状态；产出：可复用的复制操作组件。
- [x] T017 [P] 在 src/components/StatusMessage.tsx 中创建状态提示组件，用于统一显示加载、成功和友好错误信息；产出：可复用的状态提示条组件。
- [x] T018 在 src/App.tsx 中仅使用本地 React 状态和新组件组装单页布局，让左侧输入区、顶部预设选择器和右侧结果区形成响应式单页编辑器；产出：无路由、无全局 store 的应用壳。
- [x] T019 通过运行 npm run build 验证第 3 阶段，确认页面骨架和组件层可以成功编译。

---

## 第 4 阶段：润色工作流联通

**目的**：连接 UI 与提示词/配置层，实现端到端 AI 请求流程。

- [x] T020 在 src/App.tsx 中接入 src/config/presets.ts 和 src/config/prompts.ts，使当前选中的预设决定润色时使用的具体提示词模板；产出：由预设驱动的请求组装逻辑。
- [x] T021 将 src/App.tsx 中的“润色”按钮连接到 src/api/polishText.ts，并加入加载状态控制、结果回填以及请求进行中禁用重复提交；产出：可工作的润色请求流程。
- [x] T022 在 src/components/TextInputPanel.tsx 与 src/App.tsx 中强制执行 3000 字符限制，确保超限内容不能提交，并立即显示清晰反馈；产出：长文本提交硬限制。
- [x] T023 在 src/components/StatusMessage.tsx 与 src/App.tsx 中加入友好错误处理，使网络或 API 失败时给出用户可理解的指引，而不是原始堆栈；产出：安全的失败状态。
- [x] T024 通过运行 npm run build 验证第 4 阶段，确认完整润色流程可随新的集成代码一起编译通过。

---

## 第 5 阶段：复制流程、界面打磨与加固

**目的**：完成面向用户的细节，落实样式约束，并准备最终交付。

- [x] T025 在 src/components/CopyButton.tsx 与 src/App.tsx 中完成复制到剪贴板流程，使用润色结果文本并在复制后给出成功反馈；产出：一键复制行为。
- [x] T026 在 src/App.tsx 与 src/components/*.tsx 中优化响应式 Tailwind 布局与视觉层级，确保应用在桌面和移动端都保持整洁，同时不新增任何 CSS 框架；产出：最终单页 UI 样式。
- [x] T027 检查 src/**/*.ts 与 src/**/*.tsx 的 TypeScript 严格模式符合性，清理仍存在的 any，并在需要时强化 src/types/ 中的类型；产出：严格模式安全的代码。
- [x] T028 在项目根目录新增 .env.example，说明 VITE_DEEPSEEK_API_KEY 的使用方式，并描述本地运行所需配置，但不暴露任何密钥；产出：安全的环境变量说明。
- [x] T029 通过运行 npm run build 验证第 5 阶段，确认在复制、样式和类型加固后最终应用依然能够成功编译。

---

## 约束检查

**目的**：从宪法中提炼出的验收清单。发布前必须全部勾选完成。

- [x] C001 产品仍然是一个纯前端单页文本润色应用，不包含 CMS、协作、账号系统或其他无关范围。
- [x] C002 技术栈锁定为 React 19、TypeScript 严格模式、Vite 和 Tailwind CSS v4。
- [x] C003 未引入额外 CSS 框架，包括 MUI、Ant Design 和 Chakra UI。
- [x] C004 代码库中没有使用 CSS Modules 或 styled-components。
- [x] C005 没有新增路由，因为应用只设计为单页。
- [x] C006 没有引入 Redux、Zustand、Jotai 或类似状态管理库。
- [x] C007 已启用 TypeScript 严格模式，且代码库中不包含 any。
- [x] C008 UI 组件保持一文件一个组件，且没有文件导出多个组件。
- [x] C009 所有 API 调用都经过 src/api/，没有组件直接调用 fetch。
- [x] C010 六个提示词模板都位于 src/config/ 中，模型固定为 deepseek-chat，API Key 来自 VITE_DEEPSEEK_API_KEY，开发代理使用 /api/* -> https://api.deepseek.com/* 且包含 changeOrigin: true 和 rewrite 规则。

---

## 依赖与执行顺序

### 阶段依赖
- 第 1 阶段可以立即开始。
- 第 2 阶段依赖第 1 阶段完成。
- 第 3 阶段依赖第 2 阶段完成。
- 第 4 阶段依赖第 3 阶段完成。
- 第 5 阶段依赖第 4 阶段完成。

### 验证规则
- 每个阶段的最后一个任务必须是 npm run build。
- 不要把 npm run dev 作为阶段末尾的验证步骤。

### 执行说明
- 尽可能保持配置修改与 UI 修改分离。
- 优先编写小而清晰、能产出文件级结果的任务。
- 只要任务涉及配置，就必须在任务描述中写清楚准确参数值。
