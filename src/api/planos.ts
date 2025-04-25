import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Authorization: localStorage.getItem("token") || "",
    },
});

export interface Plano {
    id: number;
    nome: string;
    periodicidade: "DAILY" | "MONTHLY" | "ANNUAL";
    preco: number;
    dataCriacao: string;
}

export const getPlanos = async (): Promise<Plano[]> => {
    const response = await api.get<{ content: Plano[] }>("/v1/api/plano?page=0&size=10");
    return response.data.content;
};
