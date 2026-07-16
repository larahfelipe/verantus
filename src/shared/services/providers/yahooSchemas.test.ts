import { describe, expect, it } from 'vitest';

import { DataParseError } from '@/shared/services/errors';

import aaplChart from './__fixtures__/aapl-chart.json';
import aaplSummary from './__fixtures__/aapl-summary.json';
import petr4Summary from './__fixtures__/petr4-summary.json';
import { parseChart, parseQuoteSummary } from './yahooSchemas';

describe('yahoo envelope validation', () => {
  it('accepts a real quoteSummary payload (US and .SA)', () => {
    expect(() => parseQuoteSummary(aaplSummary)).not.toThrow();
    expect(() => parseQuoteSummary(petr4Summary)).not.toThrow();
  });

  it('accepts a real chart payload', () => {
    expect(() => parseChart(aaplChart)).not.toThrow();
  });

  it('rejects a payload missing the quoteSummary envelope', () => {
    expect(() => parseQuoteSummary({})).toThrow(DataParseError);
    expect(() => parseQuoteSummary({ quoteSummary: { result: 'nope' } })).toThrow(DataParseError);
  });

  it('rejects a payload missing the chart envelope', () => {
    expect(() => parseChart({ chart: null })).toThrow(DataParseError);
  });

  it('accepts a well-formed envelope with a null result (asset unavailable)', () => {
    expect(() => parseQuoteSummary({ quoteSummary: { result: null, error: null } })).not.toThrow();
  });
});
