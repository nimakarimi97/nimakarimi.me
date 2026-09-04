<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  hasData: {
    type: Boolean,
    default: false,
  },
  isSyncing: {
    type: Boolean,
    default: false,
  },
  syncProgress: {
    type: Object,
    default: () => ({ stage: '', fetched: 0, message: '' }),
  },
  bookmarkletHref: {
    type: String,
    default: '',
  },
  consoleScript: {
    type: String,
    default: '',
  },
  initialSession: {
    type: Object,
    default: () => ({ sessionid: '', userId: '', username: '', remember: true }),
  },
  targetEnvironment: {
    type: String,
    default: 'production',
  },
  targetTrackerUrl: {
    type: String,
    default: 'https://nimakarimi.me/instagram-tracker',
  },
  isLocalDev: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits([
  'close',
  'openGuide',
  'openPasteModal',
  'startSessionSync',
  'cancelSync',
  'filesAnalyzed',
  'errorMessage',
  'importFromClipboard',
  'update:targetEnvironment',
])

// Local UI state
const syncMode = ref('browserSync') // 'browserSync' | 'sessionConnect' | 'jsonUpload'
const copiedScript = ref(false)

// Session ID local state
const sessionid = ref(props.initialSession?.sessionid || '')
const userId = ref(props.initialSession?.userId || '')
const username = ref(props.initialSession?.username || '')
const rememberSession = ref(props.initialSession?.remember ?? true)
const showSessionId = ref(false)

// File upload local state
const isDragging = ref(false)
const followersFileInput = ref(null)
const followingFileInput = ref(null)
const followersRaw = ref(null)
const followingRaw = ref(null)
const isReadingFile = ref(false)

const canProcessFiles = computed(() => followersRaw.value && followingRaw.value)

watch(() => props.initialSession, (val) => {
  if (val) {
    if (val.sessionid)
      sessionid.value = val.sessionid
    if (val.userId)
      userId.value = val.userId
    if (val.username)
      username.value = val.username
  }
}, { deep: true })

async function copyConsoleScript() {
  try {
    await navigator.clipboard.writeText(props.consoleScript)
    copiedScript.value = true
    setTimeout(() => {
      copiedScript.value = false
    }, 2500)
  } catch {
    emit('errorMessage', 'Failed to copy script to clipboard.')
  }
}

function handleStartSync() {
  if (!sessionid.value.trim()) {
    emit('errorMessage', 'Please enter your Instagram sessionid cookie.')
    return
  }
  emit('startSessionSync', {
    sessionid: sessionid.value.trim(),
    userId: userId.value.trim(),
    username: username.value.trim(),
    remember: rememberSession.value,
  })
}

// File Handlers
function handleFollowersFileSelect(event) {
  const file = event.target.files[0]
  if (file)
    readFile(file, 'followers')
}

function handleFollowingFileSelect(event) {
  const file = event.target.files[0]
  if (file)
    readFile(file, 'following')
}

function handleFollowersDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    readFile(file, 'followers')
  } else {
    emit('errorMessage', 'Please upload a valid JSON file for followers.')
  }
}

function handleFollowingDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
    readFile(file, 'following')
  } else {
    emit('errorMessage', 'Please upload a valid JSON file for following.')
  }
}

function readFile(file, type) {
  isReadingFile.value = true
  file.text().then((text) => {
    try {
      const data = JSON.parse(text)
      if (type === 'followers') {
        followersRaw.value = data
      } else {
        followingRaw.value = data
      }
    } catch {
      emit('errorMessage', 'Invalid JSON file format.')
    } finally {
      isReadingFile.value = false
    }
  })
}

function processBothFiles() {
  try {
    const followers = parseFollowersData(followersRaw.value)
    const following = parseFollowingData(followingRaw.value)
    if (!followers || !following) {
      throw new Error('Invalid Instagram export format. Please ensure you uploaded the correct followers and following JSON files.')
    }

    emit('filesAnalyzed', { followers, following })
    followersRaw.value = null
    followingRaw.value = null
  } catch (error) {
    emit('errorMessage', error.message || 'Failed to process files.')
  }
}

