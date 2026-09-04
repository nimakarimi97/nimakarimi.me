<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import MetricStatCards from './components/MetricStatCards.vue'
import PastePayloadModal from './components/PastePayloadModal.vue'
import ScanOptionsCard from './components/ScanOptionsCard.vue'
import SnapshotHistoryBar from './components/SnapshotHistoryBar.vue'
import ThemeSwitch from './components/ThemeSwitch.vue'
import TrackerGuideModal from './components/TrackerGuideModal.vue'
import {
  fetchFollowersList,
  fetchFollowingList,
  fetchUserProfile,
  generateBookmarkletHref,
  generateSyncScript,
} from './instagramService.js'
import {
  clearAllSnapshots,
  clearSession,
  computeDiff,
  deleteSnapshot,
  getSavedSession,
  getSavedSnapshots,
  migrateLegacyData,
  saveSession,
  saveSnapshot,
} from './trackerStorage.js'
import UserList from './UserList.vue'

// --- Modals State ---
const showNewScanModal = ref(false)
const showPasteModal = ref(false)
const showHelpModal = ref(false)

// --- Direct Session State ---
const savedSession = ref({
  sessionid: '',
  userId: '',
  username: '',
  remember: true,
})
const isSyncing = ref(false)
const syncProgress = ref({ stage: '', fetched: 0, message: '' })
let abortController = null

const isDark = ref(true)

watch(isDark, (val) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('ig_tracker_theme', val ? 'dark' : 'light')
  }
})

// --- General UI State ---
const errorMessage = ref('')
const successMessage = ref('')
const searchQuery = ref('')
const activeTab = ref('lostFollowers')

// --- Snapshots & History State ---
const snapshots = ref([])
const activeSnapshotId = ref('')
const compareSnapshotId = ref('')

// --- BroadcastChannel for same-browser sync ---
let broadcastChannel = null

// --- Computed Properties ---
const currentSnapshot = computed(() => {
  if (!snapshots.value.length)
    return null
  return snapshots.value.find(s => s.id === activeSnapshotId.value) || snapshots.value[0]
})

const compareSnapshot = computed(() => {
  if (snapshots.value.length < 2)
    return null
  if (compareSnapshotId.value && compareSnapshotId.value !== currentSnapshot.value?.id) {
    const found = snapshots.value.find(s => s.id === compareSnapshotId.value)
    if (found)
      return found
  }
  const currentIndex = snapshots.value.findIndex(s => s.id === currentSnapshot.value?.id)
  return snapshots.value[currentIndex + 1] || snapshots.value.find(s => s.id !== currentSnapshot.value?.id) || null
})

const diff = computed(() => {
  return computeDiff(currentSnapshot.value, compareSnapshot.value)
})

const hasData = computed(() => {
  return Boolean(
    currentSnapshot.value
    && (diff.value.stats.totalFollowers > 0 || diff.value.stats.totalFollowing > 0),
  )
})

const targetEnvironment = ref('production')
const isLocalhost = computed(() => {
  if (typeof window === 'undefined')
    return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
})

const targetTrackerUrl = computed(() => {
  if (targetEnvironment.value === 'local' && isLocalhost.value) {
    return `${window.location.origin}/instagram-tracker`
  }
  return 'https://nimakarimi.me/instagram-tracker'
})

const bookmarkletHref = computed(() => {
  return generateBookmarkletHref(targetTrackerUrl.value)
})

const consoleScript = computed(() => {
  return generateSyncScript(targetTrackerUrl.value)
})

// Filtered Lists by Search Query
const filteredAllFollowers = computed(() => filterUsers(currentSnapshot.value?.followers || []))
const filteredAllFollowing = computed(() => filterUsers(currentSnapshot.value?.following || []))
const filteredLostFollowers = computed(() => filterUsers(diff.value.lostFollowers))
const filteredNewFollowers = computed(() => filterUsers(diff.value.newFollowers))
const filteredNotFollowingBack = computed(() => filterUsers(diff.value.notFollowingBack))
const filteredYouDontFollowBack = computed(() => filterUsers(diff.value.youDontFollowBack))
const filteredMutualFollowers = computed(() => filterUsers(diff.value.mutualFollowers))
const filteredLostFollowing = computed(() => filterUsers(diff.value.lostFollowing))

