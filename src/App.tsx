import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ALL_FILES,
  GROUP_LABELS,
  filesOfProduct,
  fileTypeLabel,
  isRecent,
  type FileType,
  type MediaFile,
  type View,
} from "./data/media";
import { Footer, Header } from "./components/Header";
import { Hero, SectionCards } from "./components/Hero";
import { Library } from "./components/Library";
import { PreviewModal, ProductSheet } from "./components/Modals";
import { IconCheck } from "./components/Icons";

const byDateDesc = (a: MediaFile, b: MediaFile) => b.date.localeCompare(a.date);

/** بدء تحميل ملف — يُستبدل لاحقًا بروابط Google Drive الموقّعة */
const triggerDownload = (f: MediaFile) => {
  const a = document.createElement("a");
  a.href = f.downloadUrl;
  a.download = f.fileName;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export default function App() {
  const [view, setView] = useState<View>("all");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("الكل");
  const [ftype, setFtype] = useState<"all" | FileType>("all");
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [productCode, setProductCode] = useState<string | null>(null);
  const [toast, setToast] = useState<{ id: number; msg: string } | null>(null);

  /* البحث اللحظي + الفلاتر */
  const filtered = useMemo(() => {
    let list = [...ALL_FILES];
    if (view === "videos") list = list.filter((f) => f.fileType === "video");
    if (view === "designs") list = list.filter((f) => f.group === "social-design" || f.group === "brand");
    if (view === "latest") list = list.filter(isRecent);
    if (category !== "الكل") list = list.filter((f) => f.category === category);
    if (ftype !== "all") list = list.filter((f) => f.fileType === ftype);

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((f) =>
        [f.productCode, f.productName, f.fileName, f.category, fileTypeLabel(f.fileType), GROUP_LABELS[f.group]]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    list.sort(byDateDesc);
    if (view === "latest") list = list.slice(0, 9);
    return list;
  }, [view, category, ftype, query]);

  /* إخفاء تمرير الصفحة عند فتح نافذة */
  useEffect(() => {
    const open = preview !== null || productCode !== null;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [preview, productCode]);

  /* إخفاء التنبيه تلقائيًا */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = useCallback((msg: string) => setToast({ id: Date.now(), msg }), []);

  const handleDownload = useCallback(
    (f: MediaFile) => {
      triggerDownload(f);
      showToast(`بدأ تحميل: ${f.fileName}`);
    },
    [showToast]
  );

  const handleDownloadAll = useCallback(
    (files: MediaFile[], label: string) => {
      files.forEach((f, i) => setTimeout(() => triggerDownload(f), i * 550));
      showToast(`جارٍ تحميل ${files.length} من ملفات ${label}…`);
    },
    [showToast]
  );

  const scrollToLibrary = () => {
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleNavigate = useCallback((v: View) => {
    setView(v);
    if (v === "all") {
      setQuery("");
      setCategory("الكل");
      setFtype("all");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      requestAnimationFrame(() =>
        document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    }
  }, []);

  const handleSuggestion = useCallback((q: string) => {
    setQuery(q);
    setCategory("الكل");
    setFtype("all");
    setView((v) => (v === "latest" ? "all" : v));
    requestAnimationFrame(() =>
      document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setCategory("الكل");
    setFtype("all");
  }, []);

  const openProduct = useCallback((code: string) => {
    setPreview(null);
    setProductCode(code);
  }, []);

  const productFiles = useMemo(
    () => (productCode ? filesOfProduct(ALL_FILES, productCode) : []),
    [productCode]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Header view={view} onNavigate={handleNavigate} />

      <main className="flex-1">
        <Hero
          query={query}
          onQuery={setQuery}
          onSearchSubmit={scrollToLibrary}
          onSuggestion={handleSuggestion}
        />

        <SectionCards onPick={handleNavigate} />

        <Library
          view={view}
          files={filtered}
          query={query}
          category={category}
          ftype={ftype}
          setCategory={setCategory}
          setFtype={setFtype}
          onReset={resetFilters}
          onPreview={setPreview}
          onDownload={handleDownload}
          onOpenProduct={openProduct}
        />
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* نافذة المعاينة */}
      {preview && (
        <PreviewModal
          file={preview}
          files={filtered}
          onClose={() => setPreview(null)}
          onNavigate={setPreview}
          onDownload={handleDownload}
          onOpenProduct={openProduct}
        />
      )}

      {/* نافذة تفاصيل المنتج */}
      {productCode && productFiles.length > 0 && (
        <ProductSheet
          code={productCode}
          files={productFiles}
          onClose={() => setProductCode(null)}
          onPreview={(f) => setPreview(f)}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
        />
      )}

      {/* تنبيه التحميل */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[70] flex justify-center px-4">
          <div
            key={toast.id}
            className="anim-toast flex items-center gap-2.5 rounded-full bg-ink-950 py-2 pe-4 ps-2.5 text-sm font-bold text-cream-50 shadow-lift"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-white">
              <IconCheck className="h-4 w-4" />
            </span>
            <span className="max-w-[70vw] truncate">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
