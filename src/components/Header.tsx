import { NAV_ITEMS, type View } from "../data/media";
import { LogoMark } from "./Icons";

interface HeaderProps {
  view: View;
  onNavigate: (v: View) => void;
}

export function Header({ view, onNavigate }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-cream-300/80 bg-cream-100/85 backdrop-blur-md">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {/* الصف الرئيسي */}
        <div className="flex h-14 items-center justify-between gap-3 sm:h-16">
          <button
            type="button"
            onClick={() => onNavigate("all")}
            className="group flex items-center gap-2.5"
            aria-label="Rebune — الرئيسية"
          >
            <LogoMark className="h-9 w-9 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
            <span className="flex flex-col items-start leading-none">
              <span dir="ltr" className="font-display text-[17px] font-bold tracking-[0.16em] text-ink-900">
                REBUNE
              </span>
              <span className="mt-1 text-[10px] font-bold text-ink-400">مكتبة الوسائط</span>
            </span>
          </button>

          <span className="hidden items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[11px] font-extrabold text-brand-700 md:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            مكتبة الوسائط الرسمية
          </span>

          <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`h-9 rounded-full px-3.5 text-sm font-bold transition-all duration-200 active:scale-95 ${
                  view === item.id
                    ? "bg-ink-900 text-cream-50 shadow-sm"
                    : "text-ink-700 hover:bg-cream-200 hover:text-ink-900"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* تنقّل الجوال */}
        <nav
          className="no-scrollbar -mb-px flex gap-1.5 overflow-x-auto pb-2.5 md:hidden"
          aria-label="التنقل الرئيسي"
        >
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`h-8 shrink-0 rounded-full px-3.5 text-[13px] font-bold transition-all duration-200 active:scale-95 ${
                view === item.id
                  ? "bg-ink-900 text-cream-50 shadow-sm"
                  : "border border-cream-300 bg-white text-ink-700"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <footer className="mt-auto bg-ink-950 text-cream-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3">
            <LogoMark tone="light" className="h-10 w-10" />
            <span className="flex flex-col items-start leading-none">
              <span dir="ltr" className="font-display text-lg font-bold tracking-[0.18em] text-cream-50">
                REBUNE
              </span>
              <span dir="ltr" className="font-display mt-1.5 text-[11px] font-medium tracking-wide text-cream-200/60">
                International Trading Company
              </span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="روابط سفلية">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className="text-[13px] font-bold text-cream-200/70 transition-colors hover:text-brand-400"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-cream-50/10 pt-5 text-[12px] font-semibold text-cream-200/50 sm:flex-row">
          <p>© 2026 Rebune — جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-500" />
            بيانات تجريبية · جاهزة للربط مع Google Drive
          </p>
        </div>
      </div>
    </footer>
  );
}
