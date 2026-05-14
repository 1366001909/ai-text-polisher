import * as React from 'react';

interface ActionBarProps {
  readonly onPolish: () => void;
  readonly isLoading: boolean;
  readonly disabled: boolean;
}

const ActionBar = ({ onPolish, isLoading, disabled }: ActionBarProps) => (
  <section className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 shadow-xl shadow-cyan-950/10 backdrop-blur-xl">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-cyan-300/80">操作</p>
        <p className="mt-1 text-sm text-slate-300">点击按钮后将调用 DeepSeek 进行场景化文本润色。</p>
      </div>

      <button
        type="button"
        onClick={onPolish}
        disabled={disabled}
        className="inline-flex min-w-40 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200/70 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/25 border-t-slate-950" />
            润色中...
          </span>
        ) : (
          '开始润色'
        )}
      </button>
    </div>
  </section>
);

export default ActionBar;