# AI Text Polisher 技术方案

## 1. 技术约束对齐
本方案严格遵守宪法的约束：
- 前端技术栈固定为 React 19 + TypeScript 严格模式 + Vite + Tailwind CSS v4
- 不引入 MUI、Ant Design、Chakra UI、CSS Modules、styled-components
- 不使用 Redux、Zustand、Jotai，不引入路由
- 不在组件中直接 fetch，统一走 src/api/
- 6 个场景 prompt 统一放在 src/config/
- 禁止 any，保持单文件单组件原则

## 2. 总体架构
应用采用单页双栏编辑器结构：
- 左侧：原始文本输入区
- 顶部：6 个场景预设选择器
- 中部：润色按钮与加载状态
- 右侧：润色结果展示区与复制按钮

交互流程保持单向清晰：
1. 用户输入文本
2. 选择场景预设
3. 点击润色
4. 调用统一 API 层请求 DeepSeek
5. 返回结果并展示
6. 支持一键复制

状态管理仅使用组件内 useState、useEffect、useMemo 等 React 原生能力，不做全局状态抽象。

## 3. 目录与文件结构
仅使用以下核心目录：
- src/components/
- src/api/
- src/config/
- src/types/

建议文件结构如下：
- src/components/
  - TextInputPanel.tsx
  - PresetSelector.tsx
  - ActionBar.tsx
  - ResultPanel.tsx
  - CopyButton.tsx
  - StatusMessage.tsx
- src/api/
  - deepseekClient.ts
  - polishText.ts
- src/config/
  - presets.ts
  - prompts.ts
  - appConfig.ts
- src/types/
  - index.ts
  - prompt.ts
  - api.ts

说明：
- 每个组件一个文件，不在单文件中导出多个组件
- 场景定义、提示词模板、模型参数统一放在 config
- 请求封装和响应处理统一放在 api

## 4. 页面与组件设计
### 4.1 页面布局
主页面采用响应式双栏布局：
- 桌面端左右并排
- 窄屏时上下堆叠
- 顶部固定场景切换区
- 底部提供文本长度提示、加载/错误提示

### 4.2 组件职责
- PresetSelector：渲染 6 个场景预设，负责高亮当前选择
- TextInputPanel：输入文本、显示字数、限制 3000 字
- ActionBar：承载润色按钮与加载状态文本
- ResultPanel：展示结果文本
- CopyButton：复制结果并反馈状态
- StatusMessage：统一展示加载、错误、成功提示

### 4.3 复用策略
同一种 UI 模式出现两次及以上时抽成组件，例如：
- 按钮状态样式统一抽取
- 提示消息样式统一抽取
- 面板容器样式统一抽取

## 5. 大模型应用配置
### 5.1 模型与接口约定
- 固定模型：deepseek-chat
- API 基址：开发环境通过 Vite proxy 转发到 https://api.deepseek.com/
- 前端请求路径统一使用 /api/*
- API Key 通过环境变量 VITE_DEEPSEEK_API_KEY 读取

### 5.2 请求封装方案
src/api/deepseekClient.ts 负责：
- 读取环境变量
- 组装请求头
- 统一处理 HTTP 状态码
- 屏蔽底层错误细节，输出适合 UI 的错误信息

src/api/polishText.ts 负责：
- 接收原始文本与场景 preset
- 从 src/config/presets.ts 读取对应 prompt
- 组装 DeepSeek 请求 payload
- 返回标准化结果给组件层

### 5.3 Prompt 配置方案
src/config/prompts.ts 统一维护 6 个场景 prompt：
- 学术润色
- 商务邮件
- 社交媒体
- 技术文档
- 创意写作
- 翻译优化

配置原则：
- prompt 与 UI 完全分离
- 修改 prompt 不需要改组件代码
- 每个场景保持明确的输出约束
- 翻译优化场景需根据输入语言自动推断输出语言

### 5.4 具体提示词规则
- 学术润色：正式学术语气，去口语化，保持原意
- 商务邮件：专业商务语气，结构清晰，含问候和结尾礼貌话
- 社交媒体：轻松活泼，可用 emoji，尽量控制在 280 字内
- 技术文档：术语准确，偏被动语态，步骤编号，保留代码格式
- 创意写作：文学化表达，使用比喻、排比、拟人等修辞
- 翻译优化：中文转地道英文，英文转流畅中文，避免逐字直译

### 5.5 接口失败与空值处理
- 缺少 API Key 时直接阻止请求并提示用户配置环境变量
- 网络错误展示友好提示
- 非 2xx 响应统一转为用户可理解的错误文案
- 结果为空时保持 UI 稳定，不中断页面交互

## 6. 交互与状态设计
### 6.1 状态划分
组件内建议维护以下状态：
- sourceText：输入文本
- selectedPreset：当前场景
- isLoading：请求中状态
- resultText：返回结果
- errorMessage：错误提示
- copyStatus：复制反馈

### 6.2 约束处理
- 输入字符上限 3000 字
- 超限时阻止提交并提示
- 润色中状态禁用重复提交
- 结果存在时才显示复制按钮

### 6.3 反馈策略
- 加载中：显示“润色中...”
- 成功：显示简短成功提示
- 失败：显示友好错误提示，不展示堆栈
- 复制成功：显示“已复制”或同类轻提示

## 7. 类型与质量方案
- 所有数据结构显式定义在 src/types/
- 不使用 any
- API 响应类型、preset 类型、prompt 类型分开定义
- 所有函数参数与返回值尽量显式标注
- 通过 TypeScript 严格模式保证配置与接口的可维护性

## 8. 开发与构建方案
- Vite 负责本地开发和构建
- 使用 Vite proxy 解决跨域问题
- Tailwind CSS v4 负责样式原子化实现
- 不依赖额外 UI 框架，减少样式冲突和包体积

## 9. 实施顺序
1. 建立类型与配置文件
2. 实现 DeepSeek API 封装
3. 搭建页面骨架与布局组件
4. 接入预设选择与 prompt 映射
5. 接入润色请求与加载状态
6. 接入错误处理与复制功能
7. 完成字数限制、响应式样式与细节打磨

## 10. 验收标准
- 单页完成输入、选场景、润色、复制全流程
- 6 个场景预设全部可用
- 加载与错误提示明确
- 3000 字限制生效
- DeepSeek 模型固定为 deepseek-chat
- API Key 不硬编码
- prompt 修改不影响 UI 组件
- 代码结构符合单文件单组件与目录边界规范

## 11. 风险与约束说明
- 若 DeepSeek 接口鉴权失败，必须优先检查环境变量与代理配置
- 若输出不符合场景预期，应优先调整 prompt，不应先改 UI
- 若后续新增功能超出单页文本润色边界，必须先更新宪法

## 12. 版本信息
- 方案版本：v1.0.0
- 对应宪法：1.0.0
- 适用范围：AI Text Polisher 单页前端应用
