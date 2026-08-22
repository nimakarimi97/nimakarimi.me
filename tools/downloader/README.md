# Local Video Downloader

A local-only tool to paste YouTube / Instagram links and download them in the highest
quality (defaults to **1080p** for YouTube). It uses [`yt-dlp`](https://github.com/yt-dlp/yt-dlp)
and `ffmpeg` and runs entirely on your machine — nothing is deployed to the public site.

The UI is a Vue page at **`/downloader`** in the main app. It talks to a small local Node
backend (`server.mjs`) that does the actual downloading. Vite proxies `/api/downloader/*`
to the backend during `pnpm dev`.

## 1. Install prerequisites (one time)

```bash
brew install yt-dlp ffmpeg
```

## 2. Run both processes

In two terminals from the project root:

```bash
pnpm downloader   # backend on http://localhost:8787
pnpm dev          # Vite app on http://localhost:5173
```

Then open http://localhost:5173/downloader in your browser.

> The backend also serves a standalone page at http://localhost:8787 if you prefer to use
> it without running Vite.

## 3. Use

1. Paste a YouTube or Instagram URL.
2. Pick a quality from the dropdown (1080p is selected by default).
3. Click **Download**.

Files are saved to `tools/downloader/downloads/`.

### Options

- Change the backend port: `PORT=9000 pnpm downloader` (also update the proxy target in
  `vite.config.js`).
- Change the output folder: `DOWNLOAD_DIR=~/Downloads pnpm downloader`

> Only YouTube and Instagram hosts are accepted. This tool is for downloading content
> you have the right to download. Respect each platform's Terms of Service and copyright.
