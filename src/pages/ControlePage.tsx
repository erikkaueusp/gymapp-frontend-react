import { useState } from "react";
import {
    ativarScan,
    desativarScan,
    liberarAcesso
} from "../api/biometria";
import Notification from "../components/Notification";

const ControlePage = () => {
    const [mensagem, setMensagem] = useState<string | null>(null);
    const [bloqueado, setBloqueado] = useState(false);

    const handleAcao = async (acao: () => Promise<string>) => {
        if (bloqueado) return;

        try {
            setBloqueado(true);
            const resposta = await acao();
            setMensagem(resposta);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao executar ação.");
        } finally {
            setTimeout(() => setBloqueado(false), 4000); // 4 segundos de cooldown
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <h1 className="text-2xl font-bold mb-4">Controle de Biometria</h1>

            <div className="flex flex-col gap-3 w-full max-w-sm">
                <button
                    disabled={bloqueado}
                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    onClick={() => handleAcao(ativarScan)}
                >
                    Ativar Modo Scan
                </button>

                <button
                    disabled={bloqueado}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    onClick={() => handleAcao(desativarScan)}
                >
                    Desativar Modo Scan
                </button>

                <button
                    disabled={bloqueado}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                    onClick={() => handleAcao(liberarAcesso)}
                >
                    Liberar Acesso
                </button>
            </div>

            {mensagem && <Notification message={mensagem} onClose={() => setMensagem(null)} />}
        </div>
    );
};

export default ControlePage;
