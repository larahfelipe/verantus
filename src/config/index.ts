const STORAGE = {
  /** Versioned for schema compatibility */
  KEY_PREFIX: 'verantus@',
  /** v2 invalidates pre-provenance cached payloads */
  STOCK_CACHE_KEY: 'verantus@cached_stock_v2',
  THEME_KEY: 'verantus@theme'
} as const;

const STOCK = {
  DEFAULT_SYMBOL: 'AAPL',
  DEFAULT_RANGE: '1d',
  /** Cache TTL: prices stale beyond 24 hours */
  CACHE_TTL_MS: 24 * 60 * 60 * 1000,
  BRAZIL_EXCHANGE_SUFFIX: '.SA'
} as const;

const YAHOO_FINANCE = {
  API_KEY: import.meta.env.VITE_YAHOO_FINANCE_API_KEY as string,
  API_MODULES: [
    'assetProfile',
    'quoteType',
    'price',
    'summaryDetail',
    'defaultKeyStatistics',
    'financialData',
    'incomeStatementHistory',
    'balanceSheetHistory',
    'cashflowStatementHistory'
  ].join(','),
  /** Range to chart interval mapping (yfapi.net requirement) */
  RANGE_INTERVALS: {
    '1d': '5m',
    '5d': '15m',
    '1mo': '1d',
    '6mo': '1d',
    '1y': '1wk',
    '5y': '1wk'
  } as Record<string, string>,
  INTRADAY_RANGES: new Set(['1d', '5d']),
  FALLBACK_CHART_INTERVAL: '1d'
} as const;

const CHART = {
  TIMEFRAMES: [
    { label: '1D', value: '1d' },
    { label: '5D', value: '5d' },
    { label: '1M', value: '1mo' },
    { label: '6M', value: '6mo' },
    { label: '1Y', value: '1y' },
    { label: '5Y', value: '5y' }
  ] as const,
  /** Bucketing strategy per range (prevents ambiguous axis labels) */
  RANGE_AXIS_GRANULARITY: {
    '1d': 'hour',
    '5d': 'day',
    '1mo': 'week',
    '6mo': 'month',
    '1y': 'month',
    '5y': 'year'
  } as Record<string, 'hour' | 'day' | 'week' | 'month' | 'year'>,
  DEFAULT_AXIS_GRANULARITY: 'day' as const
} as const;

const TIME = {
  MS_PER_HOUR: 3_600_000,
  MS_PER_DAY: 86_400_000,
  MS_PER_WEEK: 86_400_000 * 7
} as const;

/** Single aggregated application configuration; every group is reachable from here. */
const config = {
  STORAGE,
  STOCK,
  YAHOO_FINANCE,
  CHART,
  TIME
} as const;

export default config;
