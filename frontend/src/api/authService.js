import api from "./axios";

export const login = async (login, password) => {
  const res = await api.post("/admin/login", {
    login,
    password,
  });
  localStorage.setItem("access", res.data.access_token);
  localStorage.setItem("refresh", res.data.refresh_token);
  return res.data;
};

export const logout = () => {
  localStorage.clear();
};