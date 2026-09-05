/**
 * /api/media — Vercel Serverless Function (Server-side only)
 * -----------------------------------------------------------
 * يقرأ مكتبة Google Drive منظمة بهذا الشكل:
 *
 *   rebune-media-library
 *   ├── تجميلي
 *   │   └── RE-2211
 *   │       ├── فيديوهات
 *   │       └── تصاميم
 *   └── منزلي
 *       └── RE-1-102
 *           ├── فيديوهات
 *           └── تصاميم
 *
 * القواعد:
 *  - يُهمل تمامًا أي مجلد باسم «صور» (أو مرادفاته) وكل ما بداخله.
 *  - تُعاد فقط الملفات داخل مجلدات «فيديوهات» أو «تصاميم».
 *  - JPG/PNG/PDF داخل «تصاميم» تُعدّ تصميمًا (Design) وليست صورة منتج.
 *  - productCode يؤخذ من اسم مجلد المنتج مباشرة (لا استخراج من اسم الملف).
 *
 * الأمان: GOOGLE_SERVICE_ACCOUNT_EMAIL و GOOGLE_PRIVATE_KEY يُقرأان هنا فقط
 * على الخادم ولا يصلان أبدًا إلى المتصفح.
 */
import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const FIELDS =
  "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, thumbnailLink, webViewLink, webContentLink)";

/* ------------------------------------------------------------------ */
/*  تسمية المجلدات                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_MAP: Record<string, string> = {
  "تجميلي": "تجميلي",
  "تجميل": "تجميلي",
  beauty: "تجميلي",
  "منزلي": "منزلي",
  home: "منزلي",
};

const VIDEOS_NAMES = new Set(["فيديوهات", "فيديو", "videos", "video"]);
const DESIGNS_NAMES = new Set(["تصاميم", "تصميم", "designs", "design"]);

/** مجلدات تُهمل نهائيًا — صور المنتجات موجودة في rebune.com */
const IGNORED_FOLDER_NAMES = new Set([
  "صور",
  "صورة",
  "صور المنتج",
  "صور منتجات",
  "images",
  "image",
  "photos",
  "photo",
  "product images",
  "product photos",
]);

function categoryOf(name: string): string {
  const t = name.trim();
  return CATEGORY_MAP[t] ?? CATEGORY_MAP[t.toLowerCase()] ?? t;
}

/** يعيد القسم الموحد («فيديوهات» أو «تصاميم») أو null لمجلد غير معروف */
function sectionOf(name: string): "فيديوهات" | "تصاميم" | null {
  const t = name.trim();
  const l = t.toLowerCase();
  if (VIDEOS_NAMES.has(t) || VIDEOS_NAMES.has(l)) return "فيديوهات";
  if (DESIGNS_NAMES.has(t) || DESIGNS_NAMES.has(l)) return "تصاميم";
  return null;
}

function isIgnoredFolder(name: string): boolean {
  const t = name.trim();
  return IGNORED_FOLDER_NAMES.has(t) || IGNORED_FOLDER_NAMES.has(t.toLowerCase());
}

/* ------------------------------------------------------------------ */
/*  أدوات مساعدة                                                       */
/* ------------------------------------------------------------------ */

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

/** عنصر في طابور الاجتياز — يحمل موقع المجلد داخل شجرة المكتبة */
interface QueueItem {
  id: string;
  /** 0 = الجذر · 1 = تصنيف · 2 = منتج · 3 = قسم (فيديوهات/تصاميم) */
  depth: number;
  category: string;
  productCode: string;
  mediaSection: "فيديوهات" | "تصاميم" | null;
}

/* ------------------------------------------------------------------ */

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

    // اجتياز متكرر (BFS) للشجرة: تصنيف ← منتج ← قسم ← ملف
    const queue: QueueItem[] = [
      { id: rootId, depth: 0, category: "", productCode: "", mediaSection: null },
    ];
    const visited = new Set<string>([rootId]);
    const files: Record<string, unknown>[] = [];

    while (queue.length) {
      const folder = queue.shift()!;
      let pageToken: string | undefined = undefined;

      do {
        const page: any = await drive.files.list({
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

          if (f.mimeType === FOLDER_MIME) {
            if (visited.has(f.id)) continue;
            // تجاهل تام لمجلدات الصور وكل ما بداخلها
            if (isIgnoredFolder(f.name)) {
              visited.add(f.id);
              continue;
            }

            if (folder.depth === 0) {
              // مستوى التصنيف (تجميلي / منزلي …)
              visited.add(f.id);
              queue.push({
                id: f.id,
                depth: 1,
                category: categoryOf(f.name),
                productCode: "",
                mediaSection: null,
              });
            } else if (folder.depth === 1) {
              // مستوى المنتج — رقم الموديل من اسم المجلد مباشرة
              visited.add(f.id);
              queue.push({
                id: f.id,
                depth: 2,
                category: folder.category,
                productCode: f.name.trim(),
                mediaSection: null,
              });
            } else if (folder.depth === 2) {
              // مستوى القسم — نقبل «فيديوهات» و«تصاميم» فقط
              const section = sectionOf(f.name);
              if (!section) {
                visited.add(f.id);
                continue;
              }
              visited.add(f.id);
              queue.push({
                id: f.id,
                depth: 3,
                category: folder.category,
                productCode: folder.productCode,
                mediaSection: section,
              });
            }
            // أي عمق أكبر — لا نلتقط منه ملفات
            continue;
          }

          // ملف — نقبله فقط داخل قسم «فيديوهات» أو «تصاميم»
          if (folder.depth !== 3 || !folder.mediaSection || !folder.productCode) continue;

          const extension = f.name.includes(".") ? (f.name.split(".").pop() ?? "").toLowerCase() : "";
          const fileType: "video" | "design" = folder.mediaSection === "فيديوهات" ? "video" : "design";
          const isPdf = extension === "pdf" || f.mimeType === "application/pdf";

          const thumbnailUrl = `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`;
          const previewUrl =
            fileType === "video" || isPdf
              ? `https://drive.google.com/file/d/${f.id}/preview`
              : `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`;

          files.push({
            id: f.id,
            name: f.name,
            extension,
            mimeType: f.mimeType ?? "",
            size: formatSize(f.size),
            modifiedTime: f.modifiedTime ?? "",
            productCode: folder.productCode,
            category: folder.category || "عام",
            mediaSection: folder.mediaSection,
            fileType,
            thumbnailUrl,
            previewUrl,
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
