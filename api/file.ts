import { google } from "googleapis";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  const fileId = String(req.query.id || "");

  if (!fileId) {
    return res.status(400).json({
      error: "missing_file_id",
    });
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    return res.status(500).json({
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

    const meta = await drive.files.get({
      fileId,
      fields: "name,mimeType,size",
      supportsAllDrives: true,
    });

    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
        supportsAllDrives: true,
      },
      {
        responseType: "stream",
      }
    );

    res.setHeader(
      "Content-Type",
      meta.data.mimeType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename*=UTF-8''${encodeURIComponent(
        meta.data.name || "file"
      )}`
    );

    res.setHeader("Cache-Control", "private, max-age=3600");

    response.data.pipe(res);
  } catch (error) {
    console.error("[/api/file]", error);

    return res.status(500).json({
      error: "file_fetch_failed",
    });
  }
}
