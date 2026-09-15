<template>
  <div :class="popoverClasses">
    <div ref="triggerRef" :class="`${prefixCls}-trigger`">
      <slot></slot>
    </div>
    <Teleport to="body">
      <Transition name="x-popover-fade">
        <div
          v-show="visible"
          ref="popoverRef"
          :class="popoverContentClasses"
          :style="popoverStyle"
          @mouseenter="handlePopoverMouseEnter"
          @mouseleave="handlePopoverMouseLeave"
        >
          <div :class="`${prefixCls}-arrow`"></div>
          <div v-if="title || $slots.title" :class="`${prefixCls}-inner-title`">
            <slot name="title">{{ title }}</slot>
          </div>
          <div :class="`${prefixCls}-inner-content`">
            <slot name="content">
              <slot></slot>
            </slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

export interface PopoverProps {
  visible?: boolean
  title?: string
  trigger?: 'click' | 'hover' | 'focus'
  placement?: 'top' | 'topLeft' | 'topRight' | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | 'bottom' | 'bottomLeft' | 'bottomRight'
  overlayClassName?: string
  overlayStyle?: Record<string, any>
  getPopupContainer?: () => HTMLElement
  disabled?: boolean
  arrowPointAtCenter?: boolean
  autoAdjustOverflow?: boolean
}

const props = withDefaults(defineProps<PopoverProps>(), {
  visible: false,
  title: '',
  trigger: 'hover',
  placement: 'top',
  overlayClassName: '',
  overlayStyle: () => ({}),
  getPopupContainer: () => document.body,
  disabled: false,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  visibleChange: [value: boolean]
}>()

const prefixCls = 'x-popover'
const triggerRef = ref<HTMLElement>()
const popoverRef = ref<HTMLElement>()
const visible = ref(props.visible)
const position = ref({ top: 0, left: 0 })
let hideTimer: number | null = null

const popoverClasses = computed(() => [
  prefixCls,
  {
    [`${prefixCls}-disabled`]: props.disabled
  }
])

const popoverContentClasses = computed(() => [
  `${prefixCls}-inner`,
  `${prefixCls}-placement-${props.placement}`,
  {
    [`${prefixCls}-inner-arrow-at-center`]: props.arrowPointAtCenter
  },
  props.overlayClassName
])

const popoverStyle = computed(() => ({
  ...props.overlayStyle,
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}))

const calculatePosition = () => {
  if (!triggerRef.value || !popoverRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const popoverRect = popoverRef.value.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  const gap = 8
  let top = 0
  let left = 0

  if (props.placement.startsWith('top')) {
    top = triggerRect.top + scrollTop - popoverRect.height - gap
  } else if (props.placement.startsWith('bottom')) {
    top = triggerRect.bottom + scrollTop + gap
  } else if (props.placement === 'left') {
    top = triggerRect.top + scrollTop + (triggerRect.height - popoverRect.height) / 2
  } else if (props.placement === 'right') {
    top = triggerRect.top + scrollTop + (triggerRect.height - popoverRect.height) / 2
  } else if (props.placement === 'leftTop') {
    top = triggerRect.top + scrollTop
  } else if (props.placement === 'leftBottom') {
    top = triggerRect.bottom + scrollTop - popoverRect.height
  } else if (props.placement === 'rightTop') {
    top = triggerRect.top + scrollTop
  } else if (props.placement === 'rightBottom') {
    top = triggerRect.bottom + scrollTop - popoverRect.height
  }

  if (props.placement === 'top' || props.placement === 'bottom') {
    left = triggerRect.left + scrollLeft + (triggerRect.width - popoverRect.width) / 2
  } else if (props.placement === 'topLeft' || props.placement === 'bottomLeft') {
    left = triggerRect.left + scrollLeft
  } else if (props.placement === 'topRight' || props.placement === 'bottomRight') {
    left = triggerRect.right + scrollLeft - popoverRect.width
  } else if (props.placement === 'left') {
    left = triggerRect.left + scrollLeft - popoverRect.width - gap*3
  } else if (props.placement === 'right') {
    left = triggerRect.right + scrollLeft + gap
  } else if (props.placement === 'leftTop' || props.placement === 'leftBottom') {
    left = triggerRect.left + scrollLeft - popoverRect.width - gap*3
  } else if (props.placement === 'rightTop' || props.placement === 'rightBottom') {
    left = triggerRect.right + scrollLeft + gap
  }

  if (props.autoAdjustOverflow) {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) {
      left = 8
    } else if (left + popoverRect.width > viewportWidth) {
      left = viewportWidth - popoverRect.width - 8
    }

    if (top < 0) {
      top = 8
    } else if (top + popoverRect.height > viewportHeight) {
      top = viewportHeight - popoverRect.height - 8
    }
  }

  position.value = { top, left }
}

const showPopover = () => {
  if (props.disabled) return
  visible.value = true
  nextTick(() => {
    calculatePosition()
  })
  emit('update:visible', true)
  emit('visibleChange', true)
}

const hidePopover = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  visible.value = false
  emit('update:visible', false)
  emit('visibleChange', false)
}

const togglePopover = () => {
  if (visible.value) {
    hidePopover()
  } else {
    showPopover()
  }
}

const handleClick = () => {
  if (props.trigger === 'click') {
    togglePopover()
  }
}

const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    showPopover()
  }
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTimer = window.setTimeout(() => {
      hidePopover()
    }, 100)
  }
}

const handleFocus = () => {
  if (props.trigger === 'focus') {
    showPopover()
  }
}

const handleBlur = () => {
  if (props.trigger === 'focus') {
    hidePopover()
  }
}

