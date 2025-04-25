import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAlunos, Aluno } from "../api/alunos";


const AlunosPage = () => {

  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalAlunos, setTotalAlunos] = useState(0);
  const [qtdAtual, setQtdAtual] = useState(0);
  const [porPagina, setPorPagina] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");


  const carregarAlunos = (pagina: number) => {
    setLoading(true);
    getAlunos(pagina, porPagina)
      .then((res) => {
        setAlunos(res.content);
        setTotalPaginas(res.totalPages);
        setPaginaAtual(res.number);
        setQtdAtual(res.numberOfElements);
        setTotalAlunos(res.totalElements);
        setPorPagina(res.size);
      })
      .catch(() => setErro("Erro ao buscar os alunos."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregarAlunos(paginaAtual);
  }, []);

  const anterior = () => {
    if (paginaAtual > 0) carregarAlunos(paginaAtual - 1);
  };

  const proximo = () => {
    if (paginaAtual + 1 < totalPaginas) carregarAlunos(paginaAtual + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Alunos Cadastrados</h1>

      {loading ? (
        <p className="text-center">Carregando alunos...</p>
      ) : erro ? (
        <p className="text-center text-red-500">{erro}</p>
      ) : (
        <>
          <div className="flex justify-end">
            <button
              onClick={() => navigate("/dashboard/alunos/novo")}
              className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Cadastrar novo
            </button>
          </div>


          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="min-w-full table-auto text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="text-left px-4 py-2">Nome</th>
                  <th className="text-left px-4 py-2">Email</th>
                  <th className="text-left px-4 py-2">Telefone</th>
                  <th className="text-left px-4 py-2">Criado em</th>
                </tr>
              </thead>
              <tbody>
                {alunos.map((aluno) => (
                  <tr key={aluno.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{aluno.nome}</td>
                    <td className="px-4 py-2">{aluno.email}</td>
                    <td className="px-4 py-2">{aluno.telefone}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">
                      {new Date(aluno.dataCriacao).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2 text-sm text-gray-700">
            <span>
              Mostrando {qtdAtual} de {totalAlunos} alunos — Página {paginaAtual + 1} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <button
                onClick={anterior}
                disabled={paginaAtual === 0}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={proximo}
                disabled={paginaAtual + 1 >= totalPaginas}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AlunosPage;
