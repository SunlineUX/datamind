<template>
  <label :class="wrapperClasses" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <span :class="radioClasses">
      <input
        ref="inputRef"
        type="radio"
        :class="inputClasses"
        :checked="isChecked"
        :disabled="disabled"
        :value="value"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <span :class="innerClasses"></span>
    </span>
    <span v-if="$slots.default || label" class="x-radio-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface RadioProps {
  modelValue?: string | number | boolean
  label?: string
  value?: string | number | boolean
  disabled?: boolean
  autofocus?: boolean
  size?: 'small' | 'default'
}

const props = withDefaults(defineProps<RadioProps>(), {
  modelValue: undefined,
  label: '',
  value: undefined,
  disabled: false,
  autofocus: false,
  size: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  change: [value: string | number | boolean]
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const hovered = ref(false)

const isChecked = computed(() => {
  return props.modelValue === props.value
})

const wrapperClasses = computed(() => [
  'x-radio-wrapper',
  {
    'x-radio-wrapper-checked': isChecked.value,
    'x-radio-wrapper-disabled': props.disabled
  }
])

const radioClasses = computed(() => [
  'x-radio',
  `x-radio-${props.size}`,
  {
    'x-radio-checked': isChecked.value,
    'x-radio-disabled': props.disabled,
    'x-radio-focused': focused.value,
    'x-radio-hovered': hovered.value
  }
])

const inputClasses = computed(() => 'x-radio-input')

const innerClasses = computed(() => [
  'x-radio-inner',
  {
    'x-radio-inner-checked': isChecked.value
  }
])

const handleChange = () => {
  if (props.value !== undefined) {
    emit('update:modelValue', props.value)
    emit('change', props.value)
  }
}

const handleFocus = () => {
  focused.value = true
}

const handleBlur = () => {
  focused.value = false
}

const handleMouseEnter = () => {
  hovered.value = true
}

const handleMouseLeave = () => {
  hovered.value = false
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

defineExpose({
  focus,
  blur,
  inputRef
})
</script>

<style scoped lang="less">
.x-radio-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  line-height: unset;
  user-select: none;

  &.x-radio-wrapper-disabled {
    cursor: not-allowed;
  }
}

.x-radio {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  cursor: pointer;
  line-height: 1;
  font-size: var(--x-font-size-base);

  &.x-radio-disabled {
    cursor: not-allowed;
  }
}

.x-radio-small {
  font-size: 12px;
}

.x-radio-input {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.x-radio-inner {
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  background-color: var(--color-bg-container);
  border-color: var(--color-form-border);
  border-style: solid;
  border-width: 1px;
  border-radius: 50%;
  transition: all 0.3s;

  .x-radio-small & {
    width: 14px;
    height: 14px;
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 8px;
    height: 8px;
    margin-top: -4px;
    margin-left: -4px;
    background-color: var(--color-primary);
    border-top: 0;
    border-left: 0;
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
    content: ' ';

    .x-radio-small & {
      width: 7px;
      height: 7px;
      margin-top: -3.5px;
      margin-left: -3.5px;
    }
  }
}

.x-radio-inner-checked {
  border-color: var(--color-primary);

  &::after {
    transform: scale(1);
    opacity: 1;
    transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
  }
}

.x-radio:hover .x-radio-inner {
  border-color: var(--color-primary);
}

.x-radio-checked:hover .x-radio-inner {
  border-color: var(--color-primary);
}

.x-radio-focused .x-radio-inner {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.x-radio-disabled .x-radio-inner {
  background-color: var(--color-bg-containerHover);
  border-color: var(--color-form-border);

  &::after {
    background-color: var(--color-textTertiary);
  }
}

.x-radio-disabled.x-radio-checked .x-radio-inner {
  background-color: var(--color-primaryFocus);
  border-color: var(--color-form-border);

  &::after {
    background-color: var(--color-primaryDisabled);
  }
}

.x-radio-label {
  padding: 0 8px;
  line-height: 1.5715;
  user-select: none;
  font-size: var(--x-font-size-sm);
}
</style>
