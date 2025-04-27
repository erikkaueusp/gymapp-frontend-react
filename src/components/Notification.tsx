import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Se quiser, pode trocar por um simples "×"

interface NotificationProps {
    message: string;
    onClose: () => void;
    duration?: number; // tempo opcional, padrão 3 segundos
}

const Notification = ({ message, onClose, duration = 3000 }: NotificationProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer); // limpa o timer se desmontar antes
    }, [duration, onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-lg flex justify-between items-center min-w-[300px]"
            >
                <span>{message}</span>
                <button onClick={onClose} className="text-yellow-700 hover:text-yellow-900 ml-4">
                    <X size={20} />
                </button>
            </motion.div>
        </AnimatePresence>
    );
};

export default Notification;