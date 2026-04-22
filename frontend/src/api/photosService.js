import api from "./axios";

// загрузить фото
export const uploadPhoto = async (albumId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(`/photos/upload/${albumId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// получить все фото
export const getPhotos = async () => {
  const res = await api.get("/photos/");
  return res.data;
};

// получить фото по id
export const getPhotoById = async (id) => {
  const res = await api.get(`/photos/${id}`);
  return res.data;
};

// создать фото
export const createPhoto = async (data) => {
  const res = await api.post("/photos/", data);
  return res.data;
};

// обновить фото
export const updatePhoto = async (id, data) => {
  const res = await api.put(`/photos/${id}`, data);
  return res.data;
};

// отключить фото
export const disablePhoto = async (id) => {
  const res = await api.delete(`/photos/${id}`);
  return res.data;
};