function filterUsers(users) {
  if (!searchQuery.value)
    return users
  const q = searchQuery.value.toLowerCase().trim()
  return users.filter((user) => {
    const name = typeof user === 'string' ? user : (user.username || '')
    const fullName = typeof user === 'object' ? (user.full_name || '') : ''
    return name.toLowerCase().includes(q) || fullName.toLowerCase().includes(q)
  })
}

// --- Direct Session Fetch ---
async function handleStartSessionSync(config) {
  errorMessage.value = ''
  successMessage.value = ''
  isSyncing.value = true
  syncProgress.value = { stage: 'init', fetched: 0, message: 'Connecting to Instagram...' }
  abortController = new AbortController()

  if (config.remember) {
    saveSession(config)
  } else {
    clearSession()
  }
  savedSession.value = { ...config }

  try {
    let resolvedUserId = config.userId

    if (!resolvedUserId && config.username) {
      syncProgress.value = { stage: 'profile', fetched: 0, message: `Resolving user profile @${config.username}...` }
      const profile = await fetchUserProfile(config.username, config, abortController.signal)
      resolvedUserId = profile.id
      savedSession.value.userId = profile.id
    }

    if (!resolvedUserId) {
      throw new Error('Please provide either your Instagram Username or User ID (ds_user_id).')
    }

    // 1. Fetch Followers
    syncProgress.value = { stage: 'followers', fetched: 0, message: 'Fetching followers list...' }
    const followers = await fetchFollowersList(
      resolvedUserId,
      config,
      (prog) => {
        syncProgress.value = {
          stage: 'followers',
          fetched: prog.fetched,
          message: `Scanning followers: ${prog.fetched} loaded (page ${prog.page})...`,
        }
      },
      abortController.signal,
    )

    // 2. Fetch Following
    syncProgress.value = { stage: 'following', fetched: 0, message: 'Fetching following list...' }
    const following = await fetchFollowingList(
      resolvedUserId,
      config,
      (prog) => {
        syncProgress.value = {
          stage: 'following',
          fetched: prog.fetched,
          message: `Scanning following: ${prog.fetched} loaded (page ${prog.page})...`,
        }
      },
      abortController.signal,
    )

    // 3. Save new snapshot
    const newSnap = saveSnapshot({
      followers,
      following,
      userId: resolvedUserId,
      username: config.username || '',
      timestamp: Date.now(),
      dateStr: new Date().toLocaleString(),
    })

    refreshSnapshots(newSnap.id)
    successMessage.value = `Scan complete! Saved snapshot with ${followers.length} followers and ${following.length} following.`
    showNewScanModal.value = false

    if (diff.value.counts.lostFollowers > 0) {
      activeTab.value = 'lostFollowers'
    } else {
      activeTab.value = 'notFollowingBack'
    }
  } catch (err) {
    if (err.message !== 'Sync aborted by user') {
      errorMessage.value = err.message || 'Failed to sync with Instagram.'
    }
  } finally {
    isSyncing.value = false
    abortController = null
  }
}

function cancelSync() {
  if (abortController) {
    abortController.abort()
    syncProgress.value.message = 'Sync cancelled.'
    isSyncing.value = false
  }
}

// --- Payload Handlers ---
function handleSyncPayload(payload) {
  if (!payload || !payload.followers || !payload.following) {
    errorMessage.value = 'Invalid sync payload received.'
    return
  }

  try {
    const newSnap = saveSnapshot({
      followers: payload.followers,
      following: payload.following,
      userId: payload.userId || '',
      username: payload.username || '',
      timestamp: payload.timestamp || Date.now(),
      dateStr: payload.dateStr || new Date().toLocaleString(),
    })

    refreshSnapshots(newSnap.id)
    successMessage.value = `Snapshot synced successfully! (${payload.followers.length} followers, ${payload.following.length} following)`
    showNewScanModal.value = false
    showPasteModal.value = false

    if (diff.value.counts.lostFollowers > 0) {
      activeTab.value = 'lostFollowers'
    } else {
      activeTab.value = 'notFollowingBack'
    }
  } catch (err) {
    errorMessage.value = `Failed to process sync data: ${err.message}`
  }
}

