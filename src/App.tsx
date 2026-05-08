import { useState, useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import type { InputType, QROptions } from './types';
import { buildQRContent } from './utils/qrContent';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LeftPanel from './components/LeftPanel';
import QRPreview from './components/QRPreview';

const DEFAULT_OPTIONS: QROptions = {
  fgColor: '#000000',
  bgColor: '#ffffff',
  useGradient: false,
  gradientType: 'linear',
  gradientColor1: '#7c3aed',
  gradientColor2: '#2563eb',
  gradientRotation: 0,
  dotStyle: 'square',
  cornerSquareStyle: 'square',
  cornerDotStyle: 'square',
  useCustomCornerColor: false,
  cornerColor: '#000000',
  logoUrl: '',
  logoSizeRatio: 0.3,
  logoMargin: 5,
  size: 512,
  margin: 2,
  errorLevel: 'M',
};

/** Returns true when viewport is ≥ 1024 px (Tailwind's `lg` breakpoint). */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 1024px)').matches,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

function AppInner() {
  const { theme, toggle } = useTheme();
  const isDesktop = useIsDesktop();

  const [inputType, setInputType] = useState<InputType>('url');
  const [inputData, setInputData] = useState<Record<string, Record<string, string>>>({});
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);

  const currentData = inputData[inputType] ?? {};
  const handleDataChange = (key: string, value: string) =>
    setInputData(p => ({ ...p, [inputType]: { ...(p[inputType] ?? {}), [key]: value } }));

  const content = useMemo(
    () => buildQRContent(inputType, currentData as never),
    [inputType, currentData],
  );

  // Right box height drives left box maxHeight (desktop only)
  const rightRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = rightRef.current;
    if (!el) return;
    setPanelHeight(el.offsetHeight);
    const ro = new ResizeObserver(() => setPanelHeight(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`min-h-screen flex flex-col bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-white transition-colors ${theme === 'dark' ? 'dark' : ''}`}>

      {/* ── Navbar — logo mark + theme toggle only ── */}
      <header className="shrink-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 lg:px-6 h-14 flex items-center justify-between">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth={2}/>
                <rect x="15" y="15" width="3" height="3" rx="0.5" strokeWidth={2}/>
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight">QRcraft</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 7a5 5 0 110 10A5 5 0 0112 7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
      </header>

      {/* ── Body — fills remaining height, centers content vertically ── */}
      <div className="flex-1 flex items-start justify-center px-4 lg:px-6 pt-10 pb-8">
      <div className="w-full max-w-7xl flex flex-col gap-5 lg:gap-6">

        {/* Title above the boxes — centered */}
        <div className="text-center">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">QR Generator</h1>
          <p className="text-base lg:text-lg text-zinc-500 dark:text-zinc-400 mt-2">Custom QR codes for any use case</p>
        </div>

        {/* Boxes row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 lg:items-start">

        {/* ── Right box (QR preview) — appears FIRST on mobile, RIGHT on desktop ── */}
        <div
          ref={rightRef}
          className="w-full lg:w-96 lg:shrink-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5
                     order-1 lg:order-2 lg:sticky lg:top-6"
        >
          <QRPreview content={content} options={options} />
        </div>

        {/* ── Left box (controls) — appears SECOND on mobile, LEFT on desktop ── */}
        <div
          className="w-full lg:flex-1 lg:min-w-0 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-y-auto panel-scroll
                     order-2 lg:order-1"
          style={{ maxHeight: isDesktop ? panelHeight : undefined }}
        >
          <LeftPanel
            inputType={inputType}
            onInputTypeChange={setInputType}
            inputData={currentData}
            onDataChange={handleDataChange}
            options={options}
            onOptionsChange={p => setOptions(o => ({ ...o, ...p }))}
          />
        </div>

        </div>
      </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
