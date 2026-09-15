<template>
  <h3 :class="titleClasses">
    <slot></slot>
  </h3>
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

  &-level-3 {
    font-size: var(--x-font-size-lg);
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