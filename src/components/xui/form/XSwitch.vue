<template>
  <button
    :class="switchClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="x-switch-loading-icon">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle
          cx="8"
          cy="8"
          r="7"
          stroke="currentColor"
          stroke-width="2"
          stroke-dasharray="14 14"
          stroke-linecap="round"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 8 8"
            to="360 8 8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
    <span :class="handleClasses"></span>
    <span v-if="checkedChildren || unCheckedChildren" class="x-switch-inner">
      <span v-if="isChecked" class="x-switch-inner-checked">
        <slot name="checkedChildren">{{ checkedChildren }}</slot>
      </span>
      <span v-else class="x-switch-inner-unchecked">
        <slot name="unCheckedChildren">{{ unCheckedChildren }}</slot>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface SwitchProps {
  modelValue?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'small' | 'default'
  checkedChildren?: string
  unCheckedChildren?: string
  checkedColor?: string
  unCheckedColor?: string
}

const props = withDefaults(defineProps<SwitchProps>(), {
  modelValue: false,
  disabled: false,
  loading: false,
  size: 'default',
  checkedChildren: '',
  unCheckedChildren: '',
  checkedColor: '',
  unCheckedColor: ''
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  change: [value: boolean]
  click: [event: MouseEvent]
}>()

const isChecked = computed(() => props.modelValue === true)

const switchClasses = computed(() => [
  'x-switch',
  `x-switch-${props.size}`,
  {
    'x-switch-checked': isChecked.value,
    'x-switch-disabled': props.disabled,
    'x-switch-loading': props.loading
  }
])

const handleClasses = computed(() => [
  'x-switch-handle',
  {
    'x-switch-handle-checked': isChecked.value
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
    emit('click', event)
  }
}
</script>

<style scoped lang="less">
.x-switch {
  --switch-height: 22px;
  --switch-height-sm: 16px;
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  min-width: 44px;
  height: var(--switch-height);
  line-height: 1;
  vertical-align: middle;
  background-color: var(--x-bg-thead);
  border: 1px solid var(--color-form-border);
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  padding: 0;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  &::after {
    position: absolute;
    top: 1px;
    left: 1px;
    width: calc(var(--switch-height) - 4px);
    height: calc(var(--switch-height) - 4px);
    background-color: #fff;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    content: ' ';
  }

  &-checked {
    background-color: var(--color-primary);
    border-color: var(--color-primary);

    &::after {
      left: 100%;
      transform: translateX(-100%);
    }
  }

  &-disabled {
    cursor: not-allowed;
    opacity: 0.4;
  }

  &-loading {
    cursor: default;
    pointer-events: none;

    &::after {
      opacity: 0.1;
      z-index: 0;
    }
    .x-switch-handle{
      opacity: 0;
    }
  }

  &-small {
    min-width: 28px;
    height: var(--switch-height-sm);

    &::after {
      width: calc(var(--switch-height-sm) - 4px);
      height: calc(var(--switch-height-sm) - 4px);
    }
    .x-switch-handle{
      width: calc(var(--switch-height-sm) - 4px);
      height: calc(var(--switch-height-sm) - 4px);
    }
    &.x-switch-checked{
      .x-switch-inner{
        margin: 0 18px 0 5px;
      }
    }
  }

  &-handle {
    position: absolute;
    top: 1px;
    left: 1px;
    width: calc(var(--switch-height) - 4px);
    height: calc(var(--switch-height) - 4px);
    background-color: #fff;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &-checked {
      left: 100%;
      transform: translateX(-100%);
    }
  }

  &-loading-icon {
    position: absolute;
    top: 2px;
    left: 2px;
    color: var(--color-primary);
    font-size: 12px;

    svg {
      display: inline-block;
    }
  }

  &-inner {
    display: block;
    margin: 0 7px 0 25px;
    color: #fff;
    font-size: 12px;
    transition: margin 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    pointer-events: none;
  }

  &-checked &-inner {
    margin: 0 25px 0 7px;
  }

  &-small &-inner {
    margin: 0 5px 0 18px;
    font-size: 10px;
  }

  &-small &-checked &-inner {
    margin: 0 18px 0 5px;
  }
}

</style>