// Check URL hash for payload data (#sync=...)
function checkHashSyncData() {
  const hash = window.location.hash
  if (hash && hash.startsWith('#sync=')) {
    try {
      const encoded = hash.slice(6)
      const jsonStr = decodeURIComponent(encoded)
      const data = JSON.parse(jsonStr)
      if (data && data.followers && data.following) {
        handleSyncPayload(data)
        history.replaceState(null, '', window.location.pathname + window.location.search)
        return true
      }
    } catch (e) {
      console.error('Failed to parse hash sync data', e)
      errorMessage.value = 'Received sync data from Instagram, but failed to parse it. Please try the clipboard paste option.'
    }
  }
  return false
}

// Clipboard Auto-Import
async function importFromClipboard() {
  errorMessage.value = ''
  try {
    const text = await navigator.clipboard.readText()
    if (!text || !text.trim()) {
      showPasteModal.value = true
      return
    }
    const data = JSON.parse(text.trim())
    if (data && data.followers && data.following) {
      handleSyncPayload(data)
    } else {
      showPasteModal.value = true
    }
  } catch {
    showPasteModal.value = true
  }
}

function handleFilesAnalyzed({ followers, following }) {
  const newSnap = saveSnapshot({
    followers,
    following,
    timestamp: Date.now(),
    dateStr: new Date().toLocaleString(),
  })

  refreshSnapshots(newSnap.id)
  successMessage.value = `Files analyzed and snapshot saved! (${followers.length} followers, ${following.length} following)`
  showNewScanModal.value = false
}

// --- Snapshot Management ---
function refreshSnapshots(selectId = null) {
  snapshots.value = getSavedSnapshots()
  if (selectId) {
    activeSnapshotId.value = selectId
  } else if ((!activeSnapshotId.value || !snapshots.value.some(s => s.id === activeSnapshotId.value)) && snapshots.value.length > 0) {
    activeSnapshotId.value = snapshots.value[0].id
  }
  if (compareSnapshotId.value && !snapshots.value.some(s => s.id === compareSnapshotId.value)) {
    compareSnapshotId.value = ''
  }
}

function removeCurrentSnapshot() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete this scan snapshot?')) {
    const idToDelete = activeSnapshotId.value
    deleteSnapshot(idToDelete)
    if (compareSnapshotId.value === idToDelete) {
      compareSnapshotId.value = ''
    }
    activeSnapshotId.value = ''
    refreshSnapshots()
  }
}

function clearAllData() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to delete ALL saved snapshots and history from this browser?')) {
    clearAllSnapshots()
    snapshots.value = []
    activeSnapshotId.value = ''
    compareSnapshotId.value = ''
    successMessage.value = 'All data cleared successfully.'
  }
}

// --- Exports ---
function exportToCSV() {
  const rows = [
    ['Category', 'Username', 'Full Name'],
    ...diff.value.lostFollowers.map(u => ['Lost Follower (Unfollowed You)', u.username, u.full_name || '']),
    ...diff.value.newFollowers.map(u => ['New Follower', u.username, u.full_name || '']),
    ...diff.value.notFollowingBack.map(u => ['Not Following Back', u.username, u.full_name || '']),
    ...diff.value.youDontFollowBack.map(u => ['You Don\'t Follow Back', u.username, u.full_name || '']),
    ...diff.value.mutualFollowers.map(u => ['Mutual Follower', u.username, u.full_name || '']),
    ...diff.value.lostFollowing.map(u => ['Unfollowed by You', u.username, u.full_name || '']),
  ]

  const csvContent = rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(',')).join('\n')
  downloadFile(csvContent, `instagram-tracker-${currentSnapshot.value?.dateStr || 'results'}.csv`, 'text/csv')
}

