import { api } from "./api";

export interface AlunoAutocomplete {
    id: number;
    nome: string;
}

export const buscarAlunosPorNome = async (
    nome: string,
    page = 0,
    size = 10
): Promise<AlunoAutocomplete[]> => {
    const res = await api.get<{ content: AlunoAutocomplete[] }>(
        `/v1/api/aluno/autocomplete?nome=${nome}&page=${page}&size=${size}`
    );
    return res.data.content;
};


export interface Aluno {
    id: number;
    nome: string;
    email: string;
    telefone: string;
    dataCriacao: string;
    biometriaCadastrada: boolean;
}

// aqui podemos refatorar o input para utilizar o Aluno, analizar se vale a pena isso dado que é usado no AlunoPageResponse
export interface AlunoInput {
    nome: string;
    email: string;
    endereco: string;
    telefone: string;
}

export interface AlunoPageResponse {
    content: Aluno[];
    totalPages: number;
    totalElements: number;
    number: number; // página atual
    numberOfElements: number;
    size: number;
}


export const getAlunos = async (page = 0, size = 10): Promise<AlunoPageResponse> => {
    const res = await api.get(`/v1/api/aluno?page=${page}&size=${size}`);
    return res.data;
};



export const createAluno = async (aluno: AlunoInput): Promise<void> => {
    await api.post("/v1/api/aluno", aluno);
};

