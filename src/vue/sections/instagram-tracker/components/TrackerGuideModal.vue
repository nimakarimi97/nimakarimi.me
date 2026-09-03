<script setup>
import { ref } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const helpActiveTab = ref('quickstart')
</script>

<template>
  <div
    v-if="show"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.55);"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div class="modal-content border-0 shadow-lg">
        <!-- Header -->
        <div class="modal-header border-bottom bg-light py-3">
          <div class="d-flex align-items-center">
            <i class="fas fa-book-reader text-primary fs-3 me-3" />
            <div>
              <h5 class="modal-title fw-bold mb-0">
                Instagram Tracker — User Guide
              </h5>
              <p class="text-muted small mb-0">
                Step-by-step guide for personal tracking, sync methods, and metrics
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click="emit('close')"
          />
        </div>

        <!-- Guide Tabs -->
        <div class="px-3 pt-3 border-bottom bg-white">
          <ul class="nav nav-tabs border-0" role="tablist">
            <li class="nav-item">
              <button
                class="nav-link py-2"
                :class="{ active: helpActiveTab === 'quickstart' }"
                type="button"
                @click="helpActiveTab = 'quickstart'"
              >
                <i class="fas fa-play-circle me-1 text-primary" />
                Quick Start
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link py-2"
                :class="{ active: helpActiveTab === 'methods' }"
                type="button"
                @click="helpActiveTab = 'methods'"
              >
                <i class="fas fa-sync-alt me-1 text-success" />
                Sync Methods
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link py-2"
                :class="{ active: helpActiveTab === 'metrics' }"
                type="button"
                @click="helpActiveTab = 'metrics'"
              >
                <i class="fas fa-chart-pie me-1 text-warning" />
                Understanding Lists
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link py-2"
                :class="{ active: helpActiveTab === 'safety' }"
                type="button"
                @click="helpActiveTab = 'safety'"
              >
                <i class="fas fa-user-shield me-1 text-info" />
                Privacy &amp; Safety
              </button>
            </li>
          </ul>
        </div>

        <!-- Body -->
        <div class="modal-body p-4" style="max-height: 65vh; overflow-y: auto;">
          <!-- 1. QUICK START -->
          <div v-if="helpActiveTab === 'quickstart'">
            <div class="alert alert-primary border-0 d-flex align-items-center mb-4">
              <i class="fas fa-info-circle fs-4 me-3 text-primary" />
              <div>
                <strong>How follower tracking works:</strong>
                Because Instagram does not notify you when someone unfollows you, tracking requires taking periodic <strong>snapshots</strong> and comparing them.
              </div>
            </div>

            <div class="timeline-steps">
              <div class="d-flex mb-4">
                <div class="me-3">
                  <span class="badge bg-primary rounded-circle p-3 fs-6">1</span>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">
                    Take Your First Scan (The Baseline)
                  </h6>
                  <p class="text-muted small mb-0">
                    Choose <strong>Instant Browser Sync</strong> (Bookmarklet) or <strong>Direct Session ID</strong> to scan your current followers and following. This creates your first snapshot. At this point, you'll see who doesn't follow you back, your fans, and mutuals.
                  </p>
                </div>
              </div>

              <div class="d-flex mb-4">
                <div class="me-3">
                  <span class="badge bg-primary rounded-circle p-3 fs-6">2</span>
                </div>
                <div>
                  <h6 class="fw-bold mb-1">
                    Take Subsequent Scans Later (e.g., Weekly)
                  </h6>
                  <p class="text-muted small mb-0">
                    Whenever you want to check for changes, click <strong>"New Scan"</strong> and run the sync again. Each scan is automatically saved with its exact timestamp.
                  </p>
                </div>
              </div>

              <div class="d-flex">
                <div class="me-3">
                  <span class="badge bg-success rounded-circle p-3 fs-6">3</span>
                </div>
                <div>
                  <h6 class="fw-bold mb-1 text-success">
                    See Who Unfollowed You!
                  </h6>
                  <p class="text-muted small mb-0">
                    The app automatically compares your new scan with your previous scan. The <strong>Unfollowers</strong> tab will display any accounts that were following you before but are missing now, while <strong>New Followers</strong> highlights new accounts that followed you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. SYNC METHODS -->
          <div v-if="helpActiveTab === 'methods'">
            <div class="mb-4">
              <h6 class="fw-bold text-primary mb-2">
                <i class="fas fa-bolt me-1" />
                Method 1: Instant Browser Sync (Recommended)
              </h6>
              <p class="text-muted small">
                This is 100% client-side, requires <strong>zero backend</strong>, and runs directly inside your active browser session on Instagram.
              </p>
              <ol class="small text-muted ps-3 mb-3">
                <li class="mb-2">
                  Drag the <strong>"⭐ Sync with IG Tracker"</strong> button into your browser bookmarks bar (<kbd>Cmd+Shift+B</kbd> on Mac or <kbd>Ctrl+Shift+B</kbd> on Windows).
                </li>
                <li class="mb-2">
                  Open <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">instagram.com</a> (make sure you are logged in).
                </li>
                <li class="mb-2">
                  Click the bookmarklet from your bookmarks bar.
                </li>
                <li class="mb-2">
                  A popup overlay will appear on Instagram showing live scanning progress.
                </li>
                <li class="mb-0">
                  Once complete, the data will automatically sync back to this tracker dashboard!
                </li>
              </ol>
              <div class="alert alert-light border small">
                <strong>Console Alternative:</strong> You can also click <em>"Copy 1-Click Sync Script"</em>, open DevTools (<kbd>F12</kbd>) on Instagram, paste it into the Console, and hit Enter.
              </div>
            </div>

            <hr class="my-4">

            <div class="mb-4">
              <h6 class="fw-bold text-info mb-2">
                <i class="fas fa-key me-1" />
                Method 2: Direct Session ID
              </h6>
              <p class="text-muted small">
                Connect directly using your Instagram session ID to inspect your account:
              </p>
              <ol class="small text-muted ps-3 mb-0">
                <li class="mb-2">
                  Open <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">instagram.com</a> in Chrome.
                </li>
                <li class="mb-2">
                  Press <kbd>F12</kbd> (or <kbd>Cmd+Option+I</kbd>) to open DevTools.
                </li>
                <li class="mb-2">
                  Go to <strong>Application</strong> tab → <strong>Cookies</strong> → <code>https://www.instagram.com</code>.
                </li>
                <li class="mb-2">
                  Find <code>sessionid</code>, double-click its value, and copy it.
                </li>
                <li class="mb-2">
                  Paste it in the "Direct Session ID" tab, enter your username, and click <strong>"Start Sync"</strong>.
                </li>
              </ol>
            </div>

            <hr class="my-4">

            <div>
              <h6 class="fw-bold text-secondary mb-2">
                <i class="fas fa-file-upload me-1" />
                Method 3: JSON Export Files (Offline Fallback)
              </h6>
              <p class="text-muted small mb-0">
                If you prefer not using live sync, you can export your data from Instagram Settings → Accounts Center → Your information and permissions → Export your information (choose JSON format). Drop the followers and following JSON files into the upload zone.
              </p>
            </div>
          </div>

          <!-- 3. UNDERSTANDING METRICS -->
          <div v-if="helpActiveTab === 'metrics'">
            <div class="row g-3">
              <div class="col-md-6">
                <div class="card h-100 border-danger-subtle bg-danger-subtle bg-opacity-10 p-3">
                  <h6 class="fw-bold text-danger mb-1">
                    <i class="fas fa-user-minus me-1" />
                    Unfollowers (Lost Followers)
                  </h6>
                  <p class="small text-muted mb-0">
                    Accounts that were in your followers list in the previous scan, but are no longer following you.
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-success-subtle bg-success-subtle bg-opacity-10 p-3">
                  <h6 class="fw-bold text-success mb-1">
                    <i class="fas fa-user-check me-1" />
                    New Followers
                  </h6>
                  <p class="small text-muted mb-0">
                    Accounts that followed you after the previous scan was taken.
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-warning-subtle bg-warning-subtle bg-opacity-10 p-3">
                  <h6 class="fw-bold text-warning mb-1">
                    <i class="fas fa-user-times me-1" />
                    Not Following Back
                  </h6>
                  <p class="small text-muted mb-0">
                    People that you follow, but who do not follow your account back.
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-secondary-subtle p-3">
                  <h6 class="fw-bold text-secondary mb-1">
                    <i class="fas fa-user-clock me-1" />
                    Fans (You Don't Follow)
                  </h6>
                  <p class="small text-muted mb-0">
                    People who follow you, but you have chosen not to follow back.
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border-primary-subtle bg-primary-subtle bg-opacity-10 p-3">
                  <h6 class="fw-bold text-primary mb-1">
                    <i class="fas fa-heart text-danger me-1" />
                    Mutual Friends
                  </h6>
                  <p class="small text-muted mb-0">
                    Accounts where you both follow each other.
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card h-100 border p-3">
                  <h6 class="fw-bold text-dark mb-1">
                    <i class="fas fa-user-slash text-muted me-1" />
                    Unfollowed by You
                  </h6>
                  <p class="small text-muted mb-0">
                    People you unfollowed since your previous scan.
                  </p>
                </div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-light rounded-3">
              <h6 class="fw-bold mb-1">
                Comparing Any Past Scans
              </h6>
              <p class="text-muted small mb-0">
                Use the <strong>"Active Scan"</strong> and <strong>"Compare with"</strong> dropdowns above the dashboard cards to compare any two historical scans (e.g., compare today vs last month).
              </p>
            </div>
          </div>

          <!-- 4. PRIVACY & SAFETY -->
          <div v-if="helpActiveTab === 'safety'">
            <div class="mb-3">
              <h6 class="fw-bold text-success mb-2">
                <i class="fas fa-lock me-1" />
                100% Private &amp; Local
              </h6>
              <p class="text-muted small">
                All snapshot data, follower lists, and credentials stay exclusively inside your own browser's <code>localStorage</code>. There is no external database or server collecting your data.
              </p>
            </div>

            <div class="mb-3">
              <h6 class="fw-bold text-primary mb-2">
                <i class="fas fa-shield-alt me-1" />
                Why We Never Ask for Passwords
              </h6>
              <p class="text-muted small">
                Entering raw passwords into third-party apps triggers Instagram's automated bot-detection, SMS verification checkpoints, or account suspension. Using your active browser session or session cookie completely avoids these risks.
              </p>
            </div>

            <div class="mb-3">
              <h6 class="fw-bold text-warning mb-2">
                <i class="fas fa-clock me-1" />
                Scanning Frequency &amp; Rate Limits
              </h6>
              <p class="text-muted small">
                Instagram enforces rate limits on high-frequency API requests. We have built in polite 1.1-second pauses between pagination calls. We recommend running scans <strong>once a day or once a week</strong>. Avoid running back-to-back scans repeatedly.
              </p>
            </div>

            <div class="alert alert-secondary small mb-0">
              <i class="fas fa-info-circle me-1 text-primary" />
              You can export your lists anytime using the <strong>"Export CSV"</strong> or <strong>"Export JSON"</strong> buttons on the dashboard.
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-top bg-light py-2">
          <button
            type="button"
            class="btn btn-primary btn-sm px-3"
            @click="emit('close')"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.nav-tabs {
  border-bottom: 1px solid #dee2e6;

  .nav-link {
    border: none;
    color: #64748b;
    font-weight: 500;
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
  }
}
</style>
