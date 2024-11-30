import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = "http://localhost:3000";

export const signupUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/registration`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const signinUser = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyEmail = async (token) => {
    const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
    return response.data;
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/auth/request-password-reset`, {email});
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const passwordReset = async (password, token) => {
    try {
        const response = await axios.post(`${API_URL}/auth/reset-password?token=${token}`, {newPassword: password});
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};


export const logoutUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/logout`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('role');

        Cookies.remove('token');

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};
