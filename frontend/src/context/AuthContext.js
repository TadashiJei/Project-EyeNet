// frontend/src/context/AuthContext.js
import { createContext, useContext, useEffect, useReducer } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        isInitialized: true,
        user: action.payload.user
      };
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.get('/auth/me');
          if (response.data && response.data.user) {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: response.data.user
              }
            });
          } else {
             console.error("Invalid response from /auth/me:", response);
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  return <AuthContext.Provider value={{ ...state }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
