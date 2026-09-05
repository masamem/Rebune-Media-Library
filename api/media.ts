import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const FOLDER_MIME = "application/vnd.google-apps.folder";

const FIELDS =
  "nextPageToken, files(id, name, mimeType, size, modifiedTime, parents, thumbnailLink, webViewLink, webContentLink)";

function esc(id: string): string {
  return id.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function formatSize(bytes?: string | null): string {
  const b = Number(bytes ?? 0);
  if (!Number.isFinite(b) || b <= 0) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 ** 2) return `${Math.round(b / 1024)} KB`;
  if (b < 1024 ** 3) return `${(b / 1024 ** 2).toFixed(1)} MB`;
  return `${(b / 1024 ** 3).toFixed(2)} GB`;
}

function kindOf(mimeType: string) {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType === "application/pdf") return "pdf";
  return "other";
}

interface QueueItem {
  id: string;
  name: string;
  path: string;
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

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const rootId = process.env.GOOGLE_DRIVE_FOLDER_ID;

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
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({
      version: "v3",
      auth,
    });

    const rootFolder = await drive.files.get({
      fileId: rootId,
      fields: "id,name,mimeType,parents,driveId",
      supportsAllDrives: true,
    });

    const queue: QueueItem[] = [
      {
        id: rootId,
        name: "",
        path: "",
      },
    ];

    const visited = new Set<string>([rootId]);
    const files: Record<string, unknown>[] = [];
    const debugItems: Record<string, unknown>[] = [];

    while (queue.length > 0) {
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
          orderBy: "folder,name",
        });

        for (const f of page.data.files ?? []) {
          debugItems.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType,
            parents: f.parents,
            currentFolder: folder.name || "ROOT",
            currentFolderPath: folder.path || "ROOT",
            currentFolderId: folder.id,
          });

          if (!f.id || !f.name) continue;

          if (f.mimeType === FOLDER_MIME) {
            if (!visited.has(f.id)) {
              visited.add(f.id);

              queue.push({
                id: f.id,
                name: f.name,
                path: folder.path
                  ? `${folder.path} / ${f.name}`
                  : f.name,
              });
            }

            continue;
          }

          const extension = f.name.includes(".")
            ? (f.name.split(".").pop() ?? "").toLowerCase()
            : "";

          const kind = kindOf(f.mimeType ?? "");

          const thumb =
            `https://drive.google.com/thumbnail?id=${f.id}&sz=w1000`;

          files.push({
            id: f.id,
            name: f.name,
            mimeType: f.mimeType ?? "",
            extension,
            size: formatSize(f.size),
            modifiedTime: f.modifiedTime ?? "",

            folderName: folder.name,
            parentFolder: folder.path,

            fileType: kind,

            thumbnailUrl:
              kind === "image" || kind === "video"
                ? thumb
                : f.thumbnailLink ?? "",

            previewUrl:
              kind === "video" || kind === "pdf"
                ? `https://drive.google.com/file/d/${f.id}/preview`
                : kind === "image"
                  ? `https://drive.google.com/thumbnail?id=${f.id}&sz=w1600`
                  : f.webViewLink ?? "",

            downloadUrl:
              f.webContentLink ??
              `https://drive.google.com/uc?export=download&id=${f.id}`,
          });
        }

        pageToken = page.data.nextPageToken ?? undefined;
      } while (pageToken);
    }

    res.setHeader(
      "Cache-Control",
      "no-store"
    );

    return res.status(200).json({
      source: "drive",
      updatedAt: new Date().toISOString(),
      rootFolder: rootFolder.data,
      debugItems,
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
