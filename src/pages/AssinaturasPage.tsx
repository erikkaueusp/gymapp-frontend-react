import { useEffect, useState } from "react";
import { criarAssinatura } from "../api/assinaturas";
import { getPlanos, Plano } from "../api/planos";
import AlunoAutocomplete, { Aluno } from "../components/AlunoAutocomplete";

const AssinaturasPage = () => {
  const [planoId, setPlanoId] = useState<number | "">("");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [fadeSucesso, setFadeSucesso] = useState(true);

  useEffect(() => {
    getPlanos().then(setPlanos).catch(() => {
      setErro("Erro ao carregar planos.");
    });
  }, []);

  useEffect(() => {
    if (mostrarSucesso) {
      const fadeOut = setTimeout(() => {
        setFadeSucesso(false);
      }, 1500);

      const esconder = setTimeout(() => {
        setMostrarSucesso(false);
        setSucesso("");
      }, 1500);

      return () => {
        clearTimeout(fadeOut);
        clearTimeout(esconder);
      };
    }
  }, [mostrarSucesso]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!alunoSelecionado || !planoId) {
      setErro("Selecione um aluno e um plano.");
      return;
    }

    try {
      await criarAssinatura({ alunoId: alunoSelecionado.id, planoId });
      setSucesso("Assinatura criada com sucesso!");
      setMostrarSucesso(true);
      setFadeSucesso(true);

      // limpa campos
      setAlunoSelecionado(null);
      setPlanoId("");
    } catch (err) {
      setErro("Erro ao criar a assinatura.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-xl font-bold text-center">Nova Assinatura</h1>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <AlunoAutocomplete
            onSelect={(aluno) => {
              setAlunoSelecionado(aluno);
              setSucesso(""); // limpa mensagem de sucesso ao mudar aluno
            }}
          />
        </div>

        <select
          value={planoId ?? ""}
          onChange={(e) => {
            setPlanoId(Number(e.target.value));
            setSucesso("");
          }}
          className="w-full border rounded px-4 py-2"
          required
        >
          <option value="">Selecione um plano</option>
          {planos.map((plano) => (
            <option key={plano.id} value={plano.id}>
              {plano.nome} — R$ {plano.preco.toFixed(2)} / {plano.periodicidade}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!alunoSelecionado || !planoId}
          className={`w-full py-2 rounded transition
            ${!alunoSelecionado || !planoId
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"}
          `}
        >
          Criar Assinatura
        </button>

        {erro && <p className="text-red-500 text-sm text-center">{erro}</p>}
        {mostrarSucesso && (
          <p
            className={`text-green-600 text-sm text-center transition-all duration-500 ease-in-out
              ${fadeSucesso ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
            `}
          >
            {sucesso}
          </p>
        )}
      </form>
    </div>
  );
};

export default AssinaturasPage;