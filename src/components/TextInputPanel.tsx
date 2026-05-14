import * as React from 'react';
import { MAX_TEXT_LENGTH } from '../config/appConfig';

interface TextInputPanelProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly disabled?: boolean;
}

const TextInputPanel = ({ value, onChange, disabled = false }: TextInputPanelProps) => {
  const length = value.length;
  const overLimit = length > MAX_TEXT_LENGTH;

  return (
    <section className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.32em] text-cyan-300/80">原始文本</p>
          <h2 className="mt-1 text-lg font-semibold text-white">把需要润色的内容贴在这里</h2>
        </div>
        <div className={`rounded-full px-3 py-1 text-xs font-medium ${overLimit ? 'bg-rose-500/15 text-rose-200' : 'bg-white/5 text-slate-300'}`}>
          {length} / {MAX_TEXT_LENGTH}
        </div>
      </div>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        maxLength={MAX_TEXT_LENGTH + 200}
        placeholder="请输入原始文本，支持中文、英文或中英混合内容。"
        className={`min-h-[22rem] w-full resize-y rounded-2xl border bg-slate-900/70 px-4 py-4 text-base leading-7 text-slate-50 outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-70 ${
          overLimit ? 'border-rose-400/60' : 'border-white/10'
        }`}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <p className={overLimit ? 'text-rose-200' : 'text-slate-400'}>
          {overLimit ? '已超过 3000 字符限制，请删减后再提交。' : '建议一次输入 3000 字符以内，结果会更快返回。'}
        </p>
        <p className="text-slate-500">支持保留代码块、编号和特殊格式。</p>
      </div>
    </section>
  );
};

export default TextInputPanel;