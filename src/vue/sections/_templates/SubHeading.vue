<script setup>
const props = defineProps({
  title: String,
  description: String,
  faIcon: String,
  img: String,
})
</script>

<template>
  <!-- Section Subheading -->
  <div class="section-subheading">
    <!-- Title -->
    <h3 class="section-subheading-title mb-2 fw-bold text-uppercase">
      <span>{{ props.title }}</span>
      <i
        v-if="props.faIcon"
        :class="props.faIcon"
        class="ms-2"
      />

      <img
        v-else-if="props.img"
        :src="props.img"
        class="image"
      >
    </h3>

    <!-- Divider -->
    <hr
      class="solid-divider ms-1 me-1 mb-3"
      :class="{ 'mb-sm-4': !props.description }"
    >

    <!-- Description -->
    <p
      v-if="props.description"
      class="section-subheading-description lead text-muted"
    >
      {{ props.description }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.section-subheading-title {
  position: relative;

  .image {
    width: 35%;
    height: auto;
    z-index: 0;

    position: absolute;
    top: 0;
    right: 0;
  }

  @media screen and (max-width: 768px) {
    .image {
      top: -2.4rem;
    }
  }
}
</style>
