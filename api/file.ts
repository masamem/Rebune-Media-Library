import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

function getSingleHeader(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function normalizeRange(range: string, size: number): string | null {
  if (!range || !Number.isFinite(size) || size <= 0) return null;

  // Browsers normally send a single byte range for HTML5 video.
  const match = /^bytes=(\d*)-(\d*)$/i.exec(range.trim());
  if (!match) return null;

  const startRaw = match[1];
  const endRaw = match[2];

  let start: number;
  let end: number;

  if (!startRaw && endRaw) {
    // Suffix range: bytes=-500
    const suffixLength = Number(endRaw);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return null;
    start = Math.max(0, size - suffixLength);
    end = size - 1;
  } else {
    start = Number(startRaw);
    if (!Number.isFinite(start) || start < 0 || start >= size) return null;

    end = endRaw ? Number(endRaw) : size - 1;
    if (!Number.isFinite(end) || end < start) return null;
    end = Math.min(end, size - 1);
  }

  return `bytes=${start}-${end}`;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const fileId = String(req.query.id || "");

  if (!fileId) {
    return res.status(400).json({ error: "missing_file_id" });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    return res.status(500).json({ error: "missing_credentials" });
  }

  try {
    const auth = new google.auth.JWT({
      email,
      key: rawKey.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    const meta = await drive.files.get({
      fileId,
      fields: "name,mimeType,size,modifiedTime",
      supportsAllDrives: true,
    });

    const fileName = meta.data.name || "file";
    const extension = fileName.includes(".")
      ? (fileName.split(".").pop() || "").toLowerCase()
      : "";

    const contentType =
      extension === "glb"
        ? "model/gltf-binary"
        : extension === "gltf"
          ? "model/gltf+json"
          : meta.data.mimeType || "application/octet-stream";

    const totalSize = Number(meta.data.size || 0);
    const requestedRange = getSingleHeader(req.headers.range);
    const normalizedRange = normalizeRange(requestedRange, totalSize);

    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Accept-Ranges", "bytes");
    res.setHeader(
      "Content-Disposition",
      `inline; filename*=UTF-8''${encodeURIComponent(fileName)}`
    );

    // The media URL includes ?v=<Drive modifiedTime>, so immutable caching is safe.
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    if (requestedRange && !normalizedRange) {
      if (totalSize > 0) {
        res.setHeader("Content-Range", `bytes */${totalSize}`);
      }
      return res.status(416).end();
    }

    if (req.method === "HEAD") {
      if (totalSize > 0) res.setHeader("Content-Length", String(totalSize));
      return res.status(200).end();
    }

    const driveResponse = await drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
        headers: normalizedRange ? { Range: normalizedRange } : undefined,
      }
    );

    if (normalizedRange) {
      const contentRange = driveResponse.headers["content-range"];
      const contentLength = driveResponse.headers["content-length"];

      if (contentRange) {
        res.setHeader("Content-Range", String(contentRange));
      } else {
        // Fallback in case the upstream omits it for any reason.
        const match = /^bytes=(\d+)-(\d+)$/.exec(normalizedRange);
        if (match && totalSize > 0) {
          res.setHeader(
            "Content-Range",
            `bytes ${match[1]}-${match[2]}/${totalSize}`
          );
        }
      }

      if (contentLength) {
        res.setHeader("Content-Length", String(contentLength));
      } else {
        const match = /^bytes=(\d+)-(\d+)$/.exec(normalizedRange);
        if (match) {
          const length = Number(match[2]) - Number(match[1]) + 1;
          res.setHeader("Content-Length", String(length));
        }
      }

      res.status(206);
    } else {
      const contentLength = driveResponse.headers["content-length"];
      if (contentLength) {
        res.setHeader("Content-Length", String(contentLength));
      } else if (totalSize > 0) {
        res.setHeader("Content-Length", String(totalSize));
      }
      res.status(200);
    }

    driveResponse.data.on("error", (streamError) => {
      console.error("[/api/file] stream error", streamError);
      if (!res.headersSent) {
        res.status(502).end();
      } else {
        res.end();
      }
    });

    driveResponse.data.pipe(res);
  } catch (error) {
    console.error("[/api/file]", error);

    if (!res.headersSent) {
      return res.status(500).json({ error: "file_fetch_failed" });
    }

    return res.end();
  }
}
