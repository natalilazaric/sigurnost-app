const axios = require('axios');

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });

API.interceptors.request.use(config => {
  const mode = localStorage.getItem('labMode') || 'safe';
  config.headers['X-LAB-MODE'] = mode;
  return config;
});

module.exports = API;
