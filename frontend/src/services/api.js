import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

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

// Payments endpoints
export const paymentsAPI = {
  getAll: () => api.get('/payments'),
  get: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post('/payments', data),
  update: (id, data) => api.put(`/payments/${id}`, data),
  delete: (id) => api.delete(`/payments/${id}`),
  getByMonth: (year, month) => api.get(`/payments/month/${year}/${month}`),
  getByYear: (year) => api.get(`/payments/year/${year}`),
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

export default api;
