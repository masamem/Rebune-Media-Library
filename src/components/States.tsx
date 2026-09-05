import { RefreshIcon, SunMark } from "./Icons";

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[1.15rem] border border-cream-300/60 bg-cream-50">
      <div className="aspect-[4/3] bg-cream-200" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-1/3 rounded-full bg-cream-200" />
        <div className="h-4 w-4/5 rounded-full bg-cream-200" />
        <div className="h-3 w-1/2 rounded-full bg-cream-200" />
        <div className="flex gap-2 pt-2">
          <div className="h-11 flex-1 rounded-xl bg-cream-200" />
          <div className="h-11 w-14 rounded-xl bg-cream-200" />
        </div>
      </div>
    </div>
  );
}

/** هيكل تحميل شبكة الملفات */
export function SkeletonGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 md:px-6" aria-busy="true" aria-label="جارٍ تحميل المكتبة">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-7 w-44 animate-pulse rounded-full bg-cream-200" />
        <div className="h-7 w-10 animate-pulse rounded-full bg-cream-200" />
      </div>
      <div className="grid grid-cols-1 gap-4 min-[430px]:grid-cols-2 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <p className="mt-8 text-center text-sm font-bold text-ink-400">جارٍ جلب الملفات من Google Drive…</p>
    </section>
  );
}

/** هيكل تحميل صفوف الفلاتر */
export function SkeletonChips() {
  return (
    <div className="space-y-3" aria-hidden="true">
      <div className="flex gap-2">
        {[64, 84, 80, 76, 72].map((w, i) => (
          <div key={i} className="h-9 animate-pulse rounded-full bg-cream-200" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

/** فشل الاتصال بـ Google Drive */
export function LibraryError({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mx-auto flex max-w-6xl items-center justify-center px-4 py-16 md:py-24">
      <div className="animate-pop-in w-full max-w-lg rounded-[1.4rem] border border-cream-300/70 bg-cream-50 p-8 text-center shadow-card md:p-10">
        <span className="relative mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-brand-500">
          <SunMark className="h-10 w-10" />
          <span className="absolute -bottom-1 -end-1 grid h-8 w-8 place-items-center rounded-full bg-ink-950 text-cream-50">
            <RefreshIcon width={15} height={15} />
          </span>
        </span>
        <h2 className="font-display mt-5 text-xl font-extrabold text-ink-950 md:text-2xl">
          تعذر تحميل مكتبة الوسائط
        </h2>
        <p className="mt-2 text-sm font-semibold leading-7 text-ink-500">
          حدث خطأ أثناء الاتصال بـ Google Drive. تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.
        </p>
        <button
          onClick={onRetry}
          className="mt-6 inline-flex h-12 items-center gap-2.5 rounded-full bg-brand-500 px-7 text-[15px] font-extrabold text-white shadow-card transition-all hover:bg-brand-600 active:scale-95"
        >
          <RefreshIcon width={17} height={17} />
          إعادة المحاولة
        </button>
      </div>
    </section>
  );
}
