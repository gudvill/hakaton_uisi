import api from "./axios";

export const registerTeam = async (data) => {
  const res = await api.post("/registration/", data);
  return res.data;
};

export const getRegistrations = async () => {
  const res = await api.get("/registration/");
  return res.data;
};

export const getRegistrationById = async (id) => {
  const res = await api.get(`/registration/${id}`);
  return res.data;
};