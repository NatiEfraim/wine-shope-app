import axios from 'axios';

// here we define the address of Nataniel's server
// for now we define a local URL; later we can change it to a real server address
const BASE_URL = 'http://localhost:8000/api';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor - intercept requests
// before each request goes to the server, we check if we have a token
// if yes, we attach it to the request header so the server can recognize us
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
