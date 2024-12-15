import { createContext, useContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

// reducer
const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing authentication state');
      try {
        const token = window.localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: response.data
            }
          });
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
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      } finally {
        console.log('Authentication state initialized:', state);
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    console.log('User login attempt:', email);
    const response = await axios.post('/api/users/login', {
      email,
      password
    });
    const { token, user } = response.data;
    window.localStorage.setItem('token', token);
    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/users/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { token, user } = response.data;
    window.localStorage.setItem('token', token);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
    console.log('User registered:', user);
  };

  const logout = () => {
    window.localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = async (email) => {
    await axios.post('/api/users/reset-password', {
      email
    });
  };

  const updateProfile = async (update) => {
    const response = await axios.put('/api/users/profile', update, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    dispatch({
      type: 'LOGIN',
      payload: {
        user: response.data
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        register,
        resetPassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
