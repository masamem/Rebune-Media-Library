/**
 * Rebune Media Library — data layer
 * ---------------------------------
 * Each entry mirrors the shape of a Google Drive / API item, so swapping the
 * demo URLs for real Drive `downloadUrl` / `previewUrl` later is a one-line
 * change per file (or a fetch from the Drive API).
 */

/** التصنيف ديناميكي — يأتي من أسماء مجلدات Google Drive أو البيانات التجريبية */
export type Category = string;
export type FileType = "video" | "image" | "pdf" | "other";
export type Section = "all" | "videos" | "gallery" | "designs" | "latest";

export interface MediaFile {
  id: string;
  productCode: string;
  productName: string;
  fileName: string;
  category: Category;
  fileType: FileType;
  /** امتداد الملف: mp4 / mov / jpg / pdf … */
  extension?: string;
  /** اسم المجلد داخل Google Drive */
  folderName?: string;
  /** card thumbnail */
  thumbnail: string;
  /** in-site preview (mp4 stream / full image / pdf / Drive preview) */
  previewUrl: string;
  /** Google Drive download link (or local demo file) */
  downloadUrl: string;
  size: string;
  /** ISO date */
  date: string;
  /** duration badge for videos, e.g. "0:47" */
  duration?: string;
  tags?: ("design" | "social" | "brand")[];
}

/* ------------------------------ demo assets ------------------------------ */

/* أصول محلية داخل public/media — تعمل دائمًا دون اتصال خارجي */
const IMG = {
  derma: "/media/derma.svg",
  silk: "/media/silk.svg",
  blender: "/media/blender.svg",
  vacuum: "/media/vacuum.svg",
  kettle: "/media/kettle.svg",
  identity: "/media/identity.svg",
  offer: "/media/promo.svg",
  catalog: "/media/catalog.svg",
  beautyLife: "/media/beauty-life.svg",
  kitchenLife: "/media/kitchen-life.svg",
};

const VIDEO_BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";
const PDF_URL = "/downloads/rebune-guide.pdf";

export const FEATURED = {
  heroMain: "/media/hero-main.svg",
  heroSmall1: "/media/hero-top.svg",
  heroSmall2: "/media/hero-bottom.svg",
  videosCard: "/media/kitchen-life.svg",
  designsCard: "/media/promo.svg",
};

/* ------------------------------ demo files ------------------------------- */

