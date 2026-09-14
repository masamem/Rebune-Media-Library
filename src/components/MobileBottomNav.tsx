import type { Section } from "../data/media";
import { FolderIcon, PlayIcon, Rotate360Icon, SearchIcon, SparkIcon } from "./Icons";

export default function MobileBottomNav({
  section,
  inProductView,
  onNavigate,
}: {
  section: Section;
  inProductView: boolean;
  onNavigate: (s: Section) => void;
}) {
  const goSearch = () => {
    window.setTimeout(() => {
      const input = document.getElementById("library-search") as HTMLInputElement | null;
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(() => input?.focus(), 350);
    }, 20);
  };

  const items = [
    { key: "all" as Section, label: "الرئيسية", icon: <FolderIcon width={20} height={20} />, action: () => onNavigate("all") },
    { key: "search", label: "البحث", icon: <SearchIcon width={20} height={20} />, action: goSearch },
    { key: "latest" as Section, label: "الجديد", icon: <SparkIcon width={20} height={20} />, action: () => onNavigate("latest") },
    { key: "videos" as Section, label: "فيديو", icon: <PlayIcon width={20} height={20} />, action: () => onNavigate("videos") },
    { key: "products3d" as Section, label: "3D", icon: <Rotate360Icon width={20} height={20} />, action: () => onNavigate("products3d") },
  ];

  return (
    <nav
      className="mobile-bottom-nav fixed inset-x-3 bottom-3 z-[70] grid grid-cols-5 rounded-[1.25rem] border border-cream-300/80 bg-cream-50/95 p-1.5 shadow-lift backdrop-blur-xl md:hidden"
      aria-label="تنقل الجوال"
    >
      {items.map((item) => {
        const active = !inProductView && item.key !== "search" && section === item.key;
        return (
          <button
            key={String(item.key)}
            type="button"
            onClick={item.action}
            className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-extrabold transition-all active:scale-95 ${
              active ? "bg-brand-50 text-brand-600" : "text-ink-500"
            }`}
          >
            <span className={active ? "text-brand-600" : "text-ink-500"}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
