import axios from "axios";

const API_URL = "http://localhost:3000";

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export const getUserPlaylists = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/playlists/user-playlists/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const createPlaylist = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/playlists/create-playlist`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addSongToPlaylist = async (id, formData) => {
    try {
        const response = await axios.post(`${API_URL}/playlists/${id}/songs`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const removeSongFromPlaylist = async (id, songId) => {
    try {
        const response = await axios.delete(`${API_URL}/playlists/${id}/songs/${songId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const deletePlaylist = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/playlists/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

