import { useEffect, useState } from "react";
import type { Section } from "../data/media";

const NAV: { key: Section; label: string }[] = [
  { key: "all", label: "الرئيسية" },
  { key: "videos", label: "الفيديوهات" },
  { key: "designs", label: "التصاميم" },
  { key: "products3d", label: "منتجات 3D" },
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

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

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
      <div className="mx-auto flex h-13 max-w-6xl items-center justify-between gap-4 px-4 md:h-16 md:px-6">

        {/* الشعار — يمين (بداية الاتجاه) */}
        <button
          onClick={() => onNavigate("all")}
          className="group flex items-center gap-2.5"
          aria-label="Rebune — الرئيسية"
        >
          {/* شعار Rebune الجديد */}
          <span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg shadow-card transition-transform duration-300 group-hover:rotate-6 md:h-9 md:w-9 md:rounded-xl">
            <img
              src="/media/RebuneIcon.svg"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>

          {/* اسم Rebune */}
          <span className="leading-none">
            <span className="lat block text-base font-extrabold tracking-[0.12em] text-ink-950 md:text-lg md:tracking-[0.14em]">
              REBUNE
            </span>

            <span className="mt-0.5 block text-[9px] font-bold text-ink-500 md:mt-1 md:text-[10px]">
              مكتبة الوسائط
            </span>
          </span>
        </button>

        {/* روابط سطح المكتب */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="التنقل الرئيسي"
        >
          {NAV.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`relative rounded-lg px-4 py-2 text-sm font-bold transition-colors duration-200 ${
                active === item.key
                  ? "text-brand-600"
                  : "text-ink-700 hover:bg-cream-200 hover:text-ink-950"
              }`}
            >
              {item.label}

              <span
                className={`absolute inset-x-4 -bottom-0.5 h-0.5 origin-center rounded-full bg-brand-500 transition-transform duration-300 ${
                  active === item.key
                    ? "scale-x-100"
                    : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </nav>

        {/* Media Library */}
        <span className="lat hidden text-[11px] font-bold tracking-widest text-ink-400 md:block">
          MEDIA LIBRARY
        </span>
      </div>

      {/* في الجوال نعتمد شريط التنقل السفلي لسهولة الاستخدام بالإبهام */}
    </header>
  );
}
