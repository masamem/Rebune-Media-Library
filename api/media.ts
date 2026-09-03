/**
 * /api/media — Vercel Serverless Function (Server-side only)
 * -----------------------------------------------------------
 * يقرأ جميع ملفات مجلد Google Drive (بشكل متكرر Recursively مع Pagination)
 * ويعيدها كبيانات منظمة للواجهة.
 *
 * الأمان: GOOGLE_SERVICE_ACCOUNT_EMAIL و GOOGLE_PRIVATE_KEY يُقرأان هنا فقط
 * على الخادم، ولا يصلان أبدًا إلى المتصفح.
 */
import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const FIELDS =
  "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, thumbnailLink, webViewLink, webContentLink)";

/** خريطة أسماء المجلدات → التصنيفات المعروفة (عربي / إنجليزي) */
const FOLDER_CATEGORY_MAP: Record<string, string> = {
  "تجميل": "تجميل",
  beauty: "تجميل",
  "منزلي": "منزلي",
  home: "منزلي",
  "تصاميم": "تصاميم",
  designs: "تصاميم",
  design: "تصاميم",
  "عروض": "عروض",
  offers: "عروض",
  promo: "عروض",
  "هوية": "هوية الشركة",
  "هوية الشركة": "هوية الشركة",
  brand: "هوية الشركة",
  branding: "هوية الشركة",
  "فيديوهات": "فيديوهات",
  videos: "فيديوهات",
};

function categoryOf(folderName: string): string {
  const name = folderName.trim();
  if (!name) return "عام";
  return FOLDER_CATEGORY_MAP[name] ?? FOLDER_CATEGORY_MAP[name.toLowerCase()] ?? name;
}

type Kind = "video" | "image" | "pdf" | "other";

function kindOf(mimeType: string): Kind {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  return "other";
}

function formatSize(bytes?: string | null): string {
  const b = Number(bytes ?? 0);
  if (!Number.isFinite(b) || b <= 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${Math.round(b / 1024)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

/** حماية معرّف المجلد داخل استعلام Drive */
function esc(id: string): string {
  return id.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

interface QueueItem {
  id: string;
  name: string;
  path: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ source: "error", error: "method_not_allowed" });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!email || !rawKey || !rootId) {
    // لا نكشف أي تفاصيل عن المتغيرات — رسالة عامة فقط
    return res.status(500).json({ source: "error", error: "missing_credentials" });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    const drive = google.drive({ version: "v3", auth });

    // اجتياز متكرر (BFS) لجميع المجلدات الفرعية
    const queue: QueueItem[] = [{ id: rootId, name: "", path: "" }];
    const visited = new Set<string>([rootId]);
    const files: Record<string, unknown>[] = [];

    while (queue.length) {
      const folder = queue.shift()!;
      let pageToken: string | undefined = undefined;

      do {
        const page = await drive.files.list({
          q: `'${esc(folder.id)}' in parents and trashed = false`,
          fields: FIELDS,
          pageSize: 1000,
          pageToken,
          supportsAllDrives: true,
          includeItemsFromAllDrives: true,
          orderBy: "folder, name",
        });

        for (const f of page.data.files ?? []) {
          if (!f.id || !f.name) continue;

          // مجلد فرعي → أضفه إلى قائمة الاجتياز
          if (f.mimeType === FOLDER_MIME) {
            if (!visited.has(f.id)) {
              visited.add(f.id);
              queue.push({
                id: f.id,
                name: f.name,
                path: folder.path ? `${folder.path} / ${f.name}` : f.name,
              });
            }
            continue;
          }

          const extension = f.name.includes(".") ? (f.name.split(".").pop() ?? "").toLowerCase() : "";
          const kind = kindOf(f.mimeType ?? "");
          const thumb = `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`;

          files.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType ?? "",
            extension,
            size: formatSize(f.size),
            modifiedTime: f.modifiedTime ?? "",
            folderName: folder.name,
            parentFolder: folder.path,
            category: categoryOf(folder.name),
            fileType: kind,
            thumbnailUrl: kind === "image" || kind === "video" ? thumb : f.thumbnailLink ?? "",
            previewUrl:
              kind === "video" || kind === "pdf"
                ? `https://drive.google.com/file/d/${f.id}/preview`
                : kind === "image"
                  ? `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`
                  : f.webViewLink ?? "",
            downloadUrl: f.webContentLink ?? `https://drive.google.com/uc?export=download&id=${f.id}`,
          });
        }

        pageToken = page.data.nextPageToken ?? undefined;
      } while (pageToken);
    }

    res.setHeader("Cache-Control", "s-maxage=120, stale-while-revalidate=600");
    return res.status(200).json({
      source: "drive",
      updatedAt: new Date().toISOString(),
      files,
    });
  } catch (err) {
    console.error("[/api/media]", err);
    return res.status(500).json({ source: "error", error: "drive_fetch_failed" });
  }
}
