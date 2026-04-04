// frontend/src/api/authApi.js
import apiClient from './apiClient';

export const loginUser = async (portalId, password) => {
    try {
        const response = await apiClient.post('/auth/login', { portalId, password });
        return response.data;
    } catch (error) {
        // Pass the error message back to the UI
        throw error.response?.data?.message || 'Login failed to connect to server';
    }
};