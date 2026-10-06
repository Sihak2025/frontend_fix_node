

import api from './api.js';

export const getAllStockProduct = async () => {
  const response = await api.get('/stock_products');
  return response.data;
};

export const getStockProductById = async (id) => {
  const response = await api.get(`/stock_products/${id}`);
  return response.data;
};

export const createStockProduct = async (formData) => {
  const response = await api.post('/stock_products', formData);
  return response.data;
};

export const updateStockProduct = async (id, formData) => {
  const response = await api.put(`/stock_products/${id}`, formData);
  return response.data;
};

export const deleteStockProduct = async (id) => {
  const response = await api.delete(`/stock_products/${id}`);
  return response.data;
};
