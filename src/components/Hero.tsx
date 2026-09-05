import { FEATURED, groupByProduct, type MediaFile } from "../data/media";
import { PlayIcon, SearchIcon, SunMark, XIcon } from "./Icons";

const SUGGESTIONS = ["RE-2211", "RE-3320", "عروض", "تجميل"];

export default function Hero({
  query,
  onQuery,
  files,
  loading,
}: {
  query: string;
  onQuery: (q: string) => void;
  files: MediaFile[];
  loading: boolean;
}) {
  const videos = files.filter((f) => f.fileType === "video").length;
  const images = files.filter((f) => f.fileType !== "video").length;
  const products = groupByProduct(files).length;

  return (
    <section className="relative overflow-hidden">
      {/* حلقة شمسية دوّارة في الخلفية */}
      <div className="pointer-events-none absolute -top-28 left-[-140px] hidden text-brand-500/10 lg:block" aria-hidden="true">
        <SunMark className="animate-ring-spin h-[380px] w-[380px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-500/30 to-transparent"
        aria-hidden="true"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-10 pt-8 md:px-6 md:pb-14 md:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* النص + البحث */}
        <div>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-brand-300/60 bg-brand-50 px-4 py-1.5 text-[13px] font-bold text-brand-700">
            <span className="animate-pulse-dot h-2 w-2 rounded-full bg-brand-500" />
            مكتبة الوسائط الرسمية
          </span>

          <h1 className="font-display mt-5 text-[2rem] font-extrabold leading-[1.25] text-ink-950 md:text-[2.9rem] md:leading-[1.2]">
            مكتبة <span className="lat">Rebune</span>
            <br />
            للصور و<mark className="bg-transparent text-brand-600">الفيديوهات</mark>
          </h1>

          <p className="mt-4 max-w-md text-[15px] font-medium leading-8 text-ink-700 md:text-base">
            كل ما تحتاجه من صور وتصاميم وفيديوهات منتجات <span className="lat font-bold">Rebune</span> في
            مكان واحد.
          </p>

          {/* البحث — أهم عنصر */}
          <form
            className="group relative mt-7"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="pointer-events-none absolute inset-y-0 start-5 grid place-items-center text-ink-400 transition-colors group-focus-within:text-brand-600">
              <SearchIcon width={22} height={22} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="ابحث باسم المنتج أو رقم الموديل..."
              aria-label="ابحث باسم المنتج أو رقم الموديل"
              className="h-15 w-full rounded-full border-2 border-cream-300 bg-cream-50 pe-14 ps-14 text-[15px] font-semibold text-ink-950 shadow-card placeholder:font-medium placeholder:text-ink-400 transition-all duration-300 focus:border-brand-500 focus:shadow-lift focus:outline-none md:h-16 md:text-base"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQuery("")}
                aria-label="مسح البحث"
                className="absolute inset-y-0 end-4 my-auto grid h-8 w-8 place-items-center rounded-full bg-cream-200 text-ink-700 transition hover:bg-brand-500 hover:text-white active:scale-90"
              >
                <XIcon width={16} height={16} />
              </button>
            )}
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-[13px] font-semibold text-ink-500">
            <span>جرّب:</span>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => onQuery(s)}
                className={`lat rounded-full border px-3 py-1 transition-all duration-200 active:scale-95 ${
                  query === s
                    ? "border-brand-500 bg-brand-500 text-white"
                    : "border-cream-300 bg-cream-50 text-ink-700 hover:border-brand-400 hover:text-brand-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* أرقام سريعة */}
          <dl className="mt-8 flex max-w-md items-center justify-between gap-3 border-t border-cream-300/70 pt-5">
            {[
              { n: products, l: "منتج" },
              { n: videos, l: "فيديو" },
              { n: images, l: "صورة وتصميم وملف" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <dt className="lat text-2xl font-extrabold text-ink-950 md:text-3xl">
                  {loading ? "…" : s.n}
                </dt>
                <dd className="mt-0.5 text-[11px] font-bold text-ink-500 md:text-xs">{s.l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* الكولاج — سطح المكتب فقط */}
        <div className="relative hidden h-[420px] lg:block" aria-hidden="true">
          <div className="absolute inset-y-4 start-6 end-24 overflow-hidden rounded-[1.6rem] border-4 border-cream-50 shadow-lift">
            <img
              src={FEATURED.heroMain}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[2.5s] ease-out hover:scale-110"
              loading="eager"
            />
            <span className="absolute bottom-4 start-4 inline-flex items-center gap-2 rounded-full bg-ink-950/80 px-3.5 py-1.5 text-xs font-bold text-cream-50 backdrop-blur-sm">
              <PlayIcon width={13} height={13} className="text-brand-400" />
              فيديو Derma Glow — جديد
            </span>
          </div>

          <figure
            className="animate-floaty absolute -bottom-2 start-0 w-44 rotate-[5deg] rounded-xl border-8 border-cream-50 bg-cream-50 shadow-lift"
            style={{ "--tilt": "5deg" } as React.CSSProperties}
          >
            <img src={FEATURED.heroSmall1} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
            <figcaption className="lat py-1.5 text-center text-[10px] font-bold tracking-wider text-ink-500">
              RE-3320 · PowerMix
            </figcaption>
          </figure>

          <figure
            className="animate-floaty absolute end-0 top-0 w-40 rotate-[-6deg] rounded-xl border-8 border-cream-50 bg-cream-50 shadow-lift"
            style={{ "--tilt": "-6deg", animationDelay: "1.4s" } as React.CSSProperties}
          >
            <img src={FEATURED.heroSmall2} alt="" className="aspect-[4/3] w-full rounded-md object-cover" />
            <figcaption className="lat py-1.5 text-center text-[10px] font-bold tracking-wider text-ink-500">
              RE-2730 · Tempo
            </figcaption>
          </figure>

          <span className="absolute end-10 bottom-14 grid h-14 w-14 rotate-12 place-items-center rounded-2xl bg-brand-500 text-white shadow-lift">
            <SunMark className="h-7 w-7" />
          </span>
        </div>
      </div>
    </section>
  );
}
