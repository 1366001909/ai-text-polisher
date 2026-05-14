import * as React from 'react';
import type { PresetDefinition, PresetKey } from '../types/preset';

interface PresetSelectorProps {
  readonly presets: readonly PresetDefinition[];
  readonly selectedPreset: PresetKey;
  readonly onSelectPreset: (presetId: PresetKey) => void;
}

const PresetSelector = ({ presets, selectedPreset, onSelectPreset }: PresetSelectorProps) => (
  <section className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-5">
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.32em] text-cyan-300/80">场景预设</p>
        <h2 className="mt-1 text-lg font-semibold text-white">选择一个润色场景</h2>
      </div>
      <div className="hidden rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200 md:block">
        6 选 1
      </div>
    </div>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {presets.map((preset) => {
        const active = preset.id === selectedPreset;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelectPreset(preset.id)}
            className={`group rounded-2xl border p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70 ${
              active
                ? 'border-cyan-300/60 bg-cyan-400/15 shadow-lg shadow-cyan-950/20'
                : 'border-white/10 bg-white/5 hover:border-cyan-300/30 hover:bg-cyan-400/8'
            }`}
            aria-pressed={active}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className={`text-base font-semibold ${active ? 'text-cyan-100' : 'text-slate-100'}`}>
                  {preset.label}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">{preset.description}</p>
              </div>
              <span
                className={`mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                  active ? 'bg-cyan-300 text-slate-950' : 'bg-white/10 text-slate-300 group-hover:bg-white/15'
                }`}
              >
                {active ? '✓' : '•'}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </section>
);

export default PresetSelector;