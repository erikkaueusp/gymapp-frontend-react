import { useEffect, useState } from "react";
import { getPlanos, Plano } from "../api/planos";

const PlanosPage = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    getPlanos()
      .then(setPlanos)
      .catch(() => setErro("Erro ao buscar os planos."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Carregando planos...</p>;
  }

  if (erro) {
    return <p className="text-center text-red-500">{erro}</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Planos Disponíveis</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planos.map((plano) => (
          <div
            key={plano.id}
            className="border border-gray-300 rounded-lg p-4 bg-white shadow hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-blue-700">{plano.nome}</h2>
            <p className="text-sm text-gray-600">
              Periodicidade: <strong>{plano.periodicidade}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Preço: <strong>R$ {plano.preco.toFixed(2)}</strong>
            </p>
            <p className="text-xs text-gray-400">
              Criado em: {new Date(plano.dataCriacao).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanosPage;
