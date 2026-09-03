/**
 * Rebune Media Library — data layer
 * ---------------------------------
 * Each entry mirrors the shape of a Google Drive / API item, so swapping the
 * demo URLs for real Drive `downloadUrl` / `previewUrl` later is a one-line
 * change per file (or a fetch from the Drive API).
 */

export type Category = "تجميل" | "منزلي" | "عروض" | "هوية الشركة";
export type FileType = "video" | "image" | "pdf";
export type Section = "all" | "videos" | "gallery" | "designs" | "latest";

export interface MediaFile {
  id: string;
  productCode: string;
  productName: string;
  fileName: string;
  category: Category;
  fileType: FileType;
  /** card thumbnail */
  thumbnail: string;
  /** in-site preview (mp4 stream / full image / pdf) */
  previewUrl: string;
  /** replace with Google Drive download link later */
  downloadUrl: string;
  size: string;
  /** ISO date */
  date: string;
  /** duration badge for videos, e.g. "0:47" */
  duration?: string;
  tags?: ("design" | "social" | "brand")[];
}

/* ------------------------------ demo assets ------------------------------ */

const IMG = {
  derma: "https://image.qwenlm.ai/generated-images/e0ca4a76-541a-40ab-8e37-218eb6fe9167/_result.png",
  silk: "https://image.qwenlm.ai/generated-images/ba5b9ef3-4c7d-4cd5-81e4-2a86a07d3ac9/_result.png",
  blender: "https://image.qwenlm.ai/generated-images/769ae44f-0e07-4e5e-a91a-1365a9e975d8/_result.png",
  vacuum: "https://image.qwenlm.ai/generated-images/940e617e-240e-4ba9-8022-d66a71286beb/_result.png",
  kettle: "https://image.qwenlm.ai/generated-images/95cdbacd-d149-4133-bf32-50308e3bebaf/_result.png",
  identity: "https://image.qwenlm.ai/generated-images/c13cf44d-1c26-49b2-9977-6c78fe4b04e2/_result.png",
  offer: "https://image.qwenlm.ai/generated-images/0a635911-8dd7-46b8-9c18-9af7924d701e/_result.png",
  catalog: "https://image.qwenlm.ai/generated-images/128000d0-a74f-48ed-8402-642f624f41fd/_result.png",
  beautyLife: "https://image.qwenlm.ai/generated-images/117cc615-e1e0-432e-9d4b-4f5663532f7b/_result.png",
  kitchenLife: "https://image.qwenlm.ai/generated-images/60074e49-8e39-4c82-8b0b-65d75e99ea0b/_result.png",
};

const VIDEO_BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample";
const PDF_URL = "/downloads/rebune-guide.pdf";

export const FEATURED = {
  heroMain: IMG.beautyLife,
  heroSmall1: IMG.blender,
  heroSmall2: IMG.kettle,
  videosCard: IMG.kitchenLife,
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

/* ------------------------------- selectors ------------------------------- */

export const CATEGORIES: Category[] = ["تجميل", "منزلي", "عروض", "هوية الشركة"];

export const TYPE_LABEL: Record<FileType, string> = {
  video: "فيديو",
  image: "صورة",
  pdf: "PDF",
};

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
    normalize(file.category).includes(q)
  );
}

export function filterFiles(
  files: MediaFile[],
  opts: { section: Section; category: Category | "all"; fileType: FileType | "all"; query: string },
): MediaFile[] {
  let list = files;
  if (opts.section === "videos") list = list.filter((f) => f.fileType === "video");
  else if (opts.section === "gallery") list = list.filter((f) => f.fileType === "image");
  else if (opts.section === "designs") list = list.filter((f) => f.tags?.includes("design"));
  else if (opts.section === "latest") list = list.slice(0, 8);

  if (opts.category !== "all") list = list.filter((f) => f.category === opts.category);
  if (opts.fileType !== "all") list = list.filter((f) => f.fileType === opts.fileType);
  if (opts.query.trim()) list = list.filter((f) => matchesQuery(f, opts.query));
  return list;
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
