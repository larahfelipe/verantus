type Currency = 'USD' | 'BRL';

export const parseCurrency = (currency: Currency) => {
  if (!currency.length || (currency !== 'USD' && currency !== 'BRL'))
    return 'N/A';

  return currency === 'USD' ? '$' : 'R$';
};
