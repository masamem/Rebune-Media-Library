import { useEffect, type ReactElement } from "react";
import {
  GROUP_LABELS,
  GROUP_ORDER,
  countLabel,
  fileTypeLabel,
  formatDateAr,
  type FileGroup,
  type MediaFile,
} from "../data/media";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
  IconEye,
  IconFilm,
  IconFolder,
  IconLayers,
  IconPdf,
  IconPhoto,
  IconPlay,
  IconTag,
  IconX,
} from "./Icons";

/* ============ نافذة المعاينة ============ */

interface PreviewModalProps {
  file: MediaFile;
  files: MediaFile[];
  onClose: () => void;
  onNavigate: (f: MediaFile) => void;
  onDownload: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
}

const GROUP_ICON: Record<FileGroup, (p: { className?: string }) => ReactElement> = {
  "product-photo": IconPhoto,
  "product-video": IconFilm,
  "social-design": IconTag,
  brand: IconPdf,
};

export function PreviewModal({ file, files, onClose, onNavigate, onDownload, onOpenProduct }: PreviewModalProps) {
  const idx = files.findIndex((f) => f.id === file.id);
  const index = idx === -1 ? null : idx;
  const prev = index !== null && index > 0 ? files[index - 1] : null;
  const next = index !== null && index < files.length - 1 ? files[index + 1] : null;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && next) onNavigate(next);
      if (e.key === "ArrowRight" && prev) onNavigate(prev);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNavigate, next, prev]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={`معاينة ${file.fileName}`}>
      <div className="anim-fade absolute inset-0 bg-ink-950/75 backdrop-blur-sm" onClick={onClose} />

      <div className="anim-pop relative flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-cream-100 shadow-lift">
        {/* الوسائط */}
        <div className="relative flex items-center justify-center overflow-hidden bg-[#171009]">
          {file.fileType === "video" ? (
            <video
              key={file.id}
              src={file.previewUrl}
              poster={file.thumbnail}
              controls
              autoPlay
              playsInline
              className="max-h-[46vh] w-full sm:max-h-[56vh]"
            />
          ) : (
            <img
              key={file.id}
              src={file.previewUrl}
              alt={file.productName}
              className="max-h-[46vh] w-full object-contain sm:max-h-[56vh]"
            />
          )}

          <button
            type="button"
            onClick={onClose}
            className="absolute end-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-950/60 text-white backdrop-blur-sm transition hover:bg-brand-500 active:scale-90"
            aria-label="إغلاق المعاينة"
          >
            <IconX className="h-4 w-4" />
          </button>

          {prev && (
            <button
              type="button"
              onClick={() => onNavigate(prev)}
              className="absolute end-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white active:scale-90 sm:flex"
              aria-label="الملف السابق"
            >
              <IconChevronRight className="h-5 w-5" />
            </button>
          )}
          {next && (
            <button
              type="button"
              onClick={() => onNavigate(next)}
              className="absolute start-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white active:scale-90 sm:flex"
              aria-label="الملف التالي"
            >
              <IconChevronLeft className="h-5 w-5" />
            </button>
          )}

          {index !== null && files.length > 1 && (
            <span dir="ltr" className="absolute bottom-3 start-1/2 translate-x-1/2 rounded-full bg-ink-950/60 px-2.5 py-1 font-mono text-[11px] font-semibold text-cream-50 backdrop-blur-sm">
              {index + 1} / {files.length}
            </span>
          )}
        </div>

        {/* المعلومات */}
        <div className="flex flex-col gap-3 overflow-y-auto p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-lg font-black text-ink-900">{file.productName}</h3>
              <p className="truncate text-[13px] font-semibold text-ink-500">{file.fileName}</p>
            </div>
            <button
              type="button"
              dir="ltr"
              onClick={() => onOpenProduct(file.productCode)}
              title={`عرض كل ملفات ${file.productCode}`}
              className="font-mono shrink-0 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100 active:scale-95"
            >
              {file.productCode}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-extrabold text-ink-700">{file.category}</span>
            <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-extrabold text-ink-700">{fileTypeLabel(file.fileType)}</span>
            <span dir="ltr" className="rounded-full bg-cream-200 px-3 py-1 font-mono text-[11px] font-semibold text-ink-700">{file.size}</span>
            <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-extrabold text-ink-700">أُضيف في {formatDateAr(file.date)}</span>
          </div>

          <div className="flex flex-col gap-2 pt-1 min-[480px]:flex-row">
            <button
              type="button"
              onClick={() => onDownload(file)}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 text-[15px] font-extrabold text-white shadow-sm shadow-brand-500/30 transition-all duration-200 hover:bg-brand-600 active:scale-[0.98]"
            >
              <IconDownload className="h-5 w-5" />
              تحميل الملف · <span dir="ltr" className="font-mono text-[13px] font-semibold">{file.size}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenProduct(file.productCode)}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-4 text-sm font-bold text-ink-700 transition-all duration-200 hover:border-brand-400 hover:text-brand-600 active:scale-[0.98]"
            >
              <IconFolder className="h-4 w-4" />
              كل ملفات المنتج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ نافذة تفاصيل المنتج ============ */

