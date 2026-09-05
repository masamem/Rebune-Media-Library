import { useState } from "react";
import {
  formatDate,
  groupByProduct,
  type MediaFile,
  type ProductGroup,
} from "../data/media";
import { downloadAll, downloadMedia } from "../lib/download";
import { useToast } from "./Toast";
import { CountPill, Reveal } from "./ui";
import { TypeBadge } from "./FileCard";
import {
  BackIcon,
  DownloadIcon,
  EyeIcon,
  FolderIcon,
  LayersIcon,
  PenIcon,
  VideoIcon,
} from "./Icons";

interface GroupDef {
  key: string;
  label: string;
  icon: React.ReactNode;
  match: (f: MediaFile) => boolean;
}

const GROUPS: GroupDef[] = [
  {
    key: "videos",
    label: "فيديوهات المنتج",
    icon: <VideoIcon width={18} height={18} />,
    match: (f) => f.fileType === "video",
  },
  {
    key: "designs",
    label: "تصاميم المنتج",
    icon: <PenIcon width={18} height={18} />,
    match: (f) => f.fileType === "design",
  },
];

function FileRow({
  file,
  onPreview,
}: {
  file: MediaFile;
  onPreview: (f: MediaFile) => void;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  return (
    <li className="group flex items-center gap-3 rounded-xl border border-cream-300/70 bg-cream-50 p-2.5 shadow-card transition-all duration-200 hover:border-brand-400/50 hover:shadow-lift md:gap-4 md:p-3">
      <button
        onClick={() => onPreview(file)}
        className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-cream-200 md:h-[4.5rem] md:w-32"
        aria-label={`معاينة ${file.name}`}
      >
        <img
          src={file.thumbnailUrl}
          alt={file.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 grid place-items-center bg-ink-950/0 transition-colors group-hover:bg-ink-950/25">
          <span className="grid h-8 w-8 scale-75 place-items-center rounded-full bg-ink-950/70 text-cream-50 opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
            <EyeIcon width={15} height={15} />
          </span>
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <TypeBadge file={file} />
          <span className="lat text-[10px] font-bold text-ink-400">{file.size}</span>
        </div>
        <h4 className="mt-1 truncate text-[13px] font-extrabold text-ink-950 md:text-sm">{file.name}</h4>
        <p className="mt-0.5 text-[10px] font-bold text-ink-400">
          آخر تحديث {formatDate(file.modifiedTime)}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row sm:gap-2">
        <button
          onClick={async () => {
            setBusy(true);
            toast(`جارٍ تحميل «${file.name}»`, "download");
            await downloadMedia(file);
            setBusy(false);
          }}
          disabled={busy}
          className="flex h-10 items-center justify-center gap-1.5 rounded-lg bg-brand-500 px-4 text-[13px] font-extrabold text-white transition-all hover:bg-brand-600 active:scale-95 disabled:opacity-60"
        >
          <DownloadIcon width={15} height={15} className={busy ? "animate-bounce" : ""} />
          تحميل
        </button>
        <button
          onClick={() => onPreview(file)}
          className="flex h-10 items-center justify-center rounded-lg border border-cream-300 bg-white px-3.5 text-[13px] font-bold text-ink-700 transition-all hover:border-brand-500 hover:text-brand-600 active:scale-95"
        >
          معاينة
        </button>
      </div>
    </li>
  );
}

export default function ProductView({
  group,
  files,
  onBack,
  onPreview,
  onOpenProduct,
}: {
  group: ProductGroup;
  files: MediaFile[];
  onBack: () => void;
  onPreview: (f: MediaFile) => void;
  onOpenProduct: (code: string) => void;
}) {
  const toast = useToast();
  const [downloadingAll, setDownloadingAll] = useState(false);
  const others = groupByProduct(files).filter((g) => g.code !== group.code);

  const handleDownloadAll = async () => {
    setDownloadingAll(true);
    toast(`بدء تحميل جميع مواد ${group.code} (${group.files.length} ملفات)`, "download");
    await downloadAll(group.files, (done, total) => {
      if (done === total) toast(`اكتمل تحميل ${total} ملفات بنجاح`, "success");
    });
    setDownloadingAll(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 md:px-6">
      {/* عودة */}
      <button
        onClick={onBack}
        className="mt-5 flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-4 py-2 text-[13px] font-extrabold text-ink-700 shadow-card transition-all hover:border-brand-500 hover:text-brand-600 active:scale-95"
      >
        <BackIcon width={16} height={16} />
        العودة إلى المكتبة
      </button>

      {/* رأس المنتج */}
      <Reveal className="mt-6">
        <div className="relative overflow-hidden rounded-[1.4rem] border border-cream-300/70 bg-cream-50 shadow-card">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-brand-500/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-20 left-24 h-44 w-44 rounded-full bg-brand-500/5" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
            <img
              src={group.files[0].thumbnailUrl}
              alt={group.code}
              className="h-36 w-full rounded-[1rem] border-4 border-white object-cover shadow-card md:h-32 md:w-44"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-[11px] font-extrabold text-brand-700">
                  <LayersIcon width={13} height={13} />
                  صفحة المنتج
                </span>
                <span className="rounded-full bg-cream-200 px-3 py-1 text-[11px] font-extrabold text-ink-700">
                  {group.category}
                </span>
              </div>
              <h1 className="lat mt-3 text-4xl font-extrabold tracking-wide text-ink-950 md:text-5xl">
                {group.code}
              </h1>
              <p className="mt-2 text-[13px] font-bold text-ink-500">
                <span className="lat">{group.files.length}</span> ملفًا جاهزًا — فيديوهات وتصاميم جاهزة
                للنشر والتحميل
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={handleDownloadAll}
                disabled={downloadingAll}
                className="flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-ink-950 px-7 text-base font-extrabold text-cream-50 shadow-lift transition-all duration-200 hover:bg-brand-600 active:scale-[0.97] disabled:opacity-70 md:w-auto"
              >
                <DownloadIcon width={20} height={20} className={downloadingAll ? "animate-bounce" : ""} />
                {downloadingAll ? "جارٍ التحميل..." : `تحميل الكل (${group.files.length})`}
              </button>
              <p className="mt-2 text-center text-[11px] font-bold text-ink-400">
                سيتم تحميل جميع مواد <span className="lat">{group.code}</span> تباعًا
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* المجموعات: فيديوهات + تصاميم */}
      {GROUPS.map((g, gi) => {
        const items = group.files.filter(g.match);
        if (items.length === 0) return null;
        return (
          <Reveal key={g.key} delay={gi * 70} className="mt-9">
            <div className="mb-3.5 flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-100 text-brand-600">
                {g.icon}
              </span>
              <h2 className="font-display text-lg font-extrabold text-ink-950 md:text-xl">{g.label}</h2>
              <CountPill n={items.length} />
              <span className="text-[11px] font-bold text-ink-400">
                {items.length === 1 ? "ملف واحد" : "ملفات"}
              </span>
            </div>
            <ul className="grid gap-2.5 md:gap-3">
              {items.map((f) => (
                <FileRow key={f.id} file={f} onPreview={onPreview} />
              ))}
            </ul>
          </Reveal>
        );
      })}

      {/* منتجات أخرى */}
      {others.length > 0 && (
        <Reveal className="mt-12">
          <div className="mb-3 flex items-center gap-2">
            <FolderIcon width={18} height={18} className="text-brand-500" />
            <h2 className="font-display text-lg font-extrabold text-ink-950">منتجات أخرى</h2>
          </div>
          <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:px-0">
            {others.map((p) => (
              <button
                key={p.code}
                onClick={() => onOpenProduct(p.code)}
                className="group flex w-56 shrink-0 snap-start items-center gap-3 rounded-xl border border-cream-300/80 bg-cream-50 p-3 text-start shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-400/60 hover:shadow-lift active:scale-[0.97]"
              >
                <img
                  src={p.files[0].thumbnailUrl}
                  alt={p.code}
                  loading="lazy"
                  className="h-14 w-16 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="lat block text-xs font-extrabold tracking-wider text-brand-600">{p.code}</span>
                  <span className="block truncate text-xs font-bold text-ink-900">{p.category}</span>
                  <span className="mt-0.5 block text-[10px] font-bold text-ink-400">
                    <span className="lat">{p.files.length}</span> ملفات · فيديو وتصاميم
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
