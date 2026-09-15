<template>
  <label :class="wrapperClasses" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <span :class="checkboxClasses">
      <input
        ref="inputRef"
        type="checkbox"
        :class="inputClasses"
        :checked="isChecked"
        :disabled="disabled"
        :value="value"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <span :class="innerClasses">
        <span v-if="isChecked && !indeterminate" class="x-checkbox-inner-check">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 39 16.2 51.7 0l488.8-611.1c4.1-5.2.4-12.9-6.3-12.9z"></path>
          </svg>
        </span>
        <span v-if="indeterminate" class="x-checkbox-inner-indeterminate"></span>
      </span>
    </span>
    <span v-if="$slots.default || label" class="x-checkbox-label">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface CheckboxProps {
  modelValue?: boolean | (string | number | boolean)[]
  label?: string
  value?: string | number | boolean
  disabled?: boolean
  indeterminate?: boolean
  autofocus?: boolean
  size?: 'small' | 'default'
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  modelValue: false,
  label: '',
  value: false,
  disabled: false,
  indeterminate: false,
  autofocus: false,
  size: 'default'
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean | (string | number | boolean)[]]
  change: [value: boolean | (string | number | boolean)[]]
}>()

const inputRef = ref<HTMLInputElement>()
const focused = ref(false)
const hovered = ref(false)

const isChecked = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(props.value)
  }
  return props.modelValue === true
})

const wrapperClasses = computed(() => [
  'x-checkbox-wrapper',
  {
    'x-checkbox-wrapper-checked': isChecked.value,
    'x-checkbox-wrapper-disabled': props.disabled
  }
])

const checkboxClasses = computed(() => [
  'x-checkbox',
  `x-checkbox-${props.size}`,
  {
    'x-checkbox-checked': isChecked.value,
    'x-checkbox-disabled': props.disabled,
    'x-checkbox-indeterminate': props.indeterminate,
    'x-checkbox-focused': focused.value,
    'x-checkbox-hovered': hovered.value
  }
])

const inputClasses = computed(() => 'x-checkbox-input')

const innerClasses = computed(() => [
  'x-checkbox-inner',
  {
    'x-checkbox-inner-checked': isChecked.value,
    'x-checkbox-inner-indeterminate': props.indeterminate
  }
])

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const checked = target.checked

  if (Array.isArray(props.modelValue)) {
    let newValue = [...props.modelValue]
    const index = newValue.indexOf(props.value)
    if (checked) {
      if (index === -1) {
        newValue.push(props.value)
      }
    } else {
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
    emit('update:modelValue', newValue)
    emit('change', newValue)
  } else {
    emit('update:modelValue', checked)
    emit('change', checked)
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
.x-checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  line-height: unset;
  user-select: none;

  &.x-checkbox-wrapper-disabled {
    cursor: not-allowed;
  }
}

.x-checkbox {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: top;
  cursor: pointer;
  line-height: 1;
  font-size: 14px;

  &.x-checkbox-disabled {
    cursor: not-allowed;
  }
}

.x-checkbox-small {
  font-size: 12px;
}

.x-checkbox-input {
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

.x-checkbox-inner {
  position: relative;
  display: block;
  width: 16px;
  height: 16px;
  background-color: var(--color-bg-container);
  border: 1px solid var(--color-form-border);
  border-radius: 2px;
  border-collapse: separate;
  transition: all 0.3s;

  .x-checkbox-small & {
    width: 14px;
    height: 14px;
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 21.5%;
    display: table;
    width: 5.71428571px;
    height: 9.14285714px;
    border: 2px solid var(--color-form-border);
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(0) translate(-50%, -50%);
    opacity: 0;
    transition: all 0.1s cubic-bezier(0.71, -0.46, 0.88, 0.6), opacity 0.1s;
    content: ' ';
  }
}

.x-checkbox-inner-checked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);

  &::after {
    position: absolute;
    display: table;
    border: 2px solid #fff;
    border-top: 0;
    border-left: 0;
    transform: rotate(45deg) scale(1) translate(-50%, -50%);
    opacity: 1;
    transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;
    content: ' ';
  }
}

.x-checkbox-inner-indeterminate {
  background-color: var(--color-primary);
  border-color: var(--color-primary);

  &::after {
    top: 50%;
    left: 50%;
    width: 8px;
    height: 8px;
    background-color: #fff;
    border: 0;
    transform: translate(-50%, -50%);
    opacity: 1;
  }
}

.x-checkbox-inner-check {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 10px;

  svg {
    display: inline-block;
  }
}

.x-checkbox-inner-indeterminate-indeterminate {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 2px;
  background-color: var(--color-bg-container);
  transform: translate(-50%, -50%);
}

.x-checkbox:hover .x-checkbox-inner {
  border-color: var(--color-primary);
}

.x-checkbox-checked:hover .x-checkbox-inner {
  border-color: var(--color-primary);
}

.x-checkbox-focused .x-checkbox-inner {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.x-checkbox-disabled .x-checkbox-inner {
  background-color: var(--color-bg-container);
  border-color: var(--color-form-border);

  &::after {
    border-color: rgba(0, 0, 0, 0.25);
  }
}

.x-checkbox-disabled.x-checkbox-checked .x-checkbox-inner {
  background-color: rgba(0, 0, 0, 0.25);
  border-color: rgba(0, 0, 0, 0.25);

  &::after {
    border-color: var(--color-form-border);
  }
}

.x-checkbox-disabled.x-checkbox-indeterminate .x-checkbox-inner {
  background-color: rgba(0, 0, 0, 0.25);
  border-color: rgba(0, 0, 0, 0.25);

  &::after {
    background-color: var(--color-form-border);
  }
}

.x-checkbox-label {
  padding: 0 8px;
  line-height: 1.5715;
  user-select: none;
}
</style>
