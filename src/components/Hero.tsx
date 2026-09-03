import type { CSSProperties, FormEvent } from "react";
import {
  ALL_FILES,
  isRecent,
  uniqueProducts,
  type View,
} from "../data/media";
import {
  IconArrowForward,
  IconFilm,
  IconPhoto,
  IconSearch,
  IconSpark,
  IconX,
} from "./Icons";
import { Reveal } from "./ui";

const IMG = {
  dryer:
    "https://image.qwenlm.ai/generated-images/2d1f907b-f8a9-4b95-a18f-8528c164eb0f/_result.png",
  fryer:
    "https://image.qwenlm.ai/generated-images/cc7827de-5e53-4f03-95d9-f1f1fa895967/_result.png",
  offer:
    "https://image.qwenlm.ai/generated-images/85dcaa06-636f-4d97-a6b7-7dbc409868a1/_result.png",
};

const SUGGESTIONS = [
  { label: "RE-2211", ltr: true },
  { label: "مجفف شعر", ltr: false },
  { label: "عرض الصيف", ltr: false },
  { label: "هوية الشركة", ltr: false },
];

interface HeroProps {
  query: string;
  onQuery: (q: string) => void;
  onSearchSubmit: () => void;
  onSuggestion: (q: string) => void;
}

export function Hero({ query, onQuery, onSearchSubmit, onSuggestion }: HeroProps) {
  const totalFiles = ALL_FILES.length;
  const totalProducts = uniqueProducts(ALL_FILES).length;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    onSearchSubmit();
  };

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-10 pt-9 sm:px-6 sm:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-14 lg:pt-14">
        {/* المحتوى */}
        <Reveal>
          <p dir="ltr" className="text-start font-mono text-[11px] font-semibold tracking-[0.3em] text-brand-600 sm:text-xs">
            REBUNE · MEDIA LIBRARY
          </p>

          <h1 className="mt-3 text-start text-[32px] font-black leading-[1.25] text-ink-900 sm:text-5xl sm:leading-[1.2] lg:text-[52px]">
            مكتبة <span dir="ltr" className="font-display text-brand-600">Rebune</span>
            <br className="sm:hidden" /> للصور والفيديوهات
          </h1>

          <p className="mt-4 max-w-xl text-start text-base font-medium leading-8 text-ink-500 sm:text-lg">
            كل ما تحتاجه من صور وتصاميم وفيديوهات منتجات Rebune في مكان واحد.
          </p>

          {/* البحث — أهم عنصر */}
          <form
            onSubmit={submit}
            role="search"
            className="group/search mt-7 flex max-w-xl items-center gap-2 rounded-full border-2 border-cream-300 bg-white p-1.5 pe-1.5 ps-4 shadow-card transition-all duration-300 focus-within:border-brand-500 focus-within:shadow-lift"
          >
            <IconSearch className="h-5 w-5 shrink-0 text-ink-400 transition-colors group-focus-within/search:text-brand-500" />
            <input
              type="text"
              inputMode="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو رقم الموديل... مثال: RE-2211"
              className="h-11 min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-ink-900 outline-none placeholder:font-medium placeholder:text-ink-400"
              aria-label="ابحث باسم المنتج أو رقم الموديل"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition hover:bg-cream-200 hover:text-ink-900"
                aria-label="مسح البحث"
              >
                <IconX className="h-4 w-4" />
              </button>
            )}
            <button
              type="submit"
              className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-500 px-4 text-sm font-extrabold text-white shadow-sm shadow-brand-500/30 transition-all duration-200 hover:bg-brand-600 active:scale-95 min-[430px]:px-5"
            >
              <IconSearch className="h-4 w-4 min-[430px]:hidden" />
              <span className="hidden min-[430px]:inline">بحث</span>
            </button>
          </form>

          {/* اقتراحات سريعة */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-ink-400">جرّب:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => onSuggestion(s.label)}
                dir={s.ltr ? "ltr" : undefined}
                className={`h-8 rounded-full border border-cream-300 bg-white px-3 text-xs font-bold text-ink-700 transition-all duration-200 hover:border-brand-400 hover:text-brand-600 active:scale-95 ${
                  s.ltr ? "font-mono" : ""
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* أرقام سريعة */}
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink-900">+{totalFiles}</span>
              <span className="text-xs font-bold text-ink-500">ملف جاهز للتحميل</span>
            </div>
            <span className="hidden h-7 w-px bg-cream-300 sm:block" />
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-ink-900">{totalProducts}</span>
              <span className="text-xs font-bold text-ink-500">منتجات وموديلات</span>
            </div>
            <span className="hidden h-7 w-px bg-cream-300 sm:block" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-500" />
              </span>
              <span className="text-xs font-bold text-ink-500">يتم التحديث باستمرار</span>
            </div>
          </div>
        </Reveal>

        {/* كولاج الصور العائمة */}
        <div className="relative hidden h-[440px] select-none lg:block" aria-hidden="true">
          <svg className="absolute -top-4 start-2 h-40 w-40 text-brand-300/60" viewBox="0 0 100 100" fill="currentColor">
            {Array.from({ length: 25 }).map((_, i) => (
              <circle key={i} cx={(i % 5) * 20 + 10} cy={Math.floor(i / 5) * 20 + 10} r="2" />
            ))}
          </svg>

          <div
            className="animate-floaty absolute start-6 top-8 w-52"
            style={{ "--r": "-5deg", animationDelay: "0s" } as CSSProperties}
          >
            <figure className="overflow-hidden rounded-xl shadow-lift ring-1 ring-ink-900/5">
              <img src={IMG.dryer} alt="" className="aspect-square w-full object-cover" loading="eager" />
              <figcaption className="flex items-center justify-between bg-white px-3 py-2">
                <span className="text-[11px] font-extrabold text-ink-900">مجفف إير فلو</span>
                <span dir="ltr" className="font-mono text-[10px] font-semibold text-brand-600">MP4</span>
              </figcaption>
            </figure>
          </div>

          <div
            className="animate-floaty absolute end-2 top-40 w-56"
            style={{ "--r": "4deg", animationDelay: "-2.6s" } as CSSProperties}
          >
            <figure className="overflow-hidden rounded-xl shadow-lift ring-1 ring-ink-900/5">
              <img src={IMG.fryer} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              <figcaption className="flex items-center justify-between bg-white px-3 py-2">
                <span className="text-[11px] font-extrabold text-ink-900">قلاية كريسبي</span>
                <span dir="ltr" className="font-mono text-[10px] font-semibold text-brand-600">PNG</span>
              </figcaption>
            </figure>
          </div>

          <div
            className="animate-floaty absolute bottom-0 start-24 w-48"
            style={{ "--r": "7deg", animationDelay: "-4.8s" } as CSSProperties}
          >
            <figure className="overflow-hidden rounded-xl shadow-lift ring-1 ring-ink-900/5">
              <img src={IMG.offer} alt="" className="aspect-square w-full object-cover" loading="lazy" />
              <figcaption className="flex items-center justify-between bg-white px-3 py-2">
                <span className="text-[11px] font-extrabold text-ink-900">عرض الصيف</span>
                <span className="text-[10px] font-bold text-brand-600">بوستر</span>
              </figcaption>
            </figure>
          </div>

          <div
            className="animate-floaty absolute end-14 top-2"
            style={{ "--r": "0deg", animationDelay: "-1.4s" } as CSSProperties}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-ink-900 px-3.5 py-2 text-[11px] font-bold text-cream-50 shadow-lift">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              ملفات جديدة كل أسبوع
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- بطاقات الأقسام الثلاثة ---------- */

interface SectionCardsProps {
  onPick: (v: View) => void;
}

export function SectionCards({ onPick }: SectionCardsProps) {
  const videoCount = ALL_FILES.filter((f) => f.fileType === "video").length;
  const imageCount = ALL_FILES.filter((f) => f.fileType === "image").length;
  const newCount = ALL_FILES.filter(isRecent).length;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4 sm:px-6" aria-label="أقسام المكتبة">
      <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {/* الفيديوهات — بطاقة داكنة */}
        <Reveal delay={0}>
          <button
            type="button"
            onClick={() => onPick("videos")}
            className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-ink-900 bg-ink-900 p-5 text-start text-cream-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <IconFilm className="absolute -bottom-7 -start-7 h-36 w-36 text-cream-50 opacity-[0.06] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/40">
              <IconFilm className="h-5 w-5" />
            </span>
            <span className="mt-4 text-lg font-extrabold">فيديوهات المنتجات</span>
            <span className="mt-1 text-[13px] font-semibold text-cream-200/60">
              {videoCount} فيديو تعريفي وترويجي جاهز للنشر
            </span>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-bold text-brand-400">
              تصفّح الفيديوهات
              <IconArrowForward className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </Reveal>

        {/* الصور والتصاميم */}
        <Reveal delay={90}>
          <button
            type="button"
            onClick={() => onPick("designs")}
            className="group flex h-full w-full flex-col rounded-xl border border-cream-300 bg-white p-5 text-start shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
              <IconPhoto className="h-5 w-5" />
            </span>
            <span className="mt-4 text-lg font-extrabold text-ink-900">صور وتصاميم المنتجات</span>
            <span className="mt-1 text-[13px] font-semibold text-ink-500">
              {imageCount} صورة وتصميم بجودة عالية
            </span>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-bold text-brand-600">
              تصفّح الصور والتصاميم
              <IconArrowForward className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </Reveal>

        {/* أحدث الملفات */}
        <Reveal delay={180}>
          <button
            type="button"
            onClick={() => onPick("latest")}
            className="group relative flex h-full w-full flex-col overflow-hidden rounded-xl border border-brand-100 bg-brand-50 p-5 text-start transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className="relative flex h-11 w-11 items-center justify-center rounded-lg bg-white text-brand-600 shadow-sm">
              <IconSpark className="h-5 w-5" />
              <span className="absolute -end-1 -top-1 h-2.5 w-2.5 rounded-full bg-brand-500 ring-2 ring-brand-50" />
            </span>
            <span className="mt-4 text-lg font-extrabold text-ink-900">أحدث المواد المضافة</span>
            <span className="mt-1 text-[13px] font-semibold text-ink-500">
              {newCount} ملفًا جديدًا خلال الأسبوعين الماضيين
            </span>
            <span className="mt-4 flex items-center gap-1.5 text-sm font-bold text-brand-600">
              شاهد الجديد
              <IconArrowForward className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
