import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/** IntersectionObserver-driven scroll reveal wrapper. */
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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("in");
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${className}`} style={{ "--rd": `${delay}ms` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Small count pill used next to section titles. */
export function CountPill({ n }: { n: number }) {
  return (
    <span className="lat inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-brand-500/12 px-2 text-sm font-bold text-brand-600">
      {n}
    </span>
  );
}
