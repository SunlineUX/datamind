<template>
  <div :class="tooltipClasses">
    <div ref="triggerRef" :class="`${prefixCls}-trigger`">
      <slot></slot>
    </div>
    <Teleport to="body">
      <Transition name="x-tooltip-fade">
        <div
          v-show="visible"
          ref="tooltipRef"
          :class="tooltipContentClasses"
          :style="tooltipStyle"
          @mouseenter="handleTooltipMouseEnter"
          @mouseleave="handleTooltipMouseLeave"
        >
          <div :class="`${prefixCls}-arrow`"></div>
          <div :class="`${prefixCls}-inner`">
            <slot name="content">{{ content || title }}</slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

export interface TooltipProps {
  visible?: boolean
  title?: string
  content?: string
  trigger?: 'click' | 'hover' | 'focus'
  placement?: 'top' | 'topLeft' | 'topRight' | 'left' | 'leftTop' | 'leftBottom' | 'right' | 'rightTop' | 'rightBottom' | 'bottom' | 'bottomLeft' | 'bottomRight'
  overlayClassName?: string
  overlayStyle?: Record<string, any>
  getPopupContainer?: () => HTMLElement
  disabled?: boolean
  arrowPointAtCenter?: boolean
  autoAdjustOverflow?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
}

const props = withDefaults(defineProps<TooltipProps>(), {
  visible: false,
  title: '',
  content: '',
  trigger: 'hover',
  placement: 'top',
  overlayClassName: '',
  overlayStyle: () => ({}),
  getPopupContainer: () => document.body,
  disabled: false,
  arrowPointAtCenter: false,
  autoAdjustOverflow: true,
  mouseEnterDelay: 100,
  mouseLeaveDelay: 100
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  visibleChange: [value: boolean]
}>()

const prefixCls = 'x-tooltip'
const triggerRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const visible = ref(props.visible)
const position = ref({ top: 0, left: 0 })
let showTimer: number | null = null
let hideTimer: number | null = null

const tooltipClasses = computed(() => [
  prefixCls,
  {
    [`${prefixCls}-disabled`]: props.disabled
  }
])

const tooltipContentClasses = computed(() => [
  `${prefixCls}-content`,
  `${prefixCls}-placement-${props.placement}`,
  {
    [`${prefixCls}-arrow-at-center`]: props.arrowPointAtCenter
  },
  props.overlayClassName
])

const tooltipStyle = computed(() => ({
  ...props.overlayStyle,
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}))

const calculatePosition = () => {
  if (!triggerRef.value || !tooltipRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  const gap = 8
  let top = 0
  let left = 0

  if (props.placement.startsWith('top')) {
    top = triggerRect.top + scrollTop - tooltipRect.height - gap
  } else if (props.placement.startsWith('bottom')) {
    top = triggerRect.bottom + scrollTop + gap
  } else if (props.placement === 'left') {
    top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2
  } else if (props.placement === 'right') {
    top = triggerRect.top + scrollTop + (triggerRect.height - tooltipRect.height) / 2
  } else if (props.placement === 'leftTop') {
    top = triggerRect.top + scrollTop
  } else if (props.placement === 'leftBottom') {
    top = triggerRect.bottom + scrollTop - tooltipRect.height
  } else if (props.placement === 'rightTop') {
    top = triggerRect.top + scrollTop
  } else if (props.placement === 'rightBottom') {
    top = triggerRect.bottom + scrollTop - tooltipRect.height
  }

  if (props.placement === 'top' || props.placement === 'bottom') {
    left = triggerRect.left + scrollLeft + (triggerRect.width - tooltipRect.width) / 2
  } else if (props.placement === 'topLeft' || props.placement === 'bottomLeft') {
    left = triggerRect.left + scrollLeft
  } else if (props.placement === 'topRight' || props.placement === 'bottomRight') {
    left = triggerRect.right + scrollLeft - tooltipRect.width
  } else if (props.placement === 'left') {
    left = triggerRect.left + scrollLeft - tooltipRect.width - gap
  } else if (props.placement === 'right') {
    left = triggerRect.right + scrollLeft + gap
  } else if (props.placement === 'leftTop' || props.placement === 'leftBottom') {
    left = triggerRect.left + scrollLeft - tooltipRect.width - gap*2
  } else if (props.placement === 'rightTop' || props.placement === 'rightBottom') {
    left = triggerRect.right + scrollLeft + gap
  }

  if (props.autoAdjustOverflow) {
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) {
      left = 8
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 8
    }

    if (top < 0) {
      top = 8
    } else if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - 8
    }
  }

  position.value = { top, left }
}

