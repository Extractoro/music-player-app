import axios from "axios";

const API_URL = "https://kursovawork-d5500927b87d.herokuapp.com/";

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export const getAllSongs = async () => {
    try {
        const response = await axios.get(`${API_URL}/songs/all-songs`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getSongById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/songs/get-song/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addSong = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/songs/add-song`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const updateSong = async (id, formData) => {
    try {
        const response = await axios.put(`${API_URL}/songs/update-song/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deleteSong = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/songs/delete-song/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

