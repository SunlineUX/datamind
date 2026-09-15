<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="x-btn-loading-icon">
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
    <span v-if="icon && !loading" class="x-btn-icon x-btn-icon-left">
      <Icon :name="icon" :size="iconSize" :color="iconColor" :spin="iconSpin" />
    </span>
    <span class="x-btn-content">
      <slot></slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import  Icon  from './XIcon.vue'

interface ButtonProps {
  type?: 'default' | 'primary' | 'dashed' | 'text' | 'link' | 'secondary' | 'ghost'
  size?: 'large' | 'middle' | 'small'
  shape?: 'default' | 'circle' | 'round'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  icon?: string
  iconSize?: number | string
  iconColor?: string
  iconSpin?: boolean
  danger?: boolean
  htmlType?: 'submit' | 'reset' | 'button'
}

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  size: 'middle',
  shape: 'default',
  disabled: false,
  loading: false,
  block: false,
  icon: "",
  iconSize: "inherit",
  iconColor: "",
  iconSpin: false,
  danger: false,
  htmlType: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'x-btn',
  `x-btn-${props.type}`,
  `x-btn-${props.size}`,
  `x-btn-${props.shape}`,
  {
    'x-btn-loading': props.loading,
    'x-btn-block': props.block,
    'x-btn-danger': props.danger,
    'x-btn-disabled': props.disabled || props.loading
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped lang="less">
.x-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  white-space: nowrap;
  text-align: center;
  background-image: none;
  border: 1px solid transparent;
  box-shadow: var(--btn-shadow-default);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  user-select: none;
  touch-action: manipulation;
  height: var(--btn-size);
  padding: var(--btn-padding-sm) var(--btn-padding-lg);
  font-size: var(--x-font-size);
  border-radius: var(--btn-radius);
  color: var(--btn-text-default);
  background-color: var(--btn-bg-default);
  border-color: var(--btn-border-default);

  > .x-btn-loading-icon,
  > .x-btn-icon {
    line-height: 1;
  }

  > .x-btn-loading-icon {
    margin-right: 8px;
  }

  > .x-btn-icon {
    margin-right: 4px;

    &:last-child {
      margin-right: 0;
    }
  }

  &-content {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  // &:hover,
      // &:focus {
      &:hover{
    color: var(--btn-text-default-hover);
    background-color: var(--btn-bg-default-hover);
    border-color: var(--btn-border-default-hover);
  }
   &:focus{
    box-shadow: 0 0 0px 3px var(--color-primaryFocus);
  }

  &:active {
    color: var(--btn-text-default-active);
    background-color: var(--btn-bg-default-active);
    border-color: var(--btn-border-default-active);
  }

  &-disabled,
  &[disabled] {
    color: var(--btn-text-default-disable);
    background: var(--btn-bg-default-disable);
    border-color: var(--btn-border-default);
    text-shadow: none;
    box-shadow: var(--btn-shadow-default-disable);
    cursor: not-allowed;
    &:hover{
      color: var(--btn-text-default-disable);
      background: var(--btn-bg-default-disable);
      border-color: var(--btn-border-default);
    }
  }

  &-loading {
    position: relative;
    cursor: default;
    pointer-events: none;

    &::before {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: transparent;
      border-radius: inherit;
      pointer-events: none;
      content: '';
    }
  }

  &-block {
    width: 100%;
  }

  &-large {
    height: var(--btn-size-lg);
    padding:0 var(--btn-padding-lg);
    font-size: var(--x-font-size-lg);
    border-radius: var(--btn-radius-lg);
  }

  &-small {
    height: var(--btn-size-sm);
    padding:0 var(--btn-padding-sm);
    font-size: var(--x-font-size-sm);
    border-radius: var(--btn-radius-sm);
  }

  &-circle {
    min-width: 32px;
    padding-right: 0;
    padding-left: 0;
    border-radius: 50%;

    &.x-btn-large {
      min-width: 40px;
      border-radius: 50%;
    }

    &.x-btn-small {
      min-width: 24px;
      border-radius: 50%;
    }
  }

  &-round {
    border-radius: 32px;

    &.x-btn-large {
      border-radius: 40px;
    }

    &.x-btn-small {
      border-radius: 24px;
    }
  }


  &-primary {
    color: var(--btn-text-primary);
    background-color: var(--btn-bg-primary);
    border-color: var(--btn-border-primary);
    // text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: var(--btn-shadow-primary);

    &:hover{
      color: var(--btn-text-primary-hover);
      background-color: var(--btn-bg-primary-hover);
      border-color: var(--btn-border-primary-hover);
    }

      &:active{
      color: var(--btn-text-primary-active);
      background-color: var(--btn-bg-primary-active);
      border-color: var(--btn-border-primary-active);
    }

  }
  &-secondary {
    color: var(--color-primary);
    // background-color: #fff;
    border-color: var(--color-primary);
    text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
    box-shadow: var(--btn-shadow-secondary);

    &:hover{
      color: var(--color-primaryHover);
      // background-color: #fff;
      border-color: var(--color-primaryHover);
    }

    &:active,
    &:focus  {
      color: var(--color-primaryActive);
      background-color: var(--color-primaryLight);
      border-color: var(--color-primaryActive);
    }
  }

  &-dashed {
    color: var(--color-text);
    background-color: var(--btn-bg-default);
    border-color: var(--color-border);
    border-style: dashed;

    &:hover{
      color: var(--color-primary);
      background-color: var(--btn-bg-default);
      border-color: var(--color-primary);
    }

    &:active {
      color: var(--color-primary);
      background-color: var(--color-primaryLight);  
      border-color: var(--color-primary);
    }
  }

  &-text {
    color: var(--color-text);
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;

    &:hover{
      color: var(--color-primary);
      background-color: rgba(0, 0, 0, 0.018);
      border-color: transparent;
    }

    &:active {
      color: var(--color-primary);
      background-color: rgba(0, 0, 0, 0.028);
      border-color: transparent;
    }

    &.x-btn-danger {
      color: var(--color-danger);
      background-color: transparent;
      border-color: transparent;

      &:hover{
        color: var(--color-dangerHover);
        background-color: var(--color-dangerLight);
        border-color: transparent;
      }

      &:active {
        color: var(--color-dangerActive);
        background-color: var(--color-dangerFocus);
        border-color: transparent;
      }
    }
  }

  &-link {
    color: var(--color-primary);
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;

    &:hover{
      color: var(--color-primaryHover);
      background-color: transparent;
      border-color: transparent;
    }

    &:active {
      color: var(--color-primaryActive);
      background-color: transparent;
      border-color: transparent;
    }

    &.x-btn-danger {
      color: var(--color-primary);
      background-color: transparent;
      border-color: transparent;

      &:hover{
        color: var(--color-dangerHover);
        background-color: transparent;
        border-color: transparent;
      }

      &:active {
        color: var(--color-dangerActive);
        background-color: transparent;
        border-color: transparent;
      }
    }
  }

  &-danger {
    color: var(--btn-text-fill);
    background-color: var(--color-danger);
    border-color: var(--color-danger);

    &:hover{
    color: var(--btn-text-fill);
      background-color: var(--color-dangerHover);
      border-color: var(--color-dangerHover);
    }

    &:active {
    color: var(--btn-text-fill);
      background-color: var(--color-dangerActive);
      border-color: var(--color-dangerActive);
    }
  }

  &-ghost {
    color: var(--color-text);
    background: transparent;
    border-color: var(--color-border);
    border-style: dashed;

    // &:hover,
      // &:focus {
      &:hover{
      color: var(--color-primary);
      background: transparent;
      border-color: var(--color-primary);
    }

    &:active {
      color: var(--color-primary);
      background: transparent;
      border-color: var(--color-primary);
    }
  }
}
</style>