function exportToJSON() {
  const jsonContent = JSON.stringify({
    snapshot: currentSnapshot.value,
    comparisonWith: compareSnapshot.value?.dateStr || null,
    stats: diff.value.stats,
    counts: diff.value.counts,
    results: {
      lostFollowers: diff.value.lostFollowers,
      newFollowers: diff.value.newFollowers,
      notFollowingBack: diff.value.notFollowingBack,
      youDontFollowBack: diff.value.youDontFollowBack,
      mutualFollowers: diff.value.mutualFollowers,
      lostFollowing: diff.value.lostFollowing,
    },
  }, null, 2)

  downloadFile(jsonContent, `instagram-tracker-${currentSnapshot.value?.dateStr || 'results'}.json`, 'application/json')
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

function handleMessage(event) {
  if (event.data && event.data.type === 'IG_TRACKER_SYNC') {
    handleSyncPayload(event.data.data)
    if (event.source) {
      try {
        event.source.postMessage({ type: 'IG_TRACKER_ACK' }, '*')
      } catch {}
    }
  }
}

async function checkClipboardOnFocus() {
  if (hasData.value)
    return
  try {
    const text = await navigator.clipboard.readText()
    if (text && text.includes('"followers"') && text.includes('"following"')) {
      const data = JSON.parse(text.trim())
      if (data && data.followers && data.following) {
        handleSyncPayload(data)
      }
    }
  } catch {}
}

// Lifecycle Hooks
onMounted(() => {
  const savedTheme = typeof localStorage !== 'undefined' ? localStorage.getItem('ig_tracker_theme') : null
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    // Default to dark mode per user request
    isDark.value = true
  }

  migrateLegacyData()

  const session = getSavedSession()
  if (session) {
    savedSession.value = {
      sessionid: session.sessionid || '',
      userId: session.userId || '',
      username: session.username || '',
      remember: Boolean(session.remember),
    }
  }

  refreshSnapshots()

  // 1. Check URL hash for payload (backwards-compat for existing bookmarks)
  checkHashSyncData()
  window.addEventListener('hashchange', checkHashSyncData)

  // 2. Listen for cross-window message events
  window.addEventListener('message', handleMessage)

  // 3. Handshake with opener tab if opened from Instagram tab
  if (window.opener) {
    try {
      window.opener.postMessage({ type: 'IG_TRACKER_READY' }, '*')
    } catch (e) {
      console.debug('Opener handshake failed', e)
    }
  }

  // 4. Auto-detect clipboard data when window is focused
  window.addEventListener('focus', checkClipboardOnFocus)

  // 5. Listen for BroadcastChannel messages
  try {
    broadcastChannel = new BroadcastChannel('ig_tracker_channel')
    broadcastChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'IG_TRACKER_SYNC') {
        handleSyncPayload(event.data.data)
      }
    }
  } catch (e) {
    console.debug('BroadcastChannel not supported', e)
  }

  if (diff.value.counts.lostFollowers > 0) {
    activeTab.value = 'lostFollowers'
  } else {
    activeTab.value = 'notFollowingBack'
  }
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
  window.removeEventListener('hashchange', checkHashSyncData)
  window.removeEventListener('focus', checkClipboardOnFocus)
  if (broadcastChannel)
    broadcastChannel.close()
  if (abortController)
    abortController.abort()
})

watch(activeSnapshotId, (newId) => {
  if (compareSnapshotId.value === newId) {
    compareSnapshotId.value = ''
  }
  if (diff.value.counts.lostFollowers > 0) {
    activeTab.value = 'lostFollowers'
  }
})
</script>

