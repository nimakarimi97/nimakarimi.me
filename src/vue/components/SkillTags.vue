<script setup>
const props = defineProps({
  skills: Object,
})
</script>

<template>
  <ul class="skills">
    <li v-for="skill in props.skills" :key="skill" class="skill-item text-1">
      <span v-html="skill.label || skill" />
    </li>
  </ul>
</template>

<style lang="scss" scoped>
@import '/src/scss/_theming.scss';

ul.skills {
  display: block;
  list-style: none;
  padding: 0;
  margin: 0;
  line-height: 20px;
}

li.skill-item {
  display: inline-flex;
  background-color: $primary;
  color: $white;
  border-radius: 5px;
  white-space: nowrap;
  user-select: none;
  transition: 0.5s background-color ease-in-out;

  &:hover {
    background-color: darken($primary, 20%);
  }

  margin-right: 4px;
  margin-bottom: 4px;
  padding: 3px 10px;

  @include media-breakpoint-down(md) {
    margin-right: 3px;
    margin-bottom: 3px;
    padding: 2px 8px;
  }
}
</style>