export const MEDIA_FILES: MediaFile[] = [
  /* -------- RE-2211 · Derma Glow — جهاز العناية بالوجه (تجميل) -------- */
  {
    id: "f01", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "فيديو تعريفي — Derma Glow", category: "تجميل", fileType: "video",
    thumbnail: IMG.beautyLife, previewUrl: `${VIDEO_BASE}/ForBiggerBlazes.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerBlazes.mp4`, size: "24.6 MB",
    date: "2026-02-08", duration: "0:47",
  },
  {
    id: "f02", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "طريقة الاستخدام — خطوات سريعة", category: "تجميل", fileType: "video",
    thumbnail: IMG.derma, previewUrl: `${VIDEO_BASE}/ForBiggerFun.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerFun.mp4`, size: "18.2 MB",
    date: "2026-01-21", duration: "0:59",
  },
  {
    id: "f03", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "صورة المنتج — أمامية", category: "تجميل", fileType: "image",
    thumbnail: IMG.derma, previewUrl: IMG.derma, downloadUrl: IMG.derma,
    size: "2.4 MB", date: "2026-01-18",
  },
  {
    id: "f04", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "صورة الاستخدام — لقطة قريبة", category: "تجميل", fileType: "image",
    thumbnail: IMG.beautyLife, previewUrl: IMG.beautyLife, downloadUrl: IMG.beautyLife,
    size: "3.1 MB", date: "2026-01-18",
  },
  {
    id: "f05", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "تصميم بوست انستغرام — Derma Glow", category: "تجميل", fileType: "image",
    thumbnail: IMG.derma, previewUrl: IMG.derma, downloadUrl: IMG.derma,
    size: "1.8 MB", date: "2026-02-02", tags: ["design", "social"],
  },
  {
    id: "f06", productCode: "RE-2211", productName: "جهاز العناية بالوجه Derma Glow",
    fileName: "دليل الاستخدام — RE-2211", category: "تجميل", fileType: "pdf",
    thumbnail: IMG.catalog, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "1.2 MB", date: "2026-01-10",
  },

  /* -------- RE-1504 · SilkPro — مكواة الشعر السيراميك (تجميل) -------- */
  {
    id: "f07", productCode: "RE-1504", productName: "مكواة الشعر السيراميك SilkPro",
    fileName: "فيديو ريلز — SilkPro", category: "تجميل", fileType: "video",
    thumbnail: IMG.silk, previewUrl: `${VIDEO_BASE}/ForBiggerEscapes.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerEscapes.mp4`, size: "12.9 MB",
    date: "2026-02-05", duration: "0:32",
  },
  {
    id: "f08", productCode: "RE-1504", productName: "مكواة الشعر السيراميك SilkPro",
    fileName: "صورة المنتج — SilkPro", category: "تجميل", fileType: "image",
    thumbnail: IMG.silk, previewUrl: IMG.silk, downloadUrl: IMG.silk,
    size: "2.2 MB", date: "2026-01-25",
  },
  {
    id: "f09", productCode: "RE-1504", productName: "مكواة الشعر السيراميك SilkPro",
    fileName: "تصميم ستوري — عرض SilkPro", category: "تجميل", fileType: "image",
    thumbnail: IMG.offer, previewUrl: IMG.offer, downloadUrl: IMG.offer,
    size: "1.5 MB", date: "2026-02-10", tags: ["design", "social"],
  },

  /* -------- RE-3320 · PowerMix — الخلاط الاحترافي (منزلي) -------- */
  {
    id: "f10", productCode: "RE-3320", productName: "الخلاط الاحترافي PowerMix",
    fileName: "فيديو إعلاني — PowerMix", category: "منزلي", fileType: "video",
    thumbnail: IMG.kitchenLife, previewUrl: `${VIDEO_BASE}/ForBiggerJoyrides.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerJoyrides.mp4`, size: "31.4 MB",
    date: "2026-02-12", duration: "0:55",
  },
  {
    id: "f11", productCode: "RE-3320", productName: "الخلاط الاحترافي PowerMix",
    fileName: "صورة المنتج — PowerMix", category: "منزلي", fileType: "image",
    thumbnail: IMG.blender, previewUrl: IMG.blender, downloadUrl: IMG.blender,
    size: "2.6 MB", date: "2026-01-30",
  },
  {
    id: "f12", productCode: "RE-3320", productName: "الخلاط الاحترافي PowerMix",
    fileName: "صورة الاستخدام اليومي", category: "منزلي", fileType: "image",
    thumbnail: IMG.kitchenLife, previewUrl: IMG.kitchenLife, downloadUrl: IMG.kitchenLife,
    size: "3.4 MB", date: "2026-01-30",
  },
  {
    id: "f13", productCode: "RE-3320", productName: "الخلاط الاحترافي PowerMix",
    fileName: "كتاب الوصفات — PowerMix", category: "منزلي", fileType: "pdf",
    thumbnail: IMG.catalog, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "4.8 MB", date: "2026-01-15",
  },

  /* -------- RE-4105 · AeroClean — المكنسة اللاسلكية (منزلي) -------- */
  {
    id: "f14", productCode: "RE-4105", productName: "المكنسة اللاسلكية AeroClean",
    fileName: "صورة المنتج — AeroClean", category: "منزلي", fileType: "image",
    thumbnail: IMG.vacuum, previewUrl: IMG.vacuum, downloadUrl: IMG.vacuum,
    size: "2.3 MB", date: "2026-02-01",
  },
  {
    id: "f15", productCode: "RE-4105", productName: "المكنسة اللاسلكية AeroClean",
    fileName: "فيديو استعراض — AeroClean", category: "منزلي", fileType: "video",
    thumbnail: IMG.vacuum, previewUrl: `${VIDEO_BASE}/ForBiggerMeltdowns.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerMeltdowns.mp4`, size: "22.7 MB",
    date: "2026-01-28", duration: "1:03",
  },
  {
    id: "f16", productCode: "RE-4105", productName: "المكنسة اللاسلكية AeroClean",
    fileName: "تصميم بوست المواصفات", category: "منزلي", fileType: "image",
    thumbnail: IMG.vacuum, previewUrl: IMG.vacuum, downloadUrl: IMG.vacuum,
    size: "1.6 MB", date: "2026-02-06", tags: ["design", "social"],
  },

  /* -------- RE-2730 · Tempo — الغلاية الكهربائية (منزلي) -------- */
  {
    id: "f17", productCode: "RE-2730", productName: "الغلاية الكهربائية Tempo",
    fileName: "صورة المنتج — Tempo", category: "منزلي", fileType: "image",
    thumbnail: IMG.kettle, previewUrl: IMG.kettle, downloadUrl: IMG.kettle,
    size: "2.1 MB", date: "2026-02-09",
  },
  {
    id: "f18", productCode: "RE-2730", productName: "الغلاية الكهربائية Tempo",
    fileName: "ورقة المواصفات — RE-2730", category: "منزلي", fileType: "pdf",
    thumbnail: IMG.catalog, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "0.9 MB", date: "2026-02-09",
  },

  /* -------- عروض — Ramadan Campaign -------- */
  {
    id: "f19", productCode: "RE-PROMO-26", productName: "حملة عروض رمضان",
    fileName: "تصميم عرض رمضان — البوست الرئيسي", category: "عروض", fileType: "image",
    thumbnail: IMG.offer, previewUrl: IMG.offer, downloadUrl: IMG.offer,
    size: "2.0 MB", date: "2026-02-14", tags: ["design", "social"],
  },
  {
    id: "f20", productCode: "RE-PROMO-26", productName: "حملة عروض رمضان",
    fileName: "فيديو العرض — نهاية الموسم", category: "عروض", fileType: "video",
    thumbnail: IMG.offer, previewUrl: `${VIDEO_BASE}/ForBiggerBlazes.mp4`,
    downloadUrl: `${VIDEO_BASE}/ForBiggerBlazes.mp4`, size: "19.8 MB",
    date: "2026-02-11", duration: "0:40",
  },
  {
    id: "f21", productCode: "RE-PROMO-26", productName: "حملة عروض رمضان",
    fileName: "نشرة العروض — فبراير 2026", category: "عروض", fileType: "pdf",
    thumbnail: IMG.catalog, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "3.2 MB", date: "2026-02-11",
  },

  /* -------- هوية الشركة -------- */
  {
    id: "f22", productCode: "RE-BRAND", productName: "هوية Rebune البصرية",
    fileName: "الشعار الرسمي — PNG", category: "هوية الشركة", fileType: "image",
    thumbnail: IMG.identity, previewUrl: IMG.identity, downloadUrl: IMG.identity,
    size: "1.1 MB", date: "2026-01-05", tags: ["brand"],
  },
  {
    id: "f23", productCode: "RE-BRAND", productName: "هوية Rebune البصرية",
    fileName: "قرطاسية الشركة — النسخة المعتمدة", category: "هوية الشركة", fileType: "image",
    thumbnail: IMG.identity, previewUrl: IMG.identity, downloadUrl: IMG.identity,
    size: "0.8 MB", date: "2026-01-05", tags: ["brand"],
  },
  {
    id: "f24", productCode: "RE-BRAND", productName: "هوية Rebune البصرية",
    fileName: "دليل الهوية البصرية", category: "هوية الشركة", fileType: "pdf",
    thumbnail: IMG.identity, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "6.4 MB", date: "2026-01-06", tags: ["brand"],
  },
  {
    id: "f25", productCode: "RE-BRAND", productName: "هوية Rebune البصرية",
    fileName: "كتالوج الشركة العام 2026", category: "هوية الشركة", fileType: "pdf",
    thumbnail: IMG.catalog, previewUrl: PDF_URL, downloadUrl: PDF_URL,
    size: "8.7 MB", date: "2026-02-13", tags: ["brand"],
  },
];

