import type { PresetKey } from './preset';

export interface PromptTemplate {
  readonly key: PresetKey;
  readonly title: string;
  readonly systemPrompt: string;
  readonly userInstruction: string;
}

export type PromptLibrary = Record<PresetKey, PromptTemplate>;