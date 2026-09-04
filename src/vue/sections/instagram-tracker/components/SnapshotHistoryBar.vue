<script setup>
defineProps({
  snapshots: {
    type: Array,
    default: () => [],
  },
  activeSnapshotId: {
    type: String,
    default: '',
  },
  compareSnapshotId: {
    type: String,
    default: '',
  },
  compareSnapshot: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits([
  'update:activeSnapshotId',
  'update:compareSnapshotId',
  'newScan',
  'openGuide',
  'deleteSnapshot',
  'clearAll',
])
</script>

<template>
  <div class="card shadow-sm border-0 mb-4 bg-light">
    <div class="card-body d-flex flex-wrap align-items-center justify-content-between gap-3 p-3">
      <!-- Selectors & Comparison Info -->
      <div class="d-flex align-items-center gap-3 flex-wrap">
        <!-- Active Scan Selector -->
        <div class="d-flex align-items-center">
          <label class="small text-muted fw-bold me-2 mb-0 text-nowrap">Active Scan:</label>
          <select
            :value="activeSnapshotId"
            class="form-select form-select-sm"
            style="min-width: 200px;"
            @change="emit('update:activeSnapshotId', $event.target.value)"
          >
            <option
              v-for="snap in snapshots"
              :key="snap.id"
              :value="snap.id"
            >
              {{ snap.dateStr }} ({{ snap.stats?.totalFollowers }} followers)
            </option>
          </select>
        </div>

        <!-- Compare With Selector -->
        <div v-if="snapshots.length > 1" class="d-flex align-items-center">
          <label class="small text-muted fw-bold me-2 mb-0 text-nowrap">Compare with:</label>
          <select
            :value="compareSnapshot?.id || compareSnapshotId"
            class="form-select form-select-sm"
            style="min-width: 200px;"
            @change="emit('update:compareSnapshotId', $event.target.value)"
          >
            <option
              v-for="snap in snapshots.filter(s => s.id !== activeSnapshotId)"
              :key="snap.id"
              :value="snap.id"
            >
              {{ snap.dateStr }}
            </option>
          </select>
        </div>

        <!-- Comparison Status Badges -->
        <span v-if="compareSnapshot" class="comparing-text small text-nowrap">
          Comparing vs {{ compareSnapshot.dateStr }}
        </span>
        <span v-else class="comparing-text small text-nowrap text-secondary">
          First snapshot (no previous comparison)
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-primary"
          @click="emit('newScan')"
        >
          <i class="fas fa-sync-alt me-1" />
          New Scan
        </button>
        <button
          class="btn btn-sm btn-outline-info"
          title="User Guide & Help"
          @click="emit('openGuide')"
        >
          <i class="fas fa-question-circle me-1" />
          Guide
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          title="Delete this snapshot"
          @click="emit('deleteSnapshot')"
        >
          <i class="fas fa-trash-alt" />
        </button>
        <button
          class="btn btn-sm btn-outline-secondary"
          title="Clear all stored data"
          @click="emit('clearAll')"
        >
          <i class="fas fa-eraser me-1" />
          Clear All
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comparing-text {
  color: #698bda !important;
  background: transparent !important;
  font-weight: 500;
}
</style>
