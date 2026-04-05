import api from "./axios";

export const getNews = async () => {
  const res = await api.get("/news/");
  return res.data;
};

export const getNewsById = async (id) => {
  const res = await api.get(`/news/${id}`);
  return res.data;
};

export const createNews = async (data) => {
  const res = await api.post("/news/", data);
  return res.data;
};

export const updateNews = async (id, data) => {
  const res = await api.put(`/news/${id}`, data);
  return res.data;
};

export const deleteNews = async (id) => {
  const res = await api.delete(`/news/${id}`);
  return res.data;
};
