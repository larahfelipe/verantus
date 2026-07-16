# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Verantus is a single-page Vue 3 equity research dashboard. It fetches raw fundamentals from Yahoo Finance (via yfapi.net), normalizes them, and runs an auditable multi-factor quantitative scoring model plus a DCF/reverse-DCF valuation entirely on the client. There is no backend — all analysis is derived in the browser.

## Commands

Package manager is **yarn**.

- `yarn dev` — Vite dev server with HMR
- `yarn build` — type-checks with `vue-tsc --noEmit` then builds; the build fails on type errors
- `yarn serve` — preview a production build
- `yarn test` — Vitest in watch mode
- `yarn test:coverage` — single run with coverage
- `vitest run src/shared/utils/scoring.test.ts` — run a single test file
- `yarn lint` / `yarn lint:fix` — ESLint (`.vue`/`.ts`), `--max-warnings=0` so any warning fails
- `yarn prettier` / `yarn prettier:fix` — Prettier check/write
- `yarn typecheck` — `tsc --noEmit`

CI (`.github/workflows/ci.yml`) runs, in order: `lint` → `prettier` → `typecheck` → `build` on Node 24. Match that gate locally before pushing — note `lint` and `prettier` are strict (zero warnings), and `build` re-runs type-checking.

## Environment

Requires `VITE_YAHOO_FINANCE_API_KEY` (a yfapi.net key). Copy `.env.example` to `.env` and set it. Read only via `import.meta.env` inside [src/config/index.ts](src/config/index.ts); do not scatter `import.meta.env` reads elsewhere.

## Architecture

Data flows one direction: **provider → repository → store → pages/components**.

1. **Provider layer** ([src/shared/services/providers/](src/shared/services/providers/)) — the only place that talks to Yahoo. [YahooFinanceProvider.ts](src/shared/services/providers/YahooFinanceProvider.ts) implements [IFinancialDataProvider](src/shared/services/providers/IFinancialDataProvider.ts), calls two yfapi.net endpoints (`quoteSummary` for fundamentals, `chart` for price history), and returns a fully-computed `NormalizedAsset`. It performs all scoring and analysis derivation before returning — components receive finished data, never raw Yahoo payloads.
2. **[FinancialDataRepository.ts](src/shared/services/providers/FinancialDataRepository.ts)** — orchestrates the provider, tolerates a missing price history (logs and continues), and backfills range-window returns from the close series. Exported as the `financialRepository` singleton.
3. **[stockStore.ts](src/stores/stockStore.ts)** (Pinia, setup-style) — the single source of truth for the current asset, symbol/exchange/range, loading, and error. Persists the last asset to `localStorage` with a 24h TTL and a versioned key (`verantus@cached_stock_v2`); it validates and evicts stale/invalid cache on load. Brazilian tickers use the `.SA` exchange suffix, split from the symbol in the store.
4. **UI** — [DashboardLayout.vue](src/layouts/DashboardLayout.vue) → [DashboardPage.vue](src/pages/DashboardPage.vue), composed of feature modules under [src/modules/](src/modules/) (`asset-analysis`, `valuation`, `financial-statements`, `dividends`), each `components/` + optional `composables/`/`utils/`. Cross-cutting UI lives in [src/shared/components/ui/](src/shared/components/ui/). Single route only (`/`).

### The scoring engine

[src/shared/utils/scoring.ts](src/shared/utils/scoring.ts) is the core and the most sensitive file. `computeQuantitativeScores(metrics, profile)` grades five dimensions — Business Quality, Growth, Financial Health, Valuation, Efficiency — each into a `ScoreComponent` with per-metric `ScoreItemDetail` audit rows (value, weight, benchmark, explanation). Key invariants when editing:

- Metric fractions are weight-normalized so **missing metrics drop out** rather than penalize; never substitute a default 0 for absent data.
- The `benchmark` label shown to the user is derived from the same constant that drives the scoring rule — keep them tied so the audit trail stays truthful.
- Sector-relative metrics compare against [SECTOR_BENCHMARKS](src/shared/constants/benchmarks.ts) (falling back to `DEFAULT_BENCHMARK`); others use absolute hurdle constants declared at the top of the file.
- `CONSOLIDATED_WEIGHTS` and `FUNDAMENTAL_HEALTH_WEIGHTS` are the canonical weights; `computeFundamentalHealthIndex` reuses the same constants so the dashboard cannot drift from the engine. Letter grades (A/B/C/D) come from [grading.ts](src/modules/asset-analysis/utils/grading.ts).

This is the only file with unit tests ([scoring.test.ts](src/shared/utils/scoring.test.ts)); update them when changing scoring behavior.

### The derivation layer

[deriveAnalysis.ts](src/shared/services/providers/deriveAnalysis.ts) turns statement history into the qualitative/quantitative synthesis: multi-year statement assembly (income/balance/cash-flow aligned by fiscal year), evolution stats (CAGR, volatility, trends), DCF with bear/base/bull scenarios, reverse-DCF (bisection for implied growth), moat, capital allocation, risk, and thesis. Its guiding rule: **every value is computed from real upstream inputs — no per-symbol hardcoding.** When an input is missing, return `null`/empty so the UI renders "—"; do not invent values. All numeric assumptions (tax rate, discount rate, growth bounds, thresholds) are named constants in section 1 of the file.

Provenance tags (`live` / `derived`) on `NormalizedAsset.provenance` mark whether each block came from the API or was computed; [DataQualityBadge.vue](src/shared/components/ui/DataQualityBadge.vue) surfaces this to the user.

### Types

Domain types live in [src/shared/types/domain.ts](src/shared/types/domain.ts) (`NormalizedAsset` and its parts — the app's own model). Raw Yahoo response shapes live in [src/types/index.d.ts](src/types/index.d.ts). Keep the boundary: raw shapes stay inside the provider; the rest of the app consumes only `domain.ts` types.

## Conventions

- Import alias `@/` → `src/`. TypeScript is strict (`noUnusedLocals`/`noUnusedParameters` on); prefix intentionally-unused args with `_`.
- ESLint enforces import ordering via `import-helpers` (groups: `vue` → external → `@/` → relative, alphabetized), PascalCase components in templates, self-closing tags, and blank lines between template tags. Run `lint:fix`/`prettier:fix` rather than hand-formatting.
- Yahoo returns wrapped `{ raw, fmt }` values; always read them through the helpers in [yahooParse.ts](src/shared/services/providers/yahooParse.ts) (`getRaw`, `getFmt`, `safeDiv`, `normalizeYield`), which preserve `null` for missing data. Yahoo returns statements newest-first and ratio changes as fractions — both are normalized in the provider layer.

## Note on the README

The README's tech-stack list is aspirational in places: TanStack Vue Query, Axios interceptors beyond a basic instance, and Playwright E2E are **not** present. Actual runtime deps are Vue 3, Vue Router, Pinia, Chart.js, and Axios ([src/services/api/index.ts](src/services/api/index.ts) is a single bare instance). Tests are Vitest only.
