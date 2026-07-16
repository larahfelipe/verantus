import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';

import api from '@/services/api';
import type { NormalizedAsset } from '@/shared/types/domain';

import aaplChart from './__fixtures__/aapl-chart.json';
import aaplSummary from './__fixtures__/aapl-summary.json';
import petr4Chart from './__fixtures__/petr4-chart.json';
import petr4Summary from './__fixtures__/petr4-summary.json';
import { financialRepository } from './FinancialDataRepository';

vi.mock('@/services/api', () => ({
  default: { get: vi.fn() }
}));

const mockedGet = api.get as unknown as Mock;

const fixtureFor = (url: string) => {
  const isBrazil = url.includes('PETR4');
  if (url.includes('quoteSummary')) return isBrazil ? petr4Summary : aaplSummary;
  if (url.includes('/chart/')) return isBrazil ? petr4Chart : aaplChart;
  throw new Error(`No fixture for url: ${url}`);
};

/**
 * Locks the fully-assembled asset so any refactor that silently changes a
 * computed value (score, ratio, DCF, statement figure) breaks the snapshot.
 * The `history` series carries timezone-sensitive display labels, so only its
 * shape and endpoints — the inputs that feed the computed range returns — are
 * snapshotted; every other field is a deterministic computation.
 */
const snapshotable = (asset: NormalizedAsset) => {
  const { history, ...rest } = asset;
  return {
    ...rest,
    history: {
      length: history.length,
      firstClose: history[0]?.close ?? null,
      lastClose: history[history.length - 1]?.close ?? null
    }
  };
};

describe('Financial data assembly — golden regression', () => {
  beforeEach(() => {
    mockedGet.mockImplementation((url: string) => Promise.resolve({ data: fixtureFor(url) }));
  });

  it('produces a stable asset for a US equity (AAPL)', async () => {
    const asset = await financialRepository.getAsset('AAPL', '', '1mo');
    expect(snapshotable(asset)).toMatchSnapshot();
  });

  it('produces a stable asset for a Brazilian equity (PETR4.SA)', async () => {
    const asset = await financialRepository.getAsset('PETR4', '.SA', '1mo');
    expect(snapshotable(asset)).toMatchSnapshot();
  });
});
