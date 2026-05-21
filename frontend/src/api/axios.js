import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

// авто-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/admin/refresh")) {
      originalRequest._retry = true;
      try {
        await api.post("/admin/refresh");
        return api(originalRequest);
      } catch (e) {
        await api.post("/admin/logout");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;