#!/usr/bin/env node
// Local video downloader server (YouTube / Instagram) using yt-dlp + ffmpeg.
// Zero npm dependencies — uses only Node built-in modules.
// Run: node tools/downloader/server.mjs   then open http://localhost:8787

import { spawn } from 'node:child_process'
import { createReadStream, existsSync, mkdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT) || 8787
const DOWNLOAD_DIR = process.env.DOWNLOAD_DIR || join(__dirname, 'downloads')
// Origin allowed to call this backend cross-origin (e.g. your GitHub Pages site).
// Defaults to '*' for local use; set to your domain in production.
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'

if (!existsSync(DOWNLOAD_DIR))
  mkdirSync(DOWNLOAD_DIR, { recursive: true })

// Allowed hosts to avoid the tool being used as an open proxy / SSRF vector.
const ALLOWED_HOSTS = [
  'youtube.com',
  'youtu.be',
  'instagram.com',
  'instagr.am',
]

function isAllowedUrl(raw) {
  try {
    const u = new URL(raw)
    if (u.protocol !== 'http:' && u.protocol !== 'https:')
      return false
    const host = u.hostname.replace(/^www\./, '')
    return ALLOWED_HOSTS.some(h => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}

// Build yt-dlp format args for the requested quality.
function formatArgs(quality) {
  switch (quality) {
    case 'audio':
      return ['-x', '--audio-format', 'mp3', '--audio-quality', '0']
    case 'best':
      return ['-f', 'bv*+ba/b', '--merge-output-format', 'mp4']
    case '2160':
    case '1440':
    case '1080':
    case '720':
    case '480': {
      const h = quality
      return [
        '-f',
        `bv*[height<=${h}]+ba/b[height<=${h}]`,
        '--merge-output-format',
        'mp4',
      ]
    }
    default:
      return ['-f', 'bv*[height<=1080]+ba/b[height<=1080]', '--merge-output-format', 'mp4']
  }
}

function ytDlpExists() {
  return new Promise((resolve) => {
    const p = spawn('yt-dlp', ['--version'])
    p.on('error', () => resolve(false))
    p.on('close', code => resolve(code === 0))
  })
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    ...headers,
  })
  res.end(typeof body === 'string' ? body : JSON.stringify(body))
}

// Server-Sent Events download endpoint. Streams yt-dlp progress to the browser.
function handleDownload(req, res, url) {
  const target = url.searchParams.get('url')?.trim()
  const quality = url.searchParams.get('quality') || '1080'

  if (!target || !isAllowedUrl(target)) {
    return send(res, 400, {
      error: 'Please provide a valid YouTube or Instagram URL.',
    })
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
  })

  const emit = (event, data) =>
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)

  const args = [
    ...formatArgs(quality),
    '--no-playlist',
    '--newline',
    '--restrict-filenames',
    '-o',
    join(DOWNLOAD_DIR, '%(title).150s [%(id)s].%(ext)s'),
    target,
  ]

  emit('log', { line: `Starting download (${quality})...` })

  const child = spawn('yt-dlp', args)
  let lastFile = ''

  child.stdout.on('data', (chunk) => {
    const text = chunk.toString()
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim())
        continue
      const pct = line.match(/\[download\]\s+([\d.]+)%/)
      if (pct)
        emit('progress', { percent: Number(pct[1]) })
      const dest = line.match(/\[download\] Destination: (.+)/)
        || line.match(/Merging formats into "(.+)"/)
      if (dest)
        lastFile = dest[1].replace(/"$/, '')
      emit('log', { line })
    }
  })

  child.stderr.on('data', chunk => emit('log', { line: chunk.toString().trim() }))

  child.on('error', (err) => {
    emit('error', { message: `Failed to run yt-dlp: ${err.message}` })
    res.end()
  })

  child.on('close', (code) => {
    if (code === 0)
      emit('done', { file: lastFile, dir: DOWNLOAD_DIR })
    else
      emit('error', { message: `yt-dlp exited with code ${code}` })
    res.end()
  })

  req.on('close', () => child.kill('SIGKILL'))
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  if (url.pathname === '/api/health') {
    const ok = await ytDlpExists()
    return send(res, 200, { ytDlp: ok })
  }

  if (url.pathname === '/api/download')
    return handleDownload(req, res, url)

  if (url.pathname === '/' || url.pathname === '/index.html') {
    try {
      const html = await readFile(join(__dirname, 'public', 'index.html'))
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(html)
    } catch {
      return send(res, 500, { error: 'Could not load page.' })
    }
  }

  // Serve static assets from public/ (css/js if any).
  if (url.pathname.startsWith('/public/')) {
    const filePath = join(__dirname, url.pathname)
    if (existsSync(filePath)) {
      res.writeHead(200)
      return createReadStream(filePath).pipe(res)
    }
  }

  send(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`\n  Video downloader running at: http://localhost:${PORT}`)
  console.log(`  Saving files to: ${DOWNLOAD_DIR}\n`)
})
