import { api } from "./api";

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
