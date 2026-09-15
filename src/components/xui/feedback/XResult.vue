<template>
  <div :class="resultClasses">
    <div :class="`${prefixCls}-icon`">
      <slot name="icon">
        <span v-if="status === 'success'" :class="`${prefixCls}-icon-success`">✓</span>
        <span v-else-if="status === 'error'" :class="`${prefixCls}-icon-error`">✕</span>
        <span v-else-if="status === 'info'" :class="`${prefixCls}-icon-info`">ℹ</span>
        <span v-else-if="status === 'warning'" :class="`${prefixCls}-icon-warning`">⚠</span>
      </slot>
    </div>
    <div v-if="title || $slots.title" :class="`${prefixCls}-title`">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="subTitle || $slots.subTitle" :class="`${prefixCls}-subtitle`">
      <slot name="subTitle">{{ subTitle }}</slot>
    </div>
    <div v-if="$slots.extra" :class="`${prefixCls}-extra`">
      <slot name="extra"></slot>
    </div>
    <div v-if="$slots.content" :class="`${prefixCls}-content`">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface ResultProps {
  status?: 'success' | 'error' | 'info' | 'warning' | '404' | '403' | '500'
  title?: string
  subTitle?: string
}

const props = withDefaults(defineProps<ResultProps>(), {
  status: 'info'
})

const prefixCls = 'x-result'

const resultClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.status}`
])
</script>

<style scoped lang="less">
.x-result {
  padding: 48px 32px;
  text-align: center;

  &-icon {
    margin-bottom: 24px;
    font-size: 72px;
    line-height: 72px;

    > span {
      display: inline-block;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      line-height: 72px;
    }

    &-success {
      background-color: #f6ffed;
      color: #52c41a;
    }

    &-error {
      background-color: #fff2f0;
      color: #ff4d4f;
    }

    &-info {
      background-color: #e6f7ff;
      color: #1890ff;
    }

    &-warning {
      background-color: #fffbe6;
      color: #faad14;
    }
  }

  &-title {
    font-size: 24px;
    color: var(--color-text);
    font-weight: 500;
    line-height: 1.5;
    margin-bottom: 16px;
  }

  &-subtitle {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.5;
    margin-bottom: 24px;
  }

  &-content {
    padding: 24px 40px;
    background-color: var(--x-bg-container);
    border-radius: var(--color-border-radius);
    text-align: left;
    margin-top: 32px;
  }

  &-extra {
    margin-top: 32px;
    text-align: center;

    > * {
      margin-right: 8px;

      &:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
