<template>
  <div :class="spaceClasses" :style="spaceStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SpaceProps {
  direction?: 'horizontal' | 'vertical'
  size?: number | [number, number] | 'small' | 'middle' | 'large'
  align?: 'start' | 'end' | 'center' | 'baseline'
  wrap?: boolean
  fill?: boolean
}

const props = withDefaults(defineProps<SpaceProps>(), {
  direction: 'horizontal',
  size: 'small',
  align: 'start',
  wrap: false,
  fill: false
})

const spaceClasses = computed(() => [
  'x-space',
  `x-space-${props.direction}`,
  {
    'x-space-wrap': props.wrap,
    'x-space-fill': props.fill
  }
])

const spaceStyles = computed(() => {
  const sizeMap = {
    small: 8,
    middle: 16,
    large: 24
  }

  let gap: number | string

  if (Array.isArray(props.size)) {
    gap = `${props.size[0]}px ${props.size[1]}px`
  } else if (typeof props.size === 'number') {
    gap = `${props.size}px`
  } else {
    gap = `${sizeMap[props.size]}px`
  }

  return {
    gap,
    alignItems: props.align
  }
})
</script>

<style scoped lang="less">
.x-space {
  display: inline-flex;
  width: 100%;

  &.x-space-horizontal {
    flex-direction: row;
  }

  &.x-space-vertical {
    flex-direction: column;
  }

  &.x-space-wrap {
    flex-wrap: wrap;
  }

  &.x-space-fill {
    display: flex;
  }

  > * {
    flex-shrink: 0;
  }
}
</style>
