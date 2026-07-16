import { describe, expect, it } from 'vitest';

import { buildFinancialsHistory } from './normalizeStatements';

const wrap = (raw: number, fmt: string | null) => ({ raw, fmt });
const endDate = (iso: string) => ({ endDate: { fmt: iso } });

describe('buildFinancialsHistory', () => {
  it('treats a stripped { raw: 0, fmt: null } placeholder as unavailable, not zero', () => {
    const income = [
      {
        ...endDate('2024-09-30'),
        totalRevenue: wrap(100, '100'),
        grossProfit: wrap(0, null),
        ebit: wrap(0, null),
        netIncome: wrap(20, '20')
      }
    ];

    const [year] = buildFinancialsHistory(income, [], []);

    expect(year.revenue).toBe(100);
    expect(year.grossProfit).toBeNull();
    expect(year.ebit).toBeNull();
    expect(year.netIncome).toBe(20);
  });

  it('preserves a genuine zero that carries a formatted string', () => {
    const income = [
      {
        ...endDate('2024-12-31'),
        totalRevenue: wrap(100, '100'),
        grossProfit: wrap(0, '0'),
        netIncome: wrap(10, '10')
      }
    ];

    const [year] = buildFinancialsHistory(income, [], []);

    expect(year.grossProfit).toBe(0);
  });

  it('aligns balance and cash-flow rows to the income statement by fiscal year', () => {
    const income = [
      { ...endDate('2023-12-31'), totalRevenue: wrap(100, '100'), netIncome: wrap(10, '10') },
      { ...endDate('2024-12-31'), totalRevenue: wrap(120, '120'), netIncome: wrap(15, '15') }
    ];
    const balance = [{ ...endDate('2024-12-31'), totalStockholderEquity: wrap(200, '200') }];
    const cashflow = [
      { ...endDate('2024-12-31'), totalCashFromOperatingActivities: wrap(30, '30') }
    ];

    const history = buildFinancialsHistory(income, balance, cashflow);

    expect(history.map((y) => y.year)).toEqual([2023, 2024]);
    expect(history[1].equity).toBe(200);
    expect(history[1].operatingCashFlow).toBe(30);
    expect(history[0].equity).toBeNull();
  });

  it('returns an empty history when no income statements are present', () => {
    expect(buildFinancialsHistory([], [], [])).toEqual([]);
  });
});
