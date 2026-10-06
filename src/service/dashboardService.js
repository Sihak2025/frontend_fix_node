import api from "./api";

export const getAllDashboard = async() => {
    const response = await api.get('/dashboards')
    return response.data;
}