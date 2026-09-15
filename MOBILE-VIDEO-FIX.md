# Mobile Video Playback Fix

This build includes a focused fix for mobile HTML5 video playback, especially iPhone/Safari.

## Changes

- `/api/file.ts`
  - Added HTTP `Range` request support.
  - Returns `206 Partial Content` for valid byte ranges.
  - Sends `Accept-Ranges`, `Content-Range`, and `Content-Length` headers.
  - Added `HEAD` support.
  - Keeps Google Drive streaming instead of buffering the full file.

- `/api/media.ts`
  - Added the Google Drive `modifiedTime` version to preview and download URLs.
  - Prevents Safari/mobile browsers from reusing an old cached video after a file is replaced.

- `src/components/PreviewModal.tsx`
  - Removed forced autoplay.
  - Added `preload="metadata"`.
  - Kept `playsInline` for iPhone/mobile playback.

## Recommended video format

For the widest browser compatibility, use MP4 files encoded with H.264 video and AAC audio.
