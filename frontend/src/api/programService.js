import api from "./axios";

// получить все записи программы
export const getProgram = async () => {
  const res = await api.get("/program/");
  return res.data;
};

// получить запись программы по id
export const getProgramById = async (id) => {
  const res = await api.get(`/program/${id}`);
  return res.data;
};

// получить дату начала события
export const getEventDate= async () => {
  const res = await api.get("/program/event-date/");
  return res.data;
};

// создать запись программы
export const createProgram = async (data) => {
  const res = await api.post("/program/", data);
  return res.data;
};

// обновить запись программы
export const updateProgram = async (id, data) => {
  const res = await api.put(`/program/${id}`, data);
  return res.data;
};

// удалить запись программы
export const deleteProgram = async (id) => {
  const res = await api.delete(`/program/${id}`);
  return res.data;
};
