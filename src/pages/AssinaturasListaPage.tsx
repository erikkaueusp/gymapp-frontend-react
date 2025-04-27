import { useState } from "react";
import { filterAssinaturas, Assinatura } from "../api/assinaturas";
import { formatarDataBR } from "../utils/formatDate";
import AlunoAutocomplete, { Aluno } from "../components/AlunoAutocomplete";
import Notification from "../components/Notification";



const AssinaturasListaPage = () => {
    const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Default inicial
    const [showNoResultsNotification, setShowNoResultsNotification] = useState(false);



    const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
    const [periodicidade, setPeriodicidade] = useState<"DAILY" | "MONTHLY" | "ANNUAL" | "">("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [ativa, setAtiva] = useState<"true" | "false" | "">("");

    const fetchAssinaturas = async (pageNumber: number) => {
        try {
            const filtros: any = {
                page: pageNumber,
                size: 10,
            };
            if (alunoSelecionado) filtros.nomeAluno = alunoSelecionado.nome;
            if (periodicidade) filtros.periodicidade = periodicidade;
            if (dataInicio) filtros.dataInicio = dataInicio;
            if (dataFim) filtros.dataFim = dataFim;
            if (ativa !== "") filtros.ativa = ativa === "true";

            const data = await filterAssinaturas(filtros);
            setAssinaturas(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
            setPageSize(data.size);

            // Aqui controlamos se mostra a notificação
            if (data.totalElements === 0) {
                setShowNoResultsNotification(true);
            } else {
                setShowNoResultsNotification(false);
            }
        } catch (error) {
            console.error("Erro ao buscar assinaturas", error);
        }
    };

    const handleBuscar = () => {
        setPage(0);
        fetchAssinaturas(0);
        setShowNoResultsNotification(false);
    };

    const handleNext = () => {
        if (page < totalPages - 1) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchAssinaturas(nextPage);
        }
    };

    const handlePrevious = () => {
        if (page > 0) {
            const prevPage = page - 1;
            setPage(prevPage);
            fetchAssinaturas(prevPage);
        }
    };

    return (
        <>
            {/* Notificação flutuante global */}
            {showNoResultsNotification && (
                <div className="fixed top-4 right-4 z-50">
                    <Notification
                        message="Nenhum resultado encontrado para os filtros selecionados."
                        onClose={() => setShowNoResultsNotification(false)}
                    />
                </div>
            )}

            <div className="max-w-6xl mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Filtro de Assinaturas</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <AlunoAutocomplete
                            label="Nome do Aluno"
                            onSelect={(alunoSelecionado) => setAlunoSelecionado(alunoSelecionado)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Periodicidade</label>
                        <select
                            value={periodicidade}
                            onChange={(e) => setPeriodicidade(e.target.value as any)}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="">Todos</option>
                            <option value="DAILY">Diário</option>
                            <option value="MONTHLY">Mensal</option>
                            <option value="ANNUAL">Anual</option>
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Data Início</label>
                        <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Data Fim</label>
                        <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Ativa</label>
                        <select
                            value={ativa}
                            onChange={(e) => setAtiva(e.target.value as "true" | "false" | "")}
                            className="border border-gray-300 rounded px-3 py-2 w-full"
                        >
                            <option value="">Todas</option>
                            <option value="true">Ativa</option>
                            <option value="false">Inativa</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end mb-6">
                    <button
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                        onClick={handleBuscar}
                    >
                        Buscar
                    </button>
                </div>

                <div className="space-y-4">
                    {totalElements > 0 && (
                        <div className="text-gray-600 mb-4 text-sm">
                            Mostrando {assinaturas.length} de {totalElements} assinaturas — Página {page + 1} de {totalPages}
                        </div>
                    )}


                    {assinaturas.map((assinatura) => (
                        <div
                            key={assinatura.id}
                            className={`p-4 rounded-lg shadow-md ${assinatura.ativa ? "bg-green-100" : "bg-red-100"}`}
                        >
                            <h2 className="text-xl font-semibold">{assinatura.aluno.nome}</h2>
                            <p className="text-gray-700">Plano: {assinatura.plano.nome}</p>
                            <p className="text-gray-700">
                                Início: {formatarDataBR(assinatura.dataInicio)} - Fim: {formatarDataBR(assinatura.dataFim)}
                            </p>
                        </div>
                    ))}
                </div>


                {totalElements > 0 && (
                    <div className="flex justify-between mt-6">
                        <button
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                            onClick={handlePrevious}
                            disabled={page === 0}
                        >
                            Anterior
                        </button>
                        <button
                            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                            onClick={handleNext}
                            disabled={page >= totalPages - 1}
                        >
                            Próximo
                        </button>
                    </div>
                )}

            </div>
        </>
    );
};

export default AssinaturasListaPage;
