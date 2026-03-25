import api from "./axios";

// получить всех партнёров
export const getPartners = async () => {
  const res = await api.get("/partners/");
  return res.data;
};