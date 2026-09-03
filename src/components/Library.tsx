import type { SyntheticEvent } from "react";
import {
  CATEGORIES,
  TYPE_FILTERS,
  countLabel,
  fileTypeLabel,
  isRecent,
  FALLBACK_IMG,
  type FileType,
  type MediaFile,
  type View,
} from "../data/media";
import {
  IconBoxSearch,
  IconDownload,
  IconEye,
  IconFilm,
  IconFolder,
  IconLayers,
  IconPdf,
  IconPhoto,
  IconPlay,
  IconX,
} from "./Icons";
import { Chip, Reveal } from "./ui";

/* ---------- رؤوس الأقسام ---------- */

const VIEW_META: Record<View, { title: string; sub: string }> = {
  all: { title: "كل الملفات", sub: "تصفّح جميع المواد المتاحة للمندوبين والعملاء والموزّعين" },
  videos: { title: "فيديوهات المنتجات", sub: "فيديوهات تعريفية وترويجية جاهزة للنشر على المنصات" },
  designs: { title: "الصور والتصاميم", sub: "تصاميم سوشيال ميديا وملفات هوية الشركة الرسمية" },
  latest: { title: "أحدث الملفات", sub: "آخر ما أُضيف إلى المكتبة — الأكثر طلبًا أولًا" },
};

/* ---------- بطاقة ملف ---------- */

function TypeBadge({ type }: { type: FileType }) {
  if (type === "video")
    return (
      <span className="absolute start-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-ink-900/85 px-2.5 py-1 text-[10px] font-extrabold text-cream-50 backdrop-blur-sm">
        <IconFilm className="h-3 w-3" /> فيديو
      </span>
    );
  if (type === "pdf")
    return (
      <span className="absolute start-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm">
        <IconPdf className="h-3 w-3" /> PDF
      </span>
    );
  return (
    <span className="absolute start-2.5 top-2.5 z-10 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold text-ink-700 backdrop-blur-sm">
      <IconPhoto className="h-3 w-3" /> صورة
    </span>
  );
}

interface MediaCardProps {
  file: MediaFile;
  index: number;
  onPreview: (f: MediaFile) => void;
  onDownload: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
}

export function MediaCard({ file, index, onPreview, onDownload, onOpenProduct }: MediaCardProps) {
  const handleImgError = (e: SyntheticEvent<HTMLImageElement>) => {
    const el = e.currentTarget;
    if (el.src !== FALLBACK_IMG) el.src = FALLBACK_IMG;
  };

  return (
    <Reveal delay={(index % 4) * 70} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-cream-300/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lift">
        {/* المعاينة المصغرة */}
        <button
          type="button"
          onClick={() => onPreview(file)}
          className="relative block aspect-[4/3] w-full overflow-hidden bg-cream-200"
          aria-label={`معاينة ${file.fileName}`}
        >
          <img
            src={file.thumbnail}
            alt={file.productName}
            loading="lazy"
            onError={handleImgError}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <TypeBadge type={file.fileType} />
          {isRecent(file) && (
            <span className="absolute end-2.5 top-2.5 z-10 rounded-full bg-brand-500 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-sm shadow-brand-500/40">
              جديد
            </span>
          )}
          {file.fileType === "video" && (
            <span className="absolute inset-0 z-10 flex items-center justify-center">
              <span className="relative flex h-14 w-14 items-center justify-center">
                <span className="play-ring absolute inset-0 rounded-full bg-white/50" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-md transition-transform duration-300 group-hover:scale-110">
                  <IconPlay className="h-5 w-5 -translate-x-px text-brand-600" />
                </span>
              </span>
            </span>
          )}
        </button>

        {/* البيانات */}
        <div className="flex grow flex-col gap-1.5 p-3.5">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              dir="ltr"
              onClick={() => onOpenProduct(file.productCode)}
              title={`عرض كل ملفات ${file.productCode}`}
              className="font-mono text-xs font-semibold text-brand-600 transition hover:text-brand-700 hover:underline underline-offset-4"
            >
              {file.productCode}
            </button>
            <span className="rounded-full bg-cream-200 px-2 py-0.5 text-[11px] font-bold text-ink-700">
              {file.category}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenProduct(file.productCode)}
            className="text-start"
            title={`كل ملفات ${file.productName}`}
          >
            <h3 className="text-[15px] font-extrabold leading-6 text-ink-900 decoration-brand-400 underline-offset-4 transition hover:underline">
              {file.productName}
            </h3>
          </button>

          <p className="truncate text-xs font-semibold text-ink-500" title={file.fileName}>
            {file.fileName}
            <span className="text-ink-400"> · {file.size}</span>
          </p>

          {/* الأزرار — ظاهرة دائمًا */}
          <div className="mt-auto grid grid-cols-[1.35fr_1fr] gap-2 pt-2">
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-3 text-sm font-extrabold text-white shadow-sm shadow-brand-500/25 transition-all duration-200 hover:bg-brand-600 active:scale-[0.96]"
            >
              <IconDownload className="h-4 w-4" />
              تحميل
            </button>
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="flex h-11 items-center justify-center gap-1.5 rounded-lg border border-cream-300 bg-cream-50 px-3 text-sm font-bold text-ink-700 transition-all duration-200 hover:border-brand-400 hover:text-brand-600 active:scale-[0.96]"
            >
              <IconEye className="h-4 w-4" />
              معاينة
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

/* ---------- حالة عدم وجود نتائج ---------- */

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="anim-fade flex flex-col items-center py-16 text-center">
      <IconBoxSearch className="h-28 w-28" />
      <h3 className="mt-5 text-xl font-black text-ink-900 sm:text-2xl">لم نجد ملفات بهذا الاسم</h3>
      <p className="mt-2 text-sm font-semibold text-ink-500 sm:text-base">
        جرّب البحث برقم الموديل أو اسم المنتج.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-6 flex h-11 items-center gap-2 rounded-full border border-cream-300 bg-white px-5 text-sm font-extrabold text-ink-700 transition-all duration-200 hover:border-brand-400 hover:text-brand-600 active:scale-95"
      >
        <IconX className="h-4 w-4" />
        إعادة تعيين البحث والفلاتر
      </button>
    </div>
  );
}

