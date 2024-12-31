import axios from "axios";

const API_URL = "https://kursovawork-d5500927b87d.herokuapp.com/";

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export const getAllPerformers = async () => {
    try {
        const response = await axios.get(`${API_URL}/performer/all-performers`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPerformerById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/performer/get-performer/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addPerformer = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/performer/add-performer`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePerformer = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/performer/update-performer/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deletePerformer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/performer/delete-performer/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

