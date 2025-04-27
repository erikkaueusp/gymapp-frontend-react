import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
    throw new Error("VITE_API_URL não está definido.");
}

export const api = axios.create({
    baseURL,
    timeout: 10000, // 10 segundos de timeout
    headers: {
        Authorization: localStorage.getItem("token") || "",
    },
});

// Adiciona o token em todas as requisições (caso esteja no localStorage)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

// Interceptor para tratar erros e logar bonito no console
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Aqui você pode fazer o log do erro formatado
        if (error.response) {
            // O servidor respondeu com um status fora do 2xx
            console.error(`[API ERROR] Status: ${error.response.status}`);
            console.error(`[API ERROR] URL: ${error.config.url}`);
            console.error(`[API ERROR] Response:`, error.response.data);
        } else if (error.request) {
            // A requisição foi feita mas não houve resposta
            console.error("[API ERROR] Sem resposta do servidor.");
            console.error(`[API ERROR] URL: ${error.config.url}`);
        } else {
            // Erro ao configurar a requisição
            console.error("[API ERROR] Erro ao configurar requisição:", error.message);
        }
        return Promise.reject(error); // Importante: ainda propaga o erro para o caller
    }
);
