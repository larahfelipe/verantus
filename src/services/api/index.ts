import axios from 'axios';

import config from '@/config';
import { mapTransportError } from '@/shared/services/errors';

const api = axios.create({
  baseURL: 'https://yfapi.net',
  headers: {
    'x-api-key': config.YAHOO_FINANCE.API_KEY
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(mapTransportError(error))
);

export default api;
