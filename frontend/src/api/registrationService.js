import api from "./axios";

// получить все активные регистрации (команды)
export const getRegistrations = async (params = {}) => {
  const res = await api.get("/registration/", { params });
  return res.data;
};

// получить все архивные регистрации (команды)
export const getArchivedRegistrations = async (params = {}) => {
  const res = await api.get("/registration/archived/", { params });
  return res.data;
};

// получить регистрацию (команду) по id
export const getRegistrationById = async (id) => {
  const res = await api.get(`/registration/${id}`);
  return res.data;
};

// зарегистрировать команду
export const registerTeam = async (data) => {
  const res = await api.post("/registration/", data);
  return res.data;
};

// обновить регистрацию (команду)
export const updateRegistration = async (id, data) => {
  const res = await api.put(`/registration/${id}`, data);
  return res.data;
};

// отключить регистрацию (команду)
export const disableRegistration = async (id) => {
  const res = await api.delete(`/registration/${id}`);
  return res.data;
};

// восстановить регистрацию (команду)
export const restoreRegistration = async (id) => {
  await api.post(`/registration/${id}/restore`);
};

// создать участника
export const createParticipant = async (regId, data) => {
  const res = await api.post(`/registration/${regId}/participant`, data);
  return res.data;
};

// удалить участника
export const deleteParticipant = async (participantId) => {
  const res = await api.delete(`/registration/participant/${participantId}`);
  return res.data;
};