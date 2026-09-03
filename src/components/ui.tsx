import { useEffect, useRef, useState, type ReactNode } from "react";

/* ---------- كشف عند التمرير ---------- */

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -36px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Chip للفلاتر ---------- */

export function Chip({
  active,
  onClick,
  children,
  tone = "dark",
  ltr = false,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  tone?: "dark" | "brand";
  ltr?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      dir={ltr ? "ltr" : undefined}
      className={`h-9 shrink-0 whitespace-nowrap rounded-full px-4 text-[13px] font-bold transition-all duration-200 active:scale-95 ${
        active
          ? tone === "brand"
            ? "bg-brand-500 text-white shadow-sm shadow-brand-500/30"
            : "bg-ink-900 text-cream-50 shadow-sm"
          : "border border-cream-300 bg-white text-ink-700 hover:border-brand-400 hover:text-brand-600"
      }`}
    >
      {children}
    </button>
  );
}
