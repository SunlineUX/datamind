<template>
  <div :class="descriptionsClasses">
    <div v-if="title || $slots.title" class="x-descriptions-title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div v-if="extra || $slots.extra" class="x-descriptions-extra">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div :class="viewClasses" :style="viewStyle">
      <div :class="rowClasses" :style="rowStyle">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

export interface DescriptionsProps {
  title?: string
  extra?: string
  bordered?: boolean
  column?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }
  size?: 'default' | 'middle' | 'small'
  layout?: 'horizontal' | 'vertical'
  labelStyle?: Record<string, any>
  contentStyle?: Record<string, any>
}

const props = withDefaults(defineProps<DescriptionsProps>(), {
  title: '',
  extra: '',
  bordered: false,
  column: 3,
  size: 'default',
  layout: 'horizontal',
  labelStyle: () => ({}),
  contentStyle: () => ({})
})

const descriptionsClasses = computed(() => [
  'x-descriptions',
  `x-descriptions-${props.size}`,
  `x-descriptions-${props.layout}`
])

const viewClasses = computed(() => [
  'x-descriptions-view',
  {
    'x-descriptions-bordered': props.bordered
  }
])

const viewStyle = computed(() => {
  const style: Record<string, any> = {}
  return style
})

const rowClasses = computed(() => [
  'x-descriptions-row'
])

const rowStyle = computed(() => {
  return {}
})

const getColumn = () => {
  if (typeof props.column === 'number') {
    return props.column
  }
  return props.column
}

provide('x-descriptions', {
  props,
  getColumn
})
</script>

<style scoped lang="less">
.x-descriptions {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &-title {
    flex: 1;
    font-size: 16px;
    font-weight: 500;
    line-height: 1.5715;
    color: var(--color-text);
  }

  &-extra {
    margin-left: auto;
  }

  &-view {
    width: 100%;
    border-radius: 2px;
  }

  &-row {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  &-item {
    padding-bottom: 0;
    display: flex;
    align-items: baseline;
  }

  &-item-label {
    color: var(--color-text);
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5715;
    text-align: left;
    display: inline-flex;
    align-items: baseline;
  }

  &-item-content {
    display: inline-flex;
    align-items: baseline;
    flex: 1;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5715;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  &-small {
    font-size: 14px;
  }

  &-middle {
    font-size: 14px;
  }

  &-default {
    font-size: 14px;
  }

  &-horizontal {
    .x-descriptions-item {
      padding-bottom: 16px;
    }
  }

  &-vertical {
    .x-descriptions-item {
      padding-bottom: 16px;
    }
  }

  &-bordered {
    .x-descriptions-view {
      border: 1px solid #f0f0f0;
    }

    .x-descriptions-item {
      padding: 16px 24px;
      border-bottom: 1px solid #f0f0f0;
      border-right: 1px solid #f0f0f0;

      &:last-child {
        border-right: none;
      }
    }

    .x-descriptions-item-label {
      background: #fafafa;
      font-weight: 500;
    }

    .x-descriptions-item-label::after {
      content: ':';
      position: relative;
      top: -0.5px;
      margin: 0 8px 0 2px;
    }
  }

  &:not(&-bordered) {
    .x-descriptions-item-label {
      padding-right: 16px;

      &::after {
        content: ':';
        position: relative;
        top: -0.5px;
        margin: 0 8px 0 2px;
      }
    }
  }
}
</style>
