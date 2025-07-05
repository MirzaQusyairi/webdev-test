import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { authAPI } from '../api';
import { cookieUtils } from '../utils/cookies';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'AUTH_CHECK_COMPLETE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = cookieUtils.getToken();
    if (token) {
      try {
        const response = await authAPI.me();
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data });
      } catch (error) {
        cookieUtils.removeToken();
        dispatch({ type: 'LOGOUT' });
      }
    } else {
      dispatch({ type: 'AUTH_CHECK_COMPLETE' });
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      const { access_token, user } = response.data;
      cookieUtils.setToken(access_token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      cookieUtils.removeToken();
      dispatch({ type: 'LOGOUT' });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {state.loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress />
        </Box>
      ) : (
        children
      )}
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
