/* =============================================================
   Rebune Media Library — Data Layer
   بنية مرنة جاهزة للربط لاحقًا مع Google Drive أو أي API:
   يكفي استبدال previewUrl / downloadUrl بروابط Drive الموقّعة.
   ============================================================= */

export type FileType = "video" | "image" | "pdf";
export type Category = "تجميل" | "منزلي" | "عروض" | "هوية الشركة";
export type FileGroup = "product-photo" | "product-video" | "social-design" | "brand";
export type View = "all" | "videos" | "designs" | "latest";

export interface MediaFile {
  id: string;
  productCode: string;
  productName: string;
  fileName: string;
  category: Category;
  fileType: FileType;
  group: FileGroup;
  thumbnail: string;
  previewUrl: string;
  downloadUrl: string;
  size: string;
  date: string; // ISO — تاريخ الإضافة
}

/* ---------- الأصول ---------- */

const IMG = {
  trimmer:
    "https://image.qwenlm.ai/generated-images/2064c54e-38f7-4243-9714-7b6ff5b94ab1/_result.png",
  dryer:
    "https://image.qwenlm.ai/generated-images/2d1f907b-f8a9-4b95-a18f-8528c164eb0f/_result.png",
  straightener:
    "https://image.qwenlm.ai/generated-images/b19f0a70-13a2-4152-a846-8edc254978fa/_result.png",
  fryer:
    "https://image.qwenlm.ai/generated-images/cc7827de-5e53-4f03-95d9-f1f1fa895967/_result.png",
  blender:
    "https://image.qwenlm.ai/generated-images/5b1458b5-e792-4463-a243-48e21231af0e/_result.png",
  vacuum:
    "https://image.qwenlm.ai/generated-images/88453898-89f1-4d9a-afa4-944c3d5440d4/_result.png",
  offer:
    "https://image.qwenlm.ai/generated-images/85dcaa06-636f-4d97-a6b7-7dbc409868a1/_result.png",
  brand:
    "https://image.qwenlm.ai/generated-images/293d28b2-684e-418c-9011-748f72551a61/_result.png",
};

/* فيديوهات تجريبية — تُستبدل لاحقًا بروابط Drive */
const VID = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
];

const SAMPLE_PDF = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";

export const FALLBACK_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'><rect width='640' height='480' fill='#F4ECDF'/><rect x='270' y='190' width='100' height='100' rx='26' fill='#E8601C'/><path d='M300 262v-44h22a14 14 0 0 1 0 28h-22m15 16 18 16' fill='none' stroke='#fff' stroke-width='9' stroke-linecap='round' stroke-linejoin='round' transform='translate(-14,-46)'/><text x='320' y='340' text-anchor='middle' font-family='sans-serif' font-size='22' font-weight='bold' fill='#8A7663'>REBUNE</text></svg>`
  );

/* ---------- البيانات التجريبية ---------- */

