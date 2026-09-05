/**
 * /api/media — Vercel Serverless Function
 *
 * Google Drive structure:
 *
 * rebune-media-library
 * ├── تجميلي
 * │   ├── فيديوهات
 * │   └── تصاميم
 * └── منزلي
 *     ├── فيديوهات
 *     └── تصاميم
 *
 * Product code is extracted from the file name.
 *
 * Examples:
 * RE-2211-video-01.mp4  -> RE-2211
 * RE-2211-design-01.jpg -> RE-2211
 * RE-3312-catalog.pdf   -> RE-3312
 */

import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const FIELDS =
  "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, thumbnailLink, webViewLink, webContentLink)";

const CATEGORY_MAP: Record<string, string> = {
  "تجميلي": "تجميلي",
  "تجميل": "تجميلي",
  beauty: "تجميلي",

  "منزلي": "منزلي",
  home: "منزلي",
};

const VIDEO_FOLDER_NAMES = new Set([
  "فيديوهات",
  "فيديو",
  "videos",
  "video",
]);

const DESIGN_FOLDER_NAMES = new Set([
  "تصاميم",
  "تصميم",
  "designs",
  "design",
]);

function categoryOf(name: string): string {
  const value = name.trim();

  return (
    CATEGORY_MAP[value] ??
    CATEGORY_MAP[value.toLowerCase()] ??
    value
  );
}

function sectionOf(
  name: string
): "فيديوهات" | "تصاميم" | null {
  const value = name.trim();
  const lower = value.toLowerCase();

  if (
    VIDEO_FOLDER_NAMES.has(value) ||
    VIDEO_FOLDER_NAMES.has(lower)
  ) {
    return "فيديوهات";
  }

  if (
    DESIGN_FOLDER_NAMES.has(value) ||
    DESIGN_FOLDER_NAMES.has(lower)
  ) {
    return "تصاميم";
  }

  return null;
}

/**
 * Extract product code from filename.
 *
 * Examples:
 * RE-2211-video-01.mp4  -> RE-2211
 * RE-1-102-video-01.mp4 -> RE-1-102
 * RE-3312-catalog.pdf   -> RE-3312
 */
function extractProductCode(fileName: string): string {
  const name = fileName.trim();

  const match = name.match(
    /^(RE-\d+(?:-\d+)*)(?:-|_|\.|$)/i
  );

  return match ? match[1].toUpperCase() : "";
}

