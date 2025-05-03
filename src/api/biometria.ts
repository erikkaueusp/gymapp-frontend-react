import { api } from "./api";

export const cadastrarBiometria = async (alunoId: number): Promise<void> => {
    await api.post(`/api/biometria/cadastrar-digital/${alunoId}`);
};

export const ativarScan = async (): Promise<string> => {
    const response = await api.post("/api/biometria/ativar-scan");
    return response.data.mensagem;
};

export const desativarScan = async (): Promise<string> => {
    const response = await api.post("/api/biometria/desativar-scan");
    return response.data.mensagem;
};

export const liberarAcesso = async (): Promise<string> => {
    const response = await api.post("/api/biometria/liberar-acesso");
    return response.data.mensagem;
};
