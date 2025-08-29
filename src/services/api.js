import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  withCredentials: true,
});

export default api;