import type { FinancialStatementYearly } from '@/shared/types/domain';
import { clamp } from '@/shared/utils/math';

import { getRaw, safeDiv } from './yahooParse';

type StatementRow = Record<string, unknown>;

/**
 * Effective tax rate applied to EBIT when a filing lacks the detail to derive
 * the real rate. Assumes a US-style ~21% corporate rate; for other
 * jurisdictions (e.g. BRL filings) this can understate taxes and slightly
 * overstate ROIC. The per-year rate from the filing is always preferred.
 */
const DEFAULT_EFFECTIVE_TAX_RATE = 0.21;
/** Upper bound on a derived tax rate, guarding against distorted single years. */
const MAX_DERIVED_TAX_RATE = 0.6;

/**
 * This yfapi tier strips some reported figures to `{ raw: 0, fmt: null }` — a
 * placeholder, not a real zero. A genuine zero carries a formatted string
 * (`fmt: "0"`), so we treat a null `fmt` on a zero as unavailable to avoid
 * showing fabricated $0 line items.
 */
const isStrippedPlaceholder = (wrapper: unknown): boolean => {
  if (!wrapper || typeof wrapper !== 'object') return false;
  const { raw, fmt } = wrapper as { raw?: unknown; fmt?: unknown };
  return raw === 0 && (fmt === null || fmt === undefined);
};

/** Reads a statement line item, trying known Yahoo field aliases in order. */
const readLineItem = (row: StatementRow | undefined, ...aliases: string[]): number | null => {
  if (!row) return null;
  for (const alias of aliases) {
    if (isStrippedPlaceholder(row[alias])) continue;
    const value = getRaw(row[alias]);
    if (value !== null) return value;
  }
  return null;
};

const fiscalYearOf = (row: StatementRow | undefined): number | null => {
  const endDate = row?.endDate as { fmt?: string; raw?: number } | undefined;
  if (endDate?.fmt) {
    const year = parseInt(endDate.fmt.slice(0, 4), 10);
    if (!Number.isNaN(year)) return year;
  }
  if (typeof endDate?.raw === 'number') return new Date(endDate.raw * 1000).getUTCFullYear();
  return null;
};

const indexByFiscalYear = (rows: StatementRow[]): Map<number, StatementRow> => {
  const byYear = new Map<number, StatementRow>();
  for (const row of rows) {
    const year = fiscalYearOf(row);
    if (year !== null) byYear.set(year, row);
  }
  return byYear;
};

/**
 * Builds the multi-year statement history by aligning income, balance-sheet and
 * cash-flow rows on their fiscal year. Returns oldest-first, or an empty array
 * when Yahoo returned no income statements (caller treats that as unavailable).
 */
export function buildFinancialsHistory(
  income: StatementRow[],
  balance: StatementRow[],
  cashflow: StatementRow[]
): FinancialStatementYearly[] {
  if (!income.length) return [];

  const balanceByYear = indexByFiscalYear(balance);
  const cashflowByYear = indexByFiscalYear(cashflow);

  const statements: FinancialStatementYearly[] = [];

  for (const incomeRow of income) {
    const year = fiscalYearOf(incomeRow);
    if (year === null) continue;
    const balanceRow = balanceByYear.get(year);
    const cashflowRow = cashflowByYear.get(year);

    const revenue = readLineItem(incomeRow, 'totalRevenue');
    const grossProfit = readLineItem(incomeRow, 'grossProfit');
    const ebit = readLineItem(incomeRow, 'ebit', 'operatingIncome');
    const incomeBeforeTax = readLineItem(incomeRow, 'incomeBeforeTax');
    const taxExpense = readLineItem(incomeRow, 'incomeTaxExpense');
    const netIncome = readLineItem(incomeRow, 'netIncome');

    const depreciation = readLineItem(cashflowRow, 'depreciation');
    const ebitda = ebit !== null ? ebit + (depreciation ?? 0) : null;

    const operatingCashFlow = readLineItem(cashflowRow, 'totalCashFromOperatingActivities');
    const capex = readLineItem(cashflowRow, 'capitalExpenditures');
    const freeCashFlow = operatingCashFlow !== null ? operatingCashFlow + (capex ?? 0) : null;
    const buybacks = readLineItem(cashflowRow, 'repurchaseOfStock');
    const dividends = readLineItem(cashflowRow, 'dividendsPaid');

    const cash = readLineItem(balanceRow, 'cash', 'cashAndCashEquivalents');
    const longTermDebt = readLineItem(balanceRow, 'longTermDebt');
    const shortTermDebt = readLineItem(balanceRow, 'shortLongTermDebt');
    const totalDebt =
      longTermDebt !== null || shortTermDebt !== null
        ? (longTermDebt ?? 0) + (shortTermDebt ?? 0)
        : null;
    const equity = readLineItem(balanceRow, 'totalStockholderEquity');
    const totalAssets = readLineItem(balanceRow, 'totalAssets');
    const currentAssets = readLineItem(balanceRow, 'totalCurrentAssets');
    const currentLiabilities = readLineItem(balanceRow, 'totalCurrentLiabilities');
    const workingCapital =
      currentAssets !== null && currentLiabilities !== null
        ? currentAssets - currentLiabilities
        : null;

    // ROIC = NOPAT / invested capital. The effective tax rate comes from the
    // filing when derivable, otherwise the default corporate rate is assumed.
    const effectiveTaxRate =
      incomeBeforeTax !== null && incomeBeforeTax !== 0 && taxExpense !== null
        ? clamp(taxExpense / incomeBeforeTax, 0, MAX_DERIVED_TAX_RATE)
        : DEFAULT_EFFECTIVE_TAX_RATE;
    const nopat = ebit !== null ? ebit * (1 - effectiveTaxRate) : null;
    const investedCapital = equity !== null ? (totalDebt ?? 0) + equity - (cash ?? 0) : null;

    statements.push({
      year,
      revenue,
      grossProfit,
      ebitda,
      ebit,
      netIncome,
      operatingCashFlow,
      capex,
      freeCashFlow,
      buybacks,
      dividends,
      cash,
      debt: totalDebt,
      equity,
      workingCapital,
      roe: safeDiv(netIncome, equity),
      roa: safeDiv(netIncome, totalAssets),
      roic: safeDiv(nopat, investedCapital),
      croic: safeDiv(freeCashFlow, investedCapital)
    });
  }

  // Yahoo returns newest-first; present oldest-first for chronological reading.
  return statements.sort((a, b) => a.year - b.year);
}
