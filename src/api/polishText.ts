import { DEFAULT_PRESET_ID } from '../config/presets';
import { PROMPT_LIBRARY, buildPromptText } from '../config/prompts';
import type { PolishRequestOptions, PolishResult } from '../types/api';
import type { PresetKey } from '../types/preset';
import { createDeepSeekMessages, extractDeepSeekText, sendDeepSeekChatRequest } from './deepseekClient';

const normalizeSourceText = (sourceText: string): string => sourceText.trim();

export const polishText = async (
  sourceText: string,
  presetId: PresetKey = DEFAULT_PRESET_ID,
  options?: PolishRequestOptions,
): Promise<PolishResult> => {
  const normalizedText = normalizeSourceText(sourceText);
  const prompt = PROMPT_LIBRARY[presetId];

  if (!normalizedText) {
    throw new Error('请输入需要润色的文本。');
  }

  const messages = createDeepSeekMessages(
    prompt.systemPrompt,
    buildPromptText(prompt.userInstruction, normalizedText),
  );

  const payload = await sendDeepSeekChatRequest(messages, options?.signal);
  const polishedText = extractDeepSeekText(payload);

  return {
    presetId,
    model: 'deepseek-chat',
    text: polishedText,
  };
};