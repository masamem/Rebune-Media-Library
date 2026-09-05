import { useMemo } from "react";
import { TYPE_LABEL, categoriesOf, type MediaFile } from "../data/media";

function Chip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-bold transition-all duration-200 active:scale-95 ${
        active
          ? "border-brand-500 bg-brand-500 text-white shadow-card"
          : "border-cream-300 bg-cream-50 text-ink-700 hover:border-brand-400/70 hover:text-brand-600"
      }`}
    >
      {label}
      {typeof count === "number" && (
        <span
          className={`lat rounded-full px-1.5 py-0.5 text-[10px] font-extrabold leading-none ${
            active ? "bg-white/20 text-white" : "bg-cream-200 text-ink-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/**
 * فلاتر ديناميكية: التصنيفات تأتي من البيانات نفسها (مجلدات Google Drive)،
 * والنوع يشمل القيم العامة (فيديو/صورة/PDF/أخرى) + امتدادات الفيديو (MP4/MOV…).
 */
export default function FilterChips({
  files,
  category,
  fileType,
  onCategory,
  onFileType,
}: {
  files: MediaFile[];
  category: string;
  fileType: string;
  onCategory: (c: string) => void;
  onFileType: (t: string) => void;
}) {
  const countBy = (pred: (f: MediaFile) => boolean) => files.filter(pred).length;

  const categories = useMemo(() => categoriesOf(files), [files]);

  const kinds = useMemo(
    () =>
      (["video", "image", "pdf", "other"] as const).filter((t) =>
        files.some((f) => f.fileType === t),
      ),
    [files],
  );

  /** امتدادات الفيديو الموجودة فعليًا: mp4 / mov / webm … */
  const videoExts = useMemo(() => {
    const set = new Set<string>();
    for (const f of files) {
      if (f.fileType === "video" && f.extension) set.add(f.extension.toLowerCase());
    }
    return [...set].sort();
  }, [files]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-[11px] font-extrabold text-ink-400">التصنيف</span>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip label="الكل" active={category === "all"} onClick={() => onCategory("all")} />
          {categories.map((c) => (
            <Chip
              key={c}
              label={c}
              count={countBy((f) => f.category === c)}
              active={category === c}
              onClick={() => onCategory(category === c ? "all" : c)}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-[11px] font-extrabold text-ink-400">النوع</span>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip label="الكل" active={fileType === "all"} onClick={() => onFileType("all")} />
          {kinds.map((t) => (
            <Chip
              key={t}
              label={TYPE_LABEL[t]}
              count={countBy((f) => f.fileType === t)}
              active={fileType === t}
              onClick={() => onFileType(fileType === t ? "all" : t)}
            />
          ))}
          {videoExts.map((ext) => (
            <Chip
              key={ext}
              label={ext.toUpperCase()}
              count={countBy((f) => (f.extension ?? "").toLowerCase() === ext)}
              active={fileType === ext}
              onClick={() => onFileType(fileType === ext ? "all" : ext)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
