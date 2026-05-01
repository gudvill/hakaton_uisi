import api from "./axios";

// получить все записи faq
export const getFaq = async () => {
  const res = await api.get("/faq/");
  return res.data;
};

// получить запись faq по id
export const getFaqById = async (id) => {
  const res = await api.get(`/faq/${id}`);
  return res.data;
};

// создать запись faq
export const createFaq = async (data) => {
  const res = await api.post("/faq/", data);
  return res.data;
};

// обновить запись faq
export const updateFaq = async (id, data) => {
  const res = await api.put(`/faq/${id}`, data);
  return res.data;
};

// удалить запись faq
export const deleteFaq = async (id) => {
  const res = await api.delete(`/faq/${id}`);
  return res.data;
};
