# QRcraft

A custom QR code generator — built with Bun, Vite, React, TypeScript, and Tailwind CSS v4.

**Live:** https://log1ri.github.io/qrCodeTest/

## Features

- **7 input types** — URL, Text, Email, Phone, SMS, Wi-Fi, Contact (vCard)
- **Dot styles** — Square, Dots, Rounded, Extra-rounded, Classy, Classy+
- **Corner styles** — Square, Round, Circle (frame + dot independently)
- **Colors & gradients** — Solid foreground/background or linear/radial gradient on dots
- **Logo upload** — Embed any image in the center with adjustable size and margin
- **Download** — PNG or SVG at any resolution up to 2048px
- **Copy to clipboard** — One-click copy as PNG
- **Light / Dark theme** — Persisted via localStorage
- **Responsive** — QR preview on top on mobile, side-by-side on desktop

## Stack

| | |
|---|---|
| Runtime | Bun |
| Build | Vite |
| UI | React + TypeScript |
| Styling | Tailwind CSS v4 |
| QR library | qr-code-styling v1.9.2 |
| Deploy | GitHub Pages via GitHub Actions |

## Getting started

```bash
bun install
bun dev
```

```bash
bun run build   # production build (runs tsc first)
bun run lint
```

## Project structure

```
src/
  App.tsx                   # root layout, state, responsive hook
  types.ts                  # InputType, QROptions, style types
  index.css                 # Tailwind v4 + dark mode variant + scrollbar
  context/ThemeContext.tsx   # class-based dark/light theme with localStorage
  utils/qrContent.ts        # builds QR string per input type
  components/
    QRPreview.tsx            # QR render, PNG/SVG download, copy to clipboard
    LeftPanel.tsx            # type tabs + accordion control sections
    InputPanel.tsx           # per-type form fields
    Collapsible.tsx          # smooth accordion (CSS grid trick)
```
