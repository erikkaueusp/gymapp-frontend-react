import { Outlet, Link, useLocation } from "react-router-dom";
import {
    Dumbbell,
    Users,
    ClipboardList,
    BarChart3,
    PlusCircle,
    List,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { useState } from "react";

const DashboardLayout = () => {
    const location = useLocation();
    const [assinaturasOpen, setAssinaturasOpen] = useState(false);

    const linkClass = (path: string) =>
        `flex items-center gap-2 hover:underline transition ${location.pathname.startsWith(path) ? "font-semibold text-blue-300" : ""
        }`;

    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
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
                        </div>
                    )}

                    <Link to="/dashboard/assinaturas/totais" className={linkClass("/dashboard/assinaturas/totais")}>
                        <BarChart3 size={18} /> Totais
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 bg-gray-100 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;