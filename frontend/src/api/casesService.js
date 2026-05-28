import axios from "axios";
import api from "./axios";

const publicApi = axios.create({ baseURL: process.env.REACT_APP_API_URL });

// получить все активные кейсы
export const getCases = async (params = {}) => {
  const res = await api.get("/cases/", { params });
  return res.data;
};

// получить все архивные кейсы (публичный эндпоинт, без токена)
export const getArchivedCases = async (params = {}) => {
  const res = await publicApi.get("/cases/archived/", { params });
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

// восстановить кейс
export const restoreCase = async (id) => {
  await api.post(`/cases/${id}/restore`);
};