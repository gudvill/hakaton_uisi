import api from "./axios";

// получить все кейсы
export const getCases = async () => {
  const res = await api.get("/cases/");
  return res.data;
};

// получить кейс по id
export const getCaseById = async (id) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

// создать кейс
export const createCase = async (data) => {
  const res = await api.post("/cases/", data);
  return res.data;
};

// обновить кейс
export const updateCase = async (id, data) => {
  const res = await api.put(`/cases/${id}`, data);
  return res.data;
};

// отключить кейс
export const disableCase = async (id) => {
  const res = await api.delete(`/cases/${id}`);
  return res.data;
};