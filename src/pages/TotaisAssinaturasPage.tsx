// TotaisAssinaturasPage.tsx
import { useState } from "react";
import { getTotaisAssinaturas, TotaisResponse } from "../api/assinaturas";
import { formatarDataBR } from "../utils/formatDate";
import { formatarDinheiroBR } from "../utils/formatMoney";
import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../utils/auth";



const TotaisAssinaturasPage = () => {
    const [mesInicio, setMesInicio] = useState("01");
    const [anoInicio, setAnoInicio] = useState("2025");
    const [mesFim, setMesFim] = useState("01");
    const [anoFim, setAnoFim] = useState("2025");
    const [resultado, setResultado] = useState<TotaisResponse | null>(null);
    const [erro, setErro] = useState("");
    const role = getRoleFromToken();

    if (role !== "ROLE_ADMINISTRADOR") {
        return <Navigate to="/dashboard" />;
    }


    const getUltimoDiaMes = (ano: number, mes: number) => {
        return new Date(ano, mes, 0).getDate();
    };

    const buscarTotais = async () => {
        setErro("");
        setResultado(null);

        try {
            const inicio = `${anoInicio}-${mesInicio}-01`;
            const ultimoDia = getUltimoDiaMes(Number(anoFim), Number(mesFim));
            const fim = `${anoFim}-${mesFim}-${ultimoDia}`;

            const res = await getTotaisAssinaturas(inicio, fim);
            setResultado(res);
        } catch (err) {
            setErro("Erro ao buscar totais. Verifique as datas e tente novamente.");
        }
    };

    const meses = [
        { label: "Janeiro", value: "01" },
        { label: "Fevereiro", value: "02" },
        { label: "Março", value: "03" },
        { label: "Abril", value: "04" },
        { label: "Maio", value: "05" },
        { label: "Junho", value: "06" },
        { label: "Julho", value: "07" },
        { label: "Agosto", value: "08" },
        { label: "Setembro", value: "09" },
        { label: "Outubro", value: "10" },
        { label: "Novembro", value: "11" },
        { label: "Dezembro", value: "12" },
    ];

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">
            <h1 className="text-xl font-bold text-center">Totais por Período</h1>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Mês Início</label>
                    <select
                        value={mesInicio}
                        onChange={(e) => setMesInicio(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    >
                        {meses.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Ano Início</label>
                    <input
                        type="number"
                        value={anoInicio}
                        onChange={(e) => setAnoInicio(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Mês Fim</label>
                    <select
                        value={mesFim}
                        onChange={(e) => setMesFim(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    >
                        {meses.map((m) => (
                            <option key={m.value} value={m.value}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Ano Fim</label>
                    <input
                        type="number"
                        value={anoFim}
                        onChange={(e) => setAnoFim(e.target.value)}
                        className="w-full border rounded px-2 py-1"
                    />
                </div>
            </div>

            <button
                onClick={buscarTotais}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
                Buscar Totais
            </button>

            {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

            {resultado && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">
                        Totais ({formatarDataBR(resultado.inicio)} a {formatarDataBR(resultado.fim)})
                    </h2>
                    <ul className="text-sm">
                        <li>Diário (DAILY): {formatarDinheiroBR(resultado.totais.DAILY)}</li>
                        <li>Mensal (MONTHLY): {formatarDinheiroBR(resultado.totais.MONTHLY)}</li>
                        <li>Anual (ANNUAL): {formatarDinheiroBR(resultado.totais.ANNUAL)}</li>
                    </ul>
                    <p className="font-semibold text-right">
                        Total Geral: {formatarDinheiroBR(resultado.totalGeral)}
                    </p>
                </div>
            )}

        </div>
    );
};

export default TotaisAssinaturasPage;