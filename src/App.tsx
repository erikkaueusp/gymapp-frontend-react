import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PlanosPage from "./pages/PlanosPage";
import AlunosPage from "./pages/AlunosPage";
import AssinaturasPage from "./pages/AssinaturasPage";
import DashboardLayout from "./layouts/DashboardLayout";
import CadastrarAlunoPage from "./pages/CadastrarAlunoPage";
import TotaisAssinaturasPage from "./pages/TotaisAssinaturasPage";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="planos" element={<PlanosPage />} />
          <Route path="alunos" element={<AlunosPage />} />
          <Route path="alunos/novo" element={<CadastrarAlunoPage />} />
          <Route path="assinaturas" element={<AssinaturasPage />} />
          <Route path="assinaturas/totais" element={<TotaisAssinaturasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
