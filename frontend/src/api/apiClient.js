// frontend/src/api/apiClient.js
import axios from 'axios';

// Create a central instance so we don't have to type http://localhost:5000 everywhere
const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure your backend is running here!
    headers: {
        'Content-Type': 'application/json'
    }
});

// The Interceptor: This runs right BEFORE every request is sent
apiClient.interceptors.request.use(
    (config) => {
        // Look inside the browser's local storage for our ID card
        const token = localStorage.getItem('token');
        
        // If we have one, attach it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;