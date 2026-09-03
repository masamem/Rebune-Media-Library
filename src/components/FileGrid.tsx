import { useMemo, useState } from "react";
import { SECTION_LABEL, type MediaFile, type ProductGroup, type Section } from "../data/media";
import FileCard from "./FileCard";
import { CountPill, Reveal } from "./ui";
import { ForwardIcon, SearchOffIcon, XIcon } from "./Icons";

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="animate-pop-in col-span-full flex flex-col items-center gap-4 rounded-[1.35rem] border-2 border-dashed border-cream-300 bg-cream-50/60 px-6 py-16 text-center">
      <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-400">
        <SearchOffIcon width={36} height={36} strokeWidth={1.6} />
      </span>
      <div>
        <h3 className="font-display text-xl font-extrabold text-ink-950 md:text-2xl">
          لم نجد ملفات بهذا الاسم
        </h3>
        <p className="mt-2 text-sm font-semibold text-ink-500">
          جرّب البحث برقم الموديل أو اسم المنتج.
        </p>
      </div>
      <button
        onClick={onClear}
        className="mt-1 flex items-center gap-2 rounded-full bg-ink-950 px-6 py-3 text-sm font-extrabold text-cream-50 transition-all hover:bg-brand-600 active:scale-95"
      >
        <XIcon width={15} height={15} />
        مسح البحث والفلاتر
      </button>
    </div>
  );
}

export default function FileGrid({
  files,
  section,
  query,
  hasFilters,
  allProducts,
  onClearAll,
  onPreview,
  onOpenProduct,
}: {
  files: MediaFile[];
  section: Section;
  query: string;
  hasFilters: boolean;
  allProducts: ProductGroup[];
  onClearAll: () => void;
  onPreview: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
}) {
  const [productsOpen, setProductsOpen] = useState(false);
  const visibleProducts = productsOpen ? allProducts : allProducts.slice(0, 6);

  const title = query.trim()
    ? `نتائج البحث عن «${query.trim()}»`
    : SECTION_LABEL[section];

  const sorted = useMemo(() => files, [files]);

  return (
    <section id="library" className="mx-auto max-w-6xl scroll-mt-28 px-4 md:px-6">
      {/* تصفح حسب المنتج */}
      {!query.trim() && section === "all" && (
        <Reveal className="mt-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-extrabold text-ink-950 md:text-xl">
              تصفّح حسب المنتج
            </h2>
            <button
              onClick={() => setProductsOpen((v) => !v)}
              className="text-xs font-extrabold text-brand-600 transition-colors hover:text-brand-700"
            >
              {productsOpen ? "عرض أقل" : `عرض الكل (${allProducts.length})`}
            </button>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
            {visibleProducts.map((p) => (
              <button
                key={p.code}
                onClick={() => onOpenProduct(p.code)}
                className="group w-40 shrink-0 snap-start overflow-hidden rounded-xl border border-cream-300/80 bg-cream-50 text-start shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/60 hover:shadow-lift active:scale-[0.97] md:w-44"
              >
                <span className="relative block aspect-[4/3] overflow-hidden bg-cream-200">
                  <img
                    src={p.files[0].thumbnail}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="lat absolute bottom-1.5 start-1.5 rounded-md bg-ink-950/80 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-cream-50 backdrop-blur-sm">
                    {p.files.length} ملفات
                  </span>
                </span>
                <span className="block p-3">
                  <span className="lat block text-[11px] font-extrabold tracking-wider text-brand-600">
                    {p.code}
                  </span>
                  <span className="mt-0.5 block truncate text-xs font-bold text-ink-900">{p.name}</span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      )}

      {/* رأس الشبكة */}
      <Reveal className="mt-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-extrabold text-ink-950 md:text-2xl">{title}</h2>
          <CountPill n={files.length} />
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="mr-auto flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 px-3.5 py-1.5 text-xs font-extrabold text-ink-700 transition-all hover:border-brand-500 hover:text-brand-600 active:scale-95"
            >
              <XIcon width={13} height={13} />
              إعادة تعيين
            </button>
          )}
        </div>
      </Reveal>

      {/* الشبكة */}
      <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {sorted.length === 0 ? (
          <EmptyState onClear={onClearAll} />
        ) : (
          sorted.map((f, i) => (
            <Reveal key={f.id} delay={Math.min(i % 8, 7) * 55} className="h-full">
              <FileCard file={f} onPreview={onPreview} onOpenProduct={onOpenProduct} />
            </Reveal>
          ))
        )}
      </div>

      {files.length > 0 && (
        <p className="mt-8 flex items-center justify-center gap-2 pb-2 text-center text-xs font-bold text-ink-400">
          <ForwardIcon width={14} height={14} className="rotate-90" />
          اضغط على أي بطاقة لعرض جميع ملفات المنتج وتحميلها دفعة واحدة
        </p>
      )}
    </section>
  );
}
