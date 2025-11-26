import api from './api';

// Register a new user
export const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', {
        name,
        email,
        password
    });
    return response.data;
};

// Login user
export const login = async (name, password) => {
    const response = await api.post('/api/auth/login', {
        name,
        password
    });
    return response.data;
};

// Refresh access token
export const refreshToken = async () => {
    const response = await api.get('/api/auth/refresh');
    return response.data;
};

// Get dashboard data (protected route)
export const getDashboard = async () => {
    const response = await api.get('/dashboard');
    return response.data;
};
