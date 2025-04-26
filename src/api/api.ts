import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    throw new Error("VITE_API_URL não está definido.");
}

export const api = axios.create({
    baseURL,
    headers: {
        Authorization: localStorage.getItem("token") || "",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

