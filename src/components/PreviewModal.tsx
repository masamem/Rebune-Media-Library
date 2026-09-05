import { useEffect, useState } from "react";
import { formatDate, type MediaFile } from "../data/media";
import { downloadMedia } from "../lib/download";
import { useToast } from "./Toast";
import { DownloadIcon, FileTextIcon, FolderIcon, XIcon } from "./Icons";
import { TypeBadge } from "./FileCard";

export default function PreviewModal({
  file,
  onClose,
  onOpenProduct,
}: {
  file: MediaFile | null;
  onClose: () => void;
  onOpenProduct: (code: string) => void;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [file, onClose]);

  if (!file) return null;

  const handleDownload = async () => {
    setBusy(true);
    toast(`جارٍ تحميل «${file.name}»`, "download");
    await downloadMedia(file);
    setBusy(false);
  };

  /* الفيديو: معاينة Drive داخل iframe (أو المشغّل المباشر إن توفر رابط mp4) */
  const isDriveEmbed = file.previewUrl.includes("/preview");
  /* التصميم: PDF يُعرض في iframe، والصور بحجم كبير */
  const isPdf = file.extension === "pdf" || file.previewUrl.includes("/preview");

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة ${file.name}`}
    >
      <div
        className="animate-pop-in relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.4rem] bg-cream-50 shadow-lift sm:rounded-[1.4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* إغلاق */}
        <button
          onClick={onClose}
          aria-label="إغلاق المعاينة"
          className="absolute end-3.5 top-3.5 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink-950/60 text-cream-50 backdrop-blur-sm transition-all hover:bg-brand-500 active:scale-90"
        >
          <XIcon width={18} height={18} />
        </button>

        {/* الوسائط */}
        <div className="shrink-0 overflow-hidden bg-ink-950">
          {file.fileType === "video" ? (
            isDriveEmbed ? (
              <iframe
                key={file.id}
                src={file.previewUrl}
                title={file.name}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              <video
                key={file.id}
                src={file.previewUrl}
                poster={file.thumbnailUrl}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full"
              />
            )
          ) : isPdf ? (
            <div className="relative">
              <iframe
                src={file.previewUrl}
                title={file.name}
                className="h-[46dvh] w-full bg-white sm:h-[52dvh]"
              />
              <span className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-md bg-ink-950/75 px-2.5 py-1 text-[11px] font-bold text-cream-100 backdrop-blur-sm">
                <FileTextIcon width={13} height={13} />
                معاينة المستند
              </span>
            </div>
          ) : (
            <div className="grid max-h-[52dvh] place-items-center overflow-auto bg-cream-200 p-3">
              <img
                src={file.previewUrl || file.thumbnailUrl}
                alt={file.name}
                className="max-h-[50dvh] w-auto max-w-full rounded-lg object-contain shadow-card"
              />
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge file={file} />
              <span className="rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.category}
              </span>
              <span className="rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.mediaSection}
              </span>
              <span className="lat rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.size}
              </span>
              <span className="text-[10px] font-bold text-ink-400">
                آخر تحديث {formatDate(file.modifiedTime)}
              </span>
            </div>
            <h3 className="font-display mt-2.5 text-lg font-extrabold leading-7 text-ink-950 md:text-xl">
              {file.name}
            </h3>
            <p className="mt-1 text-xs font-bold text-ink-500">
              المنتج: <span className="lat text-brand-600">{file.productCode}</span>
            </p>
          </div>

          <div className="mt-auto flex flex-col gap-2.5 sm:flex-row">
            <button
              onClick={handleDownload}
              disabled={busy}
              className="flex h-13 flex-1 items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-6 text-base font-extrabold text-white shadow-card transition-all hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
            >
              <DownloadIcon width={20} height={20} className={busy ? "animate-bounce" : ""} />
              {busy ? "جارٍ التحميل..." : "تحميل الملف"}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenProduct(file.productCode);
              }}
              className="flex h-13 items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-5 text-sm font-bold text-ink-700 transition-all hover:border-brand-500 hover:text-brand-600 active:scale-95"
            >
              <FolderIcon width={17} height={17} />
              كل ملفات <span className="lat">{file.productCode}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