const handlePopoverMouseEnter = () => {
  if (props.trigger === 'hover' && hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handlePopoverMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTimer = window.setTimeout(() => {
      hidePopover()
    }, 100)
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!visible.value) return

  const target = e.target as Node
  if (triggerRef.value?.contains(target) || popoverRef.value?.contains(target)) {
    return
  }

  hidePopover()
}

watch(() => props.visible, (newVal) => {
  visible.value = newVal
  if (newVal) {
    nextTick(() => {
      calculatePosition()
    })
  }
})

onMounted(() => {
  if (triggerRef.value) {
    triggerRef.value.addEventListener('mouseenter', handleMouseEnter)
    triggerRef.value.addEventListener('mouseleave', handleMouseLeave)
    triggerRef.value.addEventListener('focus', handleFocus)
    triggerRef.value.addEventListener('blur', handleBlur)
    triggerRef.value.addEventListener('click', handleClick)
  }
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('scroll', calculatePosition, true)
})

onUnmounted(() => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (triggerRef.value) {
    triggerRef.value.removeEventListener('mouseenter', handleMouseEnter)
    triggerRef.value.removeEventListener('mouseleave', handleMouseLeave)
    triggerRef.value.removeEventListener('focus', handleFocus)
    triggerRef.value.removeEventListener('blur', handleBlur)
    triggerRef.value.removeEventListener('click', handleClick)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('scroll', calculatePosition, true)
})

defineExpose({
  showPopover,
  hidePopover,
  togglePopover
})
</script>

<style lang="less" scoped>
.x-popover {
  position: relative;
  display: inline-block;

  &-disabled {
    cursor: not-allowed;
  }

  &-trigger {
    display: inline-block;
    cursor: pointer;

    .x-popover-disabled & {
      cursor: not-allowed;
    }
  }

  &-inner {
    position: fixed;
    z-index: 1050;
    min-width: 180px;
    max-width: 350px;
    background: var(--color-elevated);
    border-radius: 8px;
    box-shadow: var(--color-elevatedShadow);
    // padding: 12px 16px;

    &-title {
      min-width: 180px;
    //   margin-bottom: 8px;
      color: var(--color-text);
      font-weight: 500;
      font-size: var(--x-font-size-sm);
      line-height: 22px;
      border-bottom: 1px solid var(--color-border);
      padding: 12px 16px;
    }

    &-content {
      color: var(--color-text);
      font-size: var(--x-font-size-sm);
      line-height: 22px;
      padding: 12px 16px;
    }
  }

  &-arrow {
    position: absolute;
    z-index: 1;
    display: block;
    width: 8.48528137px;
    height: 8.48528137px;
    background: transparent;
    border-style: solid;
    border-width: 4.24264069px;
    transform: rotate(45deg);
  }

  &-placement-top &-arrow {
    bottom: -4.24264069px;
    left: 50%;
    margin-left: -4.24264069px;
    border-color: transparent var(--color-bg-container) var(--color-bg-container) transparent;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-topLeft &-arrow {
    bottom: -4.24264069px;
    left: 16px;
    border-color: transparent var(--color-bg-container) var(--color-bg-container) transparent;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-topRight &-arrow {
    bottom: -4.24264069px;
    right: 16px;
    border-color: transparent var(--color-bg-container) var(--color-bg-container) transparent;
    box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-bottom &-arrow {
    top: -4.24264069px;
    left: 50%;
    margin-left: -4.24264069px;
    border-color: var(--color-bg-container) transparent transparent var(--color-bg-container);
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }

  &-placement-bottomLeft &-arrow {
    top: -4.24264069px;
    left: 16px;
    border-color: var(--color-bg-container) transparent transparent var(--color-bg-container);
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }

  &-placement-bottomRight &-arrow {
    top: -4.24264069px;
    right: 16px;
    border-color: var(--color-bg-container) transparent transparent var(--color-bg-container);
    box-shadow: -2px -2px 5px rgba(0, 0, 0, 0.06);
  }

  &-placement-left &-arrow {
    right: -4.24264069px;
    top: 50%;
    margin-top: -4.24264069px;
    border-color: var(--color-bg-container) var(--color-bg-container) transparent transparent;
    box-shadow: 3px -3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-leftTop &-arrow {
    right: -4.24264069px;
    top: 12px;
    border-color: var(--color-bg-container) var(--color-bg-container) transparent transparent;
    box-shadow: 3px -3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-leftBottom &-arrow {
    right: -4.24264069px;
    bottom: 12px;
    border-color: var(--color-bg-container) var(--color-bg-container) transparent transparent;
    box-shadow: 3px -3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-right &-arrow {
    left: -4.24264069px;
    top: 50%;
    margin-top: -4.24264069px;
    border-color: transparent transparent var(--color-bg-container) var(--color-bg-container);
    box-shadow: -3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-rightTop &-arrow {
    left: -4.24264069px;
    top: 12px;
    border-color:  transparent transparent var(--color-bg-container) var(--color-bg-container);
    box-shadow: -3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-placement-rightBottom &-arrow {
    left: -4.24264069px;
    bottom: 12px;
    border-color: transparent transparent var(--color-bg-container) var(--color-bg-container);
    box-shadow: -3px 3px 7px rgba(0, 0, 0, 0.07);
  }

  &-inner-arrow-at-center {
    &.x-popover-placement-top &-arrow,
    &.x-popover-placement-bottom &-arrow {
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }

    &.x-popover-placement-left &-arrow,
    &.x-popover-placement-right &-arrow {
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  }
}

.x-popover-fade-enter-active,
.x-popover-fade-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.x-popover-fade-enter-from,
.x-popover-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
