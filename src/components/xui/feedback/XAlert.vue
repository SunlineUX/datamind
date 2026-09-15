<template>
  <div :class="alertClasses" v-if="visible">
    <span v-if="showIcon" :class="iconClasses">
      <slot name="icon">
        <span v-if="type === 'success'">✓</span>
        <span v-else-if="type === 'info'">ℹ</span>
        <span v-else-if="type === 'warning'">⚠</span>
        <span v-else-if="type === 'error'">✕</span>
      </slot>
    </span>
    <div :class="`${prefixCls}-content`">
      <span v-if="title || $slots.title" :class="`${prefixCls}-message`">
        <slot name="title">{{ title }}</slot>
      </span>
      <span v-if="description || $slots.default" :class="`${prefixCls}-description`">
        <slot>{{ description }}</slot>
      </span>
    </div>
    <span v-if="closable" :class="`${prefixCls}-close-icon`" @click="handleClose">
      <slot name="closeElement">
        <span>{{ closeText || '×' }}</span>
      </slot>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

interface AlertProps {
  type?: 'success' | 'info' | 'warning' | 'error'
  closable?: boolean
  closeText?: string
  showIcon?: boolean
  banner?: boolean
  description?: string
  title?: string
}

const props = withDefaults(defineProps<AlertProps>(), {
  type: 'info',
  closable: false,
  showIcon: false,
  banner: false
})

const emit = defineEmits<{
  close: []
  afterClose: []
}>()

const slots = useSlots()
const visible = ref(true)

const prefixCls = 'x-alert'

const alertClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.type}`,
  {
    [`${prefixCls}-with-description`]: props.description || slots.default,
    [`${prefixCls}-no-icon`]: !props.showIcon,
    [`${prefixCls}-banner`]: props.banner,
    [`${prefixCls}-closable`]: props.closable
  }
])

const iconClasses = computed(() => [
  `${prefixCls}-icon`,
  `${prefixCls}-icon-${props.type}`
])

const handleClose = () => {
  visible.value = false
  emit('close')
  setTimeout(() => {
    emit('afterClose')
  }, 150)
}
</script>

<style scoped lang="less">
.x-alert {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 8px 15px;
  word-wrap: break-word;
  background-color: var(--color-bg-container);
  border-radius: var(--x-radius-base);
  border: 1px solid transparent;
  transition: all 0.3s;

  &-success {
    background-color: #f6ffed;
    border-color: #b7eb8f;
  }

  &-info {
    background-color: #e6f7ff;
    border-color: #91d5ff;
  }

  &-warning {
    background-color: #fffbe6;
    border-color: #ffe58f;
  }

  &-error {
    background-color: #fff2f0;
    border-color: #ffccc7;
  }

  &-icon {
    margin-right: 8px;
    font-size: 16px;
    line-height: 1.5;

    &-success {
      color: #52c41a;
    }

    &-info {
      color: #1890ff;
    }

    &-warning {
      color: #faad14;
    }

    &-error {
      color: #ff4d4f;
    }
  }

  &-content {
    flex: 1;
    min-width: 0;
  }

  &-message {
    color: var(--color-text);
    font-size: 14px;
    line-height: 22px;
    display: block;
    margin-bottom: 0;
  }

  &-description {
    display: block;
    color: var(--color-textSecondary);
    font-size: 14px;
    line-height: 22px;
    margin-top: 4px;
  }

  &-close-icon {
    margin-left: 8px;
    padding: 0 8px;
    cursor: pointer;
    font-size: 16px;
    line-height: 1.5;
    color: var(--color-textSecondary);
    transition: color 0.3s;

    &:hover {
      color: var(--color-text);
    }
  }

  &-with-description {
    padding: 15px 15px 15px 37px;
    align-items: flex-start;

    .x-alert-icon {
      position: absolute;
      top: 16.5px;
      left: 15px;
      font-size: 24px;
    }

    .x-alert-message {
      font-size: 16px;
      margin-bottom: 4px;
    }
  }

  &-no-icon {
    padding-left: 15px;
  }

  &-banner {
    border-radius: 0;
    border: 0;
    margin-bottom: 0;
  }

  &-closable {
    padding-right: 38px;
  }
}
</style>
