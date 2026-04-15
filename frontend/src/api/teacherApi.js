// frontend/src/api/teacherApi.js
import apiClient from './apiClient';

// 1. Fetch Students assigned to THIS teacher
export const getAllStudents = async () => {
    try {
        const response = await apiClient.get('/teacher/students');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch roster';
    }
};

// 2. Submit Grade (The missing export!)
export const assignGrade = async (gradeData) => {
    try {
        // backend expects { studentId, score, remarks }
        const response = await apiClient.post('/teacher/grades', gradeData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to assign grade';
    }
};
// 3. Get Teacher Profile (For the profile card)
export const getTeacherProfile = async () => {
    try {
        const response = await apiClient.get('/teacher/profile'); 
        return response.data;
    } catch (error) {
        throw error;
    }
};