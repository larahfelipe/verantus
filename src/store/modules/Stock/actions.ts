import type { AxiosResponse } from 'axios';

import config from '@/config';
import api from '@/services/api';
import type { StockActions, StockChart, StockData } from '@/types';

export default {
  async fetchStockData(context, payload) {
    const {
      symbol,
      exchange = '',
      modules = config.yahooFinanceApiModules
    } = payload;
    if (!symbol.length) return console.log('Stock symbol is required.');

    try {
      context.commit('setIsLoading', true);

      const fmtStockSymbol = symbol + exchange;
      const endpointUrl = `/v11/finance/quoteSummary/${fmtStockSymbol}?modules=${modules}`;

      const { status, data }: AxiosResponse<StockData> = await api.get(
        endpointUrl
      );
      if (status !== 200)
        throw new Error('Some error occurred while fetching stock data.');

      context.commit('setStockData', data);
    } catch (e) {
      context.commit('setError', e);
    } finally {
      context.commit('setIsLoading', false);
    }
  },
  async fetchStockChart(context, payload) {
    const { symbol, exchange = '', range = '1d' } = payload;
    if (!symbol.length) return console.log('Stock symbol is required.');

    try {
      context.commit('setIsLoading', true);

      const fmtStockSymbol = symbol + exchange;
      const endpointUrl = `/v8/finance/chart/${fmtStockSymbol}?range=${range}`;

      const { status, data }: AxiosResponse<StockChart> = await api.get(
        endpointUrl
      );
      if (status !== 200)
        throw new Error('Some error occurred while fetching stock chart.');

      context.commit('setStockChart', data);
    } catch (e) {
      context.commit('setError', e);
    } finally {
      context.commit('setIsLoading', false);
    }
  }
} as StockActions;
