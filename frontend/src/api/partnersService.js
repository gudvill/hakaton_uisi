import api from "./axios";

// получить всех активных партнёров
export const getPartners = async (params = {}) => {
  const res = await api.get("/partners/", { params });
  return res.data;
};

// получить всех архивных партнёров
export const getArchivedPartners = async (params = {}) => {
  const res = await api.get("/partners/archived/", { params });
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

// отключить партнёра
export const disablePartner = async (id) => {
  const res = await api.delete(`/partners/${id}`);
  return res.data;
};

// восстановить партнёра
export const restorePartner = async (id) => {
  await api.post(`/partners/${id}/restore`);
};