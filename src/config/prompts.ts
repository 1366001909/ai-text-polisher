import type { PromptLibrary } from '../types/prompt';

const COMMON_SYSTEM_PROMPT = [
  '你是 AI Text Polisher，一个只负责文本润色的助手。',
  '请只输出润色后的结果，不要解释，不要列出步骤，不要输出分析过程。',
  '如果原文包含代码、表格、编号、引用或特殊格式，请尽量保留原有结构。',
].join('\n');

const COMMON_USER_SUFFIX = [
  '要求：',
  '1. 只输出最终润色结果。',
  '2. 保持与场景一致的表达风格。',
  '3. 不要额外添加和原文无关的内容。',
].join('\n');

export const PROMPT_LIBRARY: PromptLibrary = {
  academic: {
    key: 'academic',
    title: '学术润色',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请将以下文本改写为正式、严谨、客观的学术表达。',
      '去除口语化、情绪化和过于随意的措辞。',
      '确保改写后的意思与原文一致，不要改变核心观点。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
  business: {
    key: 'business',
    title: '商务邮件',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请将以下文本改写为专业商务邮件。',
      '开头要有合适的问候语，正文结构清晰，结尾要有礼貌的收束语。',
      '语气要专业、简洁、得体。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
  social: {
    key: 'social',
    title: '社交媒体',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请将以下文本改写为适合社交媒体发布的内容。',
      '语气要轻松、活泼，可以适当加入 emoji。',
      '在不影响信息完整的前提下，尽量控制在 280 个中文字符以内。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
  technical: {
    key: 'technical',
    title: '技术文档',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请将以下文本改写为技术文档风格。',
      '术语要准确，表达要清晰，流程类内容尽量使用编号步骤。',
      '如果原文包含代码块或行内代码，请保持代码格式不变。',
      '语气可偏向被动表达，但不要生硬。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
  creative: {
    key: 'creative',
    title: '创意写作',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请将以下文本改写为更有文学感和画面感的创意表达。',
      '可以适当使用比喻、排比、拟人等修辞手法。',
      '在保留原意的基础上，让语言更具感染力。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
  translation: {
    key: 'translation',
    title: '翻译优化',
    systemPrompt: COMMON_SYSTEM_PROMPT,
    userInstruction: [
      '请根据原文语言进行双向翻译优化。',
      '如果输入是中文，请输出地道自然的英文；如果输入是英文，请输出流畅自然的中文。',
      '不要逐字硬翻，要优先保证目标语言的自然表达。',
      COMMON_USER_SUFFIX,
    ].join('\n'),
  },
};

export const buildPromptText = (instruction: string, sourceText: string): string =>
  `${instruction}\n\n原始文本：\n${sourceText.trim()}`;