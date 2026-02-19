import axios from 'axios'

const apiAdminInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_APP_URL,
  baseURL: "https://upleex.2min.cloud/"
  // headers: {
  //   'Content-Type': 'multipart/form-data'
  // }
})
console.log("process.env.NEXT_PUBLIC_APP_URL",process.env.NEXT_PUBLIC_APP_URL);

export const api = apiAdminInstance;

apiAdminInstance.interceptors.request.use(
  async config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
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

    if (response.status === 401) {
      localStorage.removeItem('token');
      if (typeof window !== 'undefined' && window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);
