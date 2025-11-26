import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'https://backend-revision-gj7h.onrender.com',
    withCredentials: true, // Include cookies in requests
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add access token to headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If access token expired (401/403) and we haven't tried to refresh yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.get('https://backend-revision-gj7h.onrender.com/api/auth/refresh', {
                    withCredentials: true
                });

                const { accessToken } = response.data;

                // Store new access token
                localStorage.setItem('accessToken', accessToken);

                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                // Retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
