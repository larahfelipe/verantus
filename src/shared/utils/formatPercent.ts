/** Formats a fraction (0.123) as a one-decimal percentage ("12.3%"); em dash for missing values. */
export const formatPercent = (fraction: number | null | undefined): string =>
  fraction === null || fraction === undefined ? '—' : `${(fraction * 100).toFixed(1)}%`;

/**
 * Formats an already-scaled percentage number (1.23 → "+1.23%") with an explicit
 * sign and two decimals. Used for headline price-change deltas the provider
 * returns pre-multiplied. Em dash for missing values.
 */
export const formatSignedPercent = (percentValue: number | null | undefined): string =>
  percentValue === null || percentValue === undefined
    ? '—'
    : `${percentValue >= 0 ? '+' : ''}${percentValue.toFixed(2)}%`;
