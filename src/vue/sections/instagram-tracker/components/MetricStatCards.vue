<script setup>
defineProps({
  stats: {
    type: Object,
    default: () => ({ totalFollowers: 0, totalFollowing: 0 }),
  },
  counts: {
    type: Object,
    default: () => ({
      lostFollowers: 0,
      newFollowers: 0,
      notFollowingBack: 0,
      youDontFollowBack: 0,
      mutualFollowers: 0,
      lostFollowing: 0,
    }),
  },
  activeTab: {
    type: String,
    default: 'lostFollowers',
  },
})

const emit = defineEmits(['selectTab'])
</script>

<template>
  <div class="row g-3 mb-4">
    <!-- Total Followers -->
    <div class="col-6 col-md-4 col-lg-2">
      <div class="stat-card card shadow-sm h-100 text-center p-3">
        <i class="fas fa-users text-primary fs-4 mb-2" />
        <h4 class="mb-0 fw-bold">
          {{ stats.totalFollowers }}
        </h4>
        <p class="text-muted small mb-0">
          Followers
        </p>
      </div>
    </div>

    <!-- Total Following -->
    <div class="col-6 col-md-4 col-lg-2">
      <div class="stat-card card shadow-sm h-100 text-center p-3">
        <i class="fas fa-user-plus text-secondary fs-4 mb-2" />
        <h4 class="mb-0 fw-bold">
          {{ stats.totalFollowing }}
        </h4>
        <p class="text-muted small mb-0">
          Following
        </p>
      </div>
    </div>

    <!-- Unfollowers (Lost Followers) -->
    <div class="col-6 col-md-4 col-lg-2">
      <div
        class="stat-card card shadow-sm h-100 text-center p-3 border-danger-subtle cursor-pointer"
        :class="{
          'bg-danger-subtle bg-opacity-10': counts.lostFollowers > 0,
          'border-danger shadow': activeTab === 'lostFollowers',
        }"
        @click="emit('selectTab', 'lostFollowers')"
      >
        <i class="fas fa-user-minus text-danger fs-4 mb-2" />
        <h4 class="mb-0 fw-bold text-danger">
          {{ counts.lostFollowers }}
        </h4>
        <p class="text-muted small mb-0">
          Unfollowers
        </p>
      </div>
    </div>

    <!-- New Followers -->
    <div class="col-6 col-md-4 col-lg-2">
      <div
        class="stat-card card shadow-sm h-100 text-center p-3 border-success-subtle cursor-pointer"
        :class="{
          'bg-success-subtle bg-opacity-10': counts.newFollowers > 0,
          'border-success shadow': activeTab === 'newFollowers',
        }"
        @click="emit('selectTab', 'newFollowers')"
      >
        <i class="fas fa-user-check text-success fs-4 mb-2" />
        <h4 class="mb-0 fw-bold text-success">
          {{ counts.newFollowers }}
        </h4>
        <p class="text-muted small mb-0">
          New Followers
        </p>
      </div>
    </div>

    <!-- Not Following Back -->
    <div class="col-6 col-md-4 col-lg-2">
      <div
        class="stat-card card shadow-sm h-100 text-center p-3 cursor-pointer"
        :class="{ 'border-warning shadow': activeTab === 'notFollowingBack' }"
        @click="emit('selectTab', 'notFollowingBack')"
      >
        <i class="fas fa-user-times text-warning fs-4 mb-2" />
        <h4 class="mb-0 fw-bold text-warning">
          {{ counts.notFollowingBack }}
        </h4>
        <p class="text-muted small mb-0">
          Don't Follow Back
        </p>
      </div>
    </div>

    <!-- Mutual Followers -->
    <div class="col-6 col-md-4 col-lg-2">
      <div
        class="stat-card card shadow-sm h-100 text-center p-3 cursor-pointer"
        :class="{ 'border-primary shadow': activeTab === 'mutualFollowers' }"
        @click="emit('selectTab', 'mutualFollowers')"
      >
        <i class="fas fa-heart text-danger fs-4 mb-2" />
        <h4 class="mb-0 fw-bold text-dark">
          {{ counts.mutualFollowers }}
        </h4>
        <p class="text-muted small mb-0">
          Mutual Friends
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.stat-card {
  border-radius: 10px;
  border: 1px solid #e9ecef;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.06) !important;
  }
}

.cursor-pointer {
  cursor: pointer;
}
</style>
