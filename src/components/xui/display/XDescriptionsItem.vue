<template>
  <div :class="itemClasses" :style="itemStyle">
    <div :class="labelClasses" :style="labelStyle">
      <slot name="label">{{ label }}</slot>
    </div>
    <div :class="contentClasses" :style="contentStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

export interface DescriptionsItemProps {
  label?: string
  span?: number
  labelStyle?: Record<string, any>
  contentStyle?: Record<string, any>
}

const props = withDefaults(defineProps<DescriptionsItemProps>(), {
  label: '',
  span: 1,
  labelStyle: () => ({}),
  contentStyle: () => ({})
})

const descriptionsContext: any = inject('x-descriptions', null)

const column = computed(() => {
  return descriptionsContext?.getColumn() || 3
})

const itemClasses = computed(() => [
  'x-descriptions-item',
  `x-descriptions-item-span-${props.span}`
])

const itemStyle = computed(() => {
  const style: Record<string, any> = {}
  const width = `${(props.span / column.value) * 100}%`
  style.width = width
  style.flex = `0 0 ${width}`
  return style
})

const labelClasses = computed(() => [
  'x-descriptions-item-label'
])

const labelStyle = computed(() => {
  return {
    ...props.labelStyle,
    ...descriptionsContext?.props.labelStyle
  }
})

const contentClasses = computed(() => [
  'x-descriptions-item-content'
])

const contentStyle = computed(() => {
  return {
    ...props.contentStyle,
    ...descriptionsContext?.props.contentStyle
  }
})
</script>

<style scoped lang="less">
.x-descriptions-item {
  display: flex;
  align-items: baseline;
  padding-bottom: 0;

  &-label {
    color: var(--color-text);
    font-weight: 400;
    font-size: 14px;
    line-height: 1.5715;
    text-align: left;
    display: inline-flex;
    align-items: baseline;

    &::after {
      content: ':';
      position: relative;
      top: -0.5px;
      margin: 0 8px 0 2px;
    }
  }

  &-content {
    display: inline-flex;
    align-items: baseline;
    flex: 1;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5715;
    word-break: break-word;
    overflow-wrap: break-word;
  }
}

.x-descriptions-bordered {
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
}
</style>
