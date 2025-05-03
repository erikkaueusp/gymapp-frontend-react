import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Dumbbell,
    Users,
    UserCog,
    ClipboardList,
    BarChart3,
    PlusCircle,
    List,
    ChevronDown,
    ChevronRight,
    ShieldCheck
} from "lucide-react";
import { useState } from "react";
import { getRoleFromToken, logout } from "../utils/auth";


const DashboardLayout = () => {
    const location = useLocation();
    const [assinaturasOpen, setAssinaturasOpen] = useState(false);
    const role = getRoleFromToken();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };


    const linkClass = (path: string) =>
        `flex items-center gap-2 hover:underline transition ${location.pathname.startsWith(path) ? "font-semibold text-blue-300" : ""
        }`;

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold">GymApp</h2>
                    <nav className="flex flex-col space-y-2">
                        <Link to="/dashboard/planos" className={linkClass("/dashboard/planos")}>
                            <Dumbbell size={18} /> Planos
                        </Link>

                        <Link to="/dashboard/alunos" className={linkClass("/dashboard/alunos")}>
                            <Users size={18} /> Alunos
                        </Link>

                        {/* Assinaturas com menu colapsável */}
                        <button
                            onClick={() => setAssinaturasOpen(!assinaturasOpen)}
                            className="flex items-center justify-between w-full text-left hover:underline transition"
                        >
                            <div className="flex items-center gap-2">
                                <ClipboardList size={18} /> Assinaturas
                            </div>
                            {assinaturasOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>

                        {assinaturasOpen && (
                            <div className="ml-6 flex flex-col space-y-1">
                                <Link to="/dashboard/assinaturas/novo" className={linkClass("/dashboard/assinaturas/novo")}>
                                    <PlusCircle size={16} /> Nova Assinatura
                                </Link>
                                <Link to="/dashboard/assinaturas/listar" className={linkClass("/dashboard/assinaturas/listar")}>
                                    <List size={16} /> Listar Assinaturas
                                </Link>
                                <Link to="/dashboard/assinaturas/vencimentos" className={linkClass("/dashboard/assinaturas/vencimentos")}>
                                    <List size={16} /> Vencimentos
                                </Link>
                            </div>
                        )}


                        {role === "ROLE_ADMINISTRADOR" && (
                            <>
                                <Link to="/dashboard/assinaturas/totais" className={linkClass("/dashboard/assinaturas/totais")}>
                                    <BarChart3 size={18} /> Totais
                                </Link>

                                <Link to="/dashboard/usuarios" className={linkClass("/dashboard/usuarios")}>
                                    <UserCog size={18} /> Usuários
                                </Link>
                            </>
                        )}
                        <Link to="/dashboard/controle" className={linkClass("/dashboard/controle")}>
                            <ShieldCheck size={16} /> Controle
                        </Link>
                    </nav>
                </div>

                {/* Rodapé: botão de logout */}
                <div className="mt-4">
                    <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        Sair
                    </button>
                </div>
            </aside>

            <main className="flex-1 bg-gray-100 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;