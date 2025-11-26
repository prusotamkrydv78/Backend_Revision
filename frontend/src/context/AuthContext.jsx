import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, refreshToken as refreshTokenAPI } from '../api/authAPI';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    // Try to refresh token on mount
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (accessToken) {
                    // Token exists, try to refresh to validate
                    const data = await refreshTokenAPI();
                    localStorage.setItem('accessToken', data.accessToken);
                    setAccessToken(data.accessToken);
                }
            } catch (error) {
                // Refresh failed, clear token
                localStorage.removeItem('accessToken');
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (name, password) => {
        try {
            const data = await loginAPI(name, password);
            localStorage.setItem('accessToken', data.accessToken);
            setAccessToken(data.accessToken);
            setUser({ name });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            await registerAPI(name, email, password);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setAccessToken(null);
        setUser(null);
    };

    const value = {
        user,
        accessToken,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!accessToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
