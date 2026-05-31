export const parseCurrency = (currency: string): string => {
  const clean = currency.toUpperCase();
  if (clean === 'BRL') return 'R$';
  if (clean === 'USD') return '$';
  if (clean === 'EUR') return '€';
  if (clean === 'GBP') return '£';
  return currency;
};
export default parseCurrency;