<template>
  <div
    class="instagram-tracker-page d-flex flex-column min-vh-100"
    :class="{ 'theme-dark': isDark, 'theme-light bg-white': !isDark }"
  >
    <!-- Standalone Top Navigation Bar -->
    <header class="tracker-navbar border-bottom py-2 px-3 shadow-sm">
      <div class="container d-flex justify-content-between align-items-center">
        <a href="/" class="brand-link text-decoration-none d-flex align-items-center">
          <img
            src="/images/icons/resume.ico"
            alt="Nima Karimi"
            class="brand-icon me-2 rounded-circle"
            width="26"
            height="26"
          >
          <span class="brand-name fw-bold fs-6">Nima Karimi</span>
        </a>
        <div class="d-flex align-items-center">
          <!-- Theme Switcher -->
          <ThemeSwitch v-model="isDark" />
        </div>
      </div>
    </header>

    <main class="flex-grow-1">
      <div class="container py-4">
        <!-- Header -->
        <div class="text-center mb-5">
          <h1 class="display-5 fw-bold mb-2 tracker-heading">
            <i class="fab fa-instagram text-gradient me-2" />
            Instagram Follower &amp; Unfollower Tracker
          </h1>
          <p class="lead text-muted mx-auto" style="max-width: 720px;">
            Track who unfollowed you, discovered new followers, and inspect relationships directly in your browser with zero external backend.
          </p>
          <div class="d-flex justify-content-center align-items-center gap-2 mt-3 flex-wrap">
            <span class="personal-use-badge px-3 py-2">
              <i class="fas fa-lock me-1 text-warning" />
              For Personal Use
            </span>
            <button
              class="btn btn-sm guide-modal-btn rounded-pill px-3 shadow-sm"
              type="button"
              @click="showHelpModal = true"
            >
              <i class="fas fa-question-circle me-1" />
              How to Use &amp; Guide
            </button>
          </div>
        </div>

        <!-- Alerts -->
        <div
          v-if="errorMessage"
          class="alert alert-danger alert-dismissible fade show shadow-sm"
          role="alert"
        >
          <i class="fas fa-exclamation-triangle me-2" />
          {{ errorMessage }}
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="errorMessage = ''"
          />
        </div>

        <div
          v-if="successMessage"
          class="alert alert-success alert-dismissible fade show shadow-sm"
          role="alert"
        >
          <i class="fas fa-check-circle me-2" />
          {{ successMessage }}
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="successMessage = ''"
          />
        </div>

        <!-- Main Scan Options Card -->
        <ScanOptionsCard
          v-if="!hasData || showNewScanModal"
          :has-data="hasData"
          :is-syncing="isSyncing"
          :sync-progress="syncProgress"
          :bookmarklet-href="bookmarkletHref"
          :console-script="consoleScript"
          :initial-session="savedSession"
          :target-environment="targetEnvironment"
          :target-tracker-url="targetTrackerUrl"
          :is-local-dev="isLocalhost"
          @update:target-environment="targetEnvironment = $event"
          @close="showNewScanModal = false"
          @open-guide="showHelpModal = true"
          @open-paste-modal="showPasteModal = true"
          @import-from-clipboard="importFromClipboard"
          @start-session-sync="handleStartSessionSync"
          @cancel-sync="cancelSync"
          @files-analyzed="handleFilesAnalyzed"
          @error-message="errorMessage = $event"
        />

        <!-- RESULTS DASHBOARD -->
        <div v-if="hasData">
          <!-- Snapshot History Bar -->
          <SnapshotHistoryBar
            :snapshots="snapshots"
            :active-snapshot-id="activeSnapshotId"
            :compare-snapshot-id="compareSnapshotId"
            :compare-snapshot="compareSnapshot"
            @update:active-snapshot-id="activeSnapshotId = $event"
            @update:compare-snapshot-id="compareSnapshotId = $event"
            @new-scan="showNewScanModal = !showNewScanModal"
            @open-guide="showHelpModal = true"
            @delete-snapshot="removeCurrentSnapshot"
            @clear-all="clearAllData"
          />

          <!-- Metric Stat Cards -->
          <MetricStatCards
            :stats="diff.stats"
            :counts="diff.counts"
            :active-tab="activeTab"
            @select-tab="activeTab = $event"
          />

          <!-- User Lists & Search -->
          <div class="card shadow-sm border-0">
            <div class="card-body p-4">
              <!-- Search & Filters -->
              <div class="row g-2 mb-4">
                <div class="col-md-8">
                  <div class="input-group">
                    <span class="input-group-text bg-white">
                      <i class="fas fa-search text-muted" />
                    </span>
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="form-control border-start-0"
                      placeholder="Search by username or full name..."
                    >
                    <button
                      v-if="searchQuery"
                      class="btn btn-outline-secondary"
                      type="button"
                      @click="searchQuery = ''"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                <div class="col-md-4 text-md-end">
                  <div class="d-flex gap-2 justify-content-md-end">
                    <button class="btn btn-outline-primary btn-sm" @click="exportToCSV">
                      <i class="fas fa-file-csv me-1" />
                      Export CSV
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" @click="exportToJSON">
                      <i class="fas fa-file-code me-1" />
                      Export JSON
                    </button>
                  </div>
                </div>
              </div>

              <!-- Tab Contents -->
              <div class="tab-content">
                <div v-if="activeTab === 'allFollowers'">
                  <div class="alert alert-primary-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-users text-primary fs-5 me-2" />
                    <div>
                      <strong>All Followers:</strong> Total accounts currently following your profile ({{ currentSnapshot?.stats?.totalFollowers || 0 }} accounts).
                    </div>
                  </div>
                  <UserList
                    :users="filteredAllFollowers"
                    empty-message="No followers found in this scan."
                  />
                </div>

                <div v-if="activeTab === 'allFollowing'">
                  <div class="alert alert-secondary-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-user-plus text-secondary fs-5 me-2" />
                    <div>
                      <strong>All Following:</strong> Total accounts you are currently following ({{ currentSnapshot?.stats?.totalFollowing || 0 }} accounts).
                    </div>
                  </div>
                  <UserList
                    :users="filteredAllFollowing"
                    empty-message="You are not following anyone."
                  />
                </div>

                <div v-if="activeTab === 'lostFollowers'">
                  <div class="alert alert-danger-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-exclamation-circle text-danger fs-5 me-2" />
                    <div>
                      <strong>Lost Followers:</strong> People who followed you in the previous scan but are no longer following you.
                    </div>
                  </div>
                  <UserList
                    :users="filteredLostFollowers"
                    empty-message="No one has unfollowed you since the last scan! 🎉"
                  />
                </div>

                <div v-if="activeTab === 'newFollowers'">
                  <div class="alert alert-success-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-smile-beam text-success fs-5 me-2" />
                    <div>
                      <strong>New Followers:</strong> Accounts that followed you since the previous scan.
                    </div>
                  </div>
                  <UserList
                    :users="filteredNewFollowers"
                    empty-message="No new followers recorded between these two scans."
                  />
                </div>

                <div v-if="activeTab === 'notFollowingBack'">
                  <div class="alert alert-warning-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-user-times text-warning fs-5 me-2" />
                    <div>
                      <strong>Not Following Back:</strong> Accounts you follow who don't follow your account back.
                    </div>
                  </div>
                  <UserList
                    :users="filteredNotFollowingBack"
                    empty-message="Everyone you follow is following you back! 🎉"
                  />
                </div>

                <div v-if="activeTab === 'youDontFollowBack'">
                  <div class="alert alert-secondary-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-user-clock text-secondary fs-5 me-2" />
                    <div>
                      <strong>Fans:</strong> People who follow you, but you don't follow back.
                    </div>
                  </div>
                  <UserList
                    :users="filteredYouDontFollowBack"
                    empty-message="You follow back all of your followers!"
                  />
                </div>

                <div v-if="activeTab === 'mutualFollowers'">
                  <div class="alert alert-primary-subtle border-0 mb-3 d-flex align-items-center">
                    <i class="fas fa-heart text-danger fs-5 me-2" />
                    <div>
                      <strong>Mutual Followers:</strong> Accounts where you both follow each other.
                    </div>
                  </div>
                  <UserList
                    :users="filteredMutualFollowers"
                    empty-message="No mutual followers found."
                  />
                </div>

                <div v-if="activeTab === 'lostFollowing'">
                  <div class="alert alert-light border mb-3 d-flex align-items-center">
                    <i class="fas fa-user-slash text-muted fs-5 me-2" />
                    <div>
                      <strong>Unfollowed by You:</strong> Accounts you stopped following since the previous scan.
                    </div>
                  </div>
                  <UserList
                    :users="filteredLostFollowing"
                    empty-message="You haven't unfollowed anyone since the last scan."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer Trademark -->
    <footer class="tracker-footer text-center text-muted small py-4 border-top mt-auto bg-light">
      <div class="container">
        <p class="mb-1">
          &copy; 2026 <strong>Nima Karimi</strong> &bull;
          <a href="https://nimakarimi.me" class="text-decoration-none text-muted">nimakarimi.me</a>
          &bull; All Rights Reserved.
        </p>
        <p class="mb-0 text-secondary" style="font-size: 0.8rem;">
          Personal Instagram Follower &amp; Unfollower Tracker &bull; 100% Client-Side &amp; Private.
        </p>
      </div>
    </footer>

    <!-- Modals -->
    <TrackerGuideModal
      :show="showHelpModal"
      @close="showHelpModal = false"
    />

    <PastePayloadModal
      :show="showPasteModal"
      @close="showPasteModal = false"
      @import="handleSyncPayload"
    />
  </div>
