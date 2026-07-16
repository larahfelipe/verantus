import { z } from 'zod';

import { DataParseError } from '@/shared/services/errors';
import type { StockChart, StockData } from '@/types';

/**
 * These schemas validate only the response envelope — the shape the parser
 * relies on — not individual financial fields. Missing fields are legitimate
 * (they render as "—"); a broken envelope means the source is unusable, which
 * is the failure we want to catch early and explicitly.
 */
const module = z.record(z.string(), z.unknown());

const quoteSummaryEnvelope = z.object({
  quoteSummary: z.object({
    result: z.array(module).nullable(),
    error: z.unknown()
  })
});

const chartEnvelope = z.object({
  chart: z.object({
    result: z.array(module).nullable(),
    error: z.unknown()
  })
});

export function parseQuoteSummary(data: unknown): StockData {
  const parsed = quoteSummaryEnvelope.safeParse(data);
  if (!parsed.success) {
    throw new DataParseError('Malformed quoteSummary response from Yahoo Finance.', parsed.error);
  }
  return data as StockData;
}

export function parseChart(data: unknown): StockChart {
  const parsed = chartEnvelope.safeParse(data);
  if (!parsed.success) {
    throw new DataParseError('Malformed chart response from Yahoo Finance.', parsed.error);
  }
  return data as StockChart;
}
