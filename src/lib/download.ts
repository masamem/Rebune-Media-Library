import type { MediaFile } from "../data/media";

/** Suggests a safe download filename from a media entry. */
export function fileNameFor(file: MediaFile): string {
  const base = `${file.productCode}_${file.id}`;
  const urlExt = file.downloadUrl.split("?")[0].split(".").pop()?.toLowerCase();
  const fallback = file.fileType === "video" ? "mp4" : file.fileType === "pdf" ? "pdf" : "png";
  const ext = urlExt && /^[a-z0-9]{2,4}$/.test(urlExt) ? urlExt : fallback;
  return `${base}.${ext}`;
}

/**
 * Downloads a file. Same-origin assets are fetched as blobs so the browser
 * saves them directly; cross-origin files that block CORS gracefully fall
 * back to opening in a new tab (later replaced by Google Drive links).
 */
export async function downloadFile(url: string, filename: string): Promise<"saved" | "opened"> {
  // روابط Google Drive تُفتح مباشرة — المتصفح يتولى التحميل منها
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

/** Sequentially downloads a batch (used by "تحميل الكل"). */
export async function downloadAll(
  files: MediaFile[],
  onProgress?: (done: number, total: number, current: MediaFile) => void,
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    onProgress?.(i, files.length, files[i]);
    await downloadMedia(files[i]);
    // small pause so mobile browsers don't swallow consecutive downloads
    await new Promise((r) => window.setTimeout(r, 900));
  }
  onProgress?.(files.length, files.length, files[files.length - 1]);
}