export const ALL_FILES: MediaFile[] = [
  /* ===== RE-2211 · جهاز العناية الشخصية برو ===== */
  {
    id: "f01",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-صورة-رئيسية.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.trimmer,
    previewUrl: IMG.trimmer,
    downloadUrl: IMG.trimmer,
    size: "2.4 MB",
    date: "2026-01-18",
  },
  {
    id: "f02",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-زاوية-جانبية.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.trimmer,
    previewUrl: IMG.trimmer,
    downloadUrl: IMG.trimmer,
    size: "2.1 MB",
    date: "2026-01-18",
  },
  {
    id: "f03",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-المجموعة-مع-الملحقات.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.trimmer,
    previewUrl: IMG.trimmer,
    downloadUrl: IMG.trimmer,
    size: "2.8 MB",
    date: "2026-01-12",
  },
  {
    id: "f04",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-فيديو-تعريفي.mp4",
    category: "تجميل",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.trimmer,
    previewUrl: VID[0],
    downloadUrl: VID[0],
    size: "48 MB",
    date: "2026-01-20",
  },
  {
    id: "f05",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-طريقة-الاستخدام.mp4",
    category: "تجميل",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.trimmer,
    previewUrl: VID[1],
    downloadUrl: VID[1],
    size: "62 MB",
    date: "2026-01-05",
  },
  {
    id: "f06",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-ريلز-ترويجي-30s.mp4",
    category: "تجميل",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.trimmer,
    previewUrl: VID[2],
    downloadUrl: VID[2],
    size: "18 MB",
    date: "2026-01-22",
  },
  {
    id: "f07",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-بوست-انستقرام.png",
    category: "تجميل",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.trimmer,
    previewUrl: IMG.trimmer,
    downloadUrl: IMG.trimmer,
    size: "1.2 MB",
    date: "2026-01-21",
  },
  {
    id: "f08",
    productCode: "RE-2211",
    productName: "جهاز العناية الشخصية برو",
    fileName: "RE-2211-تصميم-ستوري.png",
    category: "تجميل",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.trimmer,
    previewUrl: IMG.trimmer,
    downloadUrl: IMG.trimmer,
    size: "0.9 MB",
    date: "2026-01-21",
  },

  /* ===== RE-1108 · مجفف الشعر إير فلو ===== */
  {
    id: "f09",
    productCode: "RE-1108",
    productName: "مجفف الشعر إير فلو",
    fileName: "RE-1108-صورة-رئيسية.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.dryer,
    previewUrl: IMG.dryer,
    downloadUrl: IMG.dryer,
    size: "2.2 MB",
    date: "2026-01-15",
  },
  {
    id: "f10",
    productCode: "RE-1108",
    productName: "مجفف الشعر إير فلو",
    fileName: "RE-1108-مع-الفوهات.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.dryer,
    previewUrl: IMG.dryer,
    downloadUrl: IMG.dryer,
    size: "2.5 MB",
    date: "2026-01-15",
  },
  {
    id: "f11",
    productCode: "RE-1108",
    productName: "مجفف الشعر إير فلو",
    fileName: "RE-1108-استعراض-سريع.mp4",
    category: "تجميل",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.dryer,
    previewUrl: VID[3],
    downloadUrl: VID[3],
    size: "34 MB",
    date: "2026-01-19",
  },
  {
    id: "f12",
    productCode: "RE-1108",
    productName: "مجفف الشعر إير فلو",
    fileName: "RE-1108-بوست-عرض.png",
    category: "تجميل",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.dryer,
    previewUrl: IMG.dryer,
    downloadUrl: IMG.dryer,
    size: "1.1 MB",
    date: "2026-01-19",
  },

  /* ===== RE-3305 · مكواة الشعر سيلك تاتش ===== */
  {
    id: "f13",
    productCode: "RE-3305",
    productName: "مكواة الشعر سيلك تاتش",
    fileName: "RE-3305-صورة-رئيسية.png",
    category: "تجميل",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.straightener,
    previewUrl: IMG.straightener,
    downloadUrl: IMG.straightener,
    size: "2.0 MB",
    date: "2025-12-28",
  },
  {
    id: "f14",
    productCode: "RE-3305",
    productName: "مكواة الشعر سيلك تاتش",
    fileName: "RE-3305-فيديو-تعريفي.mp4",
    category: "تجميل",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.straightener,
    previewUrl: VID[4],
    downloadUrl: VID[4],
    size: "41 MB",
    date: "2025-12-28",
  },
  {
    id: "f15",
    productCode: "RE-3305",
    productName: "مكواة الشعر سيلك تاتش",
    fileName: "RE-3305-إعلان-سناب.png",
    category: "تجميل",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.straightener,
    previewUrl: IMG.straightener,
    downloadUrl: IMG.straightener,
    size: "0.8 MB",
    date: "2026-01-02",
  },

  /* ===== RE-4712 · القلاية الهوائية كريسبي ===== */
  {
    id: "f16",
    productCode: "RE-4712",
    productName: "القلاية الهوائية كريسبي",
    fileName: "RE-4712-صورة-رئيسية.png",
    category: "منزلي",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.fryer,
    previewUrl: IMG.fryer,
    downloadUrl: IMG.fryer,
    size: "2.6 MB",
    date: "2026-01-10",
  },
  {
    id: "f17",
    productCode: "RE-4712",
    productName: "القلاية الهوائية كريسبي",
    fileName: "RE-4712-السلة-المفتوحة.png",
    category: "منزلي",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.fryer,
    previewUrl: IMG.fryer,
    downloadUrl: IMG.fryer,
    size: "2.3 MB",
    date: "2026-01-10",
  },
  {
    id: "f18",
    productCode: "RE-4712",
    productName: "القلاية الهوائية كريسبي",
    fileName: "RE-4712-فيديو-وصفات.mp4",
    category: "منزلي",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.fryer,
    previewUrl: VID[0],
    downloadUrl: VID[0],
    size: "55 MB",
    date: "2026-01-16",
  },
  {
    id: "f19",
    productCode: "RE-4712",
    productName: "القلاية الهوائية كريسبي",
    fileName: "RE-4712-إنفوجرافيك.png",
    category: "منزلي",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.fryer,
    previewUrl: IMG.fryer,
    downloadUrl: IMG.fryer,
    size: "1.4 MB",
    date: "2026-01-16",
  },

  /* ===== RE-4520 · الخلاط باور ميكس ===== */
  {
    id: "f20",
    productCode: "RE-4520",
    productName: "الخلاط باور ميكس",
    fileName: "RE-4520-صورة-رئيسية.png",
    category: "منزلي",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.blender,
    previewUrl: IMG.blender,
    downloadUrl: IMG.blender,
    size: "2.1 MB",
    date: "2025-12-20",
  },
  {
    id: "f21",
    productCode: "RE-4520",
    productName: "الخلاط باور ميكس",
    fileName: "RE-4520-فيديو-تشغيل.mp4",
    category: "منزلي",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.blender,
    previewUrl: VID[1],
    downloadUrl: VID[1],
    size: "27 MB",
    date: "2025-12-22",
  },

  /* ===== RE-5210 · المكنسة اللاسلكية سويفت ===== */
  {
    id: "f22",
    productCode: "RE-5210",
    productName: "المكنسة اللاسلكية سويفت",
    fileName: "RE-5210-صورة-رئيسية.png",
    category: "منزلي",
    fileType: "image",
    group: "product-photo",
    thumbnail: IMG.vacuum,
    previewUrl: IMG.vacuum,
    downloadUrl: IMG.vacuum,
    size: "2.7 MB",
    date: "2026-01-08",
  },
  {
    id: "f23",
    productCode: "RE-5210",
    productName: "المكنسة اللاسلكية سويفت",
    fileName: "RE-5210-قوة-الشفط.mp4",
    category: "منزلي",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.vacuum,
    previewUrl: VID[2],
    downloadUrl: VID[2],
    size: "39 MB",
    date: "2026-01-08",
  },

  /* ===== OF-0626 · باكدج عرض الصيف ===== */
  {
    id: "f24",
    productCode: "OF-0626",
    productName: "باكدج عرض الصيف",
    fileName: "عرض-الصيف-البوستر-الرئيسي.png",
    category: "عروض",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.offer,
    previewUrl: IMG.offer,
    downloadUrl: IMG.offer,
    size: "1.6 MB",
    date: "2026-01-22",
  },
  {
    id: "f25",
    productCode: "OF-0626",
    productName: "باكدج عرض الصيف",
    fileName: "عرض-الصيف-ستوري.png",
    category: "عروض",
    fileType: "image",
    group: "social-design",
    thumbnail: IMG.offer,
    previewUrl: IMG.offer,
    downloadUrl: IMG.offer,
    size: "1.0 MB",
    date: "2026-01-22",
  },
  {
    id: "f26",
    productCode: "OF-0626",
    productName: "باكدج عرض الصيف",
    fileName: "عرض-الصيف-فيديو-15s.mp4",
    category: "عروض",
    fileType: "video",
    group: "product-video",
    thumbnail: IMG.offer,
    previewUrl: VID[3],
    downloadUrl: VID[3],
    size: "12 MB",
    date: "2026-01-23",
  },

  /* ===== BR-0001 · هوية الشركة الرسمية ===== */
  {
    id: "f27",
    productCode: "BR-0001",
    productName: "هوية الشركة الرسمية",
    fileName: "دليل-هوية-Rebune-كامل.pdf",
    category: "هوية الشركة",
    fileType: "pdf",
    group: "brand",
    thumbnail: IMG.brand,
    previewUrl: IMG.brand,
    downloadUrl: SAMPLE_PDF,
    size: "8.4 MB",
    date: "2025-11-30",
  },
  {
    id: "f28",
    productCode: "BR-0001",
    productName: "هوية الشركة الرسمية",
    fileName: "حزمة-شعارات-Rebune.png",
    category: "هوية الشركة",
    fileType: "image",
    group: "brand",
    thumbnail: IMG.brand,
    previewUrl: IMG.brand,
    downloadUrl: IMG.brand,
    size: "3.2 MB",
    date: "2025-11-30",
  },
  {
    id: "f29",
    productCode: "BR-0001",
    productName: "هوية الشركة الرسمية",
    fileName: "قالب-بطاقة-العمل.pdf",
    category: "هوية الشركة",
    fileType: "pdf",
    group: "brand",
    thumbnail: IMG.brand,
    previewUrl: IMG.brand,
    downloadUrl: SAMPLE_PDF,
    size: "1.1 MB",
    date: "2025-12-01",
  },
];

