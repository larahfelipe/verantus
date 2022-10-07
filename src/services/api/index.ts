import axios from 'axios';

import config from '@/config';

const api = axios.create({
  baseURL: 'https://yfapi.net',
  headers: {
    'x-api-key': config.yahooFinanceApiKey
  }
});

export default api;
