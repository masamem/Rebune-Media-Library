import { FEATURED, type MediaFile, type Section } from "../data/media";
import { ForwardIcon, PenIcon, PlayIcon, SparkIcon } from "./Icons";
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
  const designs = files.filter((f) => f.fileType === "design").length;
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
              className="absolute inset-0 h-full w-full object-cover opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40"
              loading="lazy"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
            <span className="relative flex h-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500 text-white shadow-card transition-transform duration-300 group-hover:scale-110">
                <PlayIcon width={22} height={22} className="translate-x-[1px]" />
              </span>
              <span className="mt-auto pt-6">
                <span className="font-display block text-lg font-extrabold md:text-xl">
                  فيديوهات المنتجات
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-cream-300">
                  <span className="lat">{num(videos)}</span> فيديو جاهز
                  <ForwardIcon width={13} height={13} className="opacity-70 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>

        {/* التصاميم */}
        <Reveal delay={90} className="h-full">
          <button
            onClick={() => onSelect("designs")}
            className={`${cardBase} min-h-44 border-cream-300/80 bg-cream-50 text-ink-950 shadow-card hover:border-brand-400/50 ${
              section === "designs" ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-cream-100" : ""
            }`}
          >
            <img
              src={FEATURED.designsCard}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-[0.16] transition-all duration-700 group-hover:scale-105 group-hover:opacity-25"
              loading="lazy"
            />
            <span className="relative flex h-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-brand-600 transition-transform duration-300 group-hover:scale-110">
                <PenIcon width={22} height={22} />
              </span>
              <span className="mt-auto pt-6">
                <span className="font-display block text-lg font-extrabold md:text-xl">
                  تصاميم المنتجات
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-ink-500">
                  <span className="lat">{num(designs)}</span> تصميم للسوشيال والطباعة
                  <ForwardIcon width={13} height={13} className="text-brand-500 opacity-70 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>

        {/* أحدث الملفات */}
        <Reveal delay={180} className="h-full">
          <button
            onClick={() => onSelect("latest")}
            className={`${cardBase} min-h-44 border-transparent bg-brand-500 text-white shadow-lift hover:bg-brand-600 ${
              section === "latest" ? "ring-2 ring-ink-950 ring-offset-2 ring-offset-cream-100" : ""
            }`}
          >
            <span className="pointer-events-none absolute -end-8 -top-8 h-32 w-32 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125" />
            <span className="relative flex h-full flex-col">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 text-white transition-transform duration-300 group-hover:scale-110">
                <SparkIcon width={22} height={22} />
              </span>
              <span className="mt-auto pt-6">
                <span className="font-display block text-lg font-extrabold md:text-xl">
                  أحدث المواد المضافة
                </span>
                <span className="mt-1 flex items-center gap-2 text-xs font-bold text-white/80">
                  آخر ما رفعناه على المكتبة
                  <ForwardIcon width={13} height={13} className="opacity-70 transition-transform duration-300 group-hover:-translate-x-1" />
                </span>
              </span>
            </span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
