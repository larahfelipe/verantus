import axios from 'axios';

const api = axios.create({
  baseURL: 'https://yfapi.net',
  headers: {
    'x-api-key': import.meta.env.VITE_YAHOO_FINANCE_API_KEY as string
  }
});

export default api;
