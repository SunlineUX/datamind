<template>
  <div :class="progressClasses">
    <div v-if="showInfo && type !== 'circle'" :class="`${prefixCls}-outer`">
      <div :class="`${prefixCls}-inner`">
        <div :class="`${prefixCls}-bg`" :style="progressStyles"></div>
        <div v-if="strokeColor && Array.isArray(strokeColor)" :class="`${prefixCls}-bg-gradient`" :style="gradientStyles"></div>
      </div>
    </div>
    <div v-if="showInfo && type !== 'circle'" :class="`${prefixCls}-text`">
      <slot name="format">{{ format ? format(percent) : `${percent}%` }}</slot>
    </div>
    <div v-if="type === 'circle'" :class="`${prefixCls}-circle`">
      <svg :class="`${prefixCls}-circle-svg`" :viewBox="viewBox">
        <defs v-if="Array.isArray(strokeColor)">
          <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop v-for="(color, index) in strokeColor" :key="index" :offset="`${(index / (strokeColor.length - 1)) * 100}%`" :stop-color="color"></stop>
          </linearGradient>
        </defs>
        <path :class="`${prefixCls}-circle-trail`" :d="trailPath" :stroke="trailColor" :stroke-width="strokeWidth" fill="none"></path>
        <path :class="`${prefixCls}-circle-path`" :d="path" :stroke="Array.isArray(strokeColor) ? `url(#${gradientId})` : strokeColor" :stroke-width="strokeWidth" fill="none" :style="circleStyles"></path>
      </svg>
      <div v-if="showInfo" :class="`${prefixCls}-circle-text`">
        <slot name="format">{{ format ? format(percent) : `${percent}%` }}</slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ProgressProps {
  type?: 'line' | 'circle'
  percent?: number
  status?: 'normal' | 'exception' | 'active' | 'success'
  showInfo?: boolean
  strokeWidth?: number
  strokeColor?: string | string[]
  trailColor?: string
  size?: number | 'small' | 'default'
  format?: (percent: number) => string
}

const props = withDefaults(defineProps<ProgressProps>(), {
  type: 'line',
  percent: 0,
  status: 'normal',
  showInfo: true,
  strokeWidth: 8,
  trailColor: '#f5f5f5',
  size: 'default'
})

const prefixCls = 'x-progress'

const gradientId = computed(() => `x-progress-gradient-${Math.random().toString(36).substr(2, 9)}`)

const progressClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.type}`,
  `${prefixCls}-${props.status}`,
  {
    [`${prefixCls}-show-info`]: props.showInfo,
    [`${prefixCls}-${props.size}`]: props.type === 'line'
  }
])

const progressStyles = computed(() => ({
  width: `${Math.min(Math.max(props.percent, 0), 100)}%`,
  backgroundColor: typeof props.strokeColor === 'string' ? props.strokeColor : undefined
}))

const gradientStyles = computed(() => {
  if (Array.isArray(props.strokeColor)) {
    const gradient = props.strokeColor.join(', ')
    return {
      backgroundImage: `linear-gradient(to right, ${gradient})`,
      width: `${Math.min(Math.max(props.percent, 0), 100)}%`
    }
  }
  return {}
})

const viewBox = computed(() => {
  const size = props.size === 'small' ? 60 : 120
  return `0 0 ${size} ${size}`
})

const radius = computed(() => {
  const size = props.size === 'small' ? 60 : 120
  return (size - props.strokeWidth) / 2
})

const center = computed(() => {
  const size = props.size === 'small' ? 60 : 120
  return size / 2
})

const trailPath = computed(() => {
  const r = radius.value
  const c = center.value
  return `M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c} ${c + r} A ${r} ${r} 0 1 1 ${c} ${c - r}`
})

const path = computed(() => {
  const r = radius.value
  const c = center.value
  const percent = Math.min(Math.max(props.percent, 0), 100) / 100
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + percent * 2 * Math.PI
  
  const x1 = c + r * Math.cos(startAngle)
  const y1 = c + r * Math.sin(startAngle)
  const x2 = c + r * Math.cos(endAngle)
  const y2 = c + r * Math.sin(endAngle)
  
  const largeArcFlag = percent > 0.5 ? 1 : 0
  
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`
})

const circleStyles = computed(() => {
  const percent = Math.min(Math.max(props.percent, 0), 100) / 100
  return {
    strokeDasharray: `${2 * Math.PI * radius.value} ${2 * Math.PI * radius.value}`,
    strokeDashoffset: `${2 * Math.PI * radius.value * (1 - percent)}`,
    transition: 'stroke-dashoffset 0.3s ease 0s'
  }
})
</script>

<style scoped lang="less">
.x-progress {
  display: inline-block;
  width: 100%;
  font-size: 14px;
  line-height: 1.5;

  &-line {
    display: flex;
    align-items: center;
  }

  &-small {
    .x-progress-outer {
      height: 8px;
    }

    .x-progress-inner {
      height: 8px;
    }
  }

  &-outer {
    flex: 1;
    margin-right: 8px;
    height: 12px;
  }

  &-inner {
    position: relative;
    display: inline-block;
    width: 100%;
    height: 12px;
    background-color: #f5f5f5;
    border-radius: 100px;
    overflow: hidden;
  }

  &-bg {
    position: relative;
    background-color: var(--color-primary);
    border-radius: 100px;
    transition: width 0.3s ease-in-out;
    height: 100%;

    &-gradient {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      border-radius: 100px;
      transition: width 0.3s ease-in-out;
    }
  }

  &-text {
    display: inline-block;
    width: 2em;
    margin-left: 8px;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1;
    white-space: nowrap;
    word-wrap: normal;
    text-align: left;
    vertical-align: middle;
  }

  &-circle {
    position: relative;
    display: inline-block;
    width: 120px;
    height: 120px;

    &.x-progress-small {
      width: 60px;
      height: 60px;
    }
  }

  &-circle-svg {
    display: block;
    width: 100%;
    height: 100%;
  }

  &-circle-trail {
    stroke: #f5f5f5;
  }

  &-circle-path {
    stroke: var(--color-primary);
    transition: stroke-dashoffset 0.3s ease-in-out;
  }

  &-circle-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: var(--color-text);
    font-size: 24px;
    line-height: 1;
    white-space: nowrap;
    text-align: center;

    .x-progress-small & {
      font-size: 14px;
    }
  }

  &-success {
    .x-progress-bg,
    .x-progress-circle-path {
      background-color: #52c41a;
      stroke: #52c41a;
    }
  }

  &-exception {
    .x-progress-bg,
    .x-progress-circle-path {
      background-color: #ff4d4f;
      stroke: #ff4d4f;
    }
  }

  &-active {
    .x-progress-bg {
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.3) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: x-progress-active 2.4s cubic-bezier(0.23, 1, 0.32, 1) infinite;
      }
    }
  }
}

@keyframes x-progress-active {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}
</style>
