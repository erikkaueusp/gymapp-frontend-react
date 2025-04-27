import { useEffect, useState } from "react";
import { api } from "../api/api";
import { formatarDataBR } from "../utils/formatDate";
import { Link } from "react-router-dom";

interface VencimentoAssinatura {
    nomeAluno: string;
    plano: string;
    dataFim: string;
    diasRestantes: number;
}

interface ApiResponse {
    content: VencimentoAssinatura[];
    totalElements: number;
    totalPages: number;
}

const ProximosVencimentosPage = () => {
    const [vencimentos, setVencimentos] = useState<VencimentoAssinatura[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [dias, setDias] = useState(10);  // padrão 17 como no seu exemplo

    useEffect(() => {
        buscarVencimentos();
    }, [page, dias]);

    const buscarVencimentos = async () => {
        try {
            const response = await api.get<ApiResponse>(`/assinaturas/proximos-vencimentos`, {
                params: {
                    dias,
                    page,
                    size: 10,
                },
            });
            setVencimentos(response.data.content);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error("Erro ao buscar vencimentos", error);
        }
    };

    const getRowColor = (diasRestantes: number) => {
        if (diasRestantes <= 2) {
            return "bg-red-100 text-red-700";
        } else if (diasRestantes <= 5) {
            return "bg-yellow-100 text-yellow-700";
        } else {
            return "bg-green-100 text-green-700";
        }
    };

    const handleAnterior = () => {
        if (page > 0) setPage(page - 1);
    };

    const handleProximo = () => {
        if (page + 1 < totalPages) setPage(page + 1);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Próximos Vencimentos</h1>
                <Link to="/dashboard/assinaturas/novo" className="text-blue-500 hover:underline text-sm">
                    + Nova Assinatura
                </Link>
            </div>

            <div className="mb-6">
                <label className="block mb-1 text-gray-700">Buscar vencimentos nos próximos dias:</label>
                <input
                    type="number"
                    min={1}
                    value={dias}
                    onChange={(e) => {
                        const valor = Number(e.target.value);
                        if (isNaN(valor) || valor < 1) {
                            setDias(1);
                        } else {
                            setDias(valor);
                        }
                    }}
                    className="border rounded p-2 w-24"
                />
            </div>

            {totalElements > 0 && (
                <div className="text-gray-600 mb-4 text-sm">
                    Mostrando {vencimentos.length} de {totalElements} assinaturas — Página {page + 1} de {totalPages}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full table-fixed border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="text-left py-3 px-6 border-b">Nome do Aluno</th>
                            <th className="text-left py-3 px-6 border-b">Plano</th>
                            <th className="text-left py-3 px-6 border-b">Vence em</th>
                            <th className="text-left py-3 px-6 border-b">Dias Restantes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vencimentos.map((vencimento, idx) => (
                            <tr key={idx} className={`${getRowColor(vencimento.diasRestantes)} hover:bg-gray-50`}>
                                <td className="py-3 px-6 border-b">{vencimento.nomeAluno}</td>
                                <td className="py-3 px-6 border-b">{vencimento.plano}</td>
                                <td className="py-3 px-6 border-b">{formatarDataBR(vencimento.dataFim)}</td>
                                <td className="py-3 px-6 border-b">{vencimento.diasRestantes} dias</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            {totalElements > 0 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={handleAnterior}
                        disabled={page === 0}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={handleProximo}
                        disabled={page + 1 >= totalPages}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                        Próximo
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProximosVencimentosPage;