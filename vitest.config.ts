import path from 'path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [{ find: '@', replacement: path.join(__dirname, 'src') }]
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    // Fixed timezone keeps date-derived output reproducible across machines and CI.
    env: { TZ: 'UTC' },
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'text'],
      include: ['src/core/**/*.ts', 'src/shared/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.d.ts', 'src/shared/services/providers/__fixtures__/**'],
      // Thresholds are scoped to the critical calculation core, not a global percentage:
      // the financial engine must stay covered; presentational code is not gated here.
      // These are regression floors set just below the current baseline; raise them as
      // the dedicated calculation-test suites land (EPIC T.3/T.4).
      thresholds: {
        'src/core/scoring.ts': { statements: 95, branches: 75, functions: 100, lines: 95 },
        'src/core/analysis.ts': { statements: 88, branches: 40, functions: 90, lines: 88 },
        'src/shared/services/providers/normalizeStatements.ts': {
          statements: 95,
          branches: 40,
          functions: 100,
          lines: 95
        },
        'src/shared/services/providers/yahooParse.ts': {
          statements: 90,
          branches: 50,
          functions: 100,
          lines: 90
        },
        'src/shared/services/errors.ts': { statements: 100, branches: 85, functions: 100, lines: 100 },
        'src/shared/services/providers/yahooSchemas.ts': {
          statements: 95,
          branches: 90,
          functions: 100,
          lines: 95
        }
      }
    }
  }
});
