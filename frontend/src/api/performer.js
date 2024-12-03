import axios from "axios";

const API_URL = "http://localhost:3000";

export const getAllPerformers = async () => {
    try {
        const response = await axios.get(`${API_URL}/performers/all-performers`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPerformerById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/performers/get-performer/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addPerformer = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/performers/add-performer`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updatePerformer = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/performers/update-performer/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deletePerformer = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/performers/delete-performer/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

