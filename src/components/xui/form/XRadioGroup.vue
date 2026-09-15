<template>
  <div :class="wrapperClasses">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { provide, computed } from 'vue'

interface RadioGroupProps {
  modelValue?: string | number | boolean
  disabled?: boolean
  size?: 'small' | 'default'
  buttonStyle?: 'outline' | 'solid'
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  modelValue: undefined,
  disabled: false,
  size: 'default',
  buttonStyle: 'outline'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const wrapperClasses = computed(() => [
  'x-radio-group',
  `x-radio-group-${props.size}`,
  `x-radio-group-${props.buttonStyle}`
])

const handleChange = (value: string | number | boolean) => {
  emit('update:modelValue', value)
  emit('change', value)
}

provide('radioGroup', {
  modelValue: computed(() => props.modelValue),
  disabled: props.disabled,
  size: props.size,
  buttonStyle: props.buttonStyle,
  onChange: handleChange
})
</script>

<style scoped lang="less">
.x-radio-group {
  display: inline-block;
  font-size: 0;
}

.x-radio-group-small {
  font-size: 12px;
}

.x-radio-group-outline {
  .x-radio-wrapper {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
}

.x-radio-group-solid {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
