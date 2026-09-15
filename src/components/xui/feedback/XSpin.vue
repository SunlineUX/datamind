<template>
  <div :class="spinClasses" :style="spinStyles">
    <div v-if="!$slots.default" :class="`${prefixCls}-nested-loading`">
      <div :class="`${prefixCls}-loading-content`">
        <span :class="`${prefixCls}-dot`">
          <span v-for="i in 4" :key="i" :class="`${prefixCls}-dot-item`"></span>
        </span>
        <div v-if="tip" :class="`${prefixCls}-tip`">{{ tip }}</div>
      </div>
    </div>
    <div v-else :class="`${prefixCls}-nested-loading`">
      <div :class="`${prefixCls}-loading-content`">
        <span :class="`${prefixCls}-dot`">
          <span v-for="i in 4" :key="i" :class="`${prefixCls}-dot-item`"></span>
        </span>
        <div v-if="tip" :class="`${prefixCls}-tip`">{{ tip }}</div>
      </div>
      <div :class="`${prefixCls}-container`">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface SpinProps {
  spinning?: boolean
  size?: 'small' | 'default' | 'large'
  tip?: string
  delay?: number
  indicator?: any
  wrapperClassName?: string
}

const props = withDefaults(defineProps<SpinProps>(), {
  spinning: true,
  size: 'default',
  delay: 0
})

const prefixCls = 'x-spin'

const visible = ref(false)

const spinClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.size}`,
  props.wrapperClassName,
  {
    [`${prefixCls}-spinning`]: props.spinning && visible.value,
    [`${prefixCls}-show-text`]: !!props.tip
  }
])

const spinStyles = computed(() => ({}))

onMounted(() => {
  if (props.delay > 0) {
    setTimeout(() => {
      visible.value = props.spinning
    }, props.delay)
  } else {
    visible.value = props.spinning
  }
})
</script>

<style scoped lang="less">
.x-spin {
  display: inline-block;
  position: relative;
  font-size: 0;
  vertical-align: middle;

  &-nested-loading {
    position: relative;
  }

  &-container {
    position: relative;
    transition: opacity 0.3s;

    .x-spin-blur {
      opacity: 0.5;
      user-select: none;
      pointer-events: none;
    }
  }

  &-loading-content {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 4;
  }

  &-dot {
    position: relative;
    display: inline-block;
    font-size: 20px;
    width: 1em;
    height: 1em;

    &-item {
      position: absolute;
      display: block;
      width: 9px;
      height: 9px;
      background-color: var(--color-primary);
      border-radius: 100%;
      transform: scale(0.75);
      transform-origin: 50% 50%;
      opacity: 0.3;
      animation: x-spinMove 1s infinite linear alternate;

      &:nth-child(1) {
        top: 0;
        left: 0;
      }

      &:nth-child(2) {
        top: 0;
        right: 0;
        animation-delay: 0.4s;
      }

      &:nth-child(3) {
        right: 0;
        bottom: 0;
        animation-delay: 0.8s;
      }

      &:nth-child(4) {
        bottom: 0;
        left: 0;
        animation-delay: 1.2s;
      }
    }
  }

  &-tip {
    position: absolute;
    top: 50%;
    width: 100%;
    padding-top: 10px;
    text-align: center;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5;
    transform: translateY(50%);
  }

  &-small {
    .x-spin-dot {
      font-size: 14px;

      &-item {
        width: 6px;
        height: 6px;
      }
    }
  }

  &-large {
    .x-spin-dot {
      font-size: 32px;

      &-item {
        width: 14px;
        height: 14px;
      }
    }
  }

  &-spinning {
    .x-spin-container {
      user-select: none;
      pointer-events: none;
    }
  }
}

@keyframes x-spinMove {
  to {
    opacity: 1;
  }
}
</style>
