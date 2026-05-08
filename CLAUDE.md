# QRcraft

QR code generator web app — Bun + Vite + React + TypeScript + Tailwind CSS v4.

## Stack

- **Runtime/package manager**: Bun
- **Build**: Vite
- **UI**: React + TypeScript
- **Styling**: Tailwind CSS v4 (class-based dark mode via `@custom-variant dark`)
- **QR library**: `qr-code-styling` v1.9.2
- **Deploy**: GitHub Pages via GitHub Actions (`/.github/workflows/deploy.yml`)
- **Live URL**: https://log1ri.github.io/qrCodeTest/

## Commands

```bash
bun dev        # start dev server
bun run build  # production build (runs tsc first)
bun run lint   # lint
```

## Project structure

```
src/
  App.tsx                  # layout, state, useIsDesktop hook
  types.ts                 # InputType, QROptions, DotStyle, etc.
  index.css                # Tailwind v4 import + dark mode variant + scrollbar styles
  context/ThemeContext.tsx  # class-based dark/light theme with localStorage
  utils/qrContent.ts       # buildQRContent(type, data) → QR string
  components/
    QRPreview.tsx           # QR rendering + PNG/SVG download
    LeftPanel.tsx           # type tabs + all accordion sections
    InputPanel.tsx          # per-type form fields
    Collapsible.tsx         # smooth accordion (CSS grid trick)
    StylePanel.tsx          # standalone style panel (unused in current layout)
```

## Key decisions

- `margin` in `buildOpts` uses `Math.round(opts.margin * size / 33)` to convert modules → pixels proportionally
- Right panel (QR preview) is `lg:sticky lg:top-6`; left panel `maxHeight` is driven by ResizeObserver on the right panel
- Two-layer scroll: outer `overflow-hidden rounded-2xl` shell + inner `overflow-y-auto` to keep rounded corners while scrolling
- Mobile: QR preview on top (`order-1`), controls below (`order-2`); desktop reverses via flex order
- Default quiet zone: 2 modules
