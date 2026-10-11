import { createContext, useCallback, useContext, useState } from "react";
import { Check, X, Info } from "lucide-react";

const ToastContext = createContext({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const TONES = {
  success: "bg-brand",
  error: "bg-[#a8281f]",
  info: "bg-[#8a5d16]",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        className="fixed inset-x-3 bottom-3 z-[90] flex flex-col gap-2 md:inset-x-auto md:right-[18px] md:bottom-[18px] print:hidden"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`animate-toast-in flex items-center gap-2.5 rounded-[10px] py-[11px] pr-3 pl-[13px] text-[13.5px] font-medium text-white shadow-[0_12px_32px_rgba(0,30,16,0.3)] md:max-w-[380px] md:min-w-[240px] ${TONES[t.type] || TONES.info}`}
          >
            <span className="grid size-6 flex-none place-items-center rounded-full bg-white/20">
              {t.type === "success" ? (
                <Check size={16} />
              ) : t.type === "error" ? (
                <X size={16} />
              ) : (
                <Info size={16} />
              )}
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              type="button"
              className="grid place-items-center text-white/85"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
