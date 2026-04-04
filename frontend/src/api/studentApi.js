// frontend/src/api/studentApi.js
import apiClient from './apiClient';

// 1. Fetch Student Profile (The missing export!)
export const getStudentProfile = async () => {
    try {
        const response = await apiClient.get('/student/profile');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch profile';
    }
};

// 2. Fetch Student Grades
export const getMyGrades = async () => {
    try {
        const response = await apiClient.get('/student/grades');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch grades';
    }
};