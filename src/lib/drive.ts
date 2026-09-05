/**
 * طبقة الربط مع Google Drive (عبر /api/media — الخادم فقط)
 * -------------------------------------------------------
 * الواجهة لا تتحدث مع Google مباشرة أبدًا، ولا ترى أي مفاتيح؛
 * كل ما يصلها هو JSON جاهز من الـ Serverless Function.
 *
 * لا توجد بيانات تجريبية — المصدر الوحيد هو /api/media.
 */
import type { MediaFile, MediaSection } from "../data/media";

/** شكل العنصر القادم من /api/media */
export interface DriveItem {
  id: string;
  name: string;
  extension?: string;
  mimeType?: string;
  size: string;
  modifiedTime?: string;
  productCode: string;
  category: string;
  mediaSection: MediaSection;
  fileType: "video" | "design";
  thumbnailUrl: string;
  previewUrl: string;
  downloadUrl: string;
}

const PLACEHOLDER = "/media/placeholder.svg";

export async function fetchMediaLibrary(signal?: AbortSignal): Promise<MediaFile[]> {
  const res = await fetch("/api/media", { signal, headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`media API responded with ${res.status}`);

  const data: { source?: string; files?: DriveItem[] } = await res.json();
  if (!data || data.source !== "drive" || !Array.isArray(data.files)) {
    throw new Error("unexpected media API payload");
  }

  const mapped: MediaFile[] = [];
  for (const item of data.files) {
    if (!item?.id || !item.productCode || !item.mediaSection || !item.fileType) continue;
    mapped.push({
      id: item.id,
      productCode: item.productCode.trim(),
      category: item.category?.trim() || "عام",
      mediaSection: item.mediaSection,
      fileType: item.fileType,
      name: (item.name || "").replace(/\.[^.]+$/, "").trim() || item.name || "ملف",
      size: item.size || "—",
      thumbnailUrl: item.thumbnailUrl || PLACEHOLDER,
      previewUrl: item.previewUrl || "",
      downloadUrl: item.downloadUrl || "",
      modifiedTime: item.modifiedTime || new Date().toISOString(),
      extension: item.extension || undefined,
    });
  }

  /* الأحدث أولًا */
  mapped.sort((a, b) => b.modifiedTime.localeCompare(a.modifiedTime));
  return mapped;
}
