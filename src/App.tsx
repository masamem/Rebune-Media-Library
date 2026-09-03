import { useMemo, useState } from "react";
import {
  MEDIA_FILES,
  filterFiles,
  groupByProduct,
  type Category,
  type FileType,
  type MediaFile,
  type Section,
} from "./data/media";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SectionCards from "./components/SectionCards";
import FilterChips from "./components/FilterChips";
import FileGrid from "./components/FileGrid";
import PreviewModal from "./components/PreviewModal";
import ProductView from "./components/ProductView";
import Footer from "./components/Footer";
import { ToastProvider } from "./components/Toast";
import { Reveal } from "./components/ui";

export default function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [fileType, setFileType] = useState<FileType | "all">("all");
  const [section, setSection] = useState<Section>("all");
  const [productCode, setProductCode] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);

  /* أحدث الملفات أولًا */
  const sorted = useMemo(
    () => [...MEDIA_FILES].sort((a, b) => b.date.localeCompare(a.date)),
    [],
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
              onBack={() => setProductCode(null)}
              onPreview={setPreview}
              onOpenProduct={openProduct}
            />
          ) : (
            <>
              <Hero query={query} onQuery={setQuery} />

              {/* الفلاتر — تظهر عند التمرير لأسفل أو عند البحث */}
              <div className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
                <Reveal>
                  <div className="rounded-[1.15rem] border border-cream-300/70 bg-cream-50/70 p-4 shadow-card md:p-5">
                    <FilterChips
                      files={sectionFiles}
                      category={category}
                      fileType={fileType}
                      onCategory={setCategory}
                      onFileType={setFileType}
                    />
                  </div>
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
                />
              </div>

              <div className="mt-4">
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
