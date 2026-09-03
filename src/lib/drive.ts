/**
 * طبقة الربط مع Google Drive (عبر /api/media — الخادم فقط)
 * -------------------------------------------------------
 * الواجهة لا تتحدث مع Google مباشرة أبدًا، ولا ترى أي مفاتيح؛
 * كل ما يصلها هو JSON جاهز من الـ Serverless Function.
 */
import { MEDIA_FILES, type MediaFile } from "../data/media";

/** شكل العنصر القادم من /api/media */
export interface DriveItem {
  id: string;
  name: string;
  mimeType: string;
  extension: string;
  size: string;
  modifiedTime: string;
  folderName: string;
  parentFolder: string;
  category: string;
  fileType: "video" | "image" | "pdf" | "other";
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;
}

const PLACEHOLDER = "/media/placeholder.svg";

/** أسماء المنتجات المعروفة — لإعادة استخدام الأسماء العربية مع نفس أرقام الموديلات */
const PRODUCT_NAMES: Record<string, string> = {};
for (const f of MEDIA_FILES) PRODUCT_NAMES[f.productCode] = f.productName;

/** استخراج رقم الموديل من اسم الملف: RE-2211.mp4 → RE-2211 */
const CODE_RE = /re-?\d[\d-]*/i;

export async function fetchDriveMedia(signal?: AbortSignal): Promise<DriveItem[]> {
  const res = await fetch("/api/media", { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`media API responded with ${res.status}`);
  const data: { files?: DriveItem[] } = await res.json();
  if (!data || !Array.isArray(data.files)) throw new Error("unexpected media API payload");
  return data.files;
}

/** تحويل عنصر Drive إلى MediaFile المستخدم في كل الواجهة */
export function toMediaFile(item: DriveItem): MediaFile {
  const base = item.name.replace(/\.[^.]+$/, "").trim() || item.name;
  const codeMatch = item.name.match(CODE_RE);
  const productCode = codeMatch ? codeMatch[0].toUpperCase() : item.folderName.trim() || base;
  const productName = PRODUCT_NAMES[productCode] ?? (codeMatch ? `منتج ${productCode}` : base);
  const isDesign =
    item.category === "تصاميم" || /social|تصميم|design|post|story|reel/i.test(item.name);

  return {
    id: item.id,
    productCode,
    productName,
    fileName: base,
    category: item.category || "عام",
    fileType: item.fileType,
    extension: item.extension || undefined,
    folderName: item.folderName || undefined,
    thumbnail: item.thumbnailUrl || PLACEHOLDER,
    previewUrl: item.previewUrl,
    downloadUrl: item.downloadUrl,
    size: item.size || "—",
    date: item.modifiedTime || new Date().toISOString(),
    tags: isDesign ? ["design"] : undefined,
  };
}
