import { useMemo } from "react";
import { groupByProduct, SECTION_LABEL, type MediaFile, type ProductGroup, type Section } from "../data/media";
import FileCard from "./FileCard";
import { CountPill, Reveal } from "./ui";
import { ForwardIcon, RefreshIcon, Rotate360Icon, SearchOffIcon, XIcon } from "./Icons";


function ProductThumb({ product }: { product: ProductGroup }) {
  const visual = product.files.find((f) => f.fileType !== "3d" && !!f.thumbnail);
  const has3d = product.files.some((f) => f.fileType === "3d");

  if (visual) {
    return (
      <span className="relative block h-full w-full">
        <img
          src={visual.thumbnail}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition-transform duration-700 group-hover:scale-105"
        />
        {has3d && (
          <span className="absolute end-2 top-2 inline-flex items-center gap-1 rounded-full bg-ink-950/80 px-2 py-1 text-[10px] font-extrabold text-white backdrop-blur-sm">
            <Rotate360Icon width={13} height={13} />
            360°
          </span>
        )}
      </span>
    );
  }

  if (has3d) {
    return (
      <span className="grid h-full w-full place-items-center bg-gradient-to-br from-brand-50 via-cream-50 to-cream-200 text-brand-600">
        <span className="flex flex-col items-center gap-2">
          <span className="grid h-16 w-16 place-items-center rounded-full border border-brand-200 bg-white/85 shadow-card">
            <Rotate360Icon width={30} height={30} />
          </span>
          <span className="lat text-sm font-extrabold">360° / 3D</span>
          <span className="text-[10px] font-bold text-ink-500">عرض تفاعلي</span>
        </span>
      </span>
    );
  }

  return <span className="block h-full w-full bg-cream-200" />;
}

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
  source,
  onClearAll,
  onPreview,
  onOpenProduct,
  onRefresh,
  refreshing,
  lastRefreshed,
}: {
  files: MediaFile[];
  section: Section;
  query: string;
  hasFilters: boolean;
  allProducts: ProductGroup[];
  source: "drive" | "demo";
  onClearAll: () => void;
  onPreview: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
  onRefresh: () => void;
  refreshing: boolean;
  lastRefreshed: Date | null;
}) {

  const title = query.trim()
    ? `نتائج البحث عن «${query.trim()}»`
    : SECTION_LABEL[section];

  const sorted = useMemo(() => files, [files]);
  const productResults = useMemo(() => groupByProduct(files), [files]);
  const productMode = section === "all";

  return (
    <section id="library" className="mx-auto max-w-6xl scroll-mt-28 px-4 md:px-6">
      {/* رأس الشبكة */}
      <Reveal className="mt-10">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 className="font-display text-xl font-extrabold text-ink-950 md:text-2xl">{productMode ? (query.trim() ? `نتائج البحث عن «${query.trim()}»` : "اكتشف المنتجات") : title}</h2>
          <CountPill n={productMode ? productResults.length : files.length} />
          {source === "drive" ? (
            <div
              dir="ltr"
              className="lat inline-flex items-center gap-2 rounded-lg border border-cream-300/80 bg-ink-950 px-3 py-1.5 text-[11px] font-bold text-cream-50 shadow-card"
              title="الملفات مقروءة مباشرة من Google Drive"
            >
              <span className="text-sky-300">Live from Google Drive</span>
              <span className="text-ink-500">•</span>
              <button
                type="button"
                onClick={onRefresh}
                disabled={refreshing}
                className="inline-flex items-center gap-1.5 text-orange-400 transition-colors hover:text-orange-300 disabled:cursor-wait disabled:opacity-60"
                aria-label="Refresh media library"
                title="Refresh media library from Google Drive"
              >
                <RefreshIcon
                  width={13}
                  height={13}
                  className={refreshing ? "animate-spin" : ""}
                />
                {refreshing ? "Refreshing…" : "Refresh"}
              </button>
              {lastRefreshed && (
                <span className="text-ink-400">
                  {lastRefreshed.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </div>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[10px] font-extrabold text-amber-700"
              title="بيانات تجريبية محلية"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              نسخة تجريبية
            </span>
          )}
          {hasFilters && (
            <button
              onClick={onClearAll}
              className="ms-auto flex items-center gap-1.5 rounded-full border border-cream-300 bg-cream-50 px-3.5 py-1.5 text-xs font-extrabold text-ink-700 transition-all hover:border-brand-500 hover:text-brand-600 active:scale-95"
            >
              <XIcon width={13} height={13} />
              إعادة تعيين
            </button>
          )}
        </div>
      </Reveal>

      {/* الشبكة */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {sorted.length === 0 ? (
          <EmptyState onClear={onClearAll} />
        ) : productMode ? (
          productResults.map(product => (
            <article key={product.code} className="overflow-hidden rounded-2xl border border-cream-300 bg-cream-50 shadow-card">
              <button className="block w-full text-start" onClick={() => onOpenProduct(product.code)} aria-label={`اكتشف ${product.name}`}>
                <span className="block aspect-square bg-white"><ProductThumb product={product} /></span>
                <span className="block px-5 pt-5">
                  <span className="lat block text-sm font-bold text-brand-600">{product.code}</span>
                  <span className="mt-2 block text-lg font-extrabold text-ink-950">{product.name}</span>
                  <span className="mt-2 block text-sm text-ink-500">{product.category}</span>
                </span>
              </button>
              <div className="p-5"><button onClick={() => onOpenProduct(product.code)} className="min-h-12 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-extrabold text-white hover:bg-brand-600">اكتشف المنتج</button></div>
            </article>
          ))
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
          اختر منتجًا لعرض تفاصيله والملفات المتاحة
        </p>
      )}
    </section>
  );
}
