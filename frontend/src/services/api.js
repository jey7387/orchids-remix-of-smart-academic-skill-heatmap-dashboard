import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const login = (email, password) => api.post('/auth/login', { email, password });
export const getProfile = () => api.get('/auth/profile');
export const getAllUsers = () => api.get('/auth/users');
export const deleteUser = (id) => api.delete(`/auth/users/${id}`);
export const getSkills = () => api.get('/skills');
export const getMyScores = () => api.get('/my-scores');
export const getHeatmapData = () => api.get('/heatmap');
export const getDashboardStats = () => api.get('/dashboard');
export const getClassPerformance = () => api.get('/class-performance');
export const getAlerts = () => api.get('/alerts');

export default api;
