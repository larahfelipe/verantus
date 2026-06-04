# verantus

A high-fidelity quantitative fundamental analysis and investment research platform for equities, designed to analyze financial assets, benchmark competitors, and evaluate businesses through an auditable multi-factor quantitative scoring model.

## Features

- **Quantitative Scoring Engine:** Consolidated asset grading (A, B, C, D) based on 5 dimensions: Business Quality, Growth, Financial Health, Valuation, and Efficiency, complete with detailed methodology logs.
- **Provider-Based Data Layer:** Fully decoupled multi-provider architecture (Yahoo Finance integration with robust fallback mapping to local mock data repository).
- **Interactive Data Charts:** Responsive price histories using Chart.js with canvas gradients, dynamic timeframe toggling, and non-blocking local loaders.
- **Detailed Statements:** Summarized Balance Sheets, Income Statements, and Cash Flow logs in dynamic tabular views.
- **Peer Benchmarking Matrices:** Side-by-side comparison tables against sector competitors with calculated ROE/PE spreads.

## Tech stack

- **Framework:** Vue 3 (Composition API)
- **State Management:** Pinia
- **Styling:** Tailwind CSS (v3)
- **Routing:** Vue Router (v5)
- **Charts:** Chart.js
- **Query & HTTP:** TanStack Vue Query (v5), Axios
- **Languages & Linter:** TypeScript, ESLint, Prettier
- **Testing:** Vitest (unit), Playwright (E2E)

## Getting started

### 1. Installation
Clone the repository and install dependencies:
```bash
yarn install
```

### 2. Environment setup
Configure the environment variables by copying `.env.example` and adding your Yahoo Finance API key:
```bash
cp .env.example .env
```
Open the `.env` file and insert your API key in the `VITE_YAHOO_FINANCE_API_KEY` variable.

### 3. Dev server
Run the local hot-reloaded dev server:
```bash
yarn dev
```

### 4. Build
Compile and optimize for production:
```bash
yarn build
```
