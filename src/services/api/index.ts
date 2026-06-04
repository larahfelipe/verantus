import axios from 'axios';

import config from '@/config';

const api = axios.create({
  baseURL: 'https://yfapi.net',
  headers: {
    'x-api-key': config.YAHOO_FINANCE.API_KEY
  }
});

export default api;
