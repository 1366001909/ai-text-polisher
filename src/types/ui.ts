export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export type CopyStatus = 'idle' | 'copied' | 'failed';

export type MessageVariant = 'info' | 'success' | 'warning' | 'error';

export interface StatusBanner {
  readonly variant: MessageVariant;
  readonly text: string;
}