function parseFollowersData(data) {
  if (!data)
    return null
  const items = Array.isArray(data) ? data : (data.relationships_followers || [])
  return items.map((item) => {
    return item.string_list_data?.[0]?.value || item.title || item.username || ''
  }).filter(Boolean)
}

function parseFollowingData(data) {
  if (!data)
    return null
  if (Array.isArray(data.relationships_following)) {
    return data.relationships_following.map(item => item.string_list_data?.[0]?.value || item.title || item.username || '').filter(Boolean)
  }
  if (Array.isArray(data.following)) {
    return data.following.map(item => item.string_list_data?.[0]?.value || item.title || item.username || '').filter(Boolean)
  }
  if (Array.isArray(data)) {
    return data.map(item => item.string_list_data?.[0]?.value || item.title || item.username || '').filter(Boolean)
  }
  return null
}
</script>

<template>
  <div class="card shadow-sm border-0 mb-5 main-scan-card">
    <div class="card-header bg-white border-bottom p-4">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <h4 class="mb-1 fw-bold">
            <i class="fas fa-satellite-dish text-primary me-2" />
            {{ hasData ? 'Take a New Scan' : 'Connect & Scan Your Account' }}
          </h4>
          <p class="text-muted small mb-0">
            Choose your preferred synchronization method to read followers & followings
          </p>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button
            class="btn btn-sm btn-outline-primary"
            type="button"
            @click="emit('openGuide')"
          >
            <i class="fas fa-book-open me-1" />
            User Guide
          </button>
          <button
            v-if="hasData"
            class="btn btn-sm btn-outline-secondary"
            @click="emit('close')"
          >
            <i class="fas fa-times me-1" />
            Close
          </button>
        </div>
      </div>

      <!-- Quick Tip Banner -->
      <div class="alert alert-primary-subtle border border-primary-subtle rounded-3 p-3 mt-3 mb-0">
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-info-circle text-primary fs-5 me-2" />
            <span class="small">
              <strong>First time here?</strong> Scan your account today to set your baseline. In your next scan, the tracker will automatically reveal who unfollowed you!
            </span>
          </div>
          <button
            class="btn btn-sm btn-link text-primary text-decoration-none fw-bold p-0"
            @click="emit('openGuide')"
          >
            Read full step-by-step guide &rarr;
          </button>
        </div>
      </div>

      <!-- Method Selection Tabs -->
      <ul class="nav nav-pills mt-4" role="tablist">
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: syncMode === 'browserSync' }"
            type="button"
            @click="syncMode = 'browserSync'"
          >
            <i class="fas fa-bolt text-warning me-1" />
            Instant Browser Sync
            <span class="badge bg-primary ms-2">Zero Backend</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: syncMode === 'sessionConnect' }"
            type="button"
            @click="syncMode = 'sessionConnect'"
          >
            <i class="fas fa-key text-info me-1" />
            Direct Session ID
            <span class="badge bg-secondary ms-2">Session Cookie</span>
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button
            class="nav-link"
            :class="{ active: syncMode === 'jsonUpload' }"
            type="button"
            @click="syncMode = 'jsonUpload'"
          >
            <i class="fas fa-file-upload text-muted me-1" />
            JSON Export Files
          </button>
        </li>
      </ul>
    </div>

    <div class="card-body p-4">
      <!-- 1. BROWSER SYNC MODE -->
      <div v-if="syncMode === 'browserSync'">
        <div class="row g-4 align-items-center">
          <div class="col-lg-7">
            <h5 class="fw-bold mb-3">
              <i class="fas fa-magic text-primary me-2" />
              Method A: 1-Click Bookmarklet (Safest & Fastest)
            </h5>
            <p class="text-muted">
              Runs directly inside your active Instagram tab with zero passwords, zero checkpoints, and zero CORS blocks.
            </p>

            <!-- Target Environment Selector (if in local dev) -->
            <div v-if="isLocalDev" class="d-flex align-items-center gap-3 mb-3 p-2 bg-light border rounded-3 small">
              <span class="text-muted fw-bold">Target Redirect:</span>
              <div class="form-check form-check-inline mb-0">
                <input
                  id="targetProd"
                  class="form-check-input"
                  type="radio"
                  name="targetEnv"
                  value="production"
                  :checked="targetEnvironment === 'production'"
                  @change="emit('update:targetEnvironment', 'production')"
                >
                <label class="form-check-label" for="targetProd">
                  <strong>nimakarimi.me</strong> (Production)
                </label>
              </div>
              <div class="form-check form-check-inline mb-0">
                <input
                  id="targetLocal"
                  class="form-check-input"
                  type="radio"
                  name="targetEnv"
                  value="local"
                  :checked="targetEnvironment === 'local'"
                  @change="emit('update:targetEnvironment', 'local')"
                >
                <label class="form-check-label" for="targetLocal">
                  localhost:5173 (Dev)
                </label>
              </div>
            </div>

            <div class="card bg-light border-0 p-3 mb-4 rounded-3">
              <div class="d-flex align-items-center mb-2">
                <span class="badge bg-primary rounded-circle p-2 me-2">1</span>
                <strong>Drag this button to your Bookmarks Bar:</strong>
              </div>
              <div class="my-2 text-center text-md-start ps-md-4">
                <a
                  :href="bookmarkletHref"
                  class="btn btn-warning fw-bold text-dark shadow-sm bookmarklet-btn"
                  title="Drag to your browser bookmarks bar"
                  @click.prevent="emit('errorMessage', 'To use this bookmarklet, drag it to your browser Bookmarks Bar (Cmd+Shift+B / Ctrl+Shift+B), then click it while on instagram.com!')"
                >
                  <i class="fas fa-star text-dark me-1" /> ⭐ Sync with IG Tracker
                </a>
                <span class="ms-2 small text-muted d-block d-md-inline mt-2 mt-md-0">
                  ← Drag & drop into your browser bookmarks bar
                </span>
                <div class="small text-muted mt-2">
                  <i class="fas fa-external-link-alt me-1 text-primary" />
                  Opens: <code>{{ targetTrackerUrl }}</code>
                </div>
              </div>

              <div class="d-flex align-items-center mt-3 mb-1">
                <span class="badge bg-primary rounded-circle p-2 me-2">2</span>
                <strong>Open <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">instagram.com</a> and click the bookmark.</strong>
              </div>
              <p class="small text-muted ps-4 mb-0">
                A status window will show scan progress. Once finished, it transmits the data directly to this tracker or copies it to your clipboard.
              </p>
            </div>

            <h5 class="fw-bold mb-3">
              <i class="fas fa-terminal text-secondary me-2" />
              Method B: DevTools Console Script
            </h5>
            <p class="text-muted small">
              Prefer not using bookmarks? Open DevTools (<code>F12</code> or <code>Cmd+Option+I</code>) on <strong>instagram.com</strong>, paste this snippet into the Console, and hit Enter:
            </p>
            <div class="d-flex gap-2 flex-wrap">
              <button
                class="btn btn-outline-primary"
                :class="{ 'btn-success text-white': copiedScript }"
                @click="copyConsoleScript"
              >
                <i class="fas" :class="copiedScript ? 'fa-check' : 'fa-copy'" />
                {{ copiedScript ? 'Script Copied to Clipboard!' : 'Copy 1-Click Sync Script' }}
              </button>
              <button
                class="btn btn-primary"
                @click="emit('importFromClipboard')"
              >
                <i class="fas fa-clipboard-check me-1" />
                Import from Clipboard
              </button>
              <button
                class="btn btn-outline-secondary"
                @click="emit('openPasteModal')"
              >
                <i class="fas fa-paste me-1" />
                Paste JSON
              </button>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card border border-info-subtle bg-info-subtle bg-opacity-10 p-3 h-100">
              <h6 class="fw-bold text-primary mb-2">
                <i class="fas fa-lightbulb me-2" />
                Why Browser Sync is Best:
              </h6>
              <ul class="small text-muted ps-3 mb-3">
                <li class="mb-2">
                  <strong>Zero Login Friction:</strong> You're already logged into Instagram in your browser.
                </li>
                <li class="mb-2">
                  <strong>Anti-Ban Safe:</strong> Requests originate from your genuine IP and browser session without sending raw credentials.
                </li>
                <li class="mb-2">
                  <strong>Human-Safe Pacing:</strong> 1.1-second polite pauses between pagination calls avoid Instagram rate limits.
                </li>
                <li class="mb-0">
                  <strong>Full Rich Data:</strong> Captures profile photos, verified status, and real names.
                </li>
              </ul>
              <div class="alert alert-secondary bg-white small mb-0 border">
                <i class="fas fa-shield-alt text-success me-1" />
                100% Client-side. Private, secure, and instant.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. DIRECT SESSION CONNECT MODE -->
      <div v-if="syncMode === 'sessionConnect'">
        <div class="row g-4">
          <div class="col-lg-7">
            <h5 class="fw-bold mb-3">
              <i class="fas fa-key text-info me-2" />
              Connect via Instagram Session ID
            </h5>
            <p class="text-muted small mb-2">
              Connect directly to Instagram web endpoints using your authenticated session ID cookie.
            </p>

            <div v-if="!isLocalDev" class="alert alert-info small py-2 px-3 mb-3">
              <i class="fas fa-info-circle me-1" />
              <strong>Recommended for live site:</strong> For 100% serverless sync without a local backend, use <strong>Method 1 (Instant Browser Sync)</strong> above.
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold small">Instagram Username or User ID</label>
              <div class="input-group">
                <span class="input-group-text">@</span>
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  placeholder="e.g. nima.__.karimi"
                  :disabled="isSyncing"
                >
              </div>
              <div class="form-text">
                Enter your username or user ID (<code>ds_user_id</code>).
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold small">Instagram Session ID Cookie (`sessionid`)</label>
              <div class="input-group">
                <input
                  v-model="sessionid"
                  :type="showSessionId ? 'text' : 'password'"
                  class="form-control font-monospace"
                  placeholder="Paste sessionid value here..."
                  :disabled="isSyncing"
                >
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showSessionId = !showSessionId"
                >
                  <i class="fas" :class="showSessionId ? 'fa-eye-slash' : 'fa-eye'" />
                </button>
              </div>
              <div class="form-text">
                Find in Chrome DevTools: <code>Application &gt; Cookies &gt; https://www.instagram.com &gt; sessionid</code>.
              </div>
            </div>

            <div class="form-check mb-4">
              <input
                id="rememberCheck"
                v-model="rememberSession"
                class="form-check-input"
                type="checkbox"
                :disabled="isSyncing"
              >
              <label class="form-check-label small" for="rememberCheck">
                Remember session ID in this browser's local storage (personal use only)
              </label>
            </div>

            <!-- Sync Controls -->
            <div class="d-flex align-items-center gap-2">
              <button
                v-if="!isSyncing"
                class="btn btn-primary px-4"
                :disabled="!sessionid"
                @click="handleStartSync"
              >
                <i class="fas fa-play me-2" />
                Start Sync
              </button>
              <button
                v-else
                class="btn btn-danger px-4"
                @click="emit('cancelSync')"
              >
                <i class="fas fa-stop me-2" />
                Cancel Sync
              </button>
            </div>

            <!-- Live Sync Progress Indicator -->
            <div v-if="isSyncing" class="mt-4 p-3 bg-light border rounded-3">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="small fw-bold text-primary">
                  <i class="fas fa-sync fa-spin me-2" />
                  {{ syncProgress.message }}
                </span>
                <span class="badge bg-primary">{{ syncProgress.stage }}</span>
              </div>
              <div class="progress" style="height: 8px;">
                <div
                  class="progress-bar progress-bar-striped progress-bar-animated"
                  :style="{
                    width: syncProgress.stage === 'followers'
                      ? '45%'
                      : (syncProgress.stage === 'following' ? '85%' : '15%'),
                  }"
                />
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="card bg-light border-0 p-3 h-100">
              <h6 class="fw-bold mb-2">
                <i class="fas fa-question-circle text-muted me-2" />
                How to copy your `sessionid`:
              </h6>
              <ol class="small text-muted ps-3 mb-0">
                <li class="mb-2">
                  Open <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">instagram.com</a> and make sure you're logged in.
                </li>
                <li class="mb-2">
                  Press <kbd>F12</kbd> (or <kbd>Cmd</kbd> + <kbd>Option</kbd> + <kbd>I</kbd>) to open DevTools.
                </li>
                <li class="mb-2">
                  Click the <strong>Application</strong> tab (or <strong>Storage</strong> in Firefox).
                </li>
                <li class="mb-2">
                  Expand <strong>Cookies</strong> → click <code>https://www.instagram.com</code>.
                </li>
                <li class="mb-2">
                  Double-click the value column next to <strong>sessionid</strong>, copy it, and paste it here.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. JSON UPLOAD MODE -->
      <div v-if="syncMode === 'jsonUpload'">
        <div class="alert alert-light border small mb-4">
          <i class="fas fa-info-circle text-primary me-2" />
          Upload the <code>followers_1.json</code> and <code>following.json</code> files from your Instagram Data Export.
        </div>

        <div class="row g-4">
          <div class="col-md-6">
            <div
              class="upload-zone"
              :class="{ 'drag-over': isDragging }"
              @drop.prevent="handleFollowersDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @click="followersFileInput.click()"
            >
              <input
                ref="followersFileInput"
                type="file"
                accept=".json"
                style="display: none"
                @change="handleFollowersFileSelect"
              >
              <div class="text-center">
                <i class="fas fa-users fa-3x text-primary mb-3" />
                <h5>Drop your <strong>Followers</strong> JSON here</h5>
                <p class="text-muted small mb-0">
                  or click to browse
                </p>
                <div v-if="followersRaw" class="mt-2 text-success small fw-bold">
                  <i class="fas fa-check me-1" />
                  Followers file loaded!
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div
              class="upload-zone"
              :class="{ 'drag-over': isDragging }"
              @drop.prevent="handleFollowingDrop"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @click="followingFileInput.click()"
            >
              <input
                ref="followingFileInput"
                type="file"
                accept=".json"
                style="display: none"
                @change="handleFollowingFileSelect"
              >
              <div class="text-center">
                <i class="fas fa-user-plus fa-3x text-primary mb-3" />
                <h5>Drop your <strong>Following</strong> JSON here</h5>
                <p class="text-muted small mb-0">
                  or click to browse
                </p>
                <div v-if="followingRaw" class="mt-2 text-success small fw-bold">
                  <i class="fas fa-check me-1" />
                  Following file loaded!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="canProcessFiles" class="text-center mt-4">
          <button
            class="btn btn-primary px-4"
            :disabled="isReadingFile"
            @click="processBothFiles"
          >
            <i class="fas fa-play me-2" />
            Analyze Files &amp; Save Snapshot
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.main-scan-card {
  border-radius: 14px;
}

.upload-zone {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 3rem 1.5rem;
  cursor: pointer;
  transition: all 0.25s ease;
  background-color: #f8fafc;

  &:hover,
  &.drag-over {
    border-color: #0d6efd;
    background-color: #eff6ff;
    transform: translateY(-1px);
  }

  i {
    transition: transform 0.25s ease;
  }

  &:hover i {
    transform: scale(1.08);
  }
}

.nav-pills {
  .nav-link {
    border-radius: 8px;
    padding: 0.6rem 1.2rem;
    color: #475569;
    font-weight: 500;
    margin-right: 0.5rem;

    &.active {
      background-color: #0d6efd;
      color: white;
    }
  }
}

.bookmarklet-btn {
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
</style>
