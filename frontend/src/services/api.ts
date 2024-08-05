import axios from 'axios';
import {redirectTo} from "../utils/navigation";

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    timeout: 1000,
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('username');
            redirectTo('/signin');
        }

        return Promise.reject(error);
    }
);

export default api;
