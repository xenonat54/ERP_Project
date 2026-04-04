// frontend/src/utils/authStorage.js

export const saveAuthData = (token, user) => {
    // Save the token and user data directly into the browser's memory
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuthData = () => {
    // This is for the Logout button later!
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

export const getUserRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
};