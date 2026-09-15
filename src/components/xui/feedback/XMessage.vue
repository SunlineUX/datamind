<template>
  <Transition name="x-message-fade">
    <div v-show="visible" :class="messageClasses" :style="messageStyles">
      <span v-if="showIcon" :class="`${prefixCls}-icon`">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'info'">ℹ</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else-if="type === 'error'">✕</span>
        <span v-else-if="type === 'loading'">⟳</span>
      </span>
      <span :class="`${prefixCls}-content`">
        <slot>{{ content }}</slot>
      </span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface MessageProps {
  type?: 'success' | 'info' | 'warning' | 'error' | 'loading'
  content?: string
  duration?: number
  showIcon?: boolean
  top?: number
  onClose?: () => void
}

const props = withDefaults(defineProps<MessageProps>(), {
  type: 'info',
  duration: 3000,
  showIcon: true,
  top: 16
})

const visible = ref(false)
const timer = ref<number | null>(null)

const prefixCls = 'x-message'

const messageClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.type}`,
  {
    [`${prefixCls}-with-icon`]: props.showIcon
  }
])

const messageStyles = computed(() => ({
  top: `${props.top}px`
}))

const startTimer = () => {
  if (props.duration > 0) {
    timer.value = window.setTimeout(() => {
      close()
    }, props.duration)
  }
}

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
}

onMounted(() => {
  visible.value = true
  startTimer()
})

defineExpose({
  close
})
</script>

<style scoped lang="less">
.x-message {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--color-bg-container);
  border-radius: var(--x-radius-base);
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  pointer-events: all;

  &-success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
  }

  &-info {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
  }

  &-warning {
    background-color: #fffbe6;
    border: 1px solid #ffe58f;
  }

  &-error {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
  }

  &-loading {
    background-color: var(--color-bg-container);
    border: 1px solid var(--color-border);
  }

  &-icon {
    margin-right: 8px;
    font-size: 16px;
    line-height: 1;

    .x-message-success & {
      color: #52c41a;
    }

    .x-message-info & {
      color: #1890ff;
    }

    .x-message-warning & {
      color: #faad14;
    }

    .x-message-error & {
      color: #ff4d4f;
    }

    .x-message-loading & {
      color: var(--color-primary);
      animation: x-message-spin 1s linear infinite;
    }
  }

  &-content {
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text);
  }

  &-with-icon {
    padding-left: 38px;
  }
}

.x-message-fade-enter-active,
.x-message-fade-leave-active {
  transition: all 0.3s;
}

.x-message-fade-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.x-message-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

@keyframes x-message-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
