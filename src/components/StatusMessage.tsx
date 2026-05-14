import * as React from 'react';
import type { MessageVariant } from '../types/ui';

interface StatusMessageProps {
  readonly variant: MessageVariant;
  readonly message: string | null;
}

const variantClasses: Record<MessageVariant, string> = {
  info: 'border-cyan-300/20 bg-cyan-400/10 text-cyan-100',
  success: 'border-emerald-300/20 bg-emerald-400/10 text-emerald-100',
  warning: 'border-amber-300/20 bg-amber-400/10 text-amber-100',
  error: 'border-rose-300/20 bg-rose-400/10 text-rose-100',
};

const StatusMessage = ({ variant, message }: StatusMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${variantClasses[variant]}`} role="status" aria-live="polite">
      {message}
    </div>
  );
};

export default StatusMessage;