<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  emptyMessage: {
    type: String,
    default: 'No users found.',
  },
})

const currentPage = ref(1)
const itemsPerPage = 30
const brokenImages = ref({})

const totalPages = computed(() => {
  return Math.ceil(props.users.length / itemsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage
})

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, props.users.length)
})

const paginatedUsers = computed(() => {
  return props.users.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

function getUsername(user) {
  if (!user)
    return ''
  return typeof user === 'string' ? user : (user.username || '')
}

function getFullName(user) {
  if (!user || typeof user === 'string')
    return ''
  return user.full_name || ''
}

function getProfilePic(user) {
  if (!user || typeof user === 'string')
    return ''
  return user.profile_pic_url || ''
}

function isVerified(user) {
  if (!user || typeof user === 'string')
    return false
  return Boolean(user.is_verified)
}

function handleImageError(username) {
  if (username) {
    brokenImages.value[username] = true
  }
}

// Reset to first page when users array changes
watch(() => props.users, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="user-list">
    <div v-if="users.length === 0" class="text-center py-5">
      <i class="fas fa-check-circle fa-3x text-success mb-3" />
      <p class="text-muted">
        {{ emptyMessage }}
      </p>
    </div>

    <div v-else class="row g-3">
      <div
        v-for="(user, index) in paginatedUsers"
        :key="index"
        class="col-12 col-md-6 col-lg-4"
      >
        <div class="user-card card h-100 shadow-sm">
          <div class="card-body d-flex align-items-center justify-content-between p-3">
            <div class="d-flex align-items-center flex-grow-1 overflow-hidden me-2">
              <!-- Avatar -->
              <div class="user-avatar-wrapper me-3 flex-shrink-0">
                <img
                  v-if="getProfilePic(user) && !brokenImages[getUsername(user)]"
                  :src="getProfilePic(user)"
                  :alt="getUsername(user)"
                  class="user-avatar-img"
                  referrerpolicy="no-referrer"
                  loading="lazy"
                  @error="handleImageError(getUsername(user))"
                >
                <div v-else class="user-avatar-fallback">
                  <i class="fab fa-instagram" />
                </div>
              </div>

              <!-- User Info -->
              <div class="user-info flex-grow-1 text-truncate">
                <div class="d-flex align-items-center text-truncate">
                  <a
                    :href="`https://instagram.com/${getUsername(user)}`"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="user-link text-decoration-none text-truncate"
                    :title="`@${getUsername(user)}`"
                  >
                    <strong class="text-truncate">@{{ getUsername(user) }}</strong>
                  </a>
                  <i
                    v-if="isVerified(user)"
                    class="fas fa-circle-check text-primary ms-1 small"
                    title="Verified"
                  />
                </div>
                <div
                  v-if="getFullName(user)"
                  class="user-fullname text-muted small text-truncate"
                  :title="getFullName(user)"
                >
                  {{ getFullName(user) }}
                </div>
              </div>
            </div>

            <!-- Profile External Link Button -->
            <a
              :href="`https://instagram.com/${getUsername(user)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sm btn-outline-light text-muted border-0 flex-shrink-0"
              title="Open Instagram profile"
            >
              <i class="fas fa-external-link-alt" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container mt-4">
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center mb-2">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button
              class="page-link"
              :disabled="currentPage === 1"
              aria-label="Previous"
              @click="currentPage--"
            >
              <i class="fas fa-chevron-left" />
            </button>
          </li>

          <li
            v-for="page in visiblePages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="currentPage = page">
              {{ page }}
            </button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button
              class="page-link"
              :disabled="currentPage === totalPages"
              aria-label="Next"
              @click="currentPage++"
            >
              <i class="fas fa-chevron-right" />
            </button>
          </li>
        </ul>
      </nav>

      <p class="text-center text-muted small mb-0">
        Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ users.length }} users
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  transition: all 0.25s ease;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  background-color: #fff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.06) !important;
    border-color: #0d6efd;
  }
}

.user-avatar-wrapper {
  width: 44px;
  height: 44px;
  position: relative;
}

.user-avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-avatar-fallback {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
}

.user-link {
  color: #212529;
  font-size: 0.95rem;
  transition: color 0.2s ease;

  &:hover {
    color: #0d6efd;
  }
}

.user-fullname {
  font-size: 0.8rem;
  line-height: 1.2;
}

.pagination {
  .page-link {
    border: 1px solid #dee2e6;
    color: #0d6efd;
    padding: 0.45rem 0.75rem;
    margin: 0 0.2rem;
    border-radius: 6px;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #0d6efd;
      color: white;
      border-color: #0d6efd;
    }
  }

  .page-item.active .page-link {
    background-color: #0d6efd;
    border-color: #0d6efd;
    color: white;
  }

  .page-item.disabled .page-link {
    opacity: 0.4;
    cursor: not-allowed;
  }
}
</style>
