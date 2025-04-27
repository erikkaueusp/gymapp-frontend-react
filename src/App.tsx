import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PlanosPage from "./pages/PlanosPage";
import AlunosPage from "./pages/AlunosPage";
import AssinaturasPage from "./pages/AssinaturasPage";
import DashboardLayout from "./layouts/DashboardLayout";
import CadastrarAlunoPage from "./pages/CadastrarAlunoPage";
import TotaisAssinaturasPage from "./pages/TotaisAssinaturasPage";
import AssinaturasListaPage from "./pages/AssinaturasListaPage";
import ProximosVencimentosPage from "./pages/ProximosVencimentosPage";
import UsuariosPage from "./pages/UsuariosPage";

const App = () => {
  return (
    <BrowserRouter basename="/gymapp-frontend-react/">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="planos" element={<PlanosPage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="alunos/novo" element={<CadastrarAlunoPage />} />
          <Route path="assinaturas" element={<AssinaturasPage />} />
          <Route path="assinaturas/novo" element={<AssinaturasPage />} />
          <Route path="assinaturas/listar" element={<AssinaturasListaPage />} />
          <Route path="assinaturas/totais" element={<TotaisAssinaturasPage />} />
          <Route path="assinaturas/vencimentos" element={<ProximosVencimentosPage />} />
          <Route path="/dashboard/usuarios" element={<UsuariosPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;