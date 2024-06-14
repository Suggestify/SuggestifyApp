// Inside api.js

// Import necessary items
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Global from './Global'; // Ensure this contains your configuration

const api = axios.create({
    baseURL: Global.ip,
});

// Request interceptor to attach the token
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response interceptor to refresh token on receiving a 401 error
api.interceptors.response.use(response => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const userName = await AsyncStorage.getItem('userName');
            console.log("trying to do smth rn")
            const tokenResponse = await axios.post(`${Global.ip}/auth/token`, { token: refreshToken, userName: userName });
            console.log("here yee")
            const newAccessToken = tokenResponse.data.accessToken;
            console.log("new access token: " + newAccessToken);
            await AsyncStorage.setItem('accessToken', newAccessToken);

            api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshError) {
            console.error('Failed to refresh token', refreshError);
            // Handle logout or redirection to login as needed
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});

export default api;
