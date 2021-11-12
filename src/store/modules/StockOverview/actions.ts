import { AxiosResponse } from 'axios';

import api from '@/services/ApiService';
import { StockOverview, StockOverviewActions } from '@/types';

export default {
  async fetchStockOverview(context, payload) {
    const { stockSymbol, stockExchange, modules } = payload;
    if (stockSymbol === '' || modules === '')
      return console.log('Payload is required.');

    try {
      context.commit('setIsLoading', true);
      context.commit('setIsFetched', false);
      const parsedSymbol = stockSymbol + stockExchange;
      const queryUrl = `/v11/finance/quoteSummary/${parsedSymbol}?modules=${modules}`;

      const { status, data }: AxiosResponse<StockOverview> = await api.get(
        queryUrl
      );
      if (status !== 200)
        throw new Error('Some error occured while fetching stock overview.');

      context.commit('setStockOverview', data);
      context.commit('setIsLoading', false);
      context.commit('setIsFetched', true);
    } catch (err) {
      context.commit('setError', err);
    }
  }
} as StockOverviewActions;
