/**
 * Rebune Media Library — data layer
 * ---------------------------------
 * المكتبة خاصة بالفيديوهات والتصاميم فقط (صور المنتجات في rebune.com).
 * كل البيانات تأتي من /api/media (Google Drive) — لا توجد بيانات ثابتة هنا.
 */

/** القسم داخل مجلد المنتج في Drive */
export type MediaSection = "فيديوهات" | "تصاميم";
/** نوع الملف المعروض في المكتبة */
export type FileType = "video" | "design";
/** أقسام التنقل الرئيسية */
export type Section = "all" | "videos" | "designs" | "latest";

export interface MediaFile {
  id: string;
  /** من اسم مجلد المنتج في Drive مباشرة (RE-2211 / RE-1-102 …) */
  productCode: string;
  /** تجميلي / منزلي — من مجلد التصنيف */
  category: string;
  mediaSection: MediaSection;
  fileType: FileType;
  /** اسم الملف كما هو في Drive */
  name: string;
  size: string;
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;
  /** ISO datetime */
  modifiedTime: string;
  extension?: string;
}

/* --------------------- عناصر بصرية ثابتة للموقع --------------------- */
/* رسومات الموقع نفسه (ليست بيانات مكتبة) */
export const FEATURED = {
  heroMain: "/media/beauty-life.svg",
  heroSmall1: "/media/promo.svg",
  heroSmall2: "/media/kitchen-life.svg",
  videosCard: "/media/kitchen-life.svg",
  designsCard: "/media/promo.svg",
};

/* ------------------------------- selectors ------------------------------- */

export const TYPE_LABEL: Record<FileType, string> = {
  video: "فيديو",
  design: "تصميم",
};

export const SECTION_LABEL: Record<Section, string> = {
  all: "كل الملفات",
  videos: "الفيديوهات",
  designs: "التصاميم",
  latest: "أحدث الملفات",
};

export const normalize = (s: string) =>
  s.toLowerCase().replace(/[\s\-_.·]/g, "").replace(/[أإآ]/g, "ا");

/** البحث: رقم المنتج، اسم الملف، التصنيف، القسم */
export function matchesQuery(file: MediaFile, query: string): boolean {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(file.productCode).includes(q) ||
    normalize(file.name).includes(q) ||
    normalize(file.category).includes(q) ||
    normalize(file.mediaSection).includes(q) ||
    normalize(file.extension ?? "").includes(q)
  );
}

/**
 * الفلترة الموحدة — chip واحدة نشطة:
 *  "all" | "video" | "design" | <اسم تصنيف مثل "تجميلي">
 */
export function filterFiles(
  files: MediaFile[],
  opts: { section: Section; filter: string; query: string },
): MediaFile[] {
  let list = files;

  if (opts.section === "videos") list = list.filter((f) => f.fileType === "video");
  else if (opts.section === "designs") list = list.filter((f) => f.fileType === "design");
  else if (opts.section === "latest") list = list.slice(0, 8);

  if (opts.filter === "video") list = list.filter((f) => f.fileType === "video");
  else if (opts.filter === "design") list = list.filter((f) => f.fileType === "design");
  else if (opts.filter !== "all") list = list.filter((f) => f.category === opts.filter);

  if (opts.query.trim()) list = list.filter((f) => matchesQuery(f, opts.query));
  return list;
}

/** التصنيفات الموجودة فعليًا في البيانات (تجميلي / منزلي …) */
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
  category: string;
  files: MediaFile[];
}

export function groupByProduct(files: MediaFile[]): ProductGroup[] {
  const map = new Map<string, ProductGroup>();
  for (const f of files) {
    const g = map.get(f.productCode);
    if (g) g.files.push(f);
    else map.set(f.productCode, { code: f.productCode, category: f.category, files: [f] });
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
