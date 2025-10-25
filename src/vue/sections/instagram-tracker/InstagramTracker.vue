<script setup>
import { computed, onMounted, ref } from 'vue'
import UserList from './UserList.vue'

// Reactive state
const isDragging = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const activeTab = ref('notFollowingBack')
const followersFileInput = ref(null)
const followingFileInput = ref(null)
const followersRaw = ref(null)
const followingRaw = ref(null)

const results = ref({
  notFollowingBack: [],
  youDontFollowBack: [],
  mutualFollowers: [],
  notFollowingBackCount: 0,
  youDontFollowBackCount: 0,
  mutualFollowersCount: 0,
})

const stats = ref({
  totalFollowers: 0,
  totalFollowing: 0,
})

const lastUpdated = ref('')

// Computed properties
const hasData = computed(() => {
  return results.value.notFollowingBackCount > 0
    || results.value.youDontFollowBackCount > 0
    || results.value.mutualFollowersCount > 0
})

const filteredNotFollowingBack = computed(() => filterUsers(results.value.notFollowingBack))
const filteredYouDontFollowBack = computed(() => filterUsers(results.value.youDontFollowBack))
const filteredMutualFollowers = computed(() => filterUsers(results.value.mutualFollowers))
const canProcess = computed(() => followersRaw.value && followingRaw.value)

// Methods
function filterUsers(users) {
  if (!searchQuery.value)
    return users
  const query = searchQuery.value.toLowerCase()
  return users.filter(user => user.toLowerCase().includes(query))
}

function handleFollowersFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    readFile(file, 'followers')
  }
}

function handleFollowingFileSelect(event) {
  const file = event.target.files[0]
  if (file) {
    readFile(file, 'following')
  }
}

function handleFollowersDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'application/json') {
    readFile(file, 'followers')
  } else {
    errorMessage.value = 'Please upload a valid JSON file for followers.'
  }
}

function handleFollowingDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file && file.type === 'application/json') {
    readFile(file, 'following')
  } else {
    errorMessage.value = 'Please upload a valid JSON file for followings.'
  }
}

function readFile(file, type) {
  isLoading.value = true
  errorMessage.value = ''
  file.text().then((text) => {
    try {
      const data = JSON.parse(text)
      if (type === 'followers') {
        followersRaw.value = data
      } else {
        followingRaw.value = data
      }
    } catch {
      errorMessage.value = 'Invalid JSON format.'
    } finally {
      isLoading.value = false
    }
  })
}

function processBothFiles() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const followers = parseFollowersData(followersRaw.value)
    const following = parseFollowingData(followingRaw.value)
    if (!followers || !following) {
      throw new Error('Invalid Instagram data format. Please make sure you uploaded the correct files.')
    }
    const comparison = compareFollowers(followers, following)
    results.value = comparison
    stats.value = {
      totalFollowers: followers.length,
      totalFollowing: following.length,
    }
    lastUpdated.value = new Date().toLocaleString()
    saveToLocalStorage()
  } catch (error) {
    errorMessage.value = error.message || 'Failed to process files.'
  } finally {
    isLoading.value = false
  }
}

function parseFollowersData(data) {
  if (!data || !data.length)
    return null

  return data.map((item) => {
    return item.string_list_data?.[0]?.value || item.title || item.username || ''
  }).filter(Boolean)
}

function parseFollowingData(data) {
  // Handle different possible Instagram data structures
  if (data.following) {
    return data.following.map((item) => {
      return item.string_list_data?.[0]?.value || item.title || item.username || ''
    }).filter(Boolean)
  } else if (data.relationships_following) {
    return data.relationships_following.map((item) => {
      return item.string_list_data?.[0]?.value || item.title || item.username || ''
    }).filter(Boolean)
  }
  return null
}

function compareFollowers(followers, following) {
  const followersSet = new Set(followers)
  const followingSet = new Set(following)

  const notFollowingBack = following.filter(user => !followersSet.has(user))
  const youDontFollowBack = followers.filter(user => !followingSet.has(user))
  const mutualFollowers = followers.filter(user => followingSet.has(user))

  return {
    notFollowingBack,
    youDontFollowBack,
    mutualFollowers,
    notFollowingBackCount: notFollowingBack.length,
    youDontFollowBackCount: youDontFollowBack.length,
    mutualFollowersCount: mutualFollowers.length,
  }
}

function saveToLocalStorage() {
  const dataToSave = {
    results: results.value,
    stats: stats.value,
    lastUpdated: lastUpdated.value,
  }
  localStorage.setItem('instagram_tracker_data', JSON.stringify(dataToSave))
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('instagram_tracker_data')
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      results.value = parsed.results
      stats.value = parsed.stats
      lastUpdated.value = parsed.lastUpdated
    } catch (error) {
      console.error('Error loading saved data:', error)
    }
  }
}

