import { FEATURED, type MediaFile, type Section } from "../data/media";
import { ForwardIcon, ImageIcon, PlayIcon, SparkIcon } from "./Icons";
import { Reveal } from "./ui";

export default function SectionCards({
  section,
  onSelect,
  files,
  loading,
}: {
  section: Section;
  onSelect: (s: Section) => void;
  files: MediaFile[];
  loading: boolean;
}) {
  const videos = files.filter((f) => f.fileType === "video").length;
  const images = files.filter((f) => f.fileType === "image").length;
  const num = (n: number) => (loading ? "…" : n);

  const cardBase =
    "group relative h-full w-full overflow-hidden rounded-[1.35rem] border p-6 text-start transition-all duration-300 hover:-translate-y-1.5 active:scale-[0.985] md:p-7";

  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6" aria-label="أقسام المكتبة">
      <Reveal>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="font-display text-xl font-extrabold text-ink-950 md:text-2xl">
            تصفّح حسب القسم
          </h2>
          <span className="text-xs font-bold text-ink-400">اضغط للفلترة الفورية</span>
        </div>
      </Reveal>

      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {/* الفيديوهات — بطاقة داكنة بصورة خلفية */}
        <Reveal delay={0} className="h-full">
          <button
            onClick={() => onSelect("videos")}
            className={`${cardBase} min-h-44 border-transparent bg-ink-950 text-cream-50 shadow-lift ${
              section === "videos" ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-cream-100" : ""
            }`}
          >
            <img
              src={FEATURED.videosCard}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/20" aria-hidden="true" />
            <span className="relative flex flex-col items-start gap-8">
              <span className="grid h-13 w-13 place-items-center rounded-xl bg-brand-500 text-white shadow-card transition-transform duration-300 group-hover:scale-110">
                <PlayIcon width={24} height={24} />
              </span>
              <span>
                <span className="font-display block text-lg font-extrabold md:text-xl">فيديوهات المنتجات</span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-cream-300">
                  <span className="lat">{num(videos)}</span> فيديوهات
                  <ForwardIcon width={14} height={14} className="text-brand-400 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>

        {/* الصور والتصاميم */}
        <Reveal delay={90} className="h-full">
          <button
            onClick={() => onSelect("gallery")}
            className={`${cardBase} min-h-44 border-cream-300 bg-cream-50 text-ink-950 shadow-card hover:border-brand-400/60 hover:shadow-lift ${
              section === "gallery" ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-cream-100" : ""
            }`}
          >
            <span className="pointer-events-none absolute -bottom-8 -left-8 text-brand-500/10 transition-transform duration-500 group-hover:rotate-12" aria-hidden="true">
              <ImageIcon width={130} height={130} strokeWidth={1.2} />
            </span>
            <span className="relative flex flex-col items-start gap-8">
              <span className="grid h-13 w-13 place-items-center rounded-xl bg-brand-100 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                <ImageIcon width={24} height={24} />
              </span>
              <span>
                <span className="font-display block text-lg font-extrabold md:text-xl">صور وتصاميم المنتجات</span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-ink-500">
                  <span className="lat">{num(images)}</span> صورة وتصميم
                  <ForwardIcon width={14} height={14} className="text-brand-500 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>

        {/* أحدث الملفات */}
        <Reveal delay={180} className="h-full">
          <button
            onClick={() => onSelect("latest")}
            className={`${cardBase} min-h-44 border-brand-500/25 bg-brand-50 text-ink-950 shadow-card hover:border-brand-500/50 hover:shadow-lift ${
              section === "latest" ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-cream-100" : ""
            }`}
          >
            <span className="pointer-events-none absolute -bottom-8 -left-8 text-brand-500/15 transition-transform duration-500 group-hover:-rotate-12" aria-hidden="true">
              <SparkIcon width={130} height={130} strokeWidth={1.2} />
            </span>
            <span className="relative flex flex-col items-start gap-8">
              <span className="grid h-13 w-13 place-items-center rounded-xl bg-brand-500 text-white shadow-card transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                <SparkIcon width={24} height={24} />
              </span>
              <span>
                <span className="font-display block text-lg font-extrabold md:text-xl">أحدث المواد المضافة</span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-brand-700">
                  آخر 8 ملفات
                  <ForwardIcon width={14} height={14} className="text-brand-500 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
