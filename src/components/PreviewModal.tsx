import { useEffect, useState } from "react";
import { TYPE_LABEL, formatDate, type MediaFile } from "../data/media";
import { downloadMedia } from "../lib/download";
import { useToast } from "./Toast";
import { DownloadIcon, FileTextIcon, XIcon } from "./Icons";
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
    toast(`جارٍ تحميل «${file.fileName}»`, "download");
    await downloadMedia(file);
    setBusy(false);
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة ${file.fileName}`}
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
            file.previewUrl.includes("drive.google.com/file/d/") ? (
              /* فيديو مستضاف على Google Drive — مشغّل Drive داخل الموقع */
              <iframe
                key={file.id}
                src={file.previewUrl}
                title={file.fileName}
                allow="autoplay; fullscreen"
                allowFullScreen
                className="aspect-video w-full"
              />
            ) : (
              <video
                key={file.id}
                src={file.previewUrl}
                poster={file.thumbnail}
                controls
                autoPlay
                playsInline
                className="aspect-video w-full"
              />
            )
          ) : file.fileType === "image" ? (
            <div className="grid max-h-[52dvh] place-items-center overflow-auto bg-cream-200">
              <img
                src={file.previewUrl}
                alt={file.fileName}
                className="max-h-[52dvh] w-auto max-w-full object-contain"
              />
            </div>
          ) : (
            <div className="relative">
              <iframe
                src={file.previewUrl}
                title={file.fileName}
                className="h-[46dvh] w-full bg-white sm:h-[52dvh]"
              />
              <span className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-md bg-ink-950/75 px-2.5 py-1 text-[11px] font-bold text-cream-100 backdrop-blur-sm">
                <FileTextIcon width={13} height={13} />
                معاينة المستند
              </span>
            </div>
          )}
        </div>

        {/* التفاصيل */}
        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={file.fileType} duration={file.duration} ext={file.extension} />
              <span className="rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.category}
              </span>
              <span className="lat rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.size}
              </span>
              <span className="text-[10px] font-bold text-ink-400">أضيف في {formatDate(file.date)}</span>
            </div>
            <h3 className="font-display mt-2.5 text-lg font-extrabold leading-7 text-ink-950 md:text-xl">
              {file.fileName}
            </h3>
            <button
              onClick={() => {
                onClose();
                onOpenProduct(file.productCode);
              }}
              className="group mt-1 flex items-center gap-2 text-sm font-bold text-ink-500 transition-colors hover:text-brand-600"
            >
              <span className="lat tracking-wider text-brand-600">{file.productCode}</span>
              {file.productName}
              <span className="text-[11px] font-extrabold text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
                — عرض كل الملفات
              </span>
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleDownload}
              disabled={busy}
              className="flex h-13 flex-1 items-center justify-center gap-2.5 rounded-xl bg-brand-500 text-base font-extrabold text-white shadow-card transition-all duration-200 hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
            >
              <DownloadIcon width={20} height={20} className={busy ? "animate-bounce" : ""} />
              {busy ? "جارٍ التحميل..." : `تحميل ${TYPE_LABEL[file.fileType]} (${file.size})`}
            </button>
            <button
              onClick={onClose}
              className="h-13 rounded-xl border border-cream-300 bg-white px-7 text-base font-bold text-ink-700 transition-all hover:border-ink-400 active:scale-[0.98]"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
