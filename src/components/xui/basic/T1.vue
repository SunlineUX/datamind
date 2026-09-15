<template>
  <h1 :class="titleClasses">
    <slot></slot>
  </h1>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TitleProps {
  ellipseRows?: number
  class?: string
}

const props = withDefaults(defineProps<TitleProps>(), {
  ellipseRows: undefined,
  class: ''
})

const titleClasses = computed(() => [
  'x-title',
  'x-title-level-1',
  props.class,
  {
    'x-title-ellipse': props.ellipseRows !== undefined
  }
])
</script>

<style scoped lang="less">

.x-title {
  margin: 0;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);

  &-level-1 {
    font-size: var(--x-font-size-2xl);
  }

  &-ellipse {
    display: -webkit-box;
    -webkit-line-clamp: v-bind('ellipseRows || 1');
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>