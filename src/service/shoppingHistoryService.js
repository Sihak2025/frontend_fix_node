import api from "./api";

export const getAllShoppingHistory = async() => {
    const response = await api.get('/shopping_history')
    return response.data;
};