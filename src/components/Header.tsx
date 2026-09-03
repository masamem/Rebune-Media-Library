import { useEffect, useState } from "react";
import type { Section } from "../data/media";
import { SunMark } from "./Icons";

const NAV: { key: Section; label: string }[] = [
  { key: "all", label: "الرئيسية" },
  { key: "videos", label: "الفيديوهات" },
  { key: "designs", label: "التصاميم" },
  { key: "latest", label: "أحدث الملفات" },
];

export default function Header({
  section,
  inProductView,
  onNavigate,
}: {
  section: Section;
  inProductView: boolean;
  onNavigate: (s: Section) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = inProductView ? null : section;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-cream-300/80 bg-cream-100/90 shadow-[0_8px_30px_-18px_rgb(42_32_24/0.35)] backdrop-blur-md"
          : "border-transparent bg-cream-100/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:h-16 md:px-6">
        {/* الشعار — يمين (بداية الاتجاه) */}
        <button
          onClick={() => onNavigate("all")}
          className="group flex items-center gap-2.5"
          aria-label="Rebune — الرئيسية"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-500 text-cream-50 shadow-card transition-transform duration-300 group-hover:rotate-45">
            <SunMark className="h-5.5 w-5.5" />
          </span>
          <span className="leading-none">
            <span className="lat block text-lg font-extrabold tracking-[0.14em] text-ink-950">
              REBUNE
            </span>
            <span className="mt-1 block text-[10px] font-bold text-ink-500">مكتبة الوسائط</span>
          </span>
        </button>

        {/* روابط سطح المكتب */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`relative rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                active === item.key ? "text-brand-600" : "text-ink-700 hover:bg-cream-200 hover:text-ink-950"
              }`}
            >
              {item.label}
              <span
                className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-center rounded-full bg-brand-500 transition-transform duration-300 ${
                  active === item.key ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </nav>

        <span className="lat hidden text-[11px] font-bold tracking-widest text-ink-400 md:block">
          MEDIA LIBRARY
        </span>
      </div>

      {/* شريط تنقل الجوال — قابل للسحب */}
      <nav
        className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3 md:hidden"
        aria-label="التنقل الرئيسي"
      >
        {NAV.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-[13px] font-bold transition-all duration-200 ${
              active === item.key
                ? "bg-ink-950 text-cream-50 shadow-card"
                : "border border-cream-300 bg-cream-50 text-ink-700 active:scale-95"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
