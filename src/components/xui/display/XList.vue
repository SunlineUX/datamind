<template>
  <div :class="listClasses" :style="listStyle">
    <div v-if="header" class="x-list-header">
      <slot name="header">{{ header }}</slot>
    </div>

    <div v-if="loading && !dataSource?.length" class="x-list-loading">
      <slot name="loading">
        <div class="x-list-loading-spinner"></div>
      </slot>
    </div>

    <div v-else-if="!dataSource?.length && !loading" class="x-list-empty">
      <slot name="empty">
        <div class="x-list-empty-text">暂无数据</div>
      </slot>
    </div>

    <div v-else :class="gridClasses">
      <slot></slot>
    </div>

    <div v-if="pagination" class="x-list-pagination">
      <slot name="pagination">
        <div class="x-list-pagination-content">{{ pagination }}</div>
      </slot>
    </div>

    <div v-if="footer" class="x-list-footer">
      <slot name="footer">{{ footer }}</slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface ListProps {
  bordered?: boolean
  dataSource?: any[]
  grid?: {
    gutter?: number
    column?: number
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
    xxl?: number
  }
  header?: string
  footer?: string
  loading?: boolean
  pagination?: any
  size?: 'default' | 'small' | 'large'
  split?: boolean
}

const props = withDefaults(defineProps<ListProps>(), {
  bordered: false,
  dataSource: () => [],
  grid: undefined,
  header: '',
  footer: '',
  loading: false,
  pagination: false,
  size: 'default',
  split: true
})

const listClasses = computed(() => [
  'x-list',
  `x-list-${props.size}`,
  {
    'x-list-bordered': props.bordered,
    'x-list-split': props.split,
    'x-list-vertical': !props.grid
  }
])

const listStyle = computed(() => {
  if (!props.grid) return {}

  const style: Record<string, any> = {}
  if (props.grid.gutter !== undefined) {
    style.margin = `-${props.grid.gutter / 2}px`
  }
  return style
})

const gridClasses = computed(() => {
  if (!props.grid) return 'x-list-items'

  return [
    'x-list-grid',
    'x-list-items'
  ]
})

defineExpose({
  dataSource: props.dataSource
})
</script>

<style scoped lang="less">
.x-list {
  position: relative;
  box-sizing: border-box;
  color: var(--color-text);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  background: #fff;
  border-radius: 2px;
  transition: all 0.3s;

  &-default {
    padding: 24px;
  }

  &-small {
    padding: 12px;
  }

  &-large {
    padding: 32px;
  }

  &-bordered {
    border: 1px solid #f0f0f0;
  }

  &-split {
    .x-list-items > :deep(.x-list-item) {
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  &-header {
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }

  &-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #f0f0f0;
  }

  &-loading {
    padding: 40px 0;
    text-align: center;
  }

  &-loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &-empty {
    padding: 40px 0;
    text-align: center;
  }

  &-empty-text {
    color: rgba(0, 0, 0, 0.25);
  }

  &-items {
    display: block;
  }

  &-grid {
    display: grid;
    gap: 16px;

    > :deep(.x-list-item) {
      margin-bottom: 0;
    }
  }

  &-pagination {
    margin-top: 24px;
    text-align: right;
  }

  &-pagination-content {
    display: inline-block;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
