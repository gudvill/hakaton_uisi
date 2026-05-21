/* import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// access токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// авто-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/refresh`,
          {
            refresh_token: refresh,
          }
        );

        const newAccess = res.data.access_token;

        localStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (e) {
        localStorage.clear();
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api; */
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