interface ProductSheetProps {
  code: string;
  files: MediaFile[];
  onClose: () => void;
  onPreview: (f: MediaFile) => void;
  onDownload: (f: MediaFile) => void;
  onDownloadAll: (files: MediaFile[], label: string) => void;
}

export function ProductSheet({ code, files, onClose, onPreview, onDownload, onDownloadAll }: ProductSheetProps) {
  const name = files[0]?.productName ?? code;
  const category = files[0]?.category;
  const groups = GROUP_ORDER.map((g) => ({ g, items: files.filter((f) => f.group === g) })).filter(
    (x) => x.items.length > 0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={`ملفات المنتج ${code}`}>
      <div className="anim-fade absolute inset-0 bg-ink-950/75 backdrop-blur-sm" onClick={onClose} />

      <div className="anim-pop relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-cream-100 shadow-lift sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl">
        {/* الرأس */}
        <div className="flex items-start gap-3 border-b border-cream-300/70 bg-white p-4 sm:p-5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <IconFolder className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span dir="ltr" className="font-mono text-sm font-semibold text-brand-600">{code}</span>
              {category && (
                <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-extrabold text-ink-700">{category}</span>
              )}
            </div>
            <h3 className="mt-1 truncate text-xl font-black text-ink-900">{name}</h3>
            <p className="mt-0.5 text-xs font-bold text-ink-500">
              {countLabel(files.length)} · {groups.length} {groups.length <= 2 ? "مجموعتان" : "مجموعات"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cream-300 bg-white text-ink-500 transition hover:border-brand-400 hover:text-brand-600 active:scale-90"
            aria-label="إغلاق"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        {/* المحتوى */}
        <div className="nice-scroll flex flex-col gap-6 overflow-y-auto p-4 sm:p-5">
          {/* تحميل الكل */}
          <div>
            <button
              type="button"
              onClick={() => onDownloadAll(files, code)}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3.5 text-[15px] font-extrabold text-white shadow-sm shadow-brand-500/30 transition-all duration-200 hover:bg-brand-600 active:scale-[0.98]"
            >
              <IconDownload className="h-5 w-5" />
              تحميل جميع مواد <span dir="ltr" className="font-mono text-[13px]">{code}</span> ({files.length})
            </button>
            <p className="mt-2 text-center text-[11px] font-bold text-ink-400">
              سيتم تحميل الملفات واحدًا تلو الآخر تلقائيًا
            </p>
          </div>

          {/* المجموعات */}
          {groups.map(({ g, items }) => {
            const GIcon = GROUP_ICON[g];
            return (
              <section key={g} aria-label={GROUP_LABELS[g]}>
                <div className="mb-2.5 flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cream-300 bg-white text-brand-600">
                    <GIcon className="h-4 w-4" />
                  </span>
                  <h4 className="text-[15px] font-extrabold text-ink-900">{GROUP_LABELS[g]}</h4>
                  <span className="rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-extrabold text-ink-700">
                    {countLabel(items.length)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onDownloadAll(items, `${code} — ${GROUP_LABELS[g]}`)}
                    title={`تحميل ${GROUP_LABELS[g]}`}
                    className="ms-auto flex h-8 items-center gap-1 rounded-lg border border-cream-300 bg-white px-2.5 text-[11px] font-extrabold text-ink-700 transition hover:border-brand-400 hover:text-brand-600 active:scale-95"
                  >
                    <IconDownload className="h-3.5 w-3.5" />
                    تحميل المجموعة
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {items.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center gap-3 rounded-xl border border-cream-300/70 bg-white p-2.5 transition-all duration-200 hover:border-brand-300 hover:shadow-card"
                    >
                      <button
                        type="button"
                        onClick={() => onPreview(f)}
                        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-200"
                        aria-label={`معاينة ${f.fileName}`}
                      >
                        <img src={f.thumbnail} alt="" loading="lazy" className="h-full w-full object-cover" />
                        {f.fileType === "video" && (
                          <span className="absolute inset-0 flex items-center justify-center bg-ink-950/25">
                            <IconPlay className="h-4 w-4 text-white" />
                          </span>
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-bold text-ink-900">{f.fileName}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-ink-500">
                          <span dir="ltr" className="font-mono">{f.size}</span>
                          · {fileTypeLabel(f.fileType)} · {formatDateAr(f.date)}
                        </p>
                      </div>

                      <div className="flex shrink-0 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onPreview(f)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-cream-300 text-ink-500 transition hover:border-brand-400 hover:text-brand-600 active:scale-90"
                          aria-label={`معاينة ${f.fileName}`}
                        >
                          <IconEye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDownload(f)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 text-white shadow-sm shadow-brand-500/25 transition hover:bg-brand-600 active:scale-90"
                          aria-label={`تحميل ${f.fileName}`}
                        >
                          <IconDownload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <p className="flex items-center justify-center gap-1.5 border-t border-cream-300/70 bg-white py-2.5 text-[11px] font-bold text-ink-400">
          <IconLayers className="h-3.5 w-3.5 text-brand-400" />
          جميع المواد رسمية ومعتمدة من فريق التسويق
        </p>
      </div>
    </div>
  );
}
