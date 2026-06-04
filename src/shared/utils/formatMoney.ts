import { parseCurrency } from './parseCurrency';

/**
 * Compact currency formatting for large financial figures, e.g. "R$ 1.23B".
 * Uses the absolute value to pick the scale so negative amounts (buybacks,
 * dividends paid) keep their sign. Returns "—" for missing values.
 */
export const formatCompactMoney = (value: number | null | undefined, currency: string): string => {
  if (value === null || value === undefined) return '—';
  const symbol = parseCurrency(currency);
  const abs = Math.abs(value);
  if (abs >= 1e12) return `${symbol} ${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `${symbol} ${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${symbol} ${(value / 1e6).toFixed(2)}M`;
  return `${symbol} ${value.toLocaleString()}`;
};
