import api from "./axios";

// получить все записи описания
export const getAbout = async () => {
  const res = await api.get("/about/");
  return res.data;
};

// получить запись описания по id
export const getAboutById = async (id) => {
  const res = await api.get(`/about/${id}`);
  return res.data;
};

// создать запись описания
export const createAbout = async (formData) => {
  const res = await api.post("/about/", formData);
  return res.data;
};

// обновить запись описания
export const updateAbout = async (id, formData) => {
  const res = await api.put(`/about/${id}`, formData);
  return res.data;
};

// удалить запись описания
export const deleteAbout = async (id) => {
  const res = await api.delete(`/about/${id}`);
  return res.data;
};
