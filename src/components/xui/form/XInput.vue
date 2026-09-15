<template>
  <div :class="wrapperClasses">
    <span v-if="$slots.prefix || prefix" class="x-input-prefix">
      <slot name="prefix">{{ prefix }}</slot>
    </span>
    <input
      v-if="type !== 'textarea'"
      ref="inputRef"
      v-model="innerValue"
      :type="inputType"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :class="inputClasses"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      @keydown="handleKeydown"
    />
    <textarea
      v-else
      ref="inputRef"
      v-model="innerValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :class="inputClasses"
      :rows="rows"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
    ></textarea>
    <span v-if="showClear" class="x-input-clear" @click="handleClear">
      <svg viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.6-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.6 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
      </svg>
    </span>
    <span v-if="type === 'password' && showPasswordToggle" class="x-input-password-toggle" @click="togglePassword">
      <svg v-if="!passwordVisible" viewBox="64 64 896 896" focusable="false" data-icon="eye-invisible" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.9 0-279.4-81.8-362.7-254C232.6 339.8 350.1 258 512 258c161.9 0 279.4 81.8 362.7 254C791.5 684.2 674 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
      </svg>
      <svg v-else viewBox="64 64 896 896" focusable="false" data-icon="eye" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M942.2 486.2Q889.47 375.11 816.7 305c-73.58-70.23-172.09-111.87-304.7-111.87S280.58 234.77 207 305c-72.77 70.11-125.5 181.21-125.5 181.21s52.73 111.1 125.5 181.21c73.58 70.23 172.09 111.87 304.7 111.87s231.12-41.64 304.7-111.87c72.77-70.11 125.5-181.21 125.5-181.21zM724.8 339.89c61.41 61.41 90.83 150.09 70.8 235.46-1.73 7.06-5.83 9.88-12.3 6.7-43.68-21.73-95.27-33.64-147.32-33.64-51.48 0-102.47 11.68-145.66 33.05-6.72 3.28-10.97.35-12.75-6.8-20.05-85.36 9.39-174.04 70.79-235.45 61.5-61.5 150.18-90.92 235.55-70.89 7.06 1.73 9.88 5.83 6.7 12.3-21.73 43.68-33.64 95.27-33.64 147.32 0 51.48 11.68 102.47 33.05 145.66 3.28 6.72.35 10.97-6.8 12.75-85.36 20.05-174.04-9.39-235.45-70.79-61.5-61.5-90.92-150.18-70.89-235.55 1.73-7.06 5.83-9.88 12.3-6.7 43.68 21.73 95.27 33.64 147.32 33.64 51.48 0 102.47-11.68 145.66-33.05 6.72-3.28 10.97-.35 12.75 6.8 20.05 85.36-9.39 174.04-70.79 235.45zM512 336c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path>
      </svg>
    </span>
    <span v-if="$slots.suffix || suffix" class="x-input-suffix">
      <slot name="suffix">{{ suffix }}</slot>
    </span>
    <span v-if="showCount && maxlength" class="x-input-count">
      {{ valueLength }} / {{ maxlength }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

interface InputProps {
  modelValue?: string | number
  type?: 'text' | 'password' | 'textarea' | 'url' | 'email' | 'search'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  size?: 'large' | 'middle' | 'small'
  prefix?: string
  suffix?: string
  allowClear?: boolean
  bordered?: boolean
  maxlength?: number
  showCount?: boolean
  rows?: number
  status?: 'error' | 'warning'
}

const props = withDefaults(defineProps<InputProps>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'middle',
  prefix: '',
  suffix: '',
  allowClear: false,
  bordered: true,
  rows: 2,
  status: undefined
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  input: [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  change: [value: string | number]
  clear: []
  keydown: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement | HTMLTextAreaElement>()
const slots = useSlots()
const focused = ref(false)
const passwordVisible = ref(false)

const innerValue = computed({
  get: () => props.modelValue,
  set: (val: string | number) => emit('update:modelValue', val)
})

const inputType = computed(() => {
  if (props.type === 'password') {
    return passwordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const showClear = computed(() => {
  return props.allowClear && !props.disabled && !props.readonly && String(props.modelValue).length > 0 && focused.value
})

const showPasswordToggle = computed(() => {
  return props.type === 'password'
})

const valueLength = computed(() => {
  return String(props.modelValue || '').length
})

const wrapperClasses = computed(() => [
  'x-input-wrapper',
  `x-input-wrapper-${props.size}`,
  {
    'x-input-disabled': props.disabled,
    'x-input-readonly': props.readonly,
    'x-input-focused': focused.value,
    'x-input-borderless': !props.bordered,
    'x-input-has-prefix': !!props.prefix || !!slots.prefix,
    'x-input-has-suffix': !!props.suffix || !!slots.suffix || props.showCount || props.allowClear || props.type === 'password',
    [`x-input-status-${props.status}`]: props.status
  }
])

const inputClasses = computed(() => [
  'x-input',
  `x-input-${props.size}`,
  {
    'x-input-disabled': props.disabled,
    'x-input-borderless': !props.bordered,
    'x-input-textarea': props.type === 'textarea'
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('input', target.value)
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  focused.value = false
  emit('blur', event)
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('change', target.value)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const togglePassword = () => {
  passwordVisible.value = !passwordVisible.value
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
.x-input-wrapper {
  position: relative;
  display: inline-flex;
  width: 100%;
  align-items: center;
  padding: 4px 11px;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.5715;
  background-color: var(--color-bg-container);
  background-image: none;
  border: 1px solid var(--color-form-border);
  border-radius: 6px;
  transition: all 0.3s;

  &:hover:not(.x-input-disabled):not(.x-input-borderless) {
    border-color: var(--color-primaryHover);
  }

  &:focus-within:not(.x-input-disabled):not(.x-input-borderless) {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px var(--color-primaryFocus);
  }

  &.x-input-focused:not(.x-input-disabled):not(.x-input-borderless) {
    border-color: var(--color-primary);
  }

  &.x-input-disabled {
    background-color: var(--x-bgDisabled);
    cursor: not-allowed;
    opacity: 1;

    .x-input {
      color: var(--color-textTertiary);
      cursor: not-allowed;
    }
  }
  &.x-input-readonly {
    // padding: 4px 11px;
    border: none;
    background-color: transparent;

    .x-input {
      color: var(--color-text);
      cursor: not-allowed;
    }
    &:focus-within:not(.x-input-disabled),
    &.x-input-focused {
      border:none;
      box-shadow: none
    }
  }

  &.x-input-readonly .x-input {
    cursor: default;
  }

  &.x-input-borderless {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }

  &.x-input-status-error:not(.x-input-disabled):not(.x-input-borderless) {
    border-color: var(--color-danger);
    background-color: var(--color-dangerLight);

    &:hover {
      border-color: var(--color-dangerHover);  
    }

    &:focus-within,
    &.x-input-focused {
      border-color: var(--color-dangerActive);
      background-color: var(--color-bg-container);
      box-shadow: 0 0 0 2px var(--color-dangerFocus);
    }
  }
  &.x-input-status-warning:not(.x-input-disabled):not(.x-input-borderless) {
    border-color: var(--x-warning);
    background-color: var(--x-warningLight);

    &:hover {
      border-color: var(--x-warningHover);  
    }

    &:focus-within,
    &.x-input-focused {
      border-color: var(--x-warningActive);
      background-color: var(--color-bg-container);
      box-shadow: 0 0 0 2px var(--x-warningFocus);
    }
  }

  &.x-input-has-prefix .x-input {
    padding-left: 0;
  }

  &.x-input-has-suffix .x-input {
    padding-right: 0;
  }
}

.x-input-wrapper-large {
  padding: 6.5px 11px;
  font-size: 16px;
}

.x-input-wrapper-small {
  padding: 0 7px;
}

.x-input {
  flex: auto;
  min-width: 0;
  width: 100%;
  padding: 0;
  color: var(--color-text);
  font-size: inherit;
  line-height: inherit;
  background: transparent;
  border: none;
  outline: none;
  transition: all 0.3s;

  &::placeholder {
    color: var(--color-textTertiary);
  }

  &:disabled {
    cursor: not-allowed;
  }

  &.x-input-textarea {
    min-height: 32px;
    max-height: 200px;
    resize: vertical;
  }
}

.x-input-large {
  padding: 6.5px 11px;
  font-size: 16px;
}

.x-input-small {
  padding: 0 7px;
}

.x-input-prefix,
.x-input-suffix {
  display: inline-flex;
  align-items: center;
  color: rgba(0, 0, 0, 0.45);
  line-height: 1;

  > *:not(:last-child) {
    margin-right: 8px;
  }
}

.x-input-prefix {
  margin-right: 8px;
}

.x-input-suffix {
  margin-left: 8px;
}

.x-input-clear {
  position: absolute;
  right: 11px;
  color: var(--color-textSecondary);
  font-size: 12px;
  cursor: pointer;
  transition: color 0.3s;
  visibility: hidden;

  &:hover {
    color: var(--color-textLinkHover);
  }

  svg {
    display: inline-block;
  }
}

.x-input-wrapper:hover .x-input-clear {
  visibility: visible;
}

.x-input-password-toggle {
  position: absolute;
  right: 11px;
  color: var(--color-textSecondary);
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: var(--color-textLinkHover);
  }

  svg {
    display: inline-block;
  }
}

.x-input-count {
  position: absolute;
  right: 11px;
  bottom: 0px;
  color: var(--color-textSecondary);
  font-size: 12px;
  line-height: 1.5715;
  white-space: nowrap;
  pointer-events: none;
}
</style>
