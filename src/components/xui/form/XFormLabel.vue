<template>
  <label :class="labelClasses" :style="labelStyle" :for="htmlFor">
    <slot></slot>
  </label>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

interface FormLabelProps {
  required?: boolean
  colon?: boolean
  htmlFor?: string
  label?: string
  labelCol?: Record<string, any>
  labelAlign?: 'left' | 'right' | 'top'
}

const props = withDefaults(defineProps<FormLabelProps>(), {
  required: false,
  colon: true,
  htmlFor: '',
  label: '',
  labelCol: () => ({}),
  labelAlign: 'top'
})

const slots = useSlots()

const hasLabel = computed(() => {
   
  return props.label !== ''
})

const labelClasses = computed(() => [
  'x-form-item-label',
  `x-form-item-label-${props.labelAlign}`,
  {
    'x-form-item-label-required': props.required,
    'x-form-item-label-no-colon': !hasLabel.value
  }
])

const labelStyle = computed(() => {
  const styles: Record<string, any> = {}

  if (props.labelAlign !== 'top' && props.labelCol) {
    if (props.labelCol.span) {
      styles.flex = `0 0 ${(props.labelCol.span / 24) * 100}%`
      styles.maxWidth = `${(props.labelCol.span / 24) * 100}%`
    }
    if (props.labelCol.offset) {
      styles.marginLeft = `${(props.labelCol.offset / 24) * 100}%`
    }
  }

  return styles
})
</script>

<style scoped lang="less">
.x-form-item-label {
  display: flex;
  flex-grow: 0;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
  padding-right: 8px;
  line-height: 32px;

  &-left {
    text-align: left;
    align-items: center;
    justify-content: flex-start;
  }

  &-right {
    text-align: right;
    align-items: center;
    justify-content: flex-end;
  }

  &-top {
    display: block;
    text-align: left;
    padding-right: 0;
    padding-bottom: 8px;
    line-height: 1.5715;
    height: 30px;

    &::after {
      display: none;
    }
  }

  &::after {
    content: ':';
    margin: 0 8px 0 2px;
  }

  &-no-colon {
    &::after {
      opacity: 0;
    }
  }

  &-required {
    &::before {
      display: inline-block;
      margin-right: 4px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }
}
</style>
