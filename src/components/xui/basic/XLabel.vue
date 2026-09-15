<template>
  <span :class="titleClasses">
    <slot></slot>
  </span>
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
  'x-label',
  props.class,
  {
    'x-label-ellipse': props.ellipseRows !== undefined
  }
])
</script>

<style scoped lang="less">

.x-label {
  margin: 0;
  line-height: 1.4;
  color: var(--color-textSecondary);
  font-size: var(--x-font-size-sm);
  display: inline-block;
  &-ellipse {
    display: -webkit-box;
    -webkit-line-clamp: v-bind('ellipseRows || 1');
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>