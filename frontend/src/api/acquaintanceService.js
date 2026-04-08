import api from "./axios";

export const getAcquaintanceById = async (id) => {
  const res = await api.get(`/acquaintance/${id}`);
  return res.data;
};

export const getAllAcquaintances = async () => {
  const res = await api.get("/acquaintance/");
  return res.data;
};