import { useEffect, useState, useRef } from "react";
import { criarAssinatura } from "../api/assinaturas";
import { getPlanos, Plano } from "../api/planos";
import { buscarAlunosPorNome, AlunoAutocomplete } from "../api/alunos";

const AssinaturasPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [planoId, setPlanoId] = useState<number | "">("");
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [buscaAluno, setBuscaAluno] = useState("");
  const [alunoId, setAlunoId] = useState<number>();
  const [sugestoes, setSugestoes] = useState<AlunoAutocomplete[]>([]);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
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
    if (buscaAluno.length >= 2) {
      buscarAlunosPorNome(buscaAluno).then(setSugestoes);
    } else {
      setSugestoes([]);
    }
  }, [buscaAluno]);

  useEffect(() => {
    if (mostrarSucesso) {
      const fadeOut = setTimeout(() => {
        setFadeSucesso(false); // inicia fade-out
      }, 1500); // começa o fade após 1.5s

      const esconder = setTimeout(() => {
        setMostrarSucesso(false); // remove do DOM após fade
        setSucesso("");
      }, 1500); // total de 1.5s

      return () => {
        clearTimeout(fadeOut);
        clearTimeout(esconder);
      };
    }
  }, [mostrarSucesso]);



  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < sugestoes.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : sugestoes.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      const aluno = sugestoes[highlightedIndex];
      setBuscaAluno(aluno.nome);
      setAlunoId(aluno.id);
      setHighlightedIndex(-1);
      setSugestoes([]);
      inputRef.current?.blur(); // 💥 força perda de foco para esconder a lista
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso("");

    if (!alunoId || !planoId) {
      setErro("Selecione um aluno e um plano.");
      return;
    }

    try {
      await criarAssinatura({ alunoId, planoId });
      setSucesso("Assinatura criada com sucesso!");
      setMostrarSucesso(true);
      setFadeSucesso(true); // garante fade-in ao exibir

      // limpa campos
      setBuscaAluno("");
      setAlunoId(undefined);
      setPlanoId("");
      setSugestoes([]);


    } catch (err) {
      setErro("Erro ao criar a assinatura.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
      <h1 className="text-xl font-bold text-center">Nova Assinatura</h1>

      <form onSubmit={handleSubmit} className="space-y-4 relative">
        <div>
          <input
            ref={inputRef}
            type="text"
            value={buscaAluno}
            onChange={(e) => {
              setBuscaAluno(e.target.value);
              setAlunoId(undefined);
              setHighlightedIndex(-1);
              setSucesso(""); // limpa mensagem
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setTimeout(() => setSugestoes([]), 100); // dá tempo do clique acontecer
            }}
            placeholder="Buscar aluno pelo nome..."
            className="w-full border rounded px-4 py-2"
          />

          {sugestoes.length > 0 && (
            <ul
              ref={suggestionsRef}
              className="absolute z-10 bg-white border w-full rounded shadow mt-1 max-h-48 overflow-y-auto"
            >
              {sugestoes.map((aluno, index) => (
                <li
                  key={aluno.id}
                  onMouseDown={() => {
                    setBuscaAluno(aluno.nome);
                    setAlunoId(aluno.id);
                    setHighlightedIndex(-1);
                    setSugestoes([]);
                    inputRef.current?.blur(); // força perda de foco = fecha sugestão
                  }}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === highlightedIndex ? "bg-gray-100 font-semibold" : ""
                    }`}
                >
                  {aluno.nome}
                </li>

              ))}
            </ul>
          )}
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
          disabled={!alunoId || !planoId}
          className={`w-full py-2 rounded transition 
    ${!alunoId || !planoId
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
      ${fadeSucesso ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
          >
            {sucesso}
          </p>
        )}


      </form>
    </div>
  );
};

export default AssinaturasPage;
