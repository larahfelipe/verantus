import { describe, expect, it } from 'vitest';

import {
  DataParseError,
  NetworkError,
  NotFoundError,
  ProviderError,
  RateLimitError,
  UpstreamError,
  describeError,
  mapTransportError
} from './errors';

describe('mapTransportError', () => {
  it('maps HTTP 429 to a RateLimitError', () => {
    const mapped = mapTransportError({ response: { status: 429 } });
    expect(mapped).toBeInstanceOf(RateLimitError);
    expect(mapped.kind).toBe('rate_limit');
  });

  it('maps HTTP 404 to a NotFoundError', () => {
    const mapped = mapTransportError({ response: { status: 404 } });
    expect(mapped).toBeInstanceOf(NotFoundError);
    expect(mapped.kind).toBe('not_found');
  });

  it('maps other HTTP statuses to an UpstreamError carrying the status', () => {
    const mapped = mapTransportError({ response: { status: 503 } });
    expect(mapped).toBeInstanceOf(UpstreamError);
    expect(mapped.message).toContain('503');
  });

  it('maps a request without response to a NetworkError', () => {
    const mapped = mapTransportError({ request: {} });
    expect(mapped).toBeInstanceOf(NetworkError);
    expect(mapped.kind).toBe('network');
  });

  it('falls back to a NetworkError with the original message', () => {
    const mapped = mapTransportError({ message: 'boom' });
    expect(mapped).toBeInstanceOf(NetworkError);
    expect(mapped.message).toBe('boom');
  });

  it('passes an already-typed ProviderError through unchanged', () => {
    const original = new DataParseError('bad shape');
    expect(mapTransportError(original)).toBe(original);
  });

  it('preserves the original error as the cause', () => {
    const source = { response: { status: 429 } };
    expect(mapTransportError(source).cause).toBe(source);
  });

  it('produces errors that are instances of the ProviderError base', () => {
    expect(new NetworkError('x')).toBeInstanceOf(ProviderError);
    expect(new NetworkError('x')).toBeInstanceOf(Error);
  });
});

describe('describeError', () => {
  it('marks not-found and parse errors as non-retryable', () => {
    expect(describeError(new NotFoundError('x')).retryable).toBe(false);
    expect(describeError(new DataParseError('x')).retryable).toBe(false);
  });

  it('marks transient errors (network, rate limit, upstream) as retryable', () => {
    expect(describeError(new NetworkError('x')).retryable).toBe(true);
    expect(describeError(new RateLimitError('x')).retryable).toBe(true);
    expect(describeError(new UpstreamError('x')).retryable).toBe(true);
  });

  it('returns the kind and a user-safe message for a typed error', () => {
    const described = describeError(new NotFoundError('raw internal detail'));
    expect(described.kind).toBe('not_found');
    expect(described.message).not.toContain('raw internal detail');
  });

  it('falls back to a generic, retryable descriptor for unknown errors', () => {
    expect(describeError(new Error('boom'))).toEqual({
      kind: 'unknown',
      message: 'boom',
      retryable: true
    });
    expect(describeError('weird').kind).toBe('unknown');
  });

  it('passes through a typed error whose kind has no mapped message', () => {
    class CustomProviderError extends ProviderError {
      readonly kind = 'custom';
    }
    expect(describeError(new CustomProviderError('detail'))).toEqual({
      kind: 'custom',
      message: 'detail',
      retryable: true
    });
  });
});
