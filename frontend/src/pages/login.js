// frontend/src/pages/login.js
import { loginUser } from '../api/authApi';
import { saveAuthData } from '../utils/authStorage';

// Grab the HTML elements
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('login-btn');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the browser from refreshing the page

    // Get the values the user typed in
    const portalId = document.getElementById('portalId').value;
    const password = document.getElementById('password').value;

    // Give some UI feedback
    loginBtn.textContent = 'Authenticating...';
    loginBtn.disabled = true;
    errorMessage.style.display = 'none';

    try {
        // 1. Send the data to your Node.js backend
        const response = await loginUser(portalId, password);
        
        // 2. Success! Save the JWT to the browser's vault
        saveAuthData(response.data.token, response.data.user);

        // 3. Traffic Cop: Where do they go next?
        const role = response.data.user.role;
        if (role === 'admin') {
            window.location.href = '/admin-dashboard.html';
        } else if (role === 'teacher') {
            window.location.href = '/teacher-dashboard.html';
        } else if (role === 'student') {
            window.location.href = '/student-dashboard.html';
        }
    } catch (error) {
        // 4. Failure! Show the error from the backend (e.g., "Invalid Portal ID or Password")
        errorMessage.textContent = error;
        errorMessage.style.display = 'block';
        
        // Reset the button
        loginBtn.textContent = 'Sign In';
        loginBtn.disabled = false;
    }
});