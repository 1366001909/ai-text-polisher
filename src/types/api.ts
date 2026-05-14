import type { PresetKey } from './preset';

export interface DeepSeekMessage {
  readonly role: 'system' | 'user' | 'assistant';
  readonly content: string;
}

export interface DeepSeekChatRequest {
  readonly model: string;
  readonly messages: DeepSeekMessage[];
  readonly temperature: number;
  readonly max_tokens: number;
  readonly stream: false;
}

export interface DeepSeekChatResponse {
  readonly choices?: ReadonlyArray<{
    readonly message?: {
      readonly content?: string;
    };
  }>;
  readonly error?: {
    readonly message?: string;
  };
}

export interface PolishResult {
  readonly presetId: PresetKey;
  readonly model: string;
  readonly text: string;
}

export interface PolishRequestOptions {
  readonly signal?: AbortSignal;
}

export interface FriendlyApiError extends Error {
  readonly code?: string;
}