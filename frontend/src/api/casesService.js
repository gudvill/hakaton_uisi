import api from "./axios";

// получить все доступные кейсы
export const getCases = async () => {
  const res = await api.get("/cases/");
  return res.data;
};

// получить кейс по id
export const getCaseById = async (id) => {
  const res = await api.get(`/cases/${id}`);
  return res.data;
};

// получить все архивные кейсы
export const getArchivedCases = async () => {
  const res = await api.get("/cases/archived");
  return res.data;
};

// получить кейсы за определённый год
export const getCasesByYear = async (year) => {
  if (!year) return getCases();
  const res = await api.get(`/cases/by-year/${year}`);
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