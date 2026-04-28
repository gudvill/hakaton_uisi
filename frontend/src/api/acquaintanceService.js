import api from "./axios";

// получить все oзнакомления
export const getAcquaintances = async () => {
  const res = await api.get("/acquaintance/");
  return res.data;
};

// получить oзнакомление по id
export const getAcquaintanceById = async (id) => {
  const res = await api.get(`/acquaintance/${id}`);
  return res.data;
};

// создать oзнакомление
export const createAcquaintance = async (data) => {
  const res = await api.post("/acquaintance/", data);
  return res.data;
};

// обновить oзнакомление
export const updateAcquaintance = async (id, data) => {
  const res = await api.put(`/acquaintance/${id}`, data);
  return res.data;
};