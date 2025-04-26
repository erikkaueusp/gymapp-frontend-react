import { api } from "./api";

export interface TotaisResponse {
    inicio: string;
    fim: string;
    totais: Record<"DAILY" | "MONTHLY" | "ANNUAL", number>;
    totalGeral: number;
}

export const getTotaisAssinaturas = async (
    inicio: string,
    fim: string
): Promise<TotaisResponse> => {
    const res = await api.get<TotaisResponse>(`/assinaturas/totais?inicio=${inicio}&fim=${fim}`);
    return res.data;
};


export interface CriarAssinaturaInput {
    alunoId: number;
    planoId: number;
}

export const criarAssinatura = async (input: CriarAssinaturaInput): Promise<void> => {
    await api.post("/assinaturas", input);
};
