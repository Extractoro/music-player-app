import axios from "axios";

const API_URL = "http://localhost:3000";

export const getAllAlbums = async () => {
    try {
        const response = await axios.get(`${API_URL}/albums/all-albums`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getAlbumById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/albums/get-album/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addAlbum = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/albums/add-album`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateAlbum = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/albums/update-album/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteAlbum = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/albums/delete-album/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