function clearData() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure you want to clear all data and upload new data?')) {
    results.value = {
      notFollowingBack: [],
      youDontFollowBack: [],
      mutualFollowers: [],
      notFollowingBackCount: 0,
      youDontFollowBackCount: 0,
      mutualFollowersCount: 0,
    }
    stats.value = {
      totalFollowers: 0,
      totalFollowing: 0,
    }
    lastUpdated.value = ''
    followersRaw.value = null
    followingRaw.value = null
    localStorage.removeItem('instagram_tracker_data')
  }
}

function exportToCSV() {
  const csvContent = [
    ['Category', 'Username'],
    ...results.value.notFollowingBack.map(u => ['Not Following Back', u]),
    ...results.value.youDontFollowBack.map(u => ['You Don\'t Follow Back', u]),
    ...results.value.mutualFollowers.map(u => ['Mutual Followers', u]),
  ].map(row => row.join(',')).join('\n')

  downloadFile(csvContent, 'instagram-tracker-results.csv', 'text/csv')
}

function exportToJSON() {
  const jsonContent = JSON.stringify({
    stats: stats.value,
    results: results.value,
    lastUpdated: lastUpdated.value,
  }, null, 2)

  downloadFile(jsonContent, 'instagram-tracker-results.json', 'application/json')
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

// Lifecycle hooks
onMounted(() => {
  loadFromLocalStorage()
})
</script>

<template>
  <div class="instagram-tracker">
    <div class="container py-5">
      <!-- Header -->
      <div class="text-center mb-5">
        <h1 class="display-4 mb-3">
          <i class="fab fa-instagram text-gradient" />
          Instagram Follower Tracker
        </h1>
        <p class="lead text-muted">
          Discover who doesn't follow you back and track your follower relationships
        </p>
      </div>

      <!-- Instructions Section -->
      <div v-if="!hasData" class="card shadow-sm mb-4">
        <div class="card-body">
          <h5 class="card-title">
            <i class="fas fa-info-circle text-primary" />
            How to Get Your Instagram Data
          </h5>
          <ol class="mb-0">
            <li>Open Instagram app or website</li>
            <li>Go to <strong>Settings → Accounts Center → Your information and permissions → Export your information → Create export</strong></li>
            <li>Select your Instagram account</li>
            <li>Click <strong>Export to device</strong></li>
            <li>Select <strong>customize information</strong></li>
            <li>Check only <strong>Followers and following</strong></li>
            <li>Format: <strong>JSON</strong>, Date range: <strong>All time</strong></li>
            <li>Wait for Instagram to prepare your data (can take up to 48 hours)</li>
            <li>Download the ZIP file, extract it, and upload the JSON file here</li>
          </ol>
        </div>
      </div>

      <div v-if="!hasData" class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row">
            <div class="col-md-6 mb-3 mb-md-0">
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
                  <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3" />
                  <h5>Drop your <strong>Followers</strong> JSON file here</h5>
                  <p class="text-muted mb-0">
                    or click to browse
                  </p>
                  <div v-if="followersRaw" class="mt-2 text-success small">
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
                  <i class="fas fa-cloud-upload-alt fa-3x text-primary mb-3" />
                  <h5>Drop your <strong>Following</strong> JSON file here</h5>
                  <p class="text-muted mb-0">
                    or click to browse
                  </p>
                  <div v-if="followingRaw" class="mt-2 text-success small">
                    Following file loaded!
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="canProcess" class="text-center mt-4">
            <button class="btn btn-primary" @click="processBothFiles">
              <i class="fas fa-play" /> Analyze Data
            </button>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="text-center mt-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2 text-muted">
              Analyzing your data...
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="alert alert-danger mt-3" role="alert">
            <i class="fas fa-exclamation-triangle" />
            {{ errorMessage }}
          </div>
        </div>
      </div>

      <!-- Results Dashboard -->
      <div v-if="hasData">
        <!-- Stats Overview -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card card shadow-sm h-100">
              <div class="card-body text-center">
                <i class="fas fa-users fa-2x text-primary mb-3" />
                <h3 class="display-6 mb-0">
                  {{ stats.totalFollowers }}
                </h3>
                <p class="text-muted mb-0">
                  Followers
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card shadow-sm h-100">
              <div class="card-body text-center">
                <i class="fas fa-user-plus fa-2x text-success mb-3" />
                <h3 class="display-6 mb-0">
                  {{ stats.totalFollowing }}
                </h3>
                <p class="text-muted mb-0">
                  Following
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card shadow-sm h-100">
              <div class="card-body text-center">
                <i class="fas fa-handshake fa-2x text-info mb-3" />
                <h3 class="display-6 mb-0">
                  {{ results.mutualFollowersCount }}
                </h3>
                <p class="text-muted mb-0">
                  Mutual
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card card shadow-sm h-100">
              <div class="card-body text-center">
                <i class="fas fa-user-minus fa-2x text-danger mb-3" />
                <h3 class="display-6 mb-0">
                  {{ results.notFollowingBackCount }}
                </h3>
                <p class="text-muted mb-0">
                  Not Following Back
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Last Updated Info -->
        <div class="alert alert-info d-flex justify-content-between align-items-center" role="alert">
          <span>
            <i class="fas fa-clock" />
            Last updated: {{ lastUpdated }}
          </span>
          <button class="btn btn-sm btn-outline-primary" @click="clearData">
            <i class="fas fa-sync-alt" />
            Upload New Data
          </button>
        </div>

        <!-- Tabs for Different Categories -->
        <div class="card shadow-sm">
          <div class="card-header">
            <ul class="nav nav-tabs card-header-tabs" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'notFollowingBack' }"
                  type="button"
                  role="tab"
                  @click="activeTab = 'notFollowingBack'"
                >
                  <i class="fas fa-user-times" />
                  Not Following Back
                  <span class="badge bg-danger ms-2">{{ results.notFollowingBackCount }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'youDontFollowBack' }"
                  type="button"
                  role="tab"
                  @click="activeTab = 'youDontFollowBack'"
                >
                  <i class="fas fa-user-clock" />
                  You Don't Follow Back
                  <span class="badge bg-warning ms-2">{{ results.youDontFollowBackCount }}</span>
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'mutualFollowers' }"
                  type="button"
                  role="tab"
                  @click="activeTab = 'mutualFollowers'"
                >
                  <i class="fas fa-heart" />
                  Mutual Followers
                  <span class="badge bg-success ms-2">{{ results.mutualFollowersCount }}</span>
                </button>
              </li>
            </ul>
          </div>

          <div class="card-body">
            <!-- Search Bar -->
            <div class="mb-3">
              <div class="input-group">
                <span class="input-group-text">
                  <i class="fas fa-search" />
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control"
                  placeholder="Search usernames..."
                >
              </div>
            </div>

            <!-- User List -->
            <div class="tab-content">
              <div v-if="activeTab === 'notFollowingBack'" class="tab-pane fade show active">
                <p class="text-muted mb-3">
                  <i class="fas fa-info-circle" />
                  People you follow but who don't follow you back
                </p>
                <UserList :users="filteredNotFollowingBack" empty-message="Everyone follows you back! 🎉" />
              </div>

              <div v-if="activeTab === 'youDontFollowBack'" class="tab-pane fade show active">
                <p class="text-muted mb-3">
                  <i class="fas fa-info-circle" />
                  People who follow you but you don't follow back
                </p>
                <UserList :users="filteredYouDontFollowBack" empty-message="You follow everyone back!" />
              </div>

              <div v-if="activeTab === 'mutualFollowers'" class="tab-pane fade show active">
                <p class="text-muted mb-3">
                  <i class="fas fa-info-circle" />
                  People you follow and who follow you back
                </p>
                <UserList :users="filteredMutualFollowers" empty-message="No mutual followers found." />
              </div>
            </div>

            <!-- Export Buttons -->
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-outline-primary" @click="exportToCSV">
                <i class="fas fa-download" />
                Export to CSV
              </button>
              <button class="btn btn-outline-secondary" @click="exportToJSON">
                <i class="fas fa-file-code" />
                Export to JSON
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.instagram-tracker {
  min-height: 100vh;
  padding: 2rem 0;
}

.text-gradient {
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.upload-zone {
  border: 3px dashed #dee2e6;
  border-radius: 12px;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: #f8f9fa;

  &:hover,
  &.drag-over {
    border-color: #0d6efd;
    background-color: #e7f1ff;
    transform: translateY(-2px);
  }

  i {
    transition: transform 0.3s ease;
  }

  &:hover i {
    transform: scale(1.1);
  }
}

.stat-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  }
}

.nav-tabs {
  border-bottom: none;

  .nav-link {
    border: none;
    color: #6c757d;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;

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

.card {
  border: none;
  border-radius: 12px;
}

.card-header {
  background-color: transparent;
  border-bottom: 1px solid #dee2e6;
  padding: 0;
}
</style>
