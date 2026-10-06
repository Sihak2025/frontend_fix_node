import api from "./api";

export const getAllPayment = async() => {
    const response = await api.get('/payments')
    return response.data;
};

export const getPaymentById = async(id) => {
    const response = await api.get(`/payments/${id}`)
    return response.data;
};

export const createPayment = async(formData) => {
    const response = await api.post('/payments', formData)
    return response.data;
};

export const updatePayment = async(id, formData) => {
    const response = await api.put(`/payments/${id}`, formData)
    return response.data;
};

export const deletePayment = async(id) => {
    const response = await api.delete(`/payments/${id}`)
    return response.data;
}