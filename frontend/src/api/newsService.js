import api from "./axios";

// получить все новости
export const getNews = async () => {
  const res = await api.get("/news/");
  return res.data;
};

// получить новость по id
export const getNewsById = async (id) => {
  const res = await api.get(`/news/${id}`);
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