/* استكمال امتدادات الملفات التجريبية لتظهر على شارات النوع وفلاتر الامتداد */
for (const f of MEDIA_FILES) {
  if (!f.extension) {
    f.extension = f.fileType === "video" ? "mp4" : f.fileType === "pdf" ? "pdf" : undefined;
  }
}

/* ------------------------------- selectors ------------------------------- */

export const CATEGORIES: Category[] = ["تجميل", "منزلي", "عروض", "هوية الشركة"];

export const TYPE_LABEL: Record<FileType, string> = {
  video: "فيديو",
  image: "صورة",
  pdf: "PDF",
  other: "أخرى",
};

/** القيم العامة للنوع — أي قيمة غيرها تُعامل كامتداد (MP4 / MOV …) */
export const KIND_VALUES: readonly string[] = ["video", "image", "pdf", "other"];

export const SECTION_LABEL: Record<Section, string> = {
  all: "كل الملفات",
  videos: "الفيديوهات",
  gallery: "الصور والتصاميم",
  designs: "التصاميم",
  latest: "أحدث الملفات",
};

export const normalize = (s: string) =>
  s.toLowerCase().replace(/[\s\-_.·]/g, "").replace(/[أإآ]/g, "ا");

export function matchesQuery(file: MediaFile, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(file.productCode).includes(q) ||
    normalize(file.productName).includes(q) ||
    normalize(file.fileName).includes(q) ||
    normalize(file.category).includes(q) ||
    normalize(file.folderName ?? "").includes(q) ||
    normalize(file.extension ?? "").includes(q)
  );
}

