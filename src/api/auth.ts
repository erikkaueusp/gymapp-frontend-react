import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

export interface AuthRequest {
    usuario: string;
    senha: string;
}

export interface AuthResponse {
    token: string;
    tipo: string;
}

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth", data);
    return response.data;
};
