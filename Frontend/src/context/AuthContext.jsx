import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({
    user: null,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    refreshUser: async () => { },
    isLoading: true,
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to fetch user profile using the token
    const fetchUser = async () => {
        try {
            const response = await api.get('/user');
            setUser(response.data);
        } catch (error) {
            console.error("Failed to fetch user:", error);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUser();
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.data.token);
        await fetchUser();
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        // Assuming register returns token, if not, we might need to login after
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            await fetchUser();
        }
        return response.data;
    };

    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, refreshUser: fetchUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
