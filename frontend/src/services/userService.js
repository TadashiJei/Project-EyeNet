import api from './api';

export const getCurrentUser = async () => {
    try {
        const response = await api.get('/users/me');
        return response.data;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};

export const updateUserProfile = async (userData) => {
    try {
        const response = await api.put('/users/profile', userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

export const updateUserSettings = async (settings) => {
    try {
        const response = await api.put('/users/settings', settings);
        return response.data;
    } catch (error) {
        console.error('Error updating user settings:', error);
        throw error;
    }
};

export const getAllUsers = async (page = 1, limit = 10) => {
    try {
        const response = await api.get('/admin/users', {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const updateUserRole = async (userId, role) => {
    try {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    } catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};
