<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  document.title = 'Privacy Policy - Video Hotkeys | Nima Karimi'
})
</script>

<template>
  <div class="privacy-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">
          <header class="mb-5 pb-3 border-bottom">
            <div class="d-flex align-items-center gap-2 mb-2">
              <span class="badge bg-success-subtle text-success border border-success-subtle">Chrome & Firefox Extension</span>
              <span class="badge bg-secondary-subtle text-secondary">Zero Tracking</span>
            </div>
            <h1 class="display-6 fw-bold mb-2">
              Privacy Policy for Video Hotkeys
            </h1>
            <p class="text-muted small mb-0">
              Last updated: October 14, 2026 &middot; Version 1.6.0
            </p>
          </header>

          <section class="policy-section mb-4">
            <p class="lead">
              <strong>Video Hotkeys</strong> is an open-source browser extension developed by Nima Karimi.
              Privacy is fundamental to its design: the extension operates with <strong>one local permission</strong>,
              makes <strong>zero network requests</strong>, and collects <strong>no personal data</strong>.
            </p>
          </section>

          <section class="policy-section mb-4">
            <h2 class="h4 fw-bold">
              1. Information Collection and Usage
            </h2>
            <p>
              Video Hotkeys does <strong>not</strong> collect, log, track, transmit, sell, or share any personal data, browsing activity,
              or user identity.
            </p>
            <p>
              The extension operates entirely locally inside your browser runtime. It has no external backend, no API endpoints, and makes zero network requests.
            </p>
          </section>

          <section class="policy-section mb-4">
            <h2 class="h4 fw-bold">
              2. Permissions Requested
            </h2>
            <p>The extension requests exactly one WebExtension permission:</p>
            <div class="card bg-light border-0 p-3 mb-3">
              <h3 class="h6 fw-bold mb-1">
                <code>storage</code>
              </h3>
              <p class="mb-0 small text-muted">
                Used exclusively to save your customized preferences locally via <code>chrome.storage.local</code>:
              </p>
              <ul class="mb-0 mt-2 small text-muted">
                <li>Extension enabled/disabled toggle (<code>videoHotkeysEnabled</code>)</li>
                <li>Short seek interval in seconds (<code>shortSeekSeconds</code>)</li>
                <li>Long seek interval in seconds (<code>longSeekSeconds</code>)</li>
              </ul>
            </div>
            <p class="small text-muted">
              These settings never leave your computer and are deleted when the extension is uninstalled.
            </p>
          </section>

          <section class="policy-section mb-4">
            <h2 class="h4 fw-bold">
              3. Content Scripts & Host Access
            </h2>
            <p>
              The extension injects a content script across web pages to detect HTML5 <code>&lt;video&gt;</code> elements and listen for keyboard shortcuts (seeking, volume, playback speed, Picture-in-Picture, and fullscreen).
            </p>
            <p>
              The content script:
            </p>
            <ul>
              <li>Does <strong>not</strong> read, inspect, store, or transmit webpage contents, forms, passwords, or personal credentials.</li>
              <li>Ignores keystrokes whenever you are focused on an editable element, input, textarea, or rich text editor.</li>
            </ul>
          </section>

          <section class="policy-section mb-4">
            <h2 class="h4 fw-bold">
              4. Third-Party Services and Analytics
            </h2>
            <p>
              Video Hotkeys contains no third-party tracking scripts, telemetry, crash reporters, ad networks, or external dependencies.
            </p>
          </section>

          <section class="policy-section mb-5">
            <h2 class="h4 fw-bold">
              5. Open Source and Verification
            </h2>
            <p>
              The complete source code is public and open for review on GitHub:
              <br>
              <a
                href="https://github.com/nimakarimi97/video-hotkeys"
                target="_blank"
                rel="noopener noreferrer"
                class="fw-semibold"
              >
                https://github.com/nimakarimi97/video-hotkeys
              </a>
            </p>
          </section>

          <footer class="pt-4 border-top text-muted small">
            <router-link to="/contact" class="ms-2">
              Contact me
            </router-link>

            <p class="mb-0">
              &copy; 2026 Nima Karimi. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background-color: #fafafa;
  color: #1a1a1a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.65;
}

.back-link {
  color: #4a5568;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.15s ease;
}

.back-link:hover {
  color: #1a202c;
}

.policy-section h2 {
  color: #1a202c;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.policy-section p,
.policy-section li {
  color: #4a5568;
}

code {
  background-color: #e2e8f0;
  color: #2d3748;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
  font-size: 0.875em;
}

a {
  color: #2b6cb0;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
