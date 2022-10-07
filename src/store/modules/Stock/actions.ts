import type { AxiosResponse } from 'axios';

import api from '@/services/api';
import type { StockActions, StockChart, StockData } from '@/types';

export default {
  async fetchStockData(context, payload) {
    const { symbol, exchange, modules } = payload;
    if (!symbol.length || !exchange.length)
      return console.log('Payload is required.');

    try {
      context.commit('setIsLoading', true);
      context.commit('setIsFetched', false);

      const parsedStockSymbol = symbol + exchange;
      const endpointUrl = `/v11/finance/quoteSummary/${parsedStockSymbol}?modules=${modules}`;

      const { status, data }: AxiosResponse<StockData> = await api.get(
        endpointUrl
      );
      if (status !== 200)
        throw new Error('Some error occurred while fetching stock data.');

      context.commit('setStockData', data);
      context.commit('setIsLoading', false);
      context.commit('setIsFetched', true);
    } catch (e) {
      context.commit('setError', e);
    }
  },

  async fetchStockChart(context, payload) {
    const { symbol, exchange, range } = payload;
    if (!symbol.length || !exchange.length)
      return console.log('Payload is required.');

    try {
      context.commit('setIsLoading', true);
      context.commit('setIsFetched', false);

      const parsedStockSymbol = symbol + exchange;
      const parsedTimeRange = range ? range : '1d';
      const endpointUrl = `/v8/finance/chart/${parsedStockSymbol}?range=${parsedTimeRange}`;

      const { status, data }: AxiosResponse<StockChart> = await api.get(
        endpointUrl
      );
      if (status !== 200)
        throw new Error('Some error occurred while fetching stock chart.');

      context.commit('setStockChart', data);
      context.commit('setIsLoading', false);
      context.commit('setIsFetched', true);
    } catch (e) {
      context.commit('setError', e);
    }
  }
} as StockActions;
