export type InputType = 'url' | 'text' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';
export type Theme = 'light' | 'dark';
export type DotStyle = 'square' | 'dots' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded';
export type CornerSquareStyle = 'square' | 'extra-rounded' | 'dot';
export type CornerDotStyle = 'square' | 'dot';

export interface QROptions {
  // Colors
  fgColor: string;
  bgColor: string;
  // Gradient
  useGradient: boolean;
  gradientType: 'linear' | 'radial';
  gradientColor1: string;
  gradientColor2: string;
  gradientRotation: number;
  // Shapes
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  useCustomCornerColor: boolean;
  cornerColor: string;
  // Logo
  logoUrl: string;
  logoSizeRatio: number;
  logoMargin: number;
  // Output
  size: number;
  margin: number;
  errorLevel: 'L' | 'M' | 'Q' | 'H';
}
