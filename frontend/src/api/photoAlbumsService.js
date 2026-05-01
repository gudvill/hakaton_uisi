import api from "./axios";

// получить альбомы
export const getPhotoAlbums = async () => {
  const res = await api.get("/photoalbums/");
  return res.data;
};

// создать альбом
export const createPhotoAlbum = async (data) => {
  const res = await api.post("/photoalbums/", data);
  return res.data;
};

// обновить альбом
export const updatePhotoAlbum = async (id, data) => {
  const res = await api.put(`/photoalbums/${id}`, data);
  return res.data;
};

// удалить альбом
export const deletePhotoAlbum = async (id) => {
  const res = await api.delete(`/photoalbums/${id}`);
  return res.data;
};

// получение фото по альбому
export const getPhotosByAlbum = async (albumId) => {
  const res = await api.get(`/photoalbums/${albumId}`);
  return res.data;
};

// загрузка фото
export const uploadPhoto = async (albumId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post(`/photos/upload/${albumId}`,
    formData,
    {headers: { "Content-Type": "multipart/form-data" }}
  );
  return res.data;
};

// удалить фото
export const deletePhoto = async (id) => {
  const res = await api.delete(`/photos/${id}`);
  return res.data;
};