import { useEffect, useMemo, useState } from "react";
import { formatDate, type MediaFile } from "../data/media";
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
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    setZoom(1);
  }, [file?.id]);

  useEffect(() => {
    if (!file) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();

      if (e.key === "+" || e.key === "=") {
        setZoom((z) => Math.min(4, z + 0.5));
      }

      if (e.key === "-") {
        setZoom((z) => Math.max(1, z - 0.5));
      }

      if (e.key === "0") {
        setZoom(1);
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [file, onClose]);

  const extension = useMemo(
    () => file?.extension?.toLowerCase().replace(".", "") ?? "",
    [file?.extension],
  );

  if (!file) return null;

  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "webp",
    "gif",
    "svg",
    "avif",
  ];

  const isImage =
    file.fileType === "image" ||
    (file.fileType === "design" && imageExtensions.includes(extension));

  const isPdf = extension === "pdf";

  const typeLabel =
    file.fileType === "video"
      ? "فيديو"
      : file.fileType === "design"
        ? "تصميم"
        : file.fileType === "image"
          ? "صورة"
          : isPdf
            ? "PDF"
            : "ملف";

  const displayName =
    file.fileName ||
    file.productCode ||
    "ملف ريبون";

  const zoomIn = () => {
    setZoom((z) => Math.min(4, Number((z + 0.5).toFixed(1))));
  };

  const zoomOut = () => {
    setZoom((z) => Math.max(1, Number((z - 0.5).toFixed(1))));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const handleDownload = async () => {
    try {
      setBusy(true);

      toast(`جارٍ تحميل «${displayName}»`, "download");

      await downloadMedia(file);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="animate-fade-in fixed inset-0 z-[80] flex items-end justify-center bg-ink-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`معاينة ${displayName}`}
    >
      <div
        className="animate-pop-in relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-[1.4rem] bg-cream-50 shadow-lift sm:max-h-[92dvh] sm:rounded-[1.4rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="إغلاق المعاينة"
          className="absolute end-3.5 top-3.5 z-30 grid h-11 w-11 place-items-center rounded-full bg-ink-950/65 text-cream-50 backdrop-blur-sm transition-all hover:bg-brand-500 active:scale-90"
        >
          <XIcon width={19} height={19} />
        </button>

        <div className="relative shrink-0 overflow-hidden bg-ink-950">
          {file.fileType === "video" ? (
            file.previewUrl.includes("drive.google.com/file/d/") ? (
              <iframe
                key={file.id}
                src={file.previewUrl}
                title={displayName}
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
                className="aspect-video w-full bg-black object-contain"
              />
            )
          ) : isImage ? (
            <div className="relative bg-cream-200">
              <div className="absolute bottom-3 end-3 z-20 flex items-center gap-1 rounded-full bg-ink-950/75 p-1.5 text-white shadow-card backdrop-blur-md">
                <button
                  type="button"
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  aria-label="تصغير"
                  className="grid h-9 w-9 place-items-center rounded-full text-xl font-bold transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  −
                </button>

                <button
                  type="button"
                  onClick={resetZoom}
                  aria-label="إعادة حجم الصورة"
                  className="lat min-w-[52px] rounded-full px-2 py-1 text-xs font-extrabold transition hover:bg-white/15"
                >
                  {Math.round(zoom * 100)}%
                </button>

                <button
                  type="button"
                  onClick={zoomIn}
                  disabled={zoom >= 4}
                  aria-label="تكبير"
                  className="grid h-9 w-9 place-items-center rounded-full text-xl font-bold transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-35"
                >
                  +
                </button>
              </div>

              <div className="max-h-[58dvh] min-h-[42dvh] overflow-auto overscroll-contain sm:max-h-[56dvh]">
                <div
                  className="flex min-h-[42dvh] min-w-full items-center justify-center"
                  style={{
                    width: `${zoom * 100}%`,
                    minWidth: `${zoom * 100}%`,
                  }}
                >
                  <img
                    key={file.id}
                    src={file.previewUrl}
                    alt={displayName}
                    draggable={false}
                    className="block h-auto max-h-none w-full select-none object-contain"
                  />
                </div>
              </div>

              <span className="pointer-events-none absolute bottom-3 start-3 z-10 hidden rounded-full bg-ink-950/70 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-sm sm:inline-flex">
                استخدم + للتكبير
              </span>
            </div>
          ) : (
            <div className="relative">
              <iframe
                src={file.previewUrl}
                title={displayName}
                className="h-[52dvh] w-full bg-white sm:h-[56dvh]"
              />

              <span className="pointer-events-none absolute bottom-3 start-3 inline-flex items-center gap-1.5 rounded-md bg-ink-950/75 px-2.5 py-1 text-[11px] font-bold text-cream-100 backdrop-blur-sm">
                <FileTextIcon width={13} height={13} />
                معاينة المستند
              </span>
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5 md:p-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge
                type={file.fileType}
                duration={file.duration}
                ext={file.extension}
              />

              <span className="rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.category}
              </span>

              <span className="lat rounded-md bg-cream-200 px-2 py-1 text-[10px] font-extrabold text-ink-700">
                {file.size}
              </span>

              <span className="text-[10px] font-bold text-ink-400">
                أضيف في {formatDate(file.date)}
              </span>
            </div>

            <h3 className="font-display mt-2.5 break-words text-lg font-extrabold leading-7 text-ink-950 md:text-xl">
              {displayName}
            </h3>

            {file.productCode && (
              <button
                onClick={() => {
                  onClose();
                  onOpenProduct(file.productCode);
                }}
                className="group mt-1 flex items-center gap-2 text-sm font-bold text-ink-500 transition-colors hover:text-brand-600"
              >
                <span className="lat tracking-wider text-brand-600">
                  {file.productCode}
                </span>

                {file.productName && (
                  <span>{file.productName}</span>
                )}

                <span className="text-[11px] font-extrabold text-brand-500 opacity-0 transition-opacity group-hover:opacity-100">
                  — عرض كل الملفات
                </span>
              </button>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2 sm:flex-row">
            <button
              onClick={handleDownload}
              disabled={busy}
              className="flex h-13 flex-1 items-center justify-center gap-2.5 rounded-xl bg-brand-500 text-base font-extrabold text-white shadow-card transition-all duration-200 hover:bg-brand-600 active:scale-[0.98] disabled:opacity-60"
            >
              <DownloadIcon
                width={20}
                height={20}
                className={busy ? "animate-bounce" : ""}
              />

              {busy
                ? "جارٍ التحميل..."
                : `تحميل ${typeLabel} (${file.size})`}
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
