<template>
  <span :class="badgeClasses">
    <slot></slot>
    <sup
      v-if="showBadge"
      :class="badgeCountClasses"
      :style="badgeStyle"
      :title="title"
    >
      <slot name="count">
        <span v-if="isDot"></span>
        <span v-else>{{ displayCount }}</span>
      </slot>
    </sup>
  </span>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface BadgeProps {
  count?: number | string
  dot?: boolean
  overflowCount?: number
  showZero?: boolean
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning'
  text?: string
  color?: string
  title?: string
  offset?: [number, number]
}

const props = withDefaults(defineProps<BadgeProps>(), {
  count: 0,
  dot: false,
  overflowCount: 99,
  showZero: false,
  status: undefined,
  text: '',
  color: '',
  title: '',
  offset: undefined
})

const slots = useSlots()

const isDot = computed(() => props.dot || props.status !== undefined)

const displayCount = computed(() => {
  if (typeof props.count === 'number' && props.count > props.overflowCount) {
    return `${props.overflowCount}+`
  }
  return props.count
})

const showBadge = computed(() => {
  if (props.showZero) return true
  if (typeof props.count === 'number') return props.count > 0
  return !!props.count
})

const badgeClasses = computed(() => [
  'x-badge',
  {
    'x-badge-status': props.status !== undefined,
    'x-badge-not-a-wrapper': !slots.default
  }
])

const badgeCountClasses = computed(() => [
  'x-badge-count',
  {
    'x-badge-count-a': !isDot.value,
    'x-badge-count-dot': isDot.value,
    'x-badge-count-custom': props.color && !props.status,
    [`x-badge-status-${props.status}`]: props.status !== undefined
  }
])

const badgeStyle = computed(() => {
  const style: Record<string, any> = {}

  if (props.color && !props.status) {
    style.backgroundColor = props.color
  }

  if (props.offset) {
    const [right, top] = props.offset
    style.right = `${-right}px`
    style.top = `${top}px`
  }

  return style
})
</script>

<style scoped lang="less">
.x-badge {
  position: relative;
  display: inline-block;
  line-height: 1;

  &-count {
    position: absolute;
    top: 0;
    right: 0;
    z-index: auto;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    color: #fff;
    font-weight: normal;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    text-align: center;
    background: #ff4d4f;
    border-radius: 10px;
    box-shadow: 0 0 0 1px #fff;
    transform: translate(50%, -50%);
    transform-origin: 100% 0%;
    transition: all 0.3s;
  }

  &-count-a {
    position: absolute;
    transform: translate(50%, -50%);
  }

  &-count-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 6px;
    height: 6px;
    min-width: 6px;
    padding: 0;
    background: #ff4d4f;
    border-radius: 100%;
    box-shadow: 0 0 0 1px #fff;
    transform: translate(50%, -50%);
  }

  &-count-custom {
    background: transparent;
  }

  &-status {
    line-height: inherit;
    vertical-align: baseline;

    .x-badge-count {
      position: static;
      display: inline-block;
      transform: none;
    }
  }

  &-status-success {
    background: #52c41a;
  }

  &-status-processing {
    background: #1890ff;
    position: relative;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 1px solid #1890ff;
      animation: antStatusProcessing 1.2s infinite ease-in-out;
      content: '';
    }
  }

  &-status-default {
    background: #d9d9d9;
  }

  &-status-error {
    background: #ff4d4f;
  }

  &-status-warning {
    background: #faad14;
  }

  &-not-a-wrapper {
    .x-badge-count {
      position: relative;
      top: auto;
      right: auto;
      display: inline-block;
      transform: none;
    }
  }
}

@keyframes antStatusProcessing {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(2.4);
    opacity: 0;
  }
}
</style>
