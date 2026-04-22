import api from "./axios";

// получить все фотоальбомы
export const getPhotoAlbums = async () => {
  const res = await api.get("/photoalbums/");
  return res.data;
};

// получить фотоальбом по id
export const getPhotoAlbumById = async (id) => {
  const res = await api.get(`/photoalbums/${id}`);
  return res.data;
};

// создать фотоальбом
export const createPhotoAlbum = async (data) => {
  const res = await api.post("/photoalbums/", data);
  return res.data;
};

// обновить фотоальбом
export const updatePhotoAlbum = async (id, data) => {
  const res = await api.put(`/photoalbums/${id}`, data);
  return res.data;
};

// отключить фотоальбом
export const disablePhotoAlbum = async (id) => {
  const res = await api.delete(`/photoalbums/${id}`);
  return res.data;
};