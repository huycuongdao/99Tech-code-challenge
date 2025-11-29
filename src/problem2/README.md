# Currency Swap Form

A production-grade currency swap interface built with Vite + React + TypeScript, demonstrating modern frontend architecture and UX patterns.

## Tech Stack

- **Build Tool:** Vite 6.x
- **Framework:** React 18.x with TypeScript 5.x (strict mode)
- **Data Fetching:** TanStack Query v5
- **Form Handling:** React Hook Form + Zod
- **Styling:** TailwindCSS v3 with glassmorphism design
- **Package Manager:** pnpm

## Features

- Real-time exchange rate calculation from [Switcheo API](https://interview.switcheo.com/prices.json)
- 34 unique tokens with icon support and fallback handling
- Smart button states (text reflects validation errors)
- Swap direction toggle with preserved amounts
- Mobile-first responsive design (320px → 1440px)
- Glassmorphism UI with smooth animations
- Keyboard accessible (Tab, Enter, Esc)
- Reduced motion support

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Navigate to project directory
cd src/problem2

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The app will be available at http://localhost:3000

### Build for Production

```bash
pnpm build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── button.tsx
│   │   ├── spinner.tsx
│   │   ├── token-icon.tsx
│   │   ├── token-fallback.tsx
│   │   ├── token-input-card.tsx
│   │   ├── token-modal.tsx
│   │   └── error-boundary.tsx
│   └── features/         # Domain components
│       └── swap-form.tsx
├── hooks/                # Custom hooks
│   ├── use-prices.ts     # API data fetching
│   ├── use-swap-calculation.ts
│   └── use-debounce.ts
├── types/                # TypeScript interfaces
├── utils/                # Pure utility functions
├── App.tsx               # Root component
├── main.tsx              # Entry point with providers
└── index.css             # Tailwind directives + custom styles
```

## Key Design Decisions

1. **TanStack Query** for server state - prevents useEffect anti-patterns, built-in caching (5min stale-time)
2. **Smart Button Pattern** - button text shows validation errors (matches Uniswap/1inch UX)
3. **Mobile-First** - bottom sheet modal on mobile, centered dialog on desktop
4. **Token Icon Fallback** - colored initials generated from symbol hash when CDN images 404
5. **2s Mock Delay** - simulates real transaction processing time

## API

Data fetched from: `https://interview.switcheo.com/prices.json`

Token icons from: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{SYMBOL}.svg`
