<template>
  <Transition name="x-notification-slide">
    <div v-show="visible" :class="notificationClasses" :style="notificationStyles">
      <div :class="`${prefixCls}-notice`">
        <div v-if="closable" :class="`${prefixCls}-close`" @click="handleClose">
          <span>{{ closeIcon || '×' }}</span>
        </div>
        <div :class="`${prefixCls}-notice-content`">
          <div v-if="title || $slots.title" :class="`${prefixCls}-notice-title`">
            <slot name="title">{{ title }}</slot>
          </div>
          <div :class="`${prefixCls}-notice-description`">
            <slot>{{ description }}</slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'

interface NotificationProps {
  type?: 'success' | 'info' | 'warning' | 'error'
  title?: string
  description?: string
  duration?: number
  closable?: boolean
  closeIcon?: string
  onClose?: () => void
  top?: number
  bottom?: number
}

const props = withDefaults(defineProps<NotificationProps>(), {
  type: 'info',
  duration: 4.5,
  closable: true,
  top: 24,
  bottom: 24
})

const visible = ref(false)
const timer = ref<number | null>(null)

const prefixCls = 'x-notification'

const notificationClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.type}`
])

const notificationStyles = computed(() => ({
  top: `${props.top}px`,
  right: '24px'
}))

const startTimer = () => {
  if (props.duration > 0) {
    timer.value = window.setTimeout(() => {
      close()
    }, props.duration * 1000)
  }
}

const close = () => {
  visible.value = false
  if (props.onClose) {
    props.onClose()
  }
}

const handleClose = () => {
  close()
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
.x-notification {
  position: fixed;
  z-index: 1010;
  width: 384px;
  max-width: calc(100vw - 48px);
  margin-bottom: 16px;
  overflow: hidden;
  background: var(--color-bg-container);
  border-radius: var(--x-radius-base);
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  &-success {
    border-left: 4px solid #52c41a;
  }

  &-info {
    border-left: 4px solid #1890ff;
  }

  &-warning {
    border-left: 4px solid #faad14;
  }

  &-error {
    border-left: 4px solid #ff4d4f;
  }

  &-notice {
    position: relative;
    padding: 16px 24px;
    overflow: hidden;
    line-height: 1.5;
    word-wrap: break-word;
  }

  &-close {
    position: absolute;
    top: 16px;
    right: 22px;
    color: var(--color-textSecondary);
    outline: none;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    transition: color 0.3s;

    &:hover {
      color: var(--color-text);
    }
  }

  &-notice-content {
    padding-right: 16px;
  }

  &-notice-title {
    margin-right: 8px;
    margin-bottom: 8px;
    color: var(--color-text);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  &-notice-description {
    font-size: 14px;
    color: var(--color-textSecondary);
    line-height: 22px;
  }
}

.x-notification-slide-enter-active,
.x-notification-slide-leave-active {
  transition: all 0.3s;
}

.x-notification-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.x-notification-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
