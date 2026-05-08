import type { InputType, QROptions, DotStyle, CornerSquareStyle, CornerDotStyle } from '../types';
import Collapsible from './Collapsible';
import InputPanel from './InputPanel';

interface Props {
  inputType: InputType;
  onInputTypeChange: (t: InputType) => void;
  inputData: Record<string, string>;
  onDataChange: (key: string, value: string) => void;
  options: QROptions;
  onOptionsChange: (patch: Partial<QROptions>) => void;
}

const INPUT_TYPES: { value: InputType; label: string; emoji: string }[] = [
  { value: 'url',   label: 'URL',     emoji: '🔗' },
  { value: 'text',  label: 'Text',    emoji: '📝' },
  { value: 'email', label: 'Email',   emoji: '✉️' },
  { value: 'phone', label: 'Phone',   emoji: '📞' },
  { value: 'sms',   label: 'SMS',     emoji: '💬' },
  { value: 'wifi',  label: 'Wi-Fi',   emoji: '📶' },
  { value: 'vcard', label: 'Contact', emoji: '👤' },
];

const DOT_STYLES: { value: DotStyle; label: string; cls: string }[] = [
  { value: 'square',        label: 'Square',    cls: 'rounded-none' },
  { value: 'dots',          label: 'Dots',      cls: 'rounded-full' },
  { value: 'rounded',       label: 'Rounded',   cls: 'rounded-[4px]' },
  { value: 'extra-rounded', label: 'X-Round',   cls: 'rounded-xl' },
  { value: 'classy',        label: 'Classy',    cls: 'rounded-none [clip-path:polygon(0_0,75%_0,100%_25%,100%_100%,0_100%)]' },
  { value: 'classy-rounded',label: 'Classy+',   cls: 'rounded-[4px] [clip-path:polygon(0_0,75%_0,100%_25%,100%_100%,0_100%)]' },
];

const CORNER_SQ: { value: CornerSquareStyle; label: string }[] = [
  { value: 'square',        label: 'Square' },
  { value: 'extra-rounded', label: 'Round'  },
  { value: 'dot',           label: 'Circle' },
];

const CORNER_DOT: { value: CornerDotStyle; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot',    label: 'Circle' },
];

/* ── shared class strings ── */
const LABEL = 'block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5';
const INPUT  = 'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-base text-zinc-900 dark:text-white focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition';

/* ── tiny helpers ── */
function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="h-9 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-0.5" />
        <input type="text" value={value} onChange={e => onChange(e.target.value)}
          className={INPUT + ' font-mono uppercase'} maxLength={7} />
      </div>
    </div>
  );
}

