import api from "./axios";

// получить все доступные отзывы
export const getReviews = async () => {
  const res = await api.get("/reviews/");
  return res.data;
};

// получить все архивные отзывы
export const getArchivedReviews = async () => {
  const res = await api.get("/reviews/archived/");
  return res.data;
};

// получить отзыв по id
export const getReviewsById = async (id) => {
  const res = await api.get(`/reviews/${id}`);
  return res.data;
};

// создать отзыв
export const createReviews = async (data) => {
  const res = await api.post("/reviews/", data);
  return res.data;
};

// обновить отзыв
export const updateReviews = async (id, data) => {
  const res = await api.put(`/reviews/${id}`, data);
  return res.data;
};

// отключить отзыв
export const disableReview = async (id) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};
