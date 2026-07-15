import { useToast } from '../../context/toast-context';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getToastStyles = (type) => {
    const baseStyles = 'flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg animate-slide-in text-white font-medium';
    
    switch (type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-yellow-500`;
      case 'info':
      default:
        return `${baseStyles} bg-blue-500`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-9999 flex max-w-sm flex-col gap-2" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`${getToastStyles(toast.type)} pointer-events-auto`}>
          <div className="shrink-0">{getIcon(toast.type)}</div>
          <div className="flex-1">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 rounded-full p-1 text-white/80 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label="Close toast"
          >
            <X size={18} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Toast;
