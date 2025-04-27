import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    sub: string;
    role: string;
    exp: number;
    iat: number;
}

export function getRoleFromToken(): string | null {
    const token = localStorage.getItem("token");
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        return decoded.role;
    } catch (error) {
        console.error("Erro ao decodificar token:", error);
        return null;
    }
}

export function logout() {
    localStorage.removeItem("token");
}

