import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 3000);
    };

    const success = (message) => showToast(message, 'success');
    const error = (message) => showToast(message, 'error');
    const info = (message) => showToast(message, 'info');
    const warning = (message) => showToast(message, 'warning');

    return (
        <ToastContext.Provider value={{ success, error, info, warning }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`px-6 py-4 rounded-lg shadow-lg backdrop-blur-sm border animate-slideInRight ${toast.type === 'success' ? 'bg-green-500/90 border-green-400 text-white' :
                                toast.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' :
                                    toast.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-white' :
                                        'bg-blue-500/90 border-blue-400 text-white'
                            }`}
                    >
                        {toast.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
