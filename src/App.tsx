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
import Hero from "./components/Hero";
import SectionCards from "./components/SectionCards";
import FilterChips from "./components/FilterChips";
import FileGrid from "./components/FileGrid";
import PreviewModal from "./components/PreviewModal";
import ProductView from "./components/ProductView";
import Footer from "./components/Footer";
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
  const [productCode, setProductCode] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  /* ---- جلب الملفات من /api/media (Google Drive) مع fallback تجريبي ---- */
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [source, setSource] = useState<Source>("drive");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const items = await fetchDriveMedia();
      setFiles(items.map(toMediaFile));
      setSource("drive");
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** النسخة التجريبية — تُعرض فقط عند فشل الاتصال وبالضغط الصريح من المستخدم */
  const useDemoFallback = useCallback(() => {
    setFiles(MEDIA_FILES);
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
    setProductCode(code);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeGroup = productCode ? products.find((p) => p.code === productCode) ?? null : null;

  return (
    <ToastProvider>
      <div className="flex min-h-dvh flex-col">
        <Header section={section} inProductView={!!activeGroup} onNavigate={handleNavigate} />

        <main className="flex-1">
          {activeGroup ? (
            <ProductView
              group={activeGroup}
              files={sorted}
              onBack={() => setProductCode(null)}
              onPreview={setPreview}
              onOpenProduct={openProduct}
            />
          ) : (
            <>
              <Hero query={query} onQuery={setQuery} files={sorted} loading={isLoading} />

              {/* الفلاتر — Skeleton أثناء الجلب من Drive */}
              <div className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
                <Reveal>
                  <div className="rounded-[1.15rem] border border-cream-300/70 bg-cream-50/70 p-4 shadow-card md:p-5">
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

              <div className="mt-10">
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
                  />
                )}
              </div>
            </>
          )}
        </main>

        <Footer />

        <PreviewModal
          file={preview}
          onClose={() => setPreview(null)}
          onOpenProduct={openProduct}
        />
      </div>
    </ToastProvider>
  );
}
