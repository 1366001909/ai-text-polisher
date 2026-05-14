import * as React from 'react';
import ActionBar from './components/ActionBar';
import CopyButton from './components/CopyButton';
import PresetSelector from './components/PresetSelector';
import ResultPanel from './components/ResultPanel';
import StatusMessage from './components/StatusMessage';
import TextInputPanel from './components/TextInputPanel';
import { APP_SUBTITLE, APP_TITLE, MAX_TEXT_LENGTH } from './config/appConfig';
import { DEFAULT_PRESET_ID, PRESETS } from './config/presets';
import { polishText } from './api/polishText';
import type { CopyStatus, MessageVariant, RequestStatus } from './types/ui';

const COPY_MESSAGE_TIMEOUT = 1800;

const App = () => {
  const [sourceText, setSourceText] = React.useState('');
  const [selectedPreset, setSelectedPreset] = React.useState(DEFAULT_PRESET_ID);
  const [resultText, setResultText] = React.useState('');
  const [requestStatus, setRequestStatus] = React.useState<RequestStatus>('idle');
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [statusVariant, setStatusVariant] = React.useState<MessageVariant>('info');
  const [copyStatus, setCopyStatus] = React.useState<CopyStatus>('idle');

  const selectedPresetMeta = React.useMemo(
    () => PRESETS.find((preset) => preset.id === selectedPreset) ?? PRESETS[0],
    [selectedPreset],
  );

  const isLoading = requestStatus === 'loading';
  const hasResult = resultText.trim().length > 0;
  const canSubmit = !isLoading && sourceText.trim().length > 0 && sourceText.length <= MAX_TEXT_LENGTH;

  React.useEffect(() => {
    if (copyStatus === 'idle') {
      return;
    }

    const timer = window.setTimeout(() => setCopyStatus('idle'), COPY_MESSAGE_TIMEOUT);
    return () => window.clearTimeout(timer);
  }, [copyStatus]);

  React.useEffect(() => {
    if (sourceText.length <= MAX_TEXT_LENGTH && requestStatus === 'error' && statusMessage === '文本超过 3000 字符，请先删减后再润色。') {
      setStatusMessage(null);
    }
  }, [requestStatus, sourceText.length, statusMessage]);

  const handlePolish = async () => {
    const trimmedText = sourceText.trim();

    if (!trimmedText) {
      setRequestStatus('error');
      setStatusVariant('warning');
      setStatusMessage('请先输入需要润色的文本。');
      return;
    }

    if (sourceText.length > MAX_TEXT_LENGTH) {
      setRequestStatus('error');
      setStatusVariant('warning');
      setStatusMessage('文本超过 3000 字符，请先删减后再润色。');
      return;
    }

    setRequestStatus('loading');
    setStatusVariant('info');
    setStatusMessage('润色中...');

    try {
      const result = await polishText(trimmedText, selectedPreset);
      setResultText(result.text);
      setRequestStatus('success');
      setStatusVariant('success');
      setStatusMessage(`润色完成，当前场景为「${selectedPresetMeta.label}」。`);
      setCopyStatus('idle');
    } catch (error) {
      const message = error instanceof Error ? error.message : '润色失败，请稍后重试。';
      setRequestStatus('error');
      setStatusVariant('error');
      setStatusMessage(message);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/55 p-6 shadow-2xl shadow-cyan-950/10 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.4em] text-cyan-300/80">AI 写作助手</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{APP_TITLE}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">{APP_SUBTITLE}</p>
            </div>

            <div className="grid gap-3 rounded-2xl border border-cyan-300/15 bg-cyan-400/10 px-4 py-4 text-sm text-cyan-100 sm:grid-cols-3 sm:gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">模型</p>
                <p className="mt-1 font-semibold">deepseek-chat</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">上限</p>
                <p className="mt-1 font-semibold">3000 字符</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/70">状态</p>
                <p className="mt-1 font-semibold">{isLoading ? '润色中' : '待机中'}</p>
              </div>
            </div>
          </div>
        </header>

        <PresetSelector presets={PRESETS} selectedPreset={selectedPreset} onSelectPreset={setSelectedPreset} />

        <main className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="flex flex-col gap-4">
            <TextInputPanel value={sourceText} onChange={setSourceText} disabled={isLoading} />
            <ActionBar onPolish={handlePolish} isLoading={isLoading} disabled={!canSubmit} />
            <StatusMessage variant={statusVariant} message={statusMessage} />
          </div>

          <div className="flex flex-col gap-4">
            <ResultPanel value={resultText} isLoading={isLoading} />
            <div className="flex justify-start sm:justify-end">
              <CopyButton
                text={resultText}
                status={copyStatus}
                disabled={!hasResult}
                onChangeStatus={setCopyStatus}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;