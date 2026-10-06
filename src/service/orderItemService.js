
import api from './api.js';

export const getAllOrderItem = async () => {
  const response = await api.get('/order_items');
  return response.data;
};

export const getOrderItemById = async (id) => {
  const response = await api.get(`/order_items/${id}`);
  return response.data;
};

export const createOrderItem = async (formData) => {
  const response = await api.post('/order_items', formData);
  return response.data;
};

export const updateOrderItem = async (id, formData) => {
  const response = await api.put(`/order_items/${id}`, formData);
  return response.data;
};

export const deleteOrderItem = async (id) => {
  const response = await api.delete(`/order_items/${id}`);
  return response.data;
};
