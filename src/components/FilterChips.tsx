import type { ReactNode } from "react";
import { categoriesOf, type MediaFile } from "../data/media";
import { LayersIcon, PenIcon, PlayIcon } from "./Icons";

function Chip({
  label,
  icon,
  count,
  active,
  onClick,
}: {
  label: string;
  icon?: ReactNode;
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
      {icon}
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
 * صف فلترة واحد موحّد:
 * الكل · فيديوهات · تصاميم · <التصنيفات من Drive مثل تجميلي / منزلي>
 */
export default function FilterChips({
  files,
  filter,
  onFilter,
}: {
  files: MediaFile[];
  filter: string;
  onFilter: (f: string) => void;
}) {
  const countBy = (pred: (f: MediaFile) => boolean) => files.filter(pred).length;
  const categories = categoriesOf(files);

  const toggle = (value: string) => onFilter(filter === value ? "all" : value);

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 shrink-0 text-[11px] font-extrabold text-ink-400">تصفية</span>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        <Chip label="الكل" active={filter === "all"} onClick={() => onFilter("all")} />
        <Chip
          label="فيديوهات"
          icon={<PlayIcon width={13} height={13} />}
          count={countBy((f) => f.fileType === "video")}
          active={filter === "video"}
          onClick={() => toggle("video")}
        />
        <Chip
          label="تصاميم"
          icon={<PenIcon width={13} height={13} />}
          count={countBy((f) => f.fileType === "design")}
          active={filter === "design"}
          onClick={() => toggle("design")}
        />
        {categories.map((c) => (
          <Chip
            key={c}
            label={c}
            icon={<LayersIcon width={13} height={13} />}
            count={countBy((f) => f.category === c)}
            active={filter === c}
            onClick={() => toggle(c)}
          />
        ))}
      </div>
    </div>
  );
}
