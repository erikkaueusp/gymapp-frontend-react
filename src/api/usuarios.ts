import { api } from "./api";

export interface Usuario {
    id: number;
    username: string;
}

export const criarUsuario = async (username: string, senha: string): Promise<void> => {
    await api.post("/usuarios", { username, senha });
};

export const listarUsuarios = async (): Promise<Usuario[]> => {
    const response = await api.get<Usuario[]>("/usuarios");
    return response.data;
};

export const excluirUsuario = async (id: number): Promise<void> => {
    await api.delete(`/usuarios/${id}`);
};