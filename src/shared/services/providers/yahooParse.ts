export const getRaw = (obj: unknown): number | null => {
  if (obj && typeof obj === 'object' && 'raw' in obj) {
    const rawVal = (obj as Record<string, unknown>).raw;
    return typeof rawVal === 'number' && Number.isFinite(rawVal) ? rawVal : null;
  }
  return null;
};

export const getFmt = (obj: unknown, fallback = '—'): string => {
  if (obj && typeof obj === 'object' && 'fmt' in obj) {
    const fmtVal = (obj as Record<string, unknown>).fmt;
    return fmtVal !== null && fmtVal !== undefined ? String(fmtVal) : fallback;
  }
  return fallback;
};

/**
 * yfapi is inconsistent about dividend-yield scale: some payloads return a
 * fraction (0.015 = 1.5%), others a percentage number (1.5). Normalise to a
 * fraction. A value above 1 (>100% as a fraction) is implausible for a yield
 * and is therefore treated as a percentage. The exact value 1.0 (100%) passes
 * through as a fraction — a 100% yield is theoretically possible for special
 * dividends or distressed instruments.
 */
export const normalizeYield = (v: number | null): number | null => {
  if (v === null) return null;
  return v > 1 ? v / 100 : v;
};

/** Safe division returning null on missing inputs or zero denominator. */
export const safeDiv = (num: number | null, den: number | null): number | null => {
  if (num === null || den === null || den === 0) return null;
  const r = num / den;
  return Number.isFinite(r) ? r : null;
};
