import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data if token exists
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setIsLoading(false);
                return;
            }
            try {
                const { data } = await api.get('/auth/me');
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
                logout(); // Invalid token
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (formData) => {
        // formData can be an object with { email, password, name, address, nic, phoneNumber }
        const { data } = await api.post('/auth/register', formData);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const updateProfile = async (formData) => {
        const { data } = await api.put('/auth/profile', formData);
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // OAuth Success Handler (call this from the redirect page)
    const handleOAuthSuccess = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                register,
                updateProfile,
                logout,
                handleOAuthSuccess,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
