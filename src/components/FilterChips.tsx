import { CATEGORIES, TYPE_LABEL, type Category, type FileType, type MediaFile } from "../data/media";

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

export default function FilterChips({
  files,
  category,
  fileType,
  onCategory,
  onFileType,
}: {
  files: MediaFile[];
  category: Category | "all";
  fileType: FileType | "all";
  onCategory: (c: Category | "all") => void;
  onFileType: (t: FileType | "all") => void;
}) {
  const countBy = (pred: (f: MediaFile) => boolean) => files.filter(pred).length;
  const types: (FileType | "all")[] = ["all", "video", "image", "pdf"];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="w-14 shrink-0 text-[11px] font-extrabold text-ink-400">التصنيف</span>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          <Chip label="الكل" active={category === "all"} onClick={() => onCategory("all")} />
          {CATEGORIES.map((c) => (
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
          {types.map((t) => (
            <Chip
              key={t}
              label={t === "all" ? "الكل" : TYPE_LABEL[t]}
              count={t === "all" ? undefined : countBy((f) => f.fileType === t)}
              active={fileType === t}
              onClick={() => onFileType(fileType === t ? "all" : t)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
