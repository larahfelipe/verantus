# verantus

A premium, modern fundamental analysis dashboard and peer benchmarking platform designed to analyze financial assets and evaluate them through an auditable quantitative scoring model.

## Features

- **Quantitative Scoring Engine:** Consolidated asset grading (A, B, C, D) based on 5 dimensions: Business Quality, Growth, Financial Health, Valuation, and Efficiency, complete with detailed methodology logs.
- **Provider-Based Data Layer:** Fully decoupled multi-provider architecture (Yahoo Finance integration with robust fallback mapping to local mock data repository).
- **Interactive Data Charts:** Responsive price histories using Chart.js with canvas gradients, dynamic timeframe toggling, and non-blocking local loaders.
- **Detailed Statements:** Summarized Balance Sheets, Income Statements, and Cash Flow logs in dynamic tabular views.
- **Peer Benchmarking Matrices:** Side-by-side comparison tables against sector competitors with calculated ROE/PE spreads.
- **Premium Styling & UI Polish:** Adaptive emerald green color scheme, glassmorphism sticky navigation bar, theme-integrated scrollbars, and pulsing Skeleton loaders.

## Tech Stack

- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia
- **Styling:** Tailwind CSS (v3)
- **Routing:** Vue Router (v5)
- **Charts:** Chart.js
- **Query & HTTP:** TanStack Vue Query (v5), Axios
- **Languages & Linter:** TypeScript, ESLint, Prettier
- **Testing:** Vitest (unit), Playwright (E2E)

## Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
pnpm install
# or npm install / yarn install
```

### 2. Environment Setup
Configure the environment variables by copying `.env.example`:
```bash
cp .env.example .env
```

### 3. Development Server
Run the local hot-reloaded dev server:
```bash
npm run dev
```

### 4. Build Compilation
Compile and optimize for production:
```bash
npm run build
```

### 5. Running Tests
Execute the unit test suite:
```bash
npx vitest
```

### 6. Linting & Formatting
Ensure code styling rules are satisfied:
```bash
npm run lint
npm run prettier
```
