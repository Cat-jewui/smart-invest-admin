import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 401 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = (email, password) => 
  api.post('/auth/login', { email, password });

// Dashboard
export const getDashboardStats = () => 
  api.get('/dashboard/stats');

export const getDailySignups = () => 
  api.get('/dashboard/daily-signups');

export const getDailyRevenue = () => 
  api.get('/dashboard/daily-revenue');

export const getPackageSales = () => 
  api.get('/dashboard/package-sales');

export const getRevenueSource = () => 
  api.get('/dashboard/revenue-source');

// Members
export const getMembers = (params) => 
  api.get('/members', { params });

export const getMember = (id) => 
  api.get(`/members/${id}`);

export const updateMember = (id, data) => 
  api.put(`/members/${id}`, data);

export const sendKakaoMessage = (data) => 
  api.post('/members/send-kakao', data);

// Revenue
export const getRevenue = (params) => 
  api.get('/revenue', { params });

export const uploadKmongRevenue = (data) => 
  api.post('/revenue/kmong-upload', data);

// Pricing
export const getPackages = () => 
  api.get('/pricing');

export const updatePackage = (id, data) => 
  api.put(`/pricing/${id}`, data);

// Reviews
export const getReviews = () => 
  api.get('/reviews');

export const replyToReview = (id, adminReply) => 
  api.put(`/reviews/${id}/reply`, { adminReply });

// Costs
export const getCosts = (params) => 
  api.get('/costs', { params });

export const createCost = (data) => 
  api.post('/costs', data);

// Chat
export const getChatRooms = () =>
  api.get('/chat/rooms');

export default api;
