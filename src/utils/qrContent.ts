import type { InputType, WiFiData, VCardData } from '../types';

export function buildQRContent(type: InputType, data: Record<string, string> & Partial<WiFiData> & Partial<VCardData>): string {
  switch (type) {
    case 'url':
      return data.url || '';
    case 'text':
      return data.text || '';
    case 'email':
      return `mailto:${data.email}${data.subject ? `?subject=${encodeURIComponent(data.subject)}` : ''}`;
    case 'phone':
      return `tel:${data.phone}`;
    case 'sms':
      return `sms:${data.phone}${data.message ? `?body=${encodeURIComponent(data.message)}` : ''}`;
    case 'wifi':
      return `WIFI:T:${data.encryption || 'WPA'};S:${data.ssid || ''};P:${data.password || ''};H:${data.hidden ? 'true' : 'false'};;`;
    case 'vcard':
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.lastName || ''};${data.firstName || ''}`,
        `FN:${data.firstName || ''} ${data.lastName || ''}`,
        data.org ? `ORG:${data.org}` : '',
        data.phone ? `TEL:${data.phone}` : '',
        data.email ? `EMAIL:${data.email}` : '',
        data.url ? `URL:${data.url}` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
    default:
      return '';
  }
}
