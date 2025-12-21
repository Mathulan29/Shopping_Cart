import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthSuccess = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const { handleOAuthSuccess } = useAuth(); // You need to expose this in AuthContext

    useEffect(() => {
        const params = new URLSearchParams(search);
        const token = params.get('token');

        if (token) {
            handleOAuthSuccess(token);
            navigate('/'); // Redirect to home
        } else {
            navigate('/'); // Redirect home if no token
        }
    }, [search, handleOAuthSuccess, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Authenticating...</p>
        </div>
    );
};
