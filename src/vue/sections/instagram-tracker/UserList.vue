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
          <div class="card-body d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center flex-grow-1">
              <div class="user-avatar me-3">
                <i class="fab fa-instagram" />
              </div>
              <div class="user-info flex-grow-1">
                <a
                  :href="`https://instagram.com/${user}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="user-link text-decoration-none"
                >
                  <strong>@{{ user }}</strong>
                  <i class="fas fa-external-link-alt ms-1 small" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination-container mt-4">
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" :disabled="currentPage === 1" @click="currentPage--">
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
            <button class="page-link" :disabled="currentPage === totalPages" @click="currentPage++">
              <i class="fas fa-chevron-right" />
            </button>
          </li>
        </ul>
      </nav>

      <p class="text-center text-muted small">
        Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ users.length }} users
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-card {
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
  border-radius: 8px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1) !important;
    border-color: #0d6efd;
  }
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
}

.user-link {
  color: #212529;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: #0d6efd;
  }

  i {
    font-size: 0.7rem;
    opacity: 0.6;
  }
}

.pagination {
  .page-link {
    border: 1px solid #dee2e6;
    color: #0d6efd;
    padding: 0.5rem 0.75rem;
    margin: 0 0.25rem;
    border-radius: 6px;
    transition: all 0.3s ease;

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
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>
