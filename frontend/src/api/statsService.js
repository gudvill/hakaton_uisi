import api from './axios';

export const getStats = async () => {
  const res = await api.get('/stats/');
  return res.data;
};

export const getAnalytics = async () => {
  const res = await api.get('/analytics/');
  return res.data;
};

export const getVisitSessions = async () => {
  const res = await api.get('/analytics/sessions');
  return res.data;
};

export const getTopPages = async () => {
  const res = await api.get('/analytics/pages');
  return res.data;
};

export const getDevices = async () => {
  const res = await api.get('/analytics/devices');
  return res.data;
};

export const getTrafficSources = async () => {
  const res = await api.get('/analytics/sources');
  return res.data;
};