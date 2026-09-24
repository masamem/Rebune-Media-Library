import { withLocalProducts } from "./data/localProducts";
import { getProductPage, normalizeProductCode } from "./data/productPages";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MEDIA_FILES,
  filterFiles,
  groupByProduct,
  type MediaFile,
  type Section,
} from "./data/media";
import { fetchDriveMedia, toMediaFile } from "./lib/drive";
import Header from "./components/Header";
import SectionCards from "./components/SectionCards";
import FilterChips from "./components/FilterChips";
import FileGrid from "./components/FileGrid";
import PreviewModal from "./components/PreviewModal";
import ProductView from "./components/ProductView";
import Footer from "./components/Footer";
import MobileBottomNav from "./components/MobileBottomNav";
import { SkeletonChips, SkeletonGrid, LibraryError } from "./components/States";
import { ToastProvider } from "./components/Toast";
import { Reveal } from "./components/ui";

type Status = "loading" | "ready" | "error";
type Source = "drive" | "demo";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [fileType, setFileType] = useState<string>("all");
  const [section, setSection] = useState<Section>("all");
  const [productCode, setProductCode] = useState<string | null>(() => new URLSearchParams(window.location.hash.slice(1)).get("product"));
  const [preview, setPreview] = useState<MediaFile | null>(null);

  /* ---- جلب الملفات من /api/media (Google Drive) مع fallback تجريبي ---- */
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [source, setSource] = useState<Source>("drive");
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const load = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    else setStatus("loading");

    try {
      const items = await fetchDriveMedia();
      setFiles(withLocalProducts(items.map(toMediaFile)));
      setSource("drive");
      setLastRefreshed(new Date());
      setStatus("ready");
    } catch {
      if (!silent) setStatus("error");
    } finally {
      if (silent) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** النسخة التجريبية — تُعرض فقط عند فشل الاتصال وبالضغط الصريح من المستخدم */
  const useDemoFallback = useCallback(() => {
    setFiles(withLocalProducts(MEDIA_FILES));
    setSource("demo");
    setStatus("ready");
  }, []);

  /* أحدث الملفات أولًا */
  const sorted = useMemo(
    () => [...files].sort((a, b) => b.date.localeCompare(a.date)),
    [files],
  );

  const filtered = useMemo(
    () => filterFiles(sorted, { section, category, fileType, query }),
    [sorted, section, category, fileType, query],
  );

  /* ملفات القسم النشط فقط — لجعل عدّادات الفلاتر دقيقة */
  const sectionFiles = useMemo(
    () => filterFiles(sorted, { section, category: "all", fileType: "all", query: "" }),
    [sorted, section],
  );

  const products = useMemo(() => groupByProduct(sorted), [sorted]);

  const hasFilters =
    query.trim() !== "" || category !== "all" || fileType !== "all" || section !== "all";

  const isLoading = status === "loading";

  const scrollToLibrary = () =>
    window.setTimeout(
      () => document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      30,
    );

  const handleNavigate = (s: Section) => {
    setProductCode(null);
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setQuery("");
    setCategory("all");
    setFileType("all");
    setSection(s);
    if (s === "all") window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollToLibrary();
  };

  const handleClearAll = () => {
    setQuery("");
    setCategory("all");
    setFileType("all");
    setSection("all");
  };

  const openProduct = (code: string) => {
    const page = getProductPage(code);
    if (page) { window.location.assign(page); return; }
    setProductCode(code);
    window.history.replaceState(null, "", "#product=" + encodeURIComponent(code));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const page = productCode ? getProductPage(productCode) : undefined;
    if (page) window.location.replace(page);
  }, [productCode]);

  const activeGroup = productCode ? products.find((p) => normalizeProductCode(p.code) === normalizeProductCode(productCode)) ?? null : null;

  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col pb-20 md:pb-0">
        <Header section={section} inProductView={!!activeGroup} onNavigate={handleNavigate} />

        <main className="flex-1">
          {activeGroup ? (
            <ProductView
              group={activeGroup}
              files={sorted}
              onBack={() => { setProductCode(null); window.history.replaceState(null, "", window.location.pathname + window.location.search); }}
              onPreview={setPreview}
              onOpenProduct={openProduct}
            />
          ) : (
            <>
              <section className="mx-auto max-w-6xl px-4 pt-10 md:px-6 md:pt-14">
                <p className="text-sm font-bold text-brand-600">مكتبة ريبون</p>
                <h1 className="mt-2 font-display text-3xl font-extrabold text-ink-950 md:text-4xl">كل ما تحتاجه عن منتجك</h1>
                <p className="mt-3 text-base text-ink-700">اكتشف المنتجات، تعرّف على استخدامها، وحمّل الملفات المتاحة.</p>
                <label className="mt-6 block max-w-2xl" htmlFor="product-search">
                  <span className="mb-2 block text-sm font-bold text-ink-700">ابحث باسم المنتج أو رقم الموديل</span>
                  <input id="product-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="مثال: RE-5-096" className="h-14 w-full rounded-xl border border-cream-300 bg-cream-50 px-5 text-base text-ink-950 shadow-card" />
                </label>
              </section>

              {/* الفلاتر — Skeleton أثناء الجلب من Drive */}
              <div className="mx-auto mt-4 max-w-6xl px-4 md:mt-8 md:px-6">
                <Reveal>
                  <div className="rounded-[1rem] border border-cream-300/70 bg-cream-50/80 p-3 shadow-card md:rounded-[1.15rem] md:p-5">
                    {status === "ready" ? (
                      <FilterChips
                        files={sectionFiles}
                        category={category}
                        fileType={fileType}
                        onCategory={setCategory}
                        onFileType={setFileType}
                      />
                    ) : (
                      <SkeletonChips />
                    )}
                  </div>
                </Reveal>
              </div>

              <div className="mt-6 md:mt-10">
                <SectionCards
                  section={section}
                  files={sorted}
                  loading={isLoading}
                  onSelect={(s) => {
                    const next = s === section ? "all" : s;
                    setSection(next);
                    if (next !== "all") scrollToLibrary();
                  }}
                />
              </div>

              <div className="mt-4">
                {status === "loading" && <SkeletonGrid />}
                {status === "error" && <LibraryError onRetry={() => void load()} onDemo={useDemoFallback} />}
                {status === "ready" && (
                  <FileGrid
                    files={filtered}
                    section={section}
                    query={query}
                    hasFilters={hasFilters}
                    allProducts={products}
                    source={source}
                    onClearAll={handleClearAll}
                    onPreview={setPreview}
                    onOpenProduct={openProduct}
                    onRefresh={() => void load(true)}
                    refreshing={refreshing}
                    lastRefreshed={lastRefreshed}
                  />
                )}
              </div>
            </>
          )}
        </main>

        <Footer />

        <MobileBottomNav section={section} inProductView={!!activeGroup} onNavigate={handleNavigate} />

        <PreviewModal
          file={preview}
          onClose={() => setPreview(null)}
          onOpenProduct={openProduct}
        />
      </div>
    </ToastProvider>
  );
}
