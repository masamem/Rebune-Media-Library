import { InfoIcon, RefreshIcon, SparkIcon } from "./Icons";

/** بطاقة Skeleton تحاكي بطاقة الملف أثناء الجلب من Google Drive */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[1.15rem] border border-cream-300/80 bg-cream-50 shadow-card">
      <div className="aspect-[4/3] animate-pulse bg-cream-200" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-20 animate-pulse rounded-full bg-cream-200" />
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-cream-200" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-cream-200" />
        <div className="flex gap-2 pt-2">
          <div className="h-11 flex-1 animate-pulse rounded-xl bg-cream-200" />
          <div className="h-11 w-16 animate-pulse rounded-xl bg-cream-200" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div aria-busy="true" aria-label="جارٍ تحميل المكتبة">
      <div className="mb-5 flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
        </span>
        <p className="text-sm font-bold text-ink-700">جارٍ تحميل مكتبة الوسائط من Google Drive…</p>
      </div>
      <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}

/** صفوف Chips هيكلية أثناء التحميل */
export function SkeletonChips() {
  return (
    <div className="space-y-3" aria-hidden="true">
      {[5, 4].map((n, row) => (
        <div key={row} className="flex items-center gap-3">
          <span className="h-3 w-14 shrink-0 animate-pulse rounded-full bg-cream-200" />
          <div className="flex gap-2">
            {Array.from({ length: n }, (_, i) => (
              <span
                key={i}
                className="h-9 w-20 animate-pulse rounded-full bg-cream-200"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** رسالة فشل الاتصال بـ Google Drive */
export function LibraryError({ onRetry, onDemo }: { onRetry: () => void; onDemo: () => void }) {
  return (
    <div className="animate-pop-in mx-auto max-w-md rounded-[1.15rem] border border-cream-300/80 bg-cream-50 px-6 py-10 text-center shadow-card">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
        <InfoIcon width={26} height={26} />
      </span>
      <h3 className="font-display mt-4 text-lg font-extrabold text-ink-950">
        تعذر تحميل مكتبة الوسائط، حاول مرة أخرى.
      </h3>
      <p className="mt-2 text-sm font-semibold leading-7 text-ink-500">
        تحقق من اتصالك بالإنترنت ثم أعد المحاولة، أو تصفح النسخة التجريبية من المكتبة.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:justify-center">
        <button
          onClick={onRetry}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-500 px-6 text-sm font-extrabold text-white shadow-card transition-all hover:bg-brand-600 active:scale-[0.97]"
        >
          <RefreshIcon width={18} height={18} />
          إعادة المحاولة
        </button>
        <button
          onClick={onDemo}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cream-300 bg-white px-6 text-sm font-bold text-ink-700 transition-all hover:border-brand-400 hover:text-brand-600 active:scale-[0.97]"
        >
          <SparkIcon width={17} height={17} />
          تصفح النسخة التجريبية
        </button>
      </div>
    </div>
  );
}
