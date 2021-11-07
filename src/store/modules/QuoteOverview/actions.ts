import { AxiosResponse } from 'axios';

import api from '@/services/ApiService';
import { QuoteOverview, QuoteOverviewActions } from '@/types';

export default {
  async fetchQuoteOverview(context, payload) {
    const { stockSymbol, stockExchange, modules } = payload;
    if (stockSymbol === '' || modules === '')
      return console.log('Payload is required.');

    try {
      context.commit('setIsLoading', true);
      context.commit('setIsFetched', false);
      const parsedSymbol = stockSymbol + stockExchange;
      const queryUrl = `/v11/finance/quoteSummary/${parsedSymbol}?modules=${modules}`;

      const { status, data }: AxiosResponse<QuoteOverview> = await api.get(
        queryUrl
      );
      if (status !== 200) throw new Error('Failed to fetch quote overview.');

      context.commit('setQuoteOverview', data);
      context.commit('setIsLoading', false);
      context.commit('setIsFetched', true);
    } catch (err) {
      context.commit('setError', err);
    }
  }
} as QuoteOverviewActions;