</template>

<style lang="scss">
.instagram-tracker-page {
  min-height: 100vh;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;

  .tracker-navbar {
    z-index: 1020;
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease;
  }

  .theme-toggle-btn {
    border: 1px solid #dee2e6;
    background: #f8fafc;
    color: #475569;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
  }

  .text-gradient {
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-tabs {
    border-bottom: 1px solid #dee2e6;
    flex-wrap: nowrap !important;
    white-space: nowrap !important;
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE/Edge
    &::-webkit-scrollbar {
      display: none; // Chrome/Safari
    }

    .nav-item {
      flex-shrink: 0;
    }

    .nav-link {
      border: none;
      color: #64748b;
      padding: 0.85rem 1rem;
      font-weight: 500;
      white-space: nowrap !important;
      display: inline-flex;
      align-items: center;
      transition: all 0.2s ease;

      &:hover {
        color: #0d6efd;
      }

      &.active {
        color: #0d6efd;
        background-color: transparent;
        border-bottom: 3px solid #0d6efd;
        font-weight: 600;
      }

      .badge {
        font-size: 0.75rem;
      }
    }
  }

  .personal-use-badge {
    display: inline-flex;
    align-items: center;
    font-size: 0.82rem;
    font-weight: 500;
    border-radius: 50rem;
    background: #ffffff;
    color: #334155;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    letter-spacing: 0.01em;
    transition: all 0.2s ease;
  }

  .guide-modal-btn {
    border-color: #3b82f6;
    color: #2563eb;
    background: transparent;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      background: #eff6ff;
      color: #1d4ed8;
      border-color: #2563eb;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // DARK THEME (Story Page Aesthetic: Deep Navy-Black #070913 with Distinct Cards)
  // ─────────────────────────────────────────────────────────────────────────────
  &.theme-dark {
    background-color: #070913 !important;
    color: #e8eaf6;

    .personal-use-badge {
      background-color: #12192e !important;
      border: 1px solid rgba(255, 255, 255, 0.14) !important;
      color: #f1f5f9 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35) !important;
    }

    .guide-modal-btn {
      border: 1px solid rgba(96, 165, 250, 0.7) !important;
      color: #93c5fd !important;
      background: rgba(59, 130, 246, 0.12) !important;
      font-weight: 600 !important;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3) !important;

      i {
        color: #60a5fa !important;
      }

      &:hover {
        background: rgba(59, 130, 246, 0.25) !important;
        border-color: #60a5fa !important;
        color: #ffffff !important;
        box-shadow: 0 0 14px rgba(59, 130, 246, 0.35) !important;
      }
    }

    .tracker-heading,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      color: #ffffff !important;
    }

    .lead.text-muted {
      color: #94a3b8 !important;
    }

    .tracker-feature-badge {
      background-color: #12192e !important;
      border-color: rgba(255, 255, 255, 0.14) !important;
      color: #e2e8f0 !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
    }

    .tracker-navbar {
      background-color: #0a0e1a !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4) !important;
    }

    .brand-name {
      color: #f8fafc !important;
    }

    .brand-subtitle {
      color: #94a3b8 !important;
    }

    .card {
      background-color: #11192e !important;
      border: 1px solid rgba(255, 255, 255, 0.13) !important;
      box-shadow:
        0 6px 20px rgba(0, 0, 0, 0.45),
        0 0 0 1px rgba(255, 255, 255, 0.04) !important;
      color: #e2e8f0;

      &.bg-light {
        background-color: #0d1426 !important;
        border: 1px solid rgba(255, 255, 255, 0.11) !important;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35) !important;
      }
    }

    .card-header {
      background-color: #0e162a !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .bg-white {
      background-color: #11192e !important;
      color: #e2e8f0 !important;
    }

    .bg-light {
      background-color: #0d1426 !important;
      color: #cbd5e1 !important;
    }

    .text-dark {
      color: #f8fafc !important;
    }

    .text-muted {
      color: #94a3b8 !important;
    }

    .text-secondary {
      color: #cbd5e1 !important;
    }

    .form-control,
    .form-select {
      background-color: #0b1122 !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      color: #f1f5f9 !important;

      &::placeholder {
        color: #64748b !important;
      }

      &:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 0.25rem rgba(59, 130, 246, 0.25) !important;
      }

      option {
        background-color: #0d1426;
        color: #f1f5f9;
      }
    }

    .input-group-text {
      background-color: #141e36 !important;
      border: 1px solid rgba(255, 255, 255, 0.16) !important;
      color: #cbd5e1 !important;
    }

    .nav-tabs {
      border-color: rgba(255, 255, 255, 0.1) !important;

      .nav-link {
        color: #94a3b8;

        &:hover {
          color: #60a5fa;
        }

        &.active {
          color: #60a5fa !important;
          background-color: transparent !important;
          border-bottom-color: #60a5fa !important;
        }
      }
    }

    .nav-pills {
      .nav-link {
        color: #cbd5e1;

        &.active {
          background-color: #2563eb !important;
          color: #ffffff !important;
        }
      }
    }

    .stat-card {
      background-color: #131c33 !important;
      border: 1px solid rgba(255, 255, 255, 0.13) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
      color: #ffffff !important;

      h4 {
        color: #ffffff !important;
      }

      &:hover {
        border-color: rgba(96, 165, 250, 0.6) !important;
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.5),
          0 0 12px rgba(59, 130, 246, 0.25) !important;
        background-color: #172340 !important;
      }

      &.active-card {
        border-color: #60a5fa !important;
        border-width: 2px !important;
        background-color: #172340 !important;
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.5),
          0 0 14px rgba(96, 165, 250, 0.35) !important;
      }

      &.border-danger-subtle {
        border-color: rgba(239, 68, 68, 0.35) !important;
      }

      &.border-success-subtle {
        border-color: rgba(16, 185, 129, 0.35) !important;
      }
    }

    .user-card {
      background-color: #11192e !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35) !important;
      color: #ffffff !important;

      &:hover {
        border-color: #3b82f6 !important;
        background-color: #16223d !important;
        box-shadow:
          0 8px 24px rgba(0, 0, 0, 0.5),
          0 0 12px rgba(59, 130, 246, 0.2) !important;
      }

      .user-link {
        color: #ffffff !important;

        &:hover {
          color: #60a5fa !important;
        }
      }

      .user-avatar-img {
        border-color: rgba(255, 255, 255, 0.15) !important;
      }
    }

    .upload-zone {
      background-color: #0b1122 !important;
      border: 2px dashed rgba(255, 255, 255, 0.2) !important;
      color: #e2e8f0 !important;

      &:hover,
      &.drag-over {
        background-color: #131d36 !important;
        border-color: #3b82f6 !important;
      }
    }

    .pagination {
      .page-link {
        background-color: #11192e !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #60a5fa !important;

        &:hover:not(:disabled) {
          background-color: #1c2848 !important;
          color: #93c5fd !important;
        }
      }

      .page-item.active .page-link {
        background-color: #2563eb !important;
        border-color: #2563eb !important;
        color: #fff !important;
      }
    }

    .modal-content {
      background-color: #10172a !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7) !important;
      color: #e2e8f0 !important;
    }

    .modal-header,
    .modal-footer {
      background-color: #0b101f !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      color: #f8fafc !important;
    }

    .btn-close {
      filter: invert(1) grayscale(100%) brightness(200%);
    }

    .alert-primary,
    .alert-primary-subtle {
      background-color: rgba(59, 130, 246, 0.15) !important;
      border-color: rgba(59, 130, 246, 0.3) !important;
      color: #93c5fd !important;
    }

    .alert-danger-subtle {
      background-color: rgba(239, 68, 68, 0.15) !important;
      border-color: rgba(239, 68, 68, 0.3) !important;
      color: #fca5a5 !important;
    }

    .alert-success-subtle {
      background-color: rgba(16, 185, 129, 0.15) !important;
      border-color: rgba(16, 185, 129, 0.3) !important;
      color: #6ee7b7 !important;
    }

    .alert-info-subtle {
      background-color: rgba(6, 182, 212, 0.15) !important;
      border-color: rgba(6, 182, 212, 0.3) !important;
      color: #67e8f9 !important;
    }

    .alert-light,
    .alert-secondary {
      background-color: rgba(255, 255, 255, 0.06) !important;
      border-color: rgba(255, 255, 255, 0.1) !important;
      color: #cbd5e1 !important;
    }

    .badge.bg-secondary-subtle {
      background-color: rgba(255, 255, 255, 0.07) !important;
      border-color: rgba(255, 255, 255, 0.12) !important;
      color: #cbd5e1 !important;
    }

    .tracker-footer {
      background-color: #05070d !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
      color: #94a3b8 !important;

      a {
        color: #cbd5e1 !important;
      }
    }
  }
}
</style>