function PillGroup<T extends string>({
  options, value, onChange,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-lg border text-base transition ${
            value === o.value
              ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium'
              : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function LeftPanel({ inputType, onInputTypeChange, inputData, onDataChange, options, onOptionsChange }: Props) {
  const set = <K extends keyof QROptions>(k: K) => (v: QROptions[K]) => onOptionsChange({ [k]: v });

  return (
    <div>

      {/* ── Type selector — always visible ── */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
        {INPUT_TYPES.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => onInputTypeChange(t.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-3 text-base font-medium whitespace-nowrap border-b-2 transition ${
              inputType === t.value
                ? 'border-violet-500 text-violet-600 dark:text-violet-400 bg-violet-500/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── Accordion sections ── */}

      {/* Content */}
      <Collapsible title="Content" icon="✏️" defaultOpen>
        <InputPanel type={inputType} data={inputData} onChange={onDataChange} />
      </Collapsible>

      {/* Colors */}
      <Collapsible title="Colors" icon="🎨">
        <div className="grid grid-cols-2 gap-3">
          <ColorRow label="Foreground" value={options.fgColor} onChange={set('fgColor')} />
          <ColorRow label="Background" value={options.bgColor} onChange={set('bgColor')} />
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={options.useGradient}
            onChange={e => onOptionsChange({ useGradient: e.target.checked })}
            className="w-4 h-4 accent-violet-500" />
          <span className="text-sm text-zinc-700 dark:text-zinc-300">Gradient on dots</span>
        </label>

        {options.useGradient && (
          <div className="space-y-3 border-l-2 border-violet-500/30 pl-4">
            <div className="grid grid-cols-2 gap-3">
              <ColorRow label="Color 1" value={options.gradientColor1} onChange={set('gradientColor1')} />
              <ColorRow label="Color 2" value={options.gradientColor2} onChange={set('gradientColor2')} />
            </div>
            <div>
              <label className={LABEL}>Type</label>
              <PillGroup
                options={[{ value: 'linear', label: 'Linear' }, { value: 'radial', label: 'Radial' }]}
                value={options.gradientType}
                onChange={set('gradientType')}
              />
            </div>
            {options.gradientType === 'linear' && (
              <div>
                <label className={LABEL}>Rotation — {options.gradientRotation}°</label>
                <input type="range" min={0} max={360} step={15} value={options.gradientRotation}
                  onChange={e => onOptionsChange({ gradientRotation: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
            )}
          </div>
        )}
      </Collapsible>

      {/* Dot Style */}
      <Collapsible title="Dot Style" icon="⚫">
        <div className="grid grid-cols-3 gap-2">
          {DOT_STYLES.map(({ value, label, cls }) => (
            <button key={value} type="button" onClick={() => onOptionsChange({ dotStyle: value })}
              className={`flex flex-col items-center gap-2 p-2.5 rounded-xl border-2 transition text-sm font-medium ${
                options.dotStyle === value
                  ? 'border-violet-500 bg-violet-500/10 text-violet-600 dark:text-violet-400'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600'
              }`}>
              {/* 3×3 dot preview */}
              <div className="grid grid-cols-3 gap-0.5">
                {Array(9).fill(0).map((_, i) => (
                  <div key={i} className={`w-2.5 h-2.5 ${options.dotStyle === value ? 'bg-violet-500' : 'bg-zinc-400 dark:bg-zinc-500'} ${cls}`} />
                ))}
              </div>
              {label}
            </button>
          ))}
        </div>
      </Collapsible>

      {/* Corner Style */}
      <Collapsible title="Corner Style" icon="🔲">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Corner frame</label>
              <PillGroup options={CORNER_SQ} value={options.cornerSquareStyle} onChange={set('cornerSquareStyle')} />
            </div>
            <div>
              <label className={LABEL}>Corner dot</label>
              <PillGroup options={CORNER_DOT} value={options.cornerDotStyle} onChange={set('cornerDotStyle')} />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" checked={options.useCustomCornerColor}
              onChange={e => onOptionsChange({ useCustomCornerColor: e.target.checked })}
              className="w-4 h-4 accent-violet-500" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Custom corner color</span>
          </label>
          {options.useCustomCornerColor && (
            <div className="border-l-2 border-violet-500/30 pl-4">
              <ColorRow label="Corner color" value={options.cornerColor} onChange={set('cornerColor')} />
            </div>
          )}
        </div>
      </Collapsible>

      {/* Logo */}
      <Collapsible title="Logo / Image" icon="🖼️">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-violet-400 dark:hover:border-violet-600 bg-zinc-50 dark:bg-zinc-900 py-3 cursor-pointer transition text-sm text-zinc-500 dark:text-zinc-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {options.logoUrl ? 'Change image' : 'Upload logo'}
              <input type="file" accept="image/*" className="sr-only"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const r = new FileReader();
                  r.onload = ev => onOptionsChange({ logoUrl: ev.target?.result as string });
                  r.readAsDataURL(f);
                }} />
            </label>
            {options.logoUrl && (
              <button onClick={() => onOptionsChange({ logoUrl: '' })}
                className="rounded-xl border border-zinc-300 dark:border-zinc-700 px-3 py-2.5 text-sm text-zinc-500 hover:text-red-500 hover:border-red-400 transition">
                Remove
              </button>
            )}
          </div>
          {options.logoUrl && (
            <>
              <div>
                <label className={LABEL}>Size — {Math.round(options.logoSizeRatio * 100)}%</label>
                <input type="range" min={0.1} max={0.5} step={0.05} value={options.logoSizeRatio}
                  onChange={e => onOptionsChange({ logoSizeRatio: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
              <div>
                <label className={LABEL}>Margin — {options.logoMargin}px</label>
                <input type="range" min={0} max={20} step={1} value={options.logoMargin}
                  onChange={e => onOptionsChange({ logoMargin: Number(e.target.value) })}
                  className="w-full accent-violet-500" />
              </div>
            </>
          )}
        </div>
      </Collapsible>

      {/* Output */}
      <Collapsible title="Output" icon="⚙️">
        <div className="space-y-3">
          <div>
            <label className={LABEL}>Download size — {options.size}px</label>
            <input type="range" min={256} max={2048} step={64} value={options.size}
              onChange={e => onOptionsChange({ size: Number(e.target.value) })}
              className="w-full accent-violet-500" />
            <div className="flex justify-between text-xs text-zinc-400 mt-0.5">
              <span>256</span><span>2048</span>
            </div>
          </div>
          <div>
            <label className={LABEL}>Quiet zone — {options.margin} modules (~{Math.round(options.margin * 280 / 33)}px)</label>
            <input type="range" min={0} max={10} step={1} value={options.margin}
              onChange={e => onOptionsChange({ margin: Number(e.target.value) })}
              className="w-full accent-violet-500" />
          </div>
          <div>
            <label htmlFor="errLvl" className={LABEL}>Error correction</label>
            <select id="errLvl" value={options.errorLevel}
              onChange={e => onOptionsChange({ errorLevel: e.target.value as QROptions['errorLevel'] })}
              className={INPUT}>
              <option value="L">L — Low (7%) — maximum data</option>
              <option value="M">M — Medium (15%)</option>
              <option value="Q">Q — Quartile (25%)</option>
              <option value="H">H — High (30%) — best with logos</option>
            </select>
          </div>
        </div>
      </Collapsible>

    </div>
  );
}