function formatSize(bytes?: string | null): string {
  const b = Number(bytes ?? 0);

  if (!Number.isFinite(b) || b <= 0) {
    return "—";
  }

  if (b < 1024) {
    return `${b} B`;
  }

  if (b < 1024 ** 2) {
    return `${Math.round(b / 1024)} KB`;
  }

  if (b < 1024 ** 3) {
    return `${(b / 1024 ** 2).toFixed(1)} MB`;
  }

  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function esc(id: string): string {
  return id
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'");
}

interface CategoryFolder {
  id: string;
  category: string;
}

interface MediaFolder {
  id: string;
  category: string;
  mediaSection: "فيديوهات" | "تصاميم";
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return res.status(405).json({
      source: "error",
      error: "method_not_allowed",
    });
  }

  const email =
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  const rawKey =
    process.env.GOOGLE_PRIVATE_KEY;

  const rootId =
    process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!email || !rawKey || !rootId) {
    return res.status(500).json({
      source: "error",
      error: "missing_credentials",
    });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, "\n"),
      scopes: [
        "https://www.googleapis.com/auth/drive.readonly",
      ],
    });

    const drive = google.drive({
      version: "v3",
      auth,
    });

    /*
     * STEP 1
     * Read category folders:
     *
     * rebune-media-library
     * ├── تجميلي
     * └── منزلي
     */

    const categoryFolders: CategoryFolder[] = [];

    let categoryPageToken: string | undefined =
      undefined;

    do {
      const page: any = await drive.files.list({
        q: `'${esc(
          rootId
        )}' in parents and trashed = false and mimeType = '${FOLDER_MIME}'`,

        fields: FIELDS,
        pageSize: 1000,
        pageToken: categoryPageToken,

        supportsAllDrives: true,
        includeItemsFromAllDrives: true,

        orderBy: "name",
      });

      for (const folder of page.data.files ?? []) {
        if (!folder.id || !folder.name) {
          continue;
        }

        categoryFolders.push({
          id: folder.id,
          category: categoryOf(folder.name),
        });
      }

      categoryPageToken =
        page.data.nextPageToken ?? undefined;
    } while (categoryPageToken);

    /*
     * STEP 2
     * Find فيديوهات / تصاميم
     * inside each category.
     */

    const mediaFolders: MediaFolder[] = [];

    for (const categoryFolder of categoryFolders) {
      let pageToken: string | undefined =
        undefined;

      do {
        const page: any = await drive.files.list({
          q: `'${esc(
            categoryFolder.id
          )}' in parents and trashed = false and mimeType = '${FOLDER_MIME}'`,

          fields: FIELDS,
          pageSize: 1000,
          pageToken,

          supportsAllDrives: true,
          includeItemsFromAllDrives: true,

          orderBy: "name",
        });

        for (const folder of page.data.files ?? []) {
          if (!folder.id || !folder.name) {
            continue;
          }

          const mediaSection =
            sectionOf(folder.name);

          if (!mediaSection) {
            continue;
          }

          mediaFolders.push({
            id: folder.id,
            category: categoryFolder.category,
            mediaSection,
          });
        }

        pageToken =
          page.data.nextPageToken ?? undefined;
      } while (pageToken);
    }

    /*
     * STEP 3
     * Read files from فيديوهات / تصاميم
     */

    const files: Record<string, unknown>[] = [];

    for (const mediaFolder of mediaFolders) {
      let pageToken: string | undefined =
        undefined;

      do {
        const page: any = await drive.files.list({
          q: `'${esc(
            mediaFolder.id
          )}' in parents and trashed = false and mimeType != '${FOLDER_MIME}'`,

          fields: FIELDS,
          pageSize: 1000,
          pageToken,

          supportsAllDrives: true,
          includeItemsFromAllDrives: true,

          orderBy: "name",
        });

        for (const file of page.data.files ?? []) {
          if (!file.id || !file.name) {
            continue;
          }

          const productCode =
            extractProductCode(file.name);

          /*
           * Ignore files without a valid product code.
           */
          if (!productCode) {
            console.warn(
              `[media] Product code not found: ${file.name}`
            );

            continue;
          }

          const extension = file.name.includes(".")
            ? (
                file.name.split(".").pop() ?? ""
              ).toLowerCase()
            : "";

          const fileType: "video" | "design" =
            mediaFolder.mediaSection ===
            "فيديوهات"
              ? "video"
              : "design";

          const isPdf =
            extension === "pdf" ||
            file.mimeType === "application/pdf";

          const thumbnailUrl =
            `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;

          const previewUrl =
            fileType === "video" || isPdf
              ? `https://drive.google.com/file/d/${file.id}/preview`
              : `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600`;

          const downloadUrl =
            file.webContentLink ??
            `https://drive.google.com/uc?export=download&id=${file.id}`;

          files.push({
            id: file.id,
            name: file.name,

            extension,
            mimeType: file.mimeType ?? "",

            size: formatSize(file.size),
            modifiedTime:
              file.modifiedTime ?? "",

            productCode,

            category:
              mediaFolder.category || "عام",

            mediaSection:
              mediaFolder.mediaSection,

            fileType,

            thumbnailUrl,
            previewUrl,
            downloadUrl,
          });
        }

        pageToken =
          page.data.nextPageToken ?? undefined;
      } while (pageToken);
    }

    res.setHeader(
      "Cache-Control",
      "s-maxage=120, stale-while-revalidate=600"
    );

    return res.status(200).json({
      source: "drive",
      updatedAt: new Date().toISOString(),
      files,
    });
  } catch (err) {
    console.error("[/api/media]", err);

    return res.status(500).json({
      source: "error",
      error: "drive_fetch_failed",
    });
  }
}
