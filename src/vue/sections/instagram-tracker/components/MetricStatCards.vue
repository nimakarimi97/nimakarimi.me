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
  <div class="row g-2 mb-3">
    <!-- Total Followers -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-primary shadow active-card': activeTab === 'allFollowers' }"
        @click="emit('selectTab', 'allFollowers')"
      >
        <i class="fas fa-users text-primary fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1">
          {{ stats.totalFollowers }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Followers
        </p>
      </div>
    </div>

    <!-- Total Following -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-secondary shadow active-card': activeTab === 'allFollowing' }"
        @click="emit('selectTab', 'allFollowing')"
      >
        <i class="fas fa-user-plus text-secondary fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1">
          {{ stats.totalFollowing }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Following
        </p>
      </div>
    </div>

    <!-- Unfollowers (Lost Followers) -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 border-danger-subtle cursor-pointer"
        :class="{
          'bg-danger-subtle bg-opacity-10': counts.lostFollowers > 0,
          'border-danger shadow active-card': activeTab === 'lostFollowers',
        }"
        @click="emit('selectTab', 'lostFollowers')"
      >
        <i class="fas fa-user-minus text-danger fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-danger">
          {{ counts.lostFollowers }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Unfollowers
        </p>
      </div>
    </div>

    <!-- New Followers -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 border-success-subtle cursor-pointer"
        :class="{
          'bg-success-subtle bg-opacity-10': counts.newFollowers > 0,
          'border-success shadow active-card': activeTab === 'newFollowers',
        }"
        @click="emit('selectTab', 'newFollowers')"
      >
        <i class="fas fa-user-check text-success fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-success">
          {{ counts.newFollowers }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          New Followers
        </p>
      </div>
    </div>

    <!-- Not Following Back -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-warning shadow active-card': activeTab === 'notFollowingBack' }"
        @click="emit('selectTab', 'notFollowingBack')"
      >
        <i class="fas fa-user-times text-warning fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-warning">
          {{ counts.notFollowingBack }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Don't Follow Back
        </p>
      </div>
    </div>

    <!-- Fans (You Don't Follow) -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-info shadow active-card': activeTab === 'youDontFollowBack' }"
        @click="emit('selectTab', 'youDontFollowBack')"
      >
        <i class="fas fa-user-clock text-info fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-info">
          {{ counts.youDontFollowBack }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Fans (Not Followed)
        </p>
      </div>
    </div>

    <!-- Mutual Followers -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-primary shadow active-card': activeTab === 'mutualFollowers' }"
        @click="emit('selectTab', 'mutualFollowers')"
      >
        <i class="fas fa-heart text-danger fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-dark">
          {{ counts.mutualFollowers }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Mutual Friends
        </p>
      </div>
    </div>

    <!-- Unfollowed by You -->
    <div class="col-6 col-md-3">
      <div
        class="stat-card card shadow-sm h-100 text-center py-2 px-2 cursor-pointer"
        :class="{ 'border-secondary shadow active-card': activeTab === 'lostFollowing' }"
        @click="emit('selectTab', 'lostFollowing')"
      >
        <i class="fas fa-user-slash text-muted fs-5 mb-1" />
        <div class="stat-number fw-bold fs-5 lh-1 mb-1 text-secondary">
          {{ counts.lostFollowing }}
        </div>
        <p class="stat-label text-muted mb-0 text-truncate">
          Unfollowed by You
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
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
  position: relative;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.07) !important;
  }

  &.active-card {
    border-width: 2px !important;
    box-shadow: 0 0.25rem 0.75rem rgba(13, 110, 253, 0.18) !important;
  }
}

.stat-number {
  font-size: 1.15rem !important;
}

.stat-label {
  font-size: 0.74rem !important;
  font-weight: 500;
  line-height: 1.1;
}

.cursor-pointer {
  cursor: pointer;
  user-select: none;
}
</style>
