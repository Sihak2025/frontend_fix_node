
import api from './api.js';

export const getAllOrder = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const createOrder = async (formData) => {
  const response = await api.post('/orders/', formData);
  return response.data;
};

export const updateOrder = async (id, formData) => {
  const response = await api.put(`/orders/${id}`, formData);
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
