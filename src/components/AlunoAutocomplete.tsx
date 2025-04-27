import { useState, useEffect } from "react";
import { buscarAlunosPorNome } from "../api/alunos";

export interface Aluno {
    id: number;
    nome: string;
}

interface AlunoAutocompleteProps {
    label?: string;
    onSelect: (aluno: Aluno | null) => void; // agora também pode mandar null ao limpar
    placeholder?: string;
    value?: Aluno | null;
}

const AlunoAutocomplete = ({ label = "Aluno", onSelect, placeholder = "Digite o nome do aluno...", value }: AlunoAutocompleteProps) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<Aluno[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);

    useEffect(() => {
        if (!inputValue) {
            setSuggestions([]);
            setSelectedAluno(null);
            onSelect(null);
            return;
        }

        // Se já tiver selecionado, não busca mais
        if (selectedAluno) {
            return;
        }

        const delayDebounce = setTimeout(() => {
            buscar();
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    useEffect(() => {
        if (value === null) {
            setInputValue("");
            setSelectedAluno(null);
            setSuggestions([]);
        }
    }, [value]);

    const buscar = async () => {
        setIsLoading(true);
        try {
            const alunos = await buscarAlunosPorNome(inputValue);
            setSuggestions(alunos);
        } catch (error) {
            console.error("Erro ao buscar alunos", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (aluno: Aluno) => {
        setSelectedAluno(aluno);
        setInputValue(aluno.nome);
        setSuggestions([]);
        onSelect(aluno);
    };

    const handleInputChange = (value: string) => {
        setInputValue(value);

        // Se o usuário limpar o campo, resetamos a seleção
        if (value === "") {
            setSelectedAluno(null);
            onSelect(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && suggestions.length > 0) {
            e.preventDefault();
            handleSelect(suggestions[0]);
        }
    };

    return (
        <div className="relative">
            {label && <label className="block mb-1 font-medium">{label}</label>}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            {isLoading && <div className="absolute right-3 top-3 animate-spin">🔄</div>}

            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((aluno) => (
                        <li
                            key={aluno.id}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleSelect(aluno)}
                        >
                            {aluno.nome}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AlunoAutocomplete;
