import axios from "axios";

const API_URL = "https://kursovawork-d5500927b87d.herokuapp.com";

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');

export const getTopSongs = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/top-songs`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getPopularGenres = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/popular-genres`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getUserPreferences = async () => {
    try {
        const response = await axios.get(`${API_URL}/statistics/user-preferences`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};