import api from './api';

export const getAllPaymentMethod = async() => {
    const response = await api.get('/paymentMethods')
    return response.data;
};

export const getPaymentMethodById = async(id) => {
    const response = await api.get(`/paymentMethods/${id}`)
    return response.data;
};

export const createPaymentMethod = async(formData) => {
    const response = await api.post('/paymentMethods', formData)
    return response.data;
};

export const updatePaymentMethod = async(id, formData) => {
    const response = await api.put(`/paymentMethods/${id}`, formData)
    return response.data;
};

export const deletePaymentMethod = async(id) => {
    const response = await api.delete(`/paymentMethods/${id}`)
    return response.data;
}