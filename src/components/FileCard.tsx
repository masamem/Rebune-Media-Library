import { useState } from "react";
import { TYPE_LABEL, formatDate, type MediaFile } from "../data/media";
import { downloadMedia } from "../lib/download";
import { useToast } from "./Toast";
import { DownloadIcon, EyeIcon, FileTextIcon, FolderIcon, PlayIcon } from "./Icons";

export function TypeBadge({
  type,
  duration,
  ext,
}: {
  type: MediaFile["fileType"];
  duration?: string;
  ext?: string;
}) {
  return (
    <span
      className={`lat inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-extrabold tracking-wide ${
        type === "video"
          ? "bg-ink-950/85 text-cream-50 backdrop-blur-sm"
          : type === "pdf"
            ? "bg-brand-500 text-white"
            : "bg-cream-50/90 text-ink-800 backdrop-blur-sm"
      }`}
    >
      {type === "video" ? <PlayIcon width={11} height={11} /> : type === "pdf" ? <FileTextIcon width={11} height={11} /> : null}
      {TYPE_LABEL[type]}
      {ext ? <span className={type === "video" ? "text-cream-300" : "text-ink-500"}>· {ext.toUpperCase()}</span> : null}
      {duration ? <span className="text-cream-300">· {duration}</span> : null}
    </span>
  );
}

export default function FileCard({
  file,
  onPreview,
  onOpenProduct,
  compact = false,
}: {
  file: MediaFile;
  onPreview: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
  compact?: boolean;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    toast(`جارٍ تحميل «${file.fileName}»`, "download");
    await downloadMedia(file);
    setBusy(false);
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPreview(file);
  };

  return (
    <article
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.15rem] border border-cream-300/80 bg-cream-50 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/50 hover:shadow-lift"
      onClick={() => onOpenProduct(file.productCode)}
      aria-label={`${file.fileName} — فتح صفحة المنتج ${file.productCode}`}
    >
      {/* المعاينة المصغرة */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-200">
        <img
          src={file.thumbnail}
          alt={file.fileName}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        {file.fileType === "video" && (
          <>
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-ink-950/70 text-cream-50 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-500">
                <PlayIcon width={22} height={22} className="translate-x-[1px]" />
              </span>
            </span>
            <span className="lat absolute bottom-2 end-2 rounded-md bg-ink-950/80 px-2 py-0.5 text-[10px] font-bold text-cream-50 backdrop-blur-sm">
              {file.duration}
            </span>
          </>
        )}
        <span className="absolute start-2 top-2">
          <TypeBadge type={file.fileType} ext={file.extension} />
        </span>
        <span className="absolute end-2 top-2 rounded-md bg-cream-50/90 px-2 py-1 text-[10px] font-extrabold text-ink-700 backdrop-blur-sm">
          {file.category}
        </span>
      </div>

      {/* البيانات */}
      <div className="flex flex-1 flex-col gap-1 p-3.5 md:p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="lat text-xs font-extrabold tracking-wider text-brand-600">{file.productCode}</span>
          <span className="lat text-[10px] font-bold text-ink-400">{file.size}</span>
        </div>
        <h3 className="truncate text-[13.5px] font-extrabold leading-6 text-ink-950 md:text-sm">
          {file.productName}
        </h3>
        <p className="truncate text-xs font-semibold text-ink-500">{file.fileName}</p>

        {!compact && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenProduct(file.productCode);
            }}
            className="mt-0.5 flex w-fit items-center gap-1 text-[11px] font-bold text-ink-400 transition-colors hover:text-brand-600"
          >
            <FolderIcon width={13} height={13} />
            كل ملفات المنتج
          </button>
        )}

        {/* الأزرار — ظاهرة دائمًا */}
        <div className="mt-auto flex gap-2 pt-3">
          <button
            onClick={handleDownload}
            disabled={busy}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-brand-500 text-sm font-extrabold text-white shadow-card transition-all duration-200 hover:bg-brand-600 active:scale-[0.97] disabled:opacity-60"
          >
            <DownloadIcon width={17} height={17} className={busy ? "animate-bounce" : ""} />
            {busy ? "جارٍ التحميل" : "تحميل"}
          </button>
          <button
            onClick={handlePreview}
            aria-label={`معاينة ${file.fileName}`}
            className="flex h-11 w-11 shrink-0 items-center justify-center gap-1.5 rounded-xl border border-cream-300 bg-white text-ink-700 transition-all duration-200 hover:border-brand-500 hover:text-brand-600 active:scale-95 md:w-auto md:px-4"
          >
            <EyeIcon width={17} height={17} />
            <span className="hidden text-sm font-bold md:inline">معاينة</span>
          </button>
        </div>
      </div>

      <span className="sr-only">أضيف في {formatDate(file.date)}</span>
    </article>
  );
}
