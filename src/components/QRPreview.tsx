import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { QROptions } from '../types';

interface Props {
  content: string;
  options: QROptions;
}

const DISPLAY_SIZE = 320;
const PLACEHOLDER = 'https://example.com';

function buildOpts(data: string, opts: QROptions, size: number) {
  const cornerCol = opts.useCustomCornerColor ? opts.cornerColor : opts.fgColor;
  const dotColor = opts.useGradient
    ? undefined
    : opts.fgColor;
  const dotGradient = opts.useGradient ? {
    type: opts.gradientType,
    rotation: opts.gradientRotation * (Math.PI / 180),
    colorStops: [
      { offset: 0, color: opts.gradientColor1 },
      { offset: 1, color: opts.gradientColor2 },
    ],
  } : undefined;

  return {
    width: size,
    height: size,
    data: data || PLACEHOLDER,
    margin: Math.round(opts.margin * size / 33),
    qrOptions: { errorCorrectionLevel: opts.errorLevel },
    backgroundOptions: { color: opts.bgColor },
    dotsOptions: { type: opts.dotStyle, color: dotColor, gradient: dotGradient },
    cornersSquareOptions: { type: opts.cornerSquareStyle, color: cornerCol },
    cornersDotOptions: { type: opts.cornerDotStyle, color: cornerCol },
    image: opts.logoUrl || undefined,
    imageOptions: {
      crossOrigin: 'anonymous' as const,
      margin: opts.logoMargin,
      imageSize: opts.logoSizeRatio,
    },
  };
}

export default function QRPreview({ content, options }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const isEmpty = !content.trim();

  // Init once
  useEffect(() => {
    if (!containerRef.current) return;
    const qr = new QRCodeStyling(buildOpts(content, options, DISPLAY_SIZE));
    qrRef.current = qr;
    containerRef.current.innerHTML = '';
    qr.append(containerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced updates
  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      qrRef.current?.update(buildOpts(content, options, DISPLAY_SIZE));
    }, 120);
    return () => clearTimeout(timerRef.current);
  }, [content, options]);

  const download = async (fmt: 'png' | 'svg') => {
    if (isEmpty) return;
    const qr = new QRCodeStyling({
      ...buildOpts(content, options, options.size),
      type: fmt === 'svg' ? 'svg' : 'canvas',
    });
    const blob = await qr.getRawData(fmt);
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `qrcode.${fmt}`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div
        className="relative flex items-center justify-center rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl transition-colors"
        style={{ width: DISPLAY_SIZE, height: DISPLAY_SIZE, background: options.bgColor, flexShrink: 0 }}
      >
        <div ref={containerRef} />
        {isEmpty && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2">
            <span className="flex items-center gap-1 rounded-full bg-zinc-900/60 dark:bg-zinc-100/10 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold text-white uppercase tracking-widest">
              Preview
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2 w-full">
        <button
          onClick={() => download('png')}
          disabled={isEmpty}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-base font-medium text-white transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0-3-3m3 3 3-3"/>
          </svg>
          PNG
        </button>
        <button
          onClick={() => download('svg')}
          disabled={isEmpty}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2.5 text-base font-medium text-zinc-900 dark:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0-3-3m3 3 3-3"/>
          </svg>
          SVG
        </button>
      </div>

      <div className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 mb-1">
          {isEmpty ? 'Preview encodes' : 'Encoded'}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 break-all font-mono leading-relaxed line-clamp-3">
          {isEmpty ? PLACEHOLDER : content}
        </p>
      </div>
    </div>
  );
}