/* ---------- المكتبة ---------- */

interface LibraryProps {
  view: View;
  files: MediaFile[];
  query: string;
  category: string;
  ftype: "all" | FileType;
  setCategory: (c: string) => void;
  setFtype: (t: "all" | FileType) => void;
  onReset: () => void;
  onPreview: (f: MediaFile) => void;
  onDownload: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
}

export function Library({
  view,
  files,
  query,
  category,
  ftype,
  setCategory,
  setFtype,
  onReset,
  onPreview,
  onDownload,
  onOpenProduct,
}: LibraryProps) {
  const meta = VIEW_META[view];
  const hasActiveFilters = query.trim() !== "" || category !== "الكل" || ftype !== "all";

  return (
    <section id="library" className="mx-auto w-full max-w-7xl scroll-mt-28 px-4 pb-24 pt-8 sm:px-6">
      {/* رأس القسم */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p dir="ltr" className="text-start font-mono text-[10px] font-semibold tracking-[0.28em] text-brand-600">
            {view === "all" ? "ALL FILES" : view === "videos" ? "VIDEOS" : view === "designs" ? "DESIGNS" : "LATEST"}
          </p>
          <h2 className="mt-1.5 text-2xl font-black text-ink-900 sm:text-3xl">{meta.title}</h2>
          <p className="mt-1 text-[13px] font-semibold text-ink-500 sm:text-sm">{meta.sub}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="flex h-9 items-center gap-1 rounded-full px-3 text-[13px] font-extrabold text-brand-600 transition hover:bg-brand-50 active:scale-95"
            >
              <IconX className="h-3.5 w-3.5" />
              مسح الفلاتر
            </button>
          )}
          <span className="flex h-9 items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3.5 text-[13px] font-extrabold text-brand-700">
            <IconLayers className="h-4 w-4" />
            {countLabel(files.length)}
          </span>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="no-scrollbar -mx-4 mt-5 flex items-center gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6">
        <span className="shrink-0 text-[11px] font-extrabold text-ink-400">التصنيف:</span>
        {CATEGORIES.map((c) => (
          <Chip key={c} active={category === c} tone="brand" onClick={() => setCategory(c)}>
            {c}
          </Chip>
        ))}
        <span className="mx-1 h-6 w-px shrink-0 bg-cream-300" />
        <span className="shrink-0 text-[11px] font-extrabold text-ink-400">النوع:</span>
        {TYPE_FILTERS.map((t) => (
          <Chip key={t.id} active={ftype === t.id} onClick={() => setFtype(t.id)}>
            {t.label}
          </Chip>
        ))}
      </div>

      {/* الشبكة */}
      {files.length === 0 ? (
        <EmptyState onReset={onReset} />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {files.map((f, i) => (
            <MediaCard
              key={f.id}
              file={f}
              index={i}
              onPreview={onPreview}
              onDownload={onDownload}
              onOpenProduct={onOpenProduct}
            />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs font-bold text-ink-400">
          <IconFolder className="h-4 w-4 text-brand-400" />
          اضغط على رقم الموديل لعرض جميع ملفات المنتج وتحميلها دفعة واحدة
        </p>
      )}
    </section>
  );
}
