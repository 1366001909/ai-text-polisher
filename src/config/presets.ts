import type { PresetDefinition, PresetKey } from '../types/preset';

export const PRESETS: PresetDefinition[] = [
  {
    id: 'academic',
    label: '学术润色',
    description: '正式学术语气，去口语化，保持原意不变。',
    promptKey: 'academic',
  },
  {
    id: 'business',
    label: '商务邮件',
    description: '专业商务语气，结构清晰，带问候和礼貌结尾。',
    promptKey: 'business',
  },
  {
    id: 'social',
    label: '社交媒体',
    description: '轻松活泼，可加入 emoji，尽量控制在 280 字内。',
    promptKey: 'social',
  },
  {
    id: 'technical',
    label: '技术文档',
    description: '术语准确，偏被动语态，保留代码格式。',
    promptKey: 'technical',
  },
  {
    id: 'creative',
    label: '创意写作',
    description: '文学性表达，可使用比喻、排比、拟人等修辞。',
    promptKey: 'creative',
  },
  {
    id: 'translation',
    label: '翻译优化',
    description: '中文转地道英文，英文转流畅中文，避免逐字直译。',
    promptKey: 'translation',
  },
] satisfies PresetDefinition[];

export const DEFAULT_PRESET_ID: PresetKey = 'academic';