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
    if (!symbol.length) {
      context.commit('setError', 'Stock symbol is required');
      return;
    }

    try {
      context.commit('setError', null);
      context.commit('setIsLoading', true);

      const fmtStockSymbol = symbol + exchange;
      const endpointUrl = `/v11/finance/quoteSummary/${fmtStockSymbol}?modules=${modules}`;

      const { data }: AxiosResponse<StockData> = await api.get(endpointUrl);
      const { result, error } = data.quoteSummary;
      if (error) throw new Error(error.code);

      context.commit('setStockData', result[0]);
    } catch (e) {
      context.commit(
        'setError',
        'Something went wrong while fetching stock data. Please try again later.'
      );
    } finally {
      context.commit('setIsLoading', false);
    }
  },
  async fetchStockChart(context, payload) {
    const { symbol, exchange = '', range = '1d' } = payload;
    if (!symbol.length) {
      context.commit('setError', 'Stock symbol is required');
      return;
    }

    try {
      context.commit('setError', null);
      context.commit('setIsLoading', true);

      const fmtStockSymbol = symbol + exchange;
      const endpointUrl = `/v8/finance/chart/${fmtStockSymbol}?range=${range}`;

      const { data }: AxiosResponse<StockChart> = await api.get(endpointUrl);
      const { result, error } = data.chart;
      if (error) throw new Error(error.code);

      context.commit('setStockChart', result[0]);
    } catch (e) {
      context.commit(
        'setError',
        'Something went wrong while fetching stock chart. Please try again later.'
      );
    } finally {
      context.commit('setIsLoading', false);
    }
  }
} as StockActions;
