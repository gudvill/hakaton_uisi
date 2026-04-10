import api from "./axios";

export const getAllAcquaintances = async () => {
  const res = await api.get("/acquaintance/");
  return res.data;
};

export const getAcquaintanceById = async (id) => {
  const res = await api.get(`/acquaintance/${id}`);
  return res.data;
};

export const getAcquaintanceByTitle = async (title) => {
  const res = await api.get(`/acquaintance/by-title/`, { params: { title } });
  return res.data;
};