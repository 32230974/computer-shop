// TechHub API Configuration
// This file contains shared configuration for the frontend

// 🔧 DEPLOYMENT CONFIGURATION:
// For local development (running on your laptop):
//   const API_URL = window.location.origin + '/api';
// 
// For production (after deploying backend to Render/Railway/Heroku):
//   const API_URL = 'https://your-backend-url.onrender.com/api';
//   Replace 'your-backend-url.onrender.com' with your actual deployed backend URL

// Current configuration (using local for now):
const API_URL = window.location.origin + '/api';

// 💡 After deploying your backend, uncomment and update this line:
// const API_URL = 'https://your-backend-url.onrender.com/api';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to get current user
function getCurrentUser() {
    const user = localStorage.getItem('current_user');
    return user ? JSON.parse(user) : null;
}

// Helper function to check if user is logged in
function isLoggedIn() {
    return !!getAuthToken();
}

// Helper function to logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('current_user');
    window.location.href = 'login.html';
}

// Helper function for authenticated API requests
async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        logout();
        throw new Error('Session expired. Please login again.');
    }
    
    return response;
}
