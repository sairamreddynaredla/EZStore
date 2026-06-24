import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TbCheck, TbX } from 'react-icons/tb';

const ToastContext = createContext(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return ctx.toast;
}

export function useOptionalToast() {
    return useContext(ToastContext)?.toast ?? null;
}

const MAX_VISIBLE = 3;
const SUCCESS_DURATION = 3000;
const ERROR_DURATION = 5000;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const push = useCallback(
        (type, message) => {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

            setToasts((prev) => {
                const next = [...prev, { id, type, message }];
                return next.length > MAX_VISIBLE
                    ? next.slice(next.length - MAX_VISIBLE)
                    : next;
            });

            const duration =
                type === 'success' ? SUCCESS_DURATION : ERROR_DURATION;

            setTimeout(() => dismiss(id), duration);
        },
        [dismiss],
    );

    const toast = useMemo(
        () => ({
            success: (message) => push('success', message),
            error: (message) => push('error', message),
        }),
        [push],
    );

    const value = useMemo(() => ({ toast }), [toast]);

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="fixed right-6 top-6 z-50 flex flex-col gap-2.5">
                <AnimatePresence mode="popLayout">
                    {toasts.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: -16, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -16, scale: 0.96 }}
                            transition={{
                                duration: 0.2,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            className={`flex w-80 items-center gap-3 rounded-2xl border border-gray-200 p-4 shadow-xl backdrop-blur-sm ${
                                item.type === 'success'
                                    ? 'bg-emerald-50'
                                    : 'bg-rose-50'
                            }`}
                        >
                            {item.type === 'success' ? (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500 shadow-sm">
                                    <TbCheck className="h-4 w-4 text-white" />
                                </span>
                            ) : (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-500 shadow-sm">
                                    <TbX className="h-4 w-4 text-white" />
                                </span>
                            )}

                            <p className="flex-1 text-[13px] font-semibold text-gray-900">
                                {item.message}
                            </p>

                            <button
                                type="button"
                                aria-label="Dismiss notification"
                                onClick={() => dismiss(item.id)}
                                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white transition-colors hover:bg-slate-800"
                            >
                                <TbX className="h-3.5 w-3.5" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}