const showTooltip = () => {
  if (props.disabled) return
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  showTimer = window.setTimeout(() => {
    visible.value = true
    nextTick(() => {
      calculatePosition()
    })
    emit('update:visible', true)
    emit('visibleChange', true)
  }, props.mouseEnterDelay)
}

const hideTooltip = () => {
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  hideTimer = window.setTimeout(() => {
    visible.value = false
    emit('update:visible', false)
    emit('visibleChange', false)
  }, props.mouseLeaveDelay)
}

const toggleTooltip = () => {
  if (visible.value) {
    hideTooltip()
  } else {
    showTooltip()
  }
}

const handleClick = () => {
  if (props.trigger === 'click') {
    toggleTooltip()
  }
}

const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    showTooltip()
  }
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTooltip()
  }
}

const handleFocus = () => {
  if (props.trigger === 'focus') {
    showTooltip()
  }
}

const handleBlur = () => {
  if (props.trigger === 'focus') {
    hideTooltip()
  }
}

const handleTooltipMouseEnter = () => {
  if (props.trigger === 'hover' && hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handleTooltipMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTooltip()
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!visible.value) return

  const target = e.target as Node
  if (triggerRef.value?.contains(target) || tooltipRef.value?.contains(target)) {
    return
  }

  hideTooltip()
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
  if (showTimer) {
    clearTimeout(showTimer)
    showTimer = null
  }
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
  showTooltip,
  hideTooltip,
  toggleTooltip
})
</script>

<style lang="less" scoped>
.x-tooltip {
  position: relative;
  display: inline-block;

  &-disabled {
    cursor: not-allowed;
  }

  &-trigger {
    display: inline-block;
    cursor: pointer;

    .x-tooltip-disabled & {
      cursor: not-allowed;
    }
  }

  &-content {
    position: fixed;
    z-index: 1060;
    max-width: 250px;
    padding: 6px 8px;
    background: rgba(0, 0, 0, 0.85);
    border-radius: 6px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08);
    color: #fff;
    font-size: 14px;
    line-height: 22px;
    word-wrap: break-word;
  }

  &-inner {
    position: relative;
    z-index: 1;
  }

  &-arrow {
    position: absolute;
    z-index: 1;
    display: block;
    width: 8px;
    height: 8px;
    background: transparent;
    border-style: solid;
    border-width: 4px;
    transform: rotate(45deg);
  }

  &-placement-top &-arrow {
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
    border-color: transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent;
  }

  &-placement-topLeft &-arrow {
    bottom: -4px;
    left: 12px;
    border-color: transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent;
  }

  &-placement-topRight &-arrow {
    bottom: -4px;
    right: 12px;
    border-color: transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent;
  }

  &-placement-bottom &-arrow {
    top: -4px;
    left: 50%;
    margin-left: -4px;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent rgba(0, 0, 0, 0.85);
  }

  &-placement-bottomLeft &-arrow {
    top: -4px;
    left: 12px;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent rgba(0, 0, 0, 0.85);
  }

  &-placement-bottomRight &-arrow {
    top: -4px;
    right: 12px;
    border-color: rgba(0, 0, 0, 0.85) transparent transparent rgba(0, 0, 0, 0.85);
  }

  &-placement-left &-arrow {
    right: -3px;
    top: 50%;
    margin-top: -4px;
    border-color:  rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent transparent;
  }

  &-placement-leftTop &-arrow {
    right: -4px;
    top: 8px;
    border-color: rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent transparent;
  }

  &-placement-leftBottom &-arrow {
    right: -4px;
    bottom: 8px;
    border-color: rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) transparent transparent;
  }

  &-placement-right &-arrow {
    left: -4px;
    top: 50%;
    margin-top: -4px;
    border-color:  transparent transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85);
  }

  &-placement-rightTop &-arrow {
    left: -4px;
    top: 8px;
    border-color: transparent transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85) ;
  }

  &-placement-rightBottom &-arrow {
    left: -4px;
    bottom: 8px;
    border-color: transparent transparent rgba(0, 0, 0, 0.85) rgba(0, 0, 0, 0.85); 
  }

  &-arrow-at-center {
    &.x-tooltip-placement-top &-arrow,
    &.x-tooltip-placement-bottom &-arrow {
      left: 50%;
      transform: translateX(-50%) rotate(45deg);
    }

    &.x-tooltip-placement-left &-arrow,
    &.x-tooltip-placement-right &-arrow {
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
    }
  }
}

.x-tooltip-fade-enter-active,
.x-tooltip-fade-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}

.x-tooltip-fade-enter-from,
.x-tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
