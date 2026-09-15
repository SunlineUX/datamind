<template>
  <div :class="dividerClasses" :style="dividerStyles">
    <span v-if="slots.default && props.type !== 'dashed'" class="x-divider-inner-text">
      <slot></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface DividerProps {
  direction?: 'horizontal' | 'vertical'
  type?: 'solid' | 'dashed'
  orientation?: 'left' | 'center' | 'right'
  orientationMargin?: string | number
}

const props = withDefaults(defineProps<DividerProps>(), {
  direction: 'horizontal',
  type: 'solid',
  orientation: 'center',
  orientationMargin: undefined
})

const slots = useSlots()

const dividerClasses = computed(() => [
  'x-divider',
  `x-divider-${props.direction}`,
  `x-divider-${props.type}`,
  {
    [`x-divider-with-text-${props.orientation}`]: !!slots.default && props.direction === 'horizontal'
  }
])

const dividerStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (props.orientationMargin !== undefined && slots.default && props.direction === 'horizontal') {
    if (props.orientation === 'left') {
      styles.marginLeft = typeof props.orientationMargin === 'number' 
        ? `${props.orientationMargin}px` 
        : props.orientationMargin
    } else if (props.orientation === 'right') {
      styles.marginRight = typeof props.orientationMargin === 'number' 
        ? `${props.orientationMargin}px` 
        : props.orientationMargin
    }
  }

  return styles
})
</script>

<style scoped lang="less">
.x-divider {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-textSecondary);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  border-top: 1px solid var(--color-border);

  &.x-divider-horizontal {
    display: flex;
    clear: both;
    width: 100%;
    min-width: 100%;
    margin: 24px 0;
  }

  &.x-divider-vertical {
    position: relative;
    top: -0.06em;
    display: inline-block;
    height: 0.9em;
    margin: 0 8px;
    vertical-align: middle;
    border-top: 0;
    border-left: 1px solid var(--color-border);
  }

  &.x-divider-dashed {
    background: none;
    border-color: var(--color-border);
    border-style: dashed;
    border-width: 1px 0 0;
  }

  &.x-divider-vertical.x-divider-dashed {
    border-width: 0 0 0 1px;
  }

  &.x-divider-with-text-left {
    &::before {
      width: 5%;
    }

    &::after {
      width: 95%;
    }
  }

  &.x-divider-with-text-right {
    &::before {
      width: 95%;
    }

    &::after {
      width: 5%;
    }
  }

  &.x-divider-with-text-center {
    &::before {
      width: 50%;
    }

    &::after {
      width: 50%;
    }
  }

  &.x-divider-with-text-left,
  &.x-divider-with-text-right,
  &.x-divider-with-text-center {
    display: flex;
    align-items: center;
    margin: 16px 0;
    color: var(--color-text);
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
    text-align: center;
    border-top: 0;

    &::before,
    &::after {
      position: relative;
      width: 50%;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      border-top-color: var(--color-border);
      transform: translateY(50%);
      content: '';
    }

    .x-divider-inner-text {
      display: inline-block;
      padding: 0 1em;
    }
  }

  &.x-divider-dashed.x-divider-with-text-left,
  &.x-divider-dashed.x-divider-with-text-right,
  &.x-divider-dashed.x-divider-with-text-center {
    border-top: 0;

    &::before,
    &::after {
      border-style: dashed none none;
    }
  }
}
</style>
