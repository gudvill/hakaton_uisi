import api from "./axios";

// получить всех партнёров
export const getPartners = async () => {
  const res = await api.get("/partners/");
  return res.data;
};

// получить партнёра по id
export const getPartnerById = async (id) => {
  const res = await api.get(`/partners/${id}`);
  return res.data;
};

// создать партнёра
export const createPartner = async (data) => {
  const res = await api.post("/partners/", data);
  return res.data;
};

// обновить партнёра
export const updatePartner = async (id, data) => {
  const res = await api.put(`/partners/${id}`, data);
  return res.data;
};

// удалить партнёра
export const deletePartner = async (id) => {
  const res = await api.delete(`/partners/${id}`);
  return res.data;
};