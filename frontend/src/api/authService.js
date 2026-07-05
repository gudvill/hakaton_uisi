import api from "./axios";
/*
// login
export const login = async (login, password) => {
  const res = await api.post("/admin/login", {
    login,
    password,
  });
  localStorage.setItem("access", res.data.access_token);
  localStorage.setItem("refresh", res.data.refresh_token);
  return res.data;
};

// выход
export const logout = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
};

// refresh
export const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh");

  const res = await api.post("/admin/refresh", {
    refresh_token: refresh,
  });

  localStorage.setItem("access", res.data.access_token);
  return res.data;
};
*/

// login
export const login = async (login, password) => {
  const res = await api.post("/admin/login", {
    login,
    password,
  });
  return res.data;
};

// выход
export const logout = async () => {
  await api.post("/admin/logout");
};

// refresh
export const refreshToken = async () => {
  const res = await api.post("/admin/refresh");
  return res.data;
};

// запрос сброса пароля
export const requestPasswordReset = async (email) => {
  const res = await api.post("/admin/request-password-reset", {
    email,
  });
  return res.data;
};

// сброс пароля
export const resetPassword = async (token, newPassword, confirmPassword) => {
  const res = await api.post("/admin/reset-password", {
    token,
    new_password: newPassword,
    confirm_password: confirmPassword,
  });
  return res.data;
};

// получить данные админа
export const getMe = async () => {
  const res = await api.get("/admin/me");
  return res.data;
};

// изменить данные админа
export const updateProfile = async (data) => {
  const res = await api.put("/admin/update-profile", data);
  return res.data;
};