import { API_BASE_PATH, MODEL_NAME, REQUEST_MAX_TOKENS, REQUEST_TEMPERATURE } from '../config/appConfig';
import type { DeepSeekChatRequest, DeepSeekChatResponse, DeepSeekMessage, FriendlyApiError } from '../types/api';

const buildFriendlyError = (message: string, code?: string): FriendlyApiError => {
  const error = new Error(message) as FriendlyApiError;
  if (code) {
    Object.defineProperty(error, 'code', {
      value: code,
      enumerable: true,
    });
  }
  return error;
};

export const createDeepSeekMessages = (systemPrompt: string, userPrompt: string): DeepSeekMessage[] => [
  { role: 'system', content: systemPrompt },
  { role: 'user', content: userPrompt },
];

export const sendDeepSeekChatRequest = async (
  messages: DeepSeekMessage[],
  signal?: AbortSignal,
): Promise<DeepSeekChatResponse> => {
  const response = await fetch(`${API_BASE_PATH}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: REQUEST_TEMPERATURE,
      max_tokens: REQUEST_MAX_TOKENS,
      stream: false,
    } satisfies DeepSeekChatRequest),
    signal,
  });

  if (!response.ok) {
    let serverMessage = '';
    try {
      const payload = (await response.json()) as DeepSeekChatResponse;
      serverMessage = payload.error?.message?.trim() ?? '';
    } catch {
      serverMessage = '';
    }

    const fallbackMessage = response.status === 401
      ? '后端鉴权失败，请检查服务器 API Key 配置。'
      : response.status === 403
        ? '后端拒绝了请求，请检查服务器访问策略。'
      : response.status === 429
        ? '请求过于频繁，请稍后再试。'
        : response.status === 504
          ? '请求超时（30秒），请稍后重试。'
        : '润色请求失败，请稍后重试。';

    throw buildFriendlyError(serverMessage || fallbackMessage, `HTTP_${response.status}`);
  }

  return (await response.json()) as DeepSeekChatResponse;
};

export const extractDeepSeekText = (payload: DeepSeekChatResponse): string => {
  const content = payload.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw buildFriendlyError('模型未返回有效结果，请稍后重试。', 'EMPTY_RESPONSE');
  }
  return content;
};