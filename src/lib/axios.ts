import axios from 'axios';
import { API_CONFIG } from '../config/api';
import { getAuthToken } from '../utils/authSession';

const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

const attachAuthHeader = (config: any) => {
  const token = getAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

let defaultAxiosInterceptorConfigured = false;

export function configureAxiosAuth() {
  if (defaultAxiosInterceptorConfigured) return;

  axios.interceptors.request.use(attachAuthHeader, (error) => Promise.reject(error));
  defaultAxiosInterceptorConfigured = true;
}

axiosInstance.interceptors.request.use(attachAuthHeader, (error) =>
  Promise.reject(error)
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

configureAxiosAuth();

export default axiosInstance; 
