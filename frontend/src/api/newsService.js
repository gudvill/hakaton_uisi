import api from "./axios";

// получить все доступные новости
export const getNews = async () => {
  const res = await api.get("/news/");
  return res.data;
};

// получить все архивные новости
export const getArchivedNews = async () => {
  const res = await api.get("/news/archived/");
  return res.data;
};

// получить новость по id
export const getNewsById = async (id) => {
  const res = await api.get(`/news/${id}`);
  return res.data;
};

// получить новости за определённый год
export const getNewsByYear = async (year) => {
  if (!year) return getNews();
  const res = await api.get(`/news/by-year/${year}`);
  return res.data;
};

// создать новость
export const createNews = async (data) => {
  const res = await api.post("/news/", data);
  return res.data;
};

// обновить новость
export const updateNews = async (id, data) => {
  const res = await api.put(`/news/${id}`, data);
  return res.data;
};

// отключить новость
export const disableNews = async (id) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};
