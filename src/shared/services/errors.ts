/**
 * Typed failures raised by the data layer. `kind` is a stable, machine-readable
 * discriminator the UI can branch on to show an accurate message and recovery
 * action, instead of surfacing a raw string.
 */
export abstract class ProviderError extends Error {
  abstract readonly kind: string;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    if (cause !== undefined) this.cause = cause;
  }
}

/** No usable response reached us (offline, DNS, timeout, CORS). */
export class NetworkError extends ProviderError {
  readonly kind = 'network';
}

/** Provider throttled the request (HTTP 429); the caller may back off and retry. */
export class RateLimitError extends ProviderError {
  readonly kind = 'rate_limit';
}

/** The requested asset does not exist upstream (unknown ticker / empty result). */
export class NotFoundError extends ProviderError {
  readonly kind = 'not_found';
}

/** The provider answered with an error status or an error body. */
export class UpstreamError extends ProviderError {
  readonly kind = 'upstream';
}

/** The response reached us but did not match the structure we depend on. */
export class DataParseError extends ProviderError {
  readonly kind = 'parse';
}

interface TransportErrorShape {
  response?: { status?: number };
  request?: unknown;
  message?: string;
}

/**
 * Maps a transport-level failure (typically an Axios error) to a typed
 * ProviderError. Pure and provider-shaped rather than Axios-specific so it can
 * be unit-tested and reused. Already-typed errors pass through unchanged.
 */
export function mapTransportError(error: unknown): ProviderError {
  if (error instanceof ProviderError) return error;

  const { response, request, message } = (error ?? {}) as TransportErrorShape;
  const status = response?.status;

  if (status !== undefined) {
    if (status === 429)
      return new RateLimitError('Rate limit exceeded for the data provider.', error);
    if (status === 404) return new NotFoundError('The requested asset was not found.', error);
    return new UpstreamError(`Data provider responded with HTTP ${status}.`, error);
  }

  if (request !== undefined) {
    return new NetworkError('No response received from the data provider.', error);
  }

  return new NetworkError(message || 'Unexpected data provider transport error.', error);
}

export interface UserFacingError {
  kind: string;
  message: string;
  /** Whether retrying the same request could succeed (false for not-found/parse). */
  retryable: boolean;
}

const USER_MESSAGES: Record<string, Omit<UserFacingError, 'kind'>> = {
  network: {
    message: 'Could not reach the data provider. Check your connection and try again.',
    retryable: true
  },
  rate_limit: {
    message: 'The data provider is rate-limiting requests. Please wait a moment and retry.',
    retryable: true
  },
  not_found: {
    message: 'No data was found for this symbol. Verify the ticker and try another.',
    retryable: false
  },
  upstream: {
    message: 'The data provider returned an error. Please try again shortly.',
    retryable: true
  },
  parse: {
    message: 'The data provider returned an unexpected response. Please try again shortly.',
    retryable: false
  }
};

/** Turns any thrown value into a stable kind plus a message safe to show a user. */
export function describeError(error: unknown): UserFacingError {
  if (error instanceof ProviderError) {
    const entry = USER_MESSAGES[error.kind];
    if (entry) return { kind: error.kind, ...entry };
    return { kind: error.kind, message: error.message, retryable: true };
  }

  const message =
    error instanceof Error
      ? error.message
      : 'An unexpected error occurred while fetching financial data.';
  return { kind: 'unknown', message, retryable: true };
}
