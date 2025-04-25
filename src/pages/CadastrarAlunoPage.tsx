import { useState } from "react";
import { AlunoInput, createAluno } from "../api/alunos";
import { useNavigate } from "react-router-dom";

const CadastrarAlunoPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<AlunoInput>({
    nome: "",
    email: "",
    endereco: "",
    telefone: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    try {
      await createAluno(form);
      setSucesso("Aluno cadastrado com sucesso!");
      setTimeout(() => navigate("/dashboard/alunos"), 1500); // redireciona após sucesso
    } catch (err) {
      setErro("Erro ao cadastrar aluno. Verifique os dados.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-bold mb-4 text-center">Cadastrar Aluno</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="nome"
          placeholder="Nome"
          value={form.nome}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={form.endereco}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />
        <input
          type="text"
          name="telefone"
          placeholder="Telefone"
          value={form.telefone}
          onChange={handleChange}
          className="w-full border rounded px-4 py-2"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Cadastrar
        </button>
        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm text-center">{sucesso}</p>}
      </form>
    </div>
  );
};

export default CadastrarAlunoPage;
