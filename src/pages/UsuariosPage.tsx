import { useEffect, useState } from "react";
import { listarUsuarios, excluirUsuario, criarUsuario, Usuario } from "../api/usuarios";
import { getRoleFromToken } from "../utils/auth";
import { Navigate } from "react-router-dom";

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [novoUsername, setNovoUsername] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [mensagemSucesso, setMensagemSucesso] = useState("");
    const role = getRoleFromToken();

    if (role !== "ROLE_ADMINISTRADOR") {
        return <Navigate to="/dashboard" />;
    }

    const carregarUsuarios = async () => {
        try {
            const dados = await listarUsuarios();
            setUsuarios(dados);
        } catch (error) {
            console.error("Erro ao listar usuários", error);
        }
    };

    const handleExcluir = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir este usuário?")) {
            try {
                await excluirUsuario(id);
                await carregarUsuarios();
            } catch (error) {
                console.error("Erro ao excluir usuário", error);
            }
        }
    };

    const handleCriarUsuario = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await criarUsuario(novoUsername, novaSenha);
            setMensagemSucesso("Usuário criado com sucesso!");
            setNovoUsername("");
            setNovaSenha("");
            await carregarUsuarios();
            setTimeout(() => setMensagemSucesso(""), 4000); // limpa a mensagem depois de 4 segundos
        } catch (error) {
            console.error("Erro ao criar usuário", error);
        }
    };

    useEffect(() => {
        carregarUsuarios();
    }, []);

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Usuários</h1>

            {/* Formulário de criação */}
            <form onSubmit={handleCriarUsuario} className="mb-6 bg-white p-4 shadow-md rounded-lg flex flex-col gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Nome de Usuário</label>
                    <input
                        type="text"
                        value={novoUsername}
                        onChange={(e) => setNovoUsername(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Senha</label>
                    <input
                        type="password"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="border border-gray-300 rounded px-3 py-2 w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="border border-blue-500 text-blue-500 font-semibold py-1 px-3 rounded hover:bg-blue-50 transition-colors self-start"
                >
                    Criar Usuário
                </button>

                {mensagemSucesso && (
                    <div className="text-green-600 font-semibold">{mensagemSucesso}</div>
                )}
            </form>

            {/* Tabela de usuários */}
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-2 px-4 text-left">Nome de Usuário</th>
                        <th className="py-2 px-4 text-left">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="border-b">
                            <td className="py-2 px-4">{usuario.username}</td>
                            <td className="py-2 px-4">
                                <button
                                    onClick={() => handleExcluir(usuario.id)}
                                    className="border border-red-500 text-red-500 font-semibold py-1 px-3 rounded hover:bg-red-50 transition-colors"
                                >
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                    {usuarios.length === 0 && (
                        <tr>
                            <td colSpan={2} className="text-center py-4">
                                Nenhum usuário encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsuariosPage;
