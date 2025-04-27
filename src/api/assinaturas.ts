import { api } from "./api";

export interface Aluno {
    id: number;
    nome: string;
    email: string;
    endereco: string;
    telefone: string;
    img: string | null;
    dataCriacao: string;
}

export interface Plano {
    id: number;
    nome: string;
    periodicidade: "DAILY" | "MONTHLY" | "ANNUAL";
    preco: number;
    dataCriacao: string;
}

export interface Assinatura {
    id: number;
    aluno: Aluno;
    plano: Plano;
    dataInicio: string;
    dataFim: string;
    ativa: boolean;
}

export interface AssinaturasResponse {
    content: Assinatura[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number; // página atual
    first: boolean;
    last: boolean;
}

export interface FilterAssinaturasParams {
    page: number;
    size: number;
    nomeAluno?: string;
    periodicidade?: "DAILY" | "MONTHLY" | "ANNUAL";
    dataInicio?: string;
    dataFim?: string;
    ativa?: boolean;
}

export const filterAssinaturas = async (
    params: FilterAssinaturasParams
): Promise<AssinaturasResponse> => {
    const res = await api.get<AssinaturasResponse>("/assinaturas/filter", {
        params,
    });
    return res.data;
};

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
