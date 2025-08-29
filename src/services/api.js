import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];
let refreshRetryCount = 0;
const MAX_REFRESH_RETRIES = 3;

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(api(prom.request));
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, request: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        refreshRetryCount = 0;
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        refreshRetryCount++;

        if (refreshRetryCount >= MAX_REFRESH_RETRIES) {
          console.error("Max refresh retries exceeded, redirecting to login");
          refreshRetryCount = 0;
          processQueue(refreshError, null);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
        console.error("Token refresh failed:", refreshError);

        if (
          refreshError.response?.status === 404 ||
          refreshError.response?.status === 500
        ) {
          console.error("Refresh endpoint not available, redirecting to login");
        }

        processQueue(refreshError, null);

        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
