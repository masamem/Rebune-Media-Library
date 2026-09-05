import type { MediaFile } from "../data/media";

/** اسم ملف مناسب للتحميل، بامتداده الحقيقي إن توفر */
export function fileNameFor(file: MediaFile): string {
  const ext = file.extension || (file.fileType === "video" ? "mp4" : "png");
  const base = `${file.productCode}_${file.id}`;
  return `${base}.${ext}`;
}

/**
 * التحميل:
 *  - روابط Google Drive لا تدعم CORS للمتصفح، لذا تُفتح مباشرة في تبويب
 *    جديد ويتولى المتصفح/Drive إتمام التنزيل (بدون تسجيل دخول عند مشاركة
 *    الملف عبر الرابط).
 *  - الملفات المحلية (نفس النطاق) تُحمَّل كـ blob مباشرة.
 */
export async function downloadFile(url: string, filename: string): Promise<"saved" | "opened"> {
  if (/drive\.google\.com/.test(url)) {
    window.open(url, "_blank", "noopener");
    return "opened";
  }
  try {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 5000);
    return "saved";
  } catch {
    window.open(url, "_blank", "noopener");
    return "opened";
  }
}

export async function downloadMedia(file: MediaFile): Promise<"saved" | "opened"> {
  return downloadFile(file.downloadUrl, fileNameFor(file));
}

/** تحميل مجموعة ملفات تباعًا — يستخدمه زر «تحميل الكل» */
export async function downloadAll(
  files: MediaFile[],
  onProgress?: (done: number, total: number, current: MediaFile) => void,
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length, files[i]);
    await downloadMedia(files[i]);
    // مهلة صغيرة حتى لا تبتلع متصفحات الجوال تحميلات متتالية
    await new Promise((r) => window.setTimeout(r, 900));
  }
  onProgress?.(files.length, files.length, files[files.length - 1]);
}
