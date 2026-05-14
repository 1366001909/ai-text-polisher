import * as React from 'react';
import type { CopyStatus } from '../types/ui';

interface CopyButtonProps {
  readonly text: string;
  readonly status: CopyStatus;
  readonly disabled: boolean;
  readonly onChangeStatus: (status: CopyStatus) => void;
}

const CopyButton = ({ text, status, disabled, onChangeStatus }: CopyButtonProps) => {
  const handleCopy = async () => {
    if (!text.trim() || disabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      onChangeStatus('copied');
    } catch {
      onChangeStatus('failed');
    }
  };

  const buttonLabel = status === 'copied' ? '已复制' : status === 'failed' ? '复制失败' : '复制结果';

  return (
    <div className="flex flex-col items-stretch gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/60 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span aria-hidden="true">⧉</span>
        {buttonLabel}
      </button>
      <p className="min-h-5 text-right text-xs text-slate-400">
        {status === 'copied'
          ? '结果已复制到剪贴板。'
          : status === 'failed'
            ? '复制失败，请手动选择文本。'
            : '结果生成后可一键复制。'}
      </p>
    </div>
  );
};

export default CopyButton;