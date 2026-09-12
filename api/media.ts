/**
 * /api/media — Vercel Serverless Function
 * -----------------------------------------------------------
 *
 * Google Drive structure:
 *
 * rebune-media-library
 * ├── تجميلي
 * │   └── RE-2211
 * │       ├── فيديوهات
 * │       ├── تصاميم
 * │       └── 3D
 * └── منزلي
 *     └── RE-1-102
 *         ├── فيديوهات
 *         ├── تصاميم
 *         └── 3D
 *
 * Rules:
 * - productCode comes from the product folder name.
 * - files are read only from فيديوهات / تصاميم / 3D.
 * - product image folders are ignored.
 * - 3D accepts GLB / GLTF only.
 *
 * GOOGLE_SERVICE_ACCOUNT_EMAIL
 * GOOGLE_PRIVATE_KEY
 * GOOGLE_DRIVE_FOLDER_ID
 * are server-side only.
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

const MODEL_FOLDER_NAMES = new Set([
  "3d",
  "نماذج ثلاثية الأبعاد",
  "ثلاثي الأبعاد",
  "models",
  "model",
]);

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

type MediaSection = "فيديوهات" | "تصاميم" | "3D";

interface QueueItem {
  id: string;
  depth: number;
  category: string;
  productCode: string;
  mediaSection: MediaSection | null;
}

function categoryOf(name: string): string {
  const value = name.trim();

  return (
    CATEGORY_MAP[value] ??
    CATEGORY_MAP[value.toLowerCase()] ??
    value
  );
}

function sectionOf(name: string): MediaSection | null {
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

  if (
    MODEL_FOLDER_NAMES.has(value) ||
    MODEL_FOLDER_NAMES.has(lower)
  ) {
    return "3D";
  }

  return null;
}

function isIgnoredFolder(name: string): boolean {
  const value = name.trim();

  return (
    IGNORED_FOLDER_NAMES.has(value) ||
    IGNORED_FOLDER_NAMES.has(value.toLowerCase())
  );
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
     * Tree traversal:
     *
     * depth 0 = root
     * depth 1 = category
     * depth 2 = product
     * depth 3 = media section
     */
    const queue: QueueItem[] = [
      {
        id: rootId,
        depth: 0,
        category: "",
        productCode: "",
        mediaSection: null,
      },
    ];

    const visited = new Set<string>([rootId]);

    const files: Record<string, unknown>[] = [];

    for (let index = 0; index < queue.length; index++) {
      const folder = queue[index];

      let pageToken: string | undefined =
        undefined;

      do {
        const page: any = await drive.files.list({
          q: `'${esc(folder.id)}' in parents and trashed = false`,

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

          /*
           * Folder
           */
          if (file.mimeType === FOLDER_MIME) {
            if (visited.has(file.id)) {
              continue;
            }

            visited.add(file.id);

            if (isIgnoredFolder(file.name)) {
              continue;
            }

            /*
             * Root -> category
             */
            if (folder.depth === 0) {
              queue.push({
                id: file.id,
                depth: 1,
                category: categoryOf(file.name),
                productCode: "",
                mediaSection: null,
              });

              continue;
            }

            /*
             * Category -> product
             */
            if (folder.depth === 1) {
              queue.push({
                id: file.id,
                depth: 2,
                category: folder.category,
                productCode: file.name.trim(),
                mediaSection: null,
              });

              continue;
            }

            /*
             * Product -> media section
             */
            if (folder.depth === 2) {
              const section =
                sectionOf(file.name);

              if (!section) {
                continue;
              }

              queue.push({
                id: file.id,
                depth: 3,
                category: folder.category,
                productCode: folder.productCode,
                mediaSection: section,
              });

              continue;
            }

            /*
             * Do not scan deeper than section level.
             */
            continue;
          }

          /*
           * Files are accepted only inside:
           * product -> فيديوهات / تصاميم / 3D
           */
          if (
            folder.depth !== 3 ||
            !folder.mediaSection ||
            !folder.productCode
          ) {
            continue;
          }

          const extension = file.name.includes(".")
            ? (
                file.name.split(".").pop() ?? ""
              ).toLowerCase()
            : "";

          let fileType:
            | "video"
            | "design"
            | "3d";

          if (folder.mediaSection === "3D") {
            /*
             * Only GLB / GLTF models.
             */
            if (
              extension !== "glb" &&
              extension !== "gltf"
            ) {
              continue;
            }

            fileType = "3d";
          } else if (
            folder.mediaSection === "فيديوهات"
          ) {
            fileType = "video";
          } else {
            fileType = "design";
          }

          const isPdf =
            extension === "pdf" ||
            file.mimeType === "application/pdf";

          const thumbnailUrl =
            `https://drive.google.com/thumbnail?id=${file.id}&sz=w1000`;

          /*
           * Proxy Drive through our own API.
           * This avoids depending on public Drive sharing.
           */
          const previewUrl =
            `/api/file?id=${file.id}`;

          const downloadUrl =
            `/api/file?id=${file.id}`;

          const version =
            encodeURIComponent(
              file.modifiedTime ?? ""
            );

          const modelUrl =
            fileType === "3d"
              ? `/api/file?id=${file.id}&v=${version}`
              : undefined;

          files.push({
            id: file.id,
            name: file.name,

            extension,
            mimeType: file.mimeType ?? "",

            size: formatSize(file.size),

            modifiedTime:
              file.modifiedTime ?? "",

            productCode:
              folder.productCode,

            category:
              folder.category || "عام",

            mediaSection:
              folder.mediaSection,

            fileType,

            folderName:
              folder.mediaSection,

            thumbnailUrl,
            previewUrl,
            downloadUrl,
            modelUrl,

            isPdf,
          });
        }

        pageToken =
          page.data.nextPageToken ??
          undefined;
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
