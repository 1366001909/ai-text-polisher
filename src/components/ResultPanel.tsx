import * as React from 'react';

interface ResultPanelProps {
  readonly value: string;
  readonly isLoading: boolean;
}

const ResultPanel = ({ value, isLoading }: ResultPanelProps) => {
  const hasContent = value.trim().length > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-cyan-300/80">润色结果</p>
          <h2 className="mt-1 text-lg font-semibold text-white">右侧显示 AI 改写后的内容</h2>
        </div>
        <div className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300">
          {isLoading ? '生成中' : hasContent ? '已完成' : '等待输入'}
        </div>
      </div>

      <div className="min-h-[22rem] rounded-2xl border border-dashed border-white/10 bg-slate-900/70 p-4">
        {hasContent ? (
          <pre className="whitespace-pre-wrap break-words text-base leading-8 text-slate-100">{value}</pre>
        ) : (
          <div className="flex h-full min-h-[18rem] flex-col items-center justify-center text-center text-slate-400">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-cyan-300">
              ✨
            </div>
            <p className="text-base font-medium text-slate-200">润色结果会显示在这里</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              选择场景预设、输入文本后点击润色，即可得到更适合目标场景的改写结果。
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ResultPanel;