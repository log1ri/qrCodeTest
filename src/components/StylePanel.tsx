import type { QROptions, DotStyle, CornerSquareStyle, CornerDotStyle } from '../types';

interface Props {
  options: QROptions;
  onChange: (patch: Partial<QROptions>) => void;
}

const LABEL = 'block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5';
const INPUT = 'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition';
const SECTION_TITLE = 'text-[11px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className={SECTION_TITLE}>{title}</p>
      {children}
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          className={INPUT + ' font-mono uppercase'}
          maxLength={7}
        />
      </div>
    </div>
  );
}

const DOT_STYLES: { value: DotStyle; label: string; cls: string }[] = [
  { value: 'square', label: 'Square', cls: 'rounded-none' },
  { value: 'dots', label: 'Dots', cls: 'rounded-full' },
  { value: 'rounded', label: 'Rounded', cls: 'rounded-md' },
  { value: 'extra-rounded', label: 'X-Round', cls: 'rounded-2xl' },
  { value: 'classy', label: 'Classy', cls: 'rounded-none [clip-path:polygon(0_0,70%_0,100%_30%,100%_100%,0_100%)]' },
  { value: 'classy-rounded', label: 'Classy+', cls: 'rounded-md [clip-path:polygon(0_0,70%_0,100%_30%,100%_100%,0_100%)]' },
];

const CORNER_SQ_STYLES: { value: CornerSquareStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'extra-rounded', label: 'Round' },
  { value: 'dot', label: 'Circle' },
];

const CORNER_DOT_STYLES: { value: CornerDotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Circle' },
];

function ShapeButton<T extends string>({
  selected, label, dotCls, onClick,
}: { value: T; selected: boolean; label: string; dotCls?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition text-xs font-medium ${
        selected
          ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400'
          : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
    >
      <div className="grid grid-cols-3 gap-0.5">
        {Array(9).fill(0).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 ${selected ? 'bg-violet-500' : 'bg-zinc-400 dark:bg-zinc-500'} ${dotCls ?? 'rounded-none'}`}
          />
        ))}
      </div>
      <span className="leading-none">{label}</span>
    </button>
  );
}

export default function StylePanel({ options, onChange }: Props) {
  const set = <K extends keyof QROptions>(k: K) => (v: QROptions[K]) => onChange({ [k]: v });

  return (
    <div className="space-y-6">
      {/* Colors */}
      <Section title="Colors">
        <div className="grid grid-cols-2 gap-3">
          <ColorRow label="Foreground" value={options.fgColor} onChange={set('fgColor')} />
          <ColorRow label="Background" value={options.bgColor} onChange={set('bgColor')} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={options.useGradient}
            onChange={e => onChange({ useGradient: e.target.checked })}
            className="w-4 h-4 accent-violet-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Use gradient on dots</span>
        </label>

        {options.useGradient && (
          <div className="space-y-3 pl-6">
            <div className="grid grid-cols-2 gap-3">
              <ColorRow label="Color 1" value={options.gradientColor1} onChange={set('gradientColor1')} />
              <ColorRow label="Color 2" value={options.gradientColor2} onChange={set('gradientColor2')} />
            </div>
            <div>
              <label className={LABEL}>Type</label>
              <div className="flex gap-2">
                {(['linear', 'radial'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => onChange({ gradientType: t })}
                    className={`flex-1 rounded-lg border py-1.5 text-sm capitalize transition ${
                      options.gradientType === t
                        ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
                        : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {options.gradientType === 'linear' && (
              <div>
                <label className={LABEL}>Rotation — {options.gradientRotation}°</label>
                <input type="range" min={0} max={360} step={15} value={options.gradientRotation}
                  onChange={e => onChange({ gradientRotation: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
            )}
          </div>
        )}
      </Section>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Dot shape */}
      <Section title="Dot Style">
        <div className="grid grid-cols-3 gap-2">
          {DOT_STYLES.map(({ value, label, cls }) => (
            <ShapeButton
              key={value}
              value={value}
              label={label}
              selected={options.dotStyle === value}
              dotCls={cls}
              onClick={() => onChange({ dotStyle: value })}
            />
          ))}
        </div>
      </Section>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Corner styles */}
      <Section title="Corner Style">
        <div>
          <label className={LABEL}>Corner frame</label>
          <div className="flex gap-2">
            {CORNER_SQ_STYLES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ cornerSquareStyle: value })}
                className={`flex-1 rounded-lg border py-1.5 text-sm transition ${
                  options.cornerSquareStyle === value
                    ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={LABEL}>Corner dot</label>
          <div className="flex gap-2">
            {CORNER_DOT_STYLES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onChange({ cornerDotStyle: value })}
                className={`flex-1 rounded-lg border py-1.5 text-sm transition ${
                  options.cornerDotStyle === value
                    ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={options.useCustomCornerColor}
            onChange={e => onChange({ useCustomCornerColor: e.target.checked })}
            className="w-4 h-4 accent-violet-500"
          />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Custom corner color</span>
        </label>
        {options.useCustomCornerColor && (
          <div className="pl-6">
            <ColorRow label="Corner color" value={options.cornerColor} onChange={set('cornerColor')} />
          </div>
        )}
      </Section>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Logo */}
      <Section title="Logo / Image">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-600 bg-zinc-50 dark:bg-zinc-900 py-3 cursor-pointer transition text-sm text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {options.logoUrl ? 'Change image' : 'Upload logo'}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = ev => onChange({ logoUrl: ev.target?.result as string });
                  r.readAsDataURL(f);
                }}
              />
            </label>
            {options.logoUrl && (
              <button
                onClick={() => onChange({ logoUrl: '' })}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2.5 text-sm text-zinc-500 hover:text-red-500 hover:border-red-400 transition"
              >
                Remove
              </button>
            )}
          </div>
          {options.logoUrl && (
            <>
              <div>
                <label className={LABEL}>Logo size — {Math.round(options.logoSizeRatio * 100)}%</label>
                <input type="range" min={0.1} max={0.5} step={0.05} value={options.logoSizeRatio}
                  onChange={e => onChange({ logoSizeRatio: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
              <div>
                <label className={LABEL}>Logo margin — {options.logoMargin}px</label>
                <input type="range" min={0} max={20} step={1} value={options.logoMargin}
                  onChange={e => onChange({ logoMargin: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
            </>
          )}
        </div>
      </Section>

      <hr className="border-zinc-200 dark:border-zinc-800" />

      {/* Output */}
      <Section title="Output">
        <div>
          <label className={LABEL}>Download size — {options.size}px</label>
          <input type="range" min={256} max={2048} step={64} value={options.size}
            onChange={e => onChange({ size: Number(e.target.value) })}
            className="w-full accent-violet-500" />
          <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
            <span>256</span><span>2048</span>
          </div>
        </div>
        <div>
          <label className={LABEL}>Quiet zone — {options.margin} modules</label>
          <input type="range" min={0} max={10} step={1} value={options.margin}
            onChange={e => onChange({ margin: Number(e.target.value) })}
            className="w-full accent-violet-500" />
        </div>
        <div>
          <label htmlFor="errLvl" className={LABEL}>Error correction</label>
          <select id="errLvl" value={options.errorLevel}
            onChange={e => onChange({ errorLevel: e.target.value as QROptions['errorLevel'] })}
            className={INPUT}>
            <option value="L">L — Low (7%) — max data</option>
            <option value="M">M — Medium (15%)</option>
            <option value="Q">Q — Quartile (25%)</option>
            <option value="H">H — High (30%) — best for logos</option>
          </select>
        </div>
      </Section>
    </div>
  );
}
