import { useCallback, useEffect, useMemo, useState } from "react";
import { filterFiles, groupByProduct, type MediaFile, type Section } from "./data/media";
import { fetchMediaLibrary } from "./lib/drive";
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

export default function App() {
  const [query, setQuery] = useState("");
  /** الفلتر الموحد: "all" | "video" | "design" | اسم تصنيف */
  const [filter, setFilter] = useState<string>("all");
  const [section, setSection] = useState<Section>("all");
  const [productCode, setProductCode] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  /* ---- جلب الملفات من /api/media (Google Drive) — المصدر الوحيد ---- */
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [status, setStatus] = useState<Status>("loading");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setFiles(await fetchMediaLibrary());
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () => filterFiles(files, { section, filter, query }),
    [files, section, filter, query],
  );

  /* ملفات القسم النشط فقط — لجعل عدّادات الفلاتر دقيقة */
  const sectionFiles = useMemo(
    () => filterFiles(files, { section, filter: "all", query: "" }),
    [files, section],
  );

  const products = useMemo(() => groupByProduct(files), [files]);

  const hasFilters = query.trim() !== "" || filter !== "all" || section !== "all";

  const isLoading = status === "loading";

  const scrollToLibrary = () =>
    window.setTimeout(
      () => document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" }),
      30,
    );

  const handleNavigate = (s: Section) => {
    setProductCode(null);
    setQuery("");
    setFilter("all");
    setSection(s);
    if (s === "all") window.scrollTo({ top: 0, behavior: "smooth" });
    else scrollToLibrary();
  };

  const handleClearAll = () => {
    setQuery("");
    setFilter("all");
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
              files={files}
              onBack={() => setProductCode(null)}
              onPreview={setPreview}
              onOpenProduct={openProduct}
            />
          ) : status === "error" ? (
            <LibraryError onRetry={load} />
          ) : (
            <>
              <Hero query={query} onQuery={setQuery} files={files} loading={isLoading} />

              {/* الفلاتر */}
              <div className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
                <Reveal>
                  {isLoading ? (
                    <SkeletonChips />
                  ) : (
                    <div className="rounded-[1.15rem] border border-cream-300/70 bg-cream-50/70 p-4 shadow-card md:p-5">
                      <FilterChips files={sectionFiles} filter={filter} onFilter={setFilter} />
                    </div>
                  )}
                </Reveal>
              </div>

              <div className="mt-10">
                <SectionCards
                  section={section}
                  onSelect={(s) => {
                    const next = s === section ? "all" : s;
                    setSection(next);
                    if (next !== "all") scrollToLibrary();
                  }}
                  files={files}
                  loading={isLoading}
                />
              </div>

              <div className="mt-4">
                {isLoading ? (
                  <div className="mx-auto max-w-6xl px-4 md:px-6">
                    <SkeletonGrid />
                  </div>
                ) : (
                  <FileGrid
                    files={filtered}
                    section={section}
                    query={query}
                    hasFilters={hasFilters}
                    allProducts={products}
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
