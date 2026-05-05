import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
});

// Request Interceptor: Menambahkan token ke header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Menangani eror 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Opsional: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Residents endpoints
export const residentsAPI = {
  getAll: () => api.get('/residents'),
  get: (id) => api.get(`/residents/${id}`),
  create: (data) => api.post('/residents', data),
  
  update: (id, data) => {
    // Jika data adalah FormData, gunakan POST dengan _method PUT
    if (data instanceof FormData) {
      if (!data.has('_method')) {
        data.append('_method', 'PUT');
      }
      return api.post(`/residents/${id}`, data);
    }
    // Jika JSON biasa, tetap gunakan PUT
    return api.put(`/residents/${id}`, data);
  },
  
  delete: (id) => api.delete(`/residents/${id}`),
};

// Houses endpoints
export const housesAPI = {
  getAll: () => api.get('/houses'),
  get: (id) => api.get(`/houses/${id}`),
  create: (data) => api.post('/houses', data),
  update: (id, data) => api.put(`/houses/${id}`, data),
  delete: (id) => api.delete(`/houses/${id}`),
  getHistory: (id) => api.get(`/houses/${id}/history`),
};

// Payments endpoints (mapped to dues in backend)
export const paymentsAPI = {
  getAll: () => api.get('/dues'),
  get: (id) => api.get(`/dues/${id}`),
  create: (data) => api.post('/dues', data),
  update: (id, data) => api.put(`/dues/${id}`, data),
  delete: (id) => api.delete(`/dues/${id}`),
  getByMonth: (year, month) => api.get(`/dues/month/${year}/${month}`),
  getByYear: (year) => api.get(`/dues/year/${year}`),
};

// Reports endpoints
export const reportsAPI = {
  getDashboard: () => api.get('/dashboard'),
  getFinancialSummary: (year) => api.get(`/reports/financial-summary/${year}`),
  getMonthlyDetail: (year, month) => api.get(`/reports/monthly-detail/${year}/${month}`),
  getYearlyReport: (year) => api.get(`/reports/yearly/${year}`),
};

// Dashboard endpoints
export const dashboardAPI = {
  getSummary: () => api.get('/dashboard'),
};

// Expenses endpoints
export const expensesAPI = {
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  delete: (id) => api.delete(`/expenses/${id}`),
};

export default api;
