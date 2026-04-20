import axios from 'axios'
import { getSecureToken, removeSecureToken } from './cryptoUtils'

const apiAdminInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  // baseURL: 'https://upleex.com/api/api/v1/',
  // headers: {
  //   'Content-Type': 'multipart/form-data'
  // }
})

export const api = apiAdminInstance;

apiAdminInstance.interceptors.request.use(
  async config => {
    const token = getSecureToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['ngrok-skip-browser-warning'] = 'true'
    return config;
  },
  error => Promise.reject(error)
);

apiAdminInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  error => {
    const { response } = error;

    if (response?.status === 401) {
      removeSecureToken();
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        localStorage.removeItem('user');
        localStorage.removeItem('email');
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('storage'));
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
