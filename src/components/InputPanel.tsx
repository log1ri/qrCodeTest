import type { InputType } from '../types';

interface Props {
  type: InputType;
  data: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const INPUT = 'w-full rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-base text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition';
const LABEL = 'block text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-1.5';

function Field({ label, id, ...props }: { label: string; id: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label}</label>
      <input id={id} className={INPUT} {...props} />
    </div>
  );
}

export default function InputPanel({ type, data, onChange }: Props) {
  const v = (k: string) => data[k] ?? '';
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(k, e.target.value);

  switch (type) {
    case 'url':
      return <Field label="URL" id="url" type="url" placeholder="https://example.com" value={v('url')} onChange={set('url')} />;

    case 'text':
      return (
        <div>
          <label htmlFor="text" className={LABEL}>Text</label>
          <textarea id="text" rows={5} className={INPUT + ' resize-none'} placeholder="Enter any text..." value={v('text')} onChange={set('text')} />
        </div>
      );

    case 'email':
      return (
        <div className="space-y-3">
          <Field label="Email address" id="email" type="email" placeholder="you@example.com" value={v('email')} onChange={set('email')} />
          <Field label="Subject (optional)" id="subject" placeholder="Hello!" value={v('subject')} onChange={set('subject')} />
        </div>
      );

    case 'phone':
      return <Field label="Phone number" id="phone" type="tel" placeholder="+1 555 000 0000" value={v('phone')} onChange={set('phone')} />;

    case 'sms':
      return (
        <div className="space-y-3">
          <Field label="Phone number" id="phone" type="tel" placeholder="+1 555 000 0000" value={v('phone')} onChange={set('phone')} />
          <div>
            <label htmlFor="message" className={LABEL}>Message (optional)</label>
            <textarea id="message" rows={3} className={INPUT + ' resize-none'} placeholder="Your message..." value={v('message')} onChange={set('message')} />
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-3">
          <Field label="Network name (SSID)" id="ssid" placeholder="MyWiFi" value={v('ssid')} onChange={set('ssid')} />
          <Field label="Password" id="password" type="password" placeholder="••••••••" value={v('password')} onChange={set('password')} />
          <div>
            <label htmlFor="encryption" className={LABEL}>Encryption</label>
            <select id="encryption" className={INPUT} value={v('encryption') || 'WPA'} onChange={set('encryption')}>
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input type="checkbox" className="w-4 h-4 accent-violet-500"
              checked={v('hidden') === 'true'} onChange={e => onChange('hidden', e.target.checked ? 'true' : 'false')} />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Hidden network</span>
          </label>
        </div>
      );

    case 'vcard':
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" id="firstName" placeholder="Jane" value={v('firstName')} onChange={set('firstName')} />
            <Field label="Last name" id="lastName" placeholder="Doe" value={v('lastName')} onChange={set('lastName')} />
          </div>
          <Field label="Phone" id="phone" type="tel" placeholder="+1 555 000 0000" value={v('phone')} onChange={set('phone')} />
          <Field label="Email" id="email" type="email" placeholder="jane@example.com" value={v('email')} onChange={set('email')} />
          <Field label="Organization" id="org" placeholder="Acme Corp" value={v('org')} onChange={set('org')} />
          <Field label="Website" id="url" type="url" placeholder="https://example.com" value={v('url')} onChange={set('url')} />
        </div>
      );
  }
}
