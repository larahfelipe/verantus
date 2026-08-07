// @vitest-environment jsdom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import DataPoint from './DataPoint.vue';

type DataPointProps = InstanceType<typeof DataPoint>['$props'];

const text = (props: DataPointProps) => mount(DataPoint, { props }).text();

describe('DataPoint', () => {
  it('renders the placeholder for null and undefined', () => {
    expect(text({ value: null })).toBe('—');
    expect(text({ value: undefined })).toBe('—');
  });

  it('renders the placeholder for a non-finite number', () => {
    expect(text({ value: Number.NaN, format: 'number' })).toBe('—');
    expect(text({ value: Number.POSITIVE_INFINITY, format: 'ratio' })).toBe('—');
  });

  it('honors a custom placeholder', () => {
    expect(text({ value: null, placeholder: 'N/A' })).toBe('N/A');
  });

  it('formats a fraction as a percentage', () => {
    expect(text({ value: 0.253, format: 'percent' })).toBe('25.3%');
  });

  it('formats a signed percentage from a pre-scaled number', () => {
    expect(text({ value: 1.23, format: 'signedPercent' })).toBe('+1.23%');
  });

  it('formats a ratio to the requested precision', () => {
    expect(text({ value: 1.5, format: 'ratio' })).toBe('1.50');
    expect(text({ value: 1.5, format: 'ratio', fractionDigits: 1 })).toBe('1.5');
  });

  it('formats compact money with a currency symbol', () => {
    expect(text({ value: 1_000_000, format: 'money', currency: 'USD' })).toContain('1.00M');
  });

  it('renders a real zero rather than the placeholder', () => {
    expect(text({ value: 0, format: 'percent' })).toBe('0.0%');
  });

  it('passes through string values as text', () => {
    expect(text({ value: 'Wide Moat' })).toBe('Wide Moat');
  });
});
