// frontend/src/api/adminApi.js
import apiClient from './apiClient';

// 1. Create User (Your existing one)
export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/admin/create-user', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

// 2. Create Course
export const createCourse = async (courseData) => {
    try {
        const response = await apiClient.post('/admin/create-course', courseData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to create course';
    }
};

// 3. Enroll Student
export const enrollStudent = async (enrollData) => {
    try {
        const response = await apiClient.post('/admin/enroll', enrollData);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to enroll student';
    }
};

// 4. Fetch Users by Role (For dropdowns)
export const getUsersByRole = async (role) => {
    try {
        const response = await apiClient.get(`/admin/users/${role}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || `Failed to fetch ${role}s`;
    }
};

// 5. Fetch All Courses (For dropdowns)
export const getAllCourses = async () => {
    try {
        const response = await apiClient.get('/admin/courses');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to fetch courses';
    }
};