/* ---------- ثوابت الفلاتر ---------- */

export const CATEGORIES = ["الكل", "تجميل", "منزلي", "عروض", "هوية الشركة"] as const;

export const TYPE_FILTERS: { id: "all" | FileType; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "video", label: "فيديو" },
  { id: "image", label: "صور" },
  { id: "pdf", label: "PDF" },
];

export const GROUP_ORDER: FileGroup[] = ["product-photo", "product-video", "social-design", "brand"];

export const GROUP_LABELS: Record<FileGroup, string> = {
  "product-photo": "صور المنتج",
  "product-video": "فيديوهات المنتج",
  "social-design": "تصاميم السوشيال ميديا",
  brand: "ملفات الهوية",
};

export const NAV_ITEMS: { id: View; label: string }[] = [
  { id: "all", label: "الرئيسية" },
  { id: "videos", label: "الفيديوهات" },
  { id: "designs", label: "التصاميم" },
  { id: "latest", label: "أحدث الملفات" },
];

/* ---------- أدوات مساعدة ---------- */

const NEW_CUTOFF = "2026-01-15";

export const isRecent = (f: MediaFile) => f.date >= NEW_CUTOFF;

export const fileTypeLabel = (t: FileType) =>
  t === "video" ? "فيديو" : t === "image" ? "صورة" : "PDF";

const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export const formatDateAr = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${AR_MONTHS[(m ?? 1) - 1]} ${y}`;
};

/** صياغة عربية سليمة للعدد: ملف واحد / ملفان / 5 ملفات / 24 ملفًا */
export const countLabel = (n: number) => {
  if (n === 1) return "ملف واحد";
  if (n === 2) return "ملفان";
  if (n >= 3 && n <= 10) return `${n} ملفات`;
  return `${n} ملفًا`;
};

export const uniqueProducts = (files: MediaFile[]) => {
  const map = new Map<string, { code: string; name: string; category: Category; count: number }>();
  for (const f of files) {
    const p = map.get(f.productCode);
    if (p) p.count += 1;
    else map.set(f.productCode, { code: f.productCode, name: f.productName, category: f.category, count: 1 });
  }
  return [...map.values()];
};

export const filesOfProduct = (files: MediaFile[], code: string) =>
  files.filter((f) => f.productCode === code);
