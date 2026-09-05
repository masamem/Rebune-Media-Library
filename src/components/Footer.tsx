import { ArrowUpIcon, SunMark } from "./Icons";

export default function Footer() {
  return (
    <footer className="relative mt-16 overflow-hidden bg-ink-950 text-cream-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-brand-700 via-brand-500 to-brand-300" aria-hidden="true" />
      <div className="pointer-events-none absolute -left-24 -top-24 text-cream-100/5" aria-hidden="true">
        <SunMark className="h-72 w-72" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-cream-50">
                <SunMark className="h-6 w-6" />
              </span>
              <span className="lat text-2xl font-extrabold tracking-[0.18em] text-cream-50 md:text-3xl">
                REBUNE
              </span>
            </div>
            <p className="lat mt-3 text-sm font-semibold tracking-wide text-cream-300">
              International Trading Company
            </p>
          </div>

          <div className="text-start md:text-end">
            <p className="font-display text-sm font-bold text-cream-100">
              مكتبة الفيديوهات والتصاميم الرسمية — ابحث، عاين، وحمّل
            </p>
            <p className="mt-2 max-w-sm text-[13px] font-medium leading-6 text-cream-300/80">
              جميع المواد المعروضة معتمدة من فريق التسويق، وروابط التحميل جاهزة للربط مع Google Drive.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-cream-100/10 pt-6 text-[13px] font-semibold text-cream-300/70 md:flex-row md:items-center">
          <p>
            جميع الحقوق محفوظة. <span className="lat">© {new Date().getFullYear()} Rebune</span>
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex items-center gap-2 rounded-full border border-cream-100/15 px-4 py-2 text-cream-100 transition-all hover:border-brand-500 hover:bg-brand-500 hover:text-white active:scale-95"
          >
            العودة إلى الأعلى
            <ArrowUpIcon width={15} height={15} className="transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
