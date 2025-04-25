import { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom"; // <-- Importar aqui

const LoginForm = () => {
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate(); // <-- Instanciar o navigate

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { token, tipo } = await login({ usuario, senha });
            localStorage.setItem("token", `${tipo} ${token}`);
            navigate("/dashboard"); // <-- Aqui usando navegação interna!
        } catch (err) {
            setError("Usuário ou senha inválidos.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
                Entrar
            </button>
            {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
            )}
        </form>
    );
};

export default LoginForm;