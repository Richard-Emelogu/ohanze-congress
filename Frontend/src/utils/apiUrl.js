const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (typeof window === 'undefined') return '/api';
  const host = window.location.hostname;
  const isLocalHost = host === 'localhost' || host === '127.0.0.1';
  const isLocalIp = /^\d+\.\d+\.\d+\.\d+$/.test(host);
  if (isLocalHost || isLocalIp) return 'http://localhost:5002/api';
  return '/api';
};

export const API_URL = getApiUrl();
