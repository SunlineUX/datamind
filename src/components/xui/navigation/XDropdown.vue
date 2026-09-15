<template>
  <div :class="dropdownClasses" @click="handleClick">
    <div ref="triggerRef" :class="`${prefixCls}-trigger`">
      <slot></slot>
    </div>
    <Teleport to="body">
      <Transition name="x-dropdown-fade">
        <div
          v-show="visible"
          ref="dropdownRef"
          :class="dropdownMenuClasses"
          :style="dropdownStyle"
          @click.stop
          @mouseenter="handleDropdownMouseEnter"
          @mouseleave="handleDropdownMouseLeave"
        >
          <slot name="overlay"></slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, nextTick } from 'vue'

export interface DropdownProps {
  visible?: boolean
  disabled?: boolean
  trigger?: 'click' | 'hover' | 'contextMenu'
  placement?: 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight'
  overlayClassName?: string
  overlayStyle?: Record<string, any>
  getPopupContainer?: () => HTMLElement
}

const props = withDefaults(defineProps<DropdownProps>(), {
  visible: false,
  disabled: false,
  trigger: 'hover',
  placement: 'bottomLeft',
  overlayClassName: '',
  overlayStyle: () => ({}),
  getPopupContainer: () => document.body
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  visibleChange: [value: boolean]
  click: [event: MouseEvent]
}>()

const prefixCls = 'x-dropdown'
const triggerRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const visible = ref(props.visible)
const position = ref({ top: 0, left: 0 })
let hideTimer: number | null = null

const dropdownClasses = computed(() => [
  prefixCls,
  {
    [`${prefixCls}-disabled`]: props.disabled
  }
])

const dropdownMenuClasses = computed(() => [
  `${prefixCls}-menu`,
  `${prefixCls}-menu-${props.placement}`,
  props.overlayClassName
])

const dropdownStyle = computed(() => ({
  ...props.overlayStyle,
  top: `${position.value.top}px`,
  left: `${position.value.left}px`
}))

const calculatePosition = () => {
  if (!triggerRef.value || !dropdownRef.value) return

  const triggerRect = triggerRef.value.getBoundingClientRect()
  const dropdownRect = dropdownRef.value.getBoundingClientRect()
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

  let top = 0
  let left = 0

  if (props.placement.startsWith('top')) {
    top = triggerRect.top + scrollTop - dropdownRect.height
  } else {
    top = triggerRect.bottom + scrollTop
  }

  if (props.placement.endsWith('Left')) {
    left = triggerRect.left + scrollLeft
  } else if (props.placement.endsWith('Right')) {
    left = triggerRect.right + scrollLeft - dropdownRect.width
  } else {
    left = triggerRect.left + scrollLeft + (triggerRect.width - dropdownRect.width) / 2
  }

  position.value = { top, left }
}

const showDropdown = () => {
  if (props.disabled) return
  visible.value = true
  nextTick(() => {
    calculatePosition()
  })
  emit('update:visible', true)
  emit('visibleChange', true)
}

const hideDropdown = () => {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  visible.value = false
  emit('update:visible', false)
  emit('visibleChange', false)
}

const toggleDropdown = () => {
  if (visible.value) {
    hideDropdown()
  } else {
    showDropdown()
  }
}

const handleClick = (e: MouseEvent) => {
  if (props.trigger === 'click') {
    toggleDropdown()
  }
  emit('click', e)
}

const handleMouseEnter = () => {
  if (props.trigger === 'hover') {
    if (hideTimer) {
      clearTimeout(hideTimer)
      hideTimer = null
    }
    showDropdown()
  }
}

const handleMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTimer = window.setTimeout(() => {
      hideDropdown()
    }, 100)
  }
}

const handleDropdownMouseEnter = () => {
  if (props.trigger === 'hover' && hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
}

const handleDropdownMouseLeave = () => {
  if (props.trigger === 'hover') {
    hideTimer = window.setTimeout(() => {
      hideDropdown()
    }, 100)
  }
}

const handleContextMenu = (e: MouseEvent) => {
  if (props.trigger === 'contextMenu') {
    e.preventDefault()
    position.value = {
      top: e.clientY,
      left: e.clientX
    }
    showDropdown()
  }
}

const handleClickOutside = (e: MouseEvent) => {
  if (!visible.value) return

  const target = e.target as Node
  if (triggerRef.value?.contains(target) || dropdownRef.value?.contains(target)) {
    return
  }

  hideDropdown()
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
    triggerRef.value.addEventListener('contextmenu', handleContextMenu)
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
    triggerRef.value.removeEventListener('contextmenu', handleContextMenu)
  }
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('scroll', calculatePosition, true)
})

defineExpose({
  showDropdown,
  hideDropdown,
  toggleDropdown
})
</script>

<style lang="less" scoped>
.x-dropdown {
  position: relative;
  display: inline-block;

  &-disabled {
    cursor: not-allowed;
  }

  &-trigger {
    display: inline-block;
    cursor: pointer;

    .x-dropdown-disabled & {
      cursor: not-allowed;
    }
  }

  &-menu {
    position: fixed;
    z-index: 1050;
    min-width: 120px;
    background: var(--color-elevated);
    border-radius: 8px;
    box-shadow: var(--color-elevatedShadow);
    padding: var(--x-spacing-sm);
    list-style: none;
    margin: 0;
  }
}

.x-dropdown-fade-enter-active,
.x-dropdown-fade-leave-active {
  transition: opacity 0.15s ease-out;
}

.x-dropdown-fade-enter-from,
.x-dropdown-fade-leave-to {
  opacity: 0;
}
</style>