/**
 * فلتر النوع يقبل قيمة عامة (video / image / pdf / other)
 * أو امتدادًا مباشرًا مثل "mp4" أو "mov".
 */
export function filterFiles(
  files: MediaFile[],
  opts: { section: Section; category: string; fileType: string; query: string },
): MediaFile[] {
  let list = files;
  if (opts.section === "videos") list = list.filter((f) => f.fileType === "video");
  else if (opts.section === "gallery") list = list.filter((f) => f.fileType === "image");
  else if (opts.section === "designs")
    list = list.filter((f) => f.tags?.includes("design") || f.category === "تصاميم");
  else if (opts.section === "latest") list = list.slice(0, 8);

  if (opts.category !== "all") list = list.filter((f) => f.category === opts.category);
  if (opts.fileType !== "all") {
    if (KIND_VALUES.includes(opts.fileType)) {
      list = list.filter((f) => f.fileType === opts.fileType);
    } else {
      list = list.filter((f) => (f.extension ?? "").toLowerCase() === opts.fileType.toLowerCase());
    }
  }
  if (opts.query.trim()) list = list.filter((f) => matchesQuery(f, opts.query));
  return list;
}

/** التصنيفات الموجودة فعليًا في البيانات (بدل قائمة ثابتة) */
export function categoriesOf(files: MediaFile[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const f of files) {
    if (!seen.has(f.category)) {
      seen.add(f.category);
      out.push(f.category);
    }
  }
  return out;
}

export interface ProductGroup {
  code: string;
  name: string;
  category: Category;
  files: MediaFile[];
}

export function groupByProduct(files: MediaFile[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();
  for (const f of files) {
    const g = map.get(f.productCode);
    if (g) g.files.push(f);
    else map.set(f.productCode, { code: f.productCode, name: f.productName, category: f.category, files: [f] });
  }
  return [...map.values()];
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("ar", { day: "numeric", month: "short", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}
