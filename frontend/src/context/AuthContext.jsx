import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const [actionState, setActionState] = useState({ pending: false, error: null, type: null });

  const resetActionState = (type) => setActionState({ pending: false, error: null, type });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/me')
      .then((res) => {
        setUser(res.data);
        setSessionError(null);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
        setSessionError('Your session has expired. Please sign in again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    setActionState({ pending: true, error: null, type: 'login' });
    try {
      const { data } = await api.post('/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      resetActionState('login');
      setSessionError(null);
    } catch (error) {
      setActionState({
        pending: false,
        type: 'login',
        error: error?.response?.data?.message || 'Unable to sign in. Please try again.',
      });
      throw error;
    }
  };

  const register = async (payload) => {
    setActionState({ pending: true, error: null, type: 'register' });
    try {
      const { data } = await api.post('/register', payload);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      resetActionState('register');
      setSessionError(null);
    } catch (error) {
      setActionState({
        pending: false,
        type: 'register',
        error: error?.response?.data?.message || 'Unable to create your account right now.',
      });
      throw error;
    }
  };

  const logout = async () => {
    setActionState({ pending: true, error: null, type: 'logout' });
    try {
      await api.post('/logout');
      resetActionState('logout');
    } catch (error) {
      setActionState({
        pending: false,
        type: 'logout',
        error: 'Unable to sign out right now. Please try again.',
      });
      throw error;
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        sessionError,
        actionState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
