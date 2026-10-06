
import api from './api.js';

export const getAllProductVariant = async () => {
  const response = await api.get('/product_variants');
  return response.data;
};

export const getProductVariantById = async (id) => {
  const response = await api.get(`/product_variants/${id}`);
  return response.data;
};

export const createProductVariant = async (formData) => {
  const response = await api.post('/product_variants', formData);
  return response.data;
};

export const updateProductVariant = async (id, formData) => {
  const response = await api.put(`/product_variants/${id}`, formData);
  return response.data;
};

export const deleteProductVariant = async (id) => {
  const response = await api.delete(`/product_variants/${id}`);
  return response.data;
};
