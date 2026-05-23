import api from './axios';

export const getStats = async () => {
  const res = await api.get('/stats/');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await api.get('/analytics/');
  return res.data;
};

