import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);


    const setAuthSession = useCallback((token, user) => {
        if (token) {
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        }

        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);
        } else {
            localStorage.removeItem('user');
            setUser(null);
        }
    }, []);


    useEffect(() => {
        const initAuth = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                setLoading(false);
                return;
            }

            try {

                axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;


                const res = await axios.get(`${API_URL}/auth/me`);
                setAuthSession(savedToken, res.data);
            } catch (err) {
                console.error('Initial auth check failed:', err.response?.data || err.message);
                setAuthSession(null, null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [setAuthSession]);


    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {

                    setAuthSession(null, null);

                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [setAuthSession]);

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        setAuthSession(res.data.token, res.data.user);
        setToken(res.data.token);
    };

    const signup = async (username, email, password) => {
        const res = await axios.post(`${API_URL}/auth/signup`, { username, email, password });
        setAuthSession(res.data.token, res.data.user);
        setToken(res.data.token);
    };

    const logout = () => {
        setAuthSession(null, null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
