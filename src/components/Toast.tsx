import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { CheckIcon, DownloadIcon, InfoIcon } from "./Icons";

type Kind = "success" | "info" | "download";
interface ToastItem {
  id: number;
  message: string;
  kind: Kind;
}

const ToastCtx = createContext<(message: string, kind?: Kind) => void>(() => {});

export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const push = useCallback((message: string, kind: Kind = "success") => {
    const id = ++idRef.current;
    setToasts((t) => [...t.slice(-2), { id, message, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div
        dir="rtl"
        className="pointer-events-none fixed inset-x-0 bottom-5 z-[90] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl bg-ink-950 px-4 py-3 text-cream-100 shadow-lift"
          >
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                t.kind === "download" ? "bg-brand-500 text-white" : "bg-cream-100/10 text-brand-300"
              }`}
            >
              {t.kind === "download" ? <DownloadIcon width={17} height={17} /> : t.kind === "info" ? <InfoIcon width={17} height={17} /> : <CheckIcon width={17} height={17} />}
            </span>
            <p className="text-sm font-semibold leading-6">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
