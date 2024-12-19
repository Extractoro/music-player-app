import axios from "axios";

const API_URL = "http://localhost:3000";

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export const getAllGroups = async () => {
    try {
        const response = await axios.get(`${API_URL}/groups/all-groups`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const addArtistToGroup = async (groupId, formData) => {
    try {
        const response = await axios.post(`${API_URL}/groups/${groupId}/add-artists`, formData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const removeArtistFromGroup = async (groupId, artistId) => {
    try {
        const response = await axios.delete(`${API_URL}/groups/${groupId}/delete-artists/${artistId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};