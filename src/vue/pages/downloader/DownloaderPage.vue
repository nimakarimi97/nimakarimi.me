<script setup>
import { onUnmounted, ref } from 'vue'

const QUALITY_OPTIONS = [
  { value: 'best', label: 'Best available' },
  { value: '2160', label: '2160p (4K)' },
  { value: '1440', label: '1440p (2K)' },
  { value: '1080', label: '1080p (Full HD)' },
  { value: '720', label: '720p (HD)' },
  { value: '480', label: '480p' },
  { value: 'audio', label: 'Audio only (MP3)' },
]

const url = ref('')
const quality = ref('1080')
// Local dev uses the Vite proxy (/api/downloader). In production, set
// VITE_DOWNLOADER_API to the full URL of a hosted backend, e.g.
// https://my-backend.example.com/api
const API_BASE = import.meta.env.VITE_DOWNLOADER_API || '/api/downloader'
const isDownloading = ref(false)
const percent = ref(0)
const showBar = ref(false)
const statusText = ref('')
const statusKind = ref('') // '' | 'ok' | 'err'
const logLines = ref([])

let source = null

function setStatus(text, kind = '') {
  statusText.value = text
  statusKind.value = kind
}

function start() {
  const target = url.value.trim()
  if (!target) {
    setStatus('Please paste a video URL.', 'err')
    return
  }

  if (source)
    source.close()

  logLines.value = []
  showBar.value = true
  percent.value = 0
  isDownloading.value = true
  setStatus('Connecting…')

  const q = encodeURIComponent(quality.value)
  const u = encodeURIComponent(target)
  source = new EventSource(`${API_BASE}/download?url=${u}&quality=${q}`)

  source.addEventListener('progress', (e) => {
    percent.value = JSON.parse(e.data).percent
    setStatus(`Downloading… ${percent.value.toFixed(1)}%`)
  })

  source.addEventListener('log', (e) => {
    logLines.value.push(JSON.parse(e.data).line)
  })

  source.addEventListener('done', (e) => {
    const { file, dir } = JSON.parse(e.data)
    percent.value = 100
    setStatus(`✅ Done! Saved to: ${file || dir}`, 'ok')
    isDownloading.value = false
    source.close()
  })

  source.addEventListener('error', (e) => {
    let msg = 'Download failed.'
    try {
      msg = JSON.parse(e.data).message
    } catch {}
    setStatus(`❌ ${msg}`, 'err')
    isDownloading.value = false
    source.close()
  })

  // Fires when the connection drops without an explicit error event.
  source.onerror = () => {
    if (isDownloading.value) {
      setStatus('❌ Connection lost. Is the downloader server running? (pnpm downloader)', 'err')
      isDownloading.value = false
    }
    if (source)
      source.close()
  }
}

onUnmounted(() => {
  if (source)
    source.close()
})
</script>

<template>
  <div class="downloader-page">
    <div class="dl-wrap">
      <h1 class="dl-title">
        Video Downloader
      </h1>
      <p class="dl-sub">
        Paste a YouTube or Instagram link and download it locally in the best quality.
      </p>

      <div class="dl-card">
        <label class="dl-label" for="dl-url">Video URL</label>
        <input
          id="dl-url"
          v-model="url"
          class="dl-input"
          type="url"
          placeholder="https://www.youtube.com/watch?v=… or instagram.com/reel/…"
          autocomplete="off"
          @keydown.enter="start"
        >

        <label class="dl-label mt" for="dl-quality">Quality</label>
        <select id="dl-quality" v-model="quality" class="dl-input">
          <option v-for="opt in QUALITY_OPTIONS" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>

        <button class="dl-btn" :disabled="isDownloading" @click="start">
          {{ isDownloading ? 'Downloading…' : 'Download' }}
        </button>

        <div v-if="showBar" class="dl-bar-wrap">
          <div class="dl-bar" :style="{ width: `${percent}%` }" />
        </div>

        <div v-if="statusText" class="dl-status" :class="statusKind">
          {{ statusText }}
        </div>

        <pre v-if="logLines.length" class="dl-log">{{ logLines.join('\n') }}</pre>
      </div>

      <p class="dl-foot">
        Runs locally on your machine · Start the backend with <code>pnpm downloader</code>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.downloader-page {
  --dl-bg: #0f1115;
  --dl-card: #191c23;
  --dl-border: #2a2f3a;
  --dl-text: #e8eaed;
  --dl-muted: #9aa0aa;
  --dl-accent: #4f8cff;
  --dl-accent-2: #7c5cff;
  --dl-ok: #35c46b;
  --dl-err: #ff5c66;

  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 48px 16px;
  background: radial-gradient(1200px 600px at 20% -10%, #1b2030 0%, var(--dl-bg) 60%);
  color: var(--dl-text);
}

.dl-wrap {
  width: 100%;
  max-width: 640px;
}

.dl-title {
  font-size: 1.6rem;
  margin: 0 0 4px;
}

.dl-sub {
  color: var(--dl-muted);
  margin: 0 0 24px;
  font-size: 0.95rem;
}

.dl-card {
  background: var(--dl-card);
  border: 1px solid var(--dl-border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.dl-label {
  display: block;
  font-size: 0.85rem;
  color: var(--dl-muted);
  margin: 0 0 6px;

  &.mt {
    margin-top: 16px;
  }
}

.dl-input {
  width: 100%;
  padding: 12px 14px;
  background: #11141a;
  border: 1px solid var(--dl-border);
  border-radius: 10px;
  color: var(--dl-text);
  font-size: 1rem;
  outline: none;

  &:focus {
    border-color: var(--dl-accent);
  }
}

.dl-btn {
  margin-top: 20px;
  width: 100%;
  padding: 13px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--dl-accent), var(--dl-accent-2));
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.05s;

  &:hover {
    opacity: 0.92;
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.dl-bar-wrap {
  margin-top: 20px;
  height: 10px;
  background: #11141a;
  border-radius: 999px;
  overflow: hidden;
}

.dl-bar {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, var(--dl-accent), var(--dl-accent-2));
  transition: width 0.2s ease;
}

.dl-status {
  margin-top: 14px;
  font-size: 0.9rem;

  &.ok {
    color: var(--dl-ok);
  }

  &.err {
    color: var(--dl-err);
  }
}

.dl-log {
  margin-top: 14px;
  max-height: 180px;
  overflow: auto;
  background: #0c0e12;
  border: 1px solid var(--dl-border);
  border-radius: 10px;
  padding: 12px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.78rem;
  color: var(--dl-muted);
  white-space: pre-wrap;
}

.dl-foot {
  margin-top: 18px;
  color: var(--dl-muted);
  font-size: 0.78rem;
  text-align: center;

  code {
    color: var(--dl-text);
  }
}
</style>
