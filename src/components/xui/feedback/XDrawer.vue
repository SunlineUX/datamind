<template>
  <Teleport :to="teleportTarget">
    <Transition name="x-drawer-fade">
      <div v-if="visible" :class="maskClasses" @click="handleMaskClick"></div>
    </Transition>
    <Transition :name="transitionName">
      <div v-if="visible" :class="wrapClasses" @click.self="handleMaskClick">
        <div ref="drawerRef" :class="drawerClasses" :style="drawerStyles">
          <div v-if="!hideHeader" :class="`${prefixCls}-header`">
            <div :class="`${prefixCls}-title`">
              <slot name="title">{{ title }}</slot>
            </div>
            <button v-if="closable" :class="`${prefixCls}-close`" @click="handleClose">
              <span>{{ closeIcon || '×' }}</span>
            </button>
          </div>
          <div :class="`${prefixCls}-body`">
            <slot></slot>
          </div>
          <div v-if="!hideFooter" :class="`${prefixCls}-footer`">
            <slot name="footer">
              <Button v-if="cancelText" @click="handleCancel">
                {{ cancelText }}
              </Button>  
              <Button v-if="okText" type="primary" @click="handleOk">
                {{ okText }}
              </Button>  
            </slot>
          </div>
          <div
            v-if="resize"
            :class="resizeHandleClasses"
            @mousedown="handleResizeStart"
          ></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch, ref, onUnmounted, onMounted } from 'vue'
import Button from '../basic/XButton.vue'

interface DrawerProps {
  visible?: boolean
  placement?: 'top' | 'right' | 'bottom' | 'left'
  title?: string
  closable?: boolean
  closeIcon?: string
  maskClosable?: boolean
  mask?: boolean
  width?: number | string
  height?: number | string
  size?: 'large' | 'medium' | 'small'
  okText?: string
  cancelText?: string
  hideHeader?: boolean
  hideFooter?: boolean
  destroyOnClose?: boolean
  level?: number
  target?: string,
  resize?: boolean
  minWidth?: number
  maxWidth?: number
  minHeight?: number
  maxHeight?: number
}

const props = withDefaults(defineProps<DrawerProps>(), {
  visible: false,
  placement: 'right',
  closable: true,
  maskClosable: true,
  mask: true,
  width: undefined,
  height: undefined,
  size: 'small',
  okText: 'OK',
  cancelText: 'Cancel',
  hideHeader: false,
  hideFooter: false,
  destroyOnClose: false,
  level: 1,
  target: '',
  resize: true,
  minWidth: 200,
  maxWidth: 1280,
  minHeight: 200,
  maxHeight: 800
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  ok: []
  cancel: []
  close: []
  resize: [width: number, height: number]
}>()

const prefixCls = 'x-drawer'
const drawerRef = ref<HTMLElement>()
const isResizing = ref(false)
const startX = ref(0)
const startY = ref(0)
const startWidth = ref(0)
const startHeight = ref(0)
const actualTarget = ref<string>('body')

const SIZE_MAP = {
  large: 960,
  medium: 640,
  small: 256
}

const defaultWidth = computed(() => {
  if (props.width !== undefined) return props.width
  return SIZE_MAP[props.size]
})

const defaultHeight = computed(() => {
  if (props.height !== undefined) return props.height
  return SIZE_MAP[props.size]
})

const currentWidth = ref(defaultWidth.value)
const currentHeight = ref(defaultHeight.value)

const getValidTarget = (): string => {
  if (!props.target || props.target === 'body') {
    return 'body'
  }
  
  const targetElement = document.querySelector(props.target)
  return targetElement ? props.target : 'body'
}

const teleportTarget = computed(() => actualTarget.value)

const isCustomTarget = computed(() => {
  return teleportTarget.value !== 'body'
})

onMounted(() => {
  actualTarget.value = getValidTarget()
})

watch(() => props.target, () => {
  actualTarget.value = getValidTarget()
})

const maskClasses = computed(() => [
  `${prefixCls}-mask`,
  {
    [`${prefixCls}-mask-hidden`]: !props.visible || !props.mask,
    [`${prefixCls}-mask-absolute`]: isCustomTarget.value
  }
])

const wrapClasses = computed(() => [
  `${prefixCls}-wrap`,
  {
    [`${prefixCls}-wrap-absolute`]: isCustomTarget.value
  }
])

const drawerClasses = computed(() => [
  prefixCls,
  `${prefixCls}-${props.placement}`
])

const drawerStyles = computed(() => {
  const styles: Record<string, string> = {}
  
  if (props.placement === 'left' || props.placement === 'right') {
    const width = typeof currentWidth.value === 'number' ? `${currentWidth.value}px` : currentWidth.value
    styles.width = width
  } else {
    const height = typeof currentHeight.value === 'number' ? `${currentHeight.value}px` : currentHeight.value
    styles.height = height
  }
  
  return styles
})

const resizeHandleClasses = computed(() => [
  `${prefixCls}-resize-handle`,
  `${prefixCls}-resize-handle-${props.placement}`
])

const handleResizeStart = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  startX.value = e.clientX
  startY.value = e.clientY
  
  if (drawerRef.value) {
    startWidth.value = drawerRef.value.offsetWidth
    startHeight.value = drawerRef.value.offsetHeight
  }
  
  document.addEventListener('mousemove', handleResizeMove)
  document.addEventListener('mouseup', handleResizeEnd)
}

const handleResizeMove = (e: MouseEvent) => {
  if (!isResizing.value || !drawerRef.value) return
  
  const deltaX = e.clientX - startX.value
  const deltaY = e.clientY - startY.value
  
  let newWidth = startWidth.value
  let newHeight = startHeight.value
  
  if (props.placement === 'right') {
    newWidth = startWidth.value - deltaX
  } else if (props.placement === 'left') {
    newWidth = startWidth.value + deltaX
  } else if (props.placement === 'bottom') {
    newHeight = startHeight.value - deltaY
  } else if (props.placement === 'top') {
    newHeight = startHeight.value + deltaY
  }
  
  if (props.placement === 'left' || props.placement === 'right') {
    newWidth = Math.max(props.minWidth, Math.min(props.maxWidth, newWidth))
    currentWidth.value = newWidth
  } else {
    newHeight = Math.max(props.minHeight, Math.min(props.maxHeight, newHeight))
    currentHeight.value = newHeight
  }
  
  emit('resize', Number(newWidth), Number(newHeight))
}

const handleResizeEnd = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
}

const transitionName = computed(() => `x-drawer-slide-${props.placement}`)

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleMaskClick = () => {
  if (props.maskClosable && props.mask) {
    handleClose()
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
    currentWidth.value = defaultWidth.value
    currentHeight.value = defaultHeight.value
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })

watch(() => props.size, () => {
  currentWidth.value = defaultWidth.value
  currentHeight.value = defaultHeight.value
})

watch(() => props.width, () => {
  currentWidth.value = defaultWidth.value
})

watch(() => props.height, () => {
  currentHeight.value = defaultHeight.value
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleResizeMove)
  document.removeEventListener('mouseup', handleResizeEnd)
})
</script>

<style scoped lang="less">
.x-drawer-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);

  &-hidden {
    display: none;
  }

  &-absolute {
    position: absolute;
  }
}

.x-drawer-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: hidden;
  outline: 0;

  &-absolute {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}

.x-drawer {
  position: absolute;
  background: var(--color-bg-container);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  display: flex;
  flex-direction: column;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

  &-left {
    top: 0;
    bottom: 0;
    left: 0;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  }

  &-right {
    top: 0;
    bottom: 0;
    right: 0;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  }

  &-top {
    top: 0;
    left: 0;
    right: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  &-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
  }

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  &-title {
    margin: 0;
    color: var(--color-text);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
  }

  &-close {
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: var(--color-textSecondary);
    transition: color 0.3s;
    padding: 0;

    &:hover {
      color: var(--color-text);
    }
  }

  &-body {
    flex: 1;
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text);
    overflow-y: auto;
  }

  &-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--color-border);
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-shrink: 0;
  }

  &-resize-handle {
    position: absolute;
    background: transparent;
    z-index: 10;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    &-right {
      top: 0;
      left: 0;
      bottom: 0;
      width: 5px;
      cursor: ew-resize;
    }

    &-left {
      top: 0;
      right: 0;
      bottom: 0;
      width: 5px;
      cursor: ew-resize;
    }

    &-bottom {
      left: 0;
      right: 0;
      top: 0;
      height: 5px;
      cursor: ns-resize;
    }

    &-top {
      left: 0;
      right: 0;
      bottom: 0;
      height: 5px;
      cursor: ns-resize;
    }
  }

  &-btn {
    padding: 4px 15px;
    font-size: 14px;
    border-radius: var(--x-radius-base);
    border: 1px solid var(--color-border);
    background: var(--color-bg-container);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    &-ok {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;

      &:hover {
        background: var(--color-primaryHover);
        border-color: var(--color-primaryHover);
        color: #fff;
      }
    }
  }
}

.x-drawer-fade-enter-active,
.x-drawer-fade-leave-active {
  transition: opacity 0.3s;
}

.x-drawer-fade-enter-from,
.x-drawer-fade-leave-to {
  opacity: 0;
}

.x-drawer-slide-right-enter-active,
.x-drawer-slide-right-leave-active,
.x-drawer-slide-left-enter-active,
.x-drawer-slide-left-leave-active,
.x-drawer-slide-top-enter-active,
.x-drawer-slide-top-leave-active,
.x-drawer-slide-bottom-enter-active,
.x-drawer-slide-bottom-leave-active {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

.x-drawer-slide-right-enter-from,
.x-drawer-slide-right-leave-to {
  transform: translateX(100%);
}

.x-drawer-slide-left-enter-from,
.x-drawer-slide-left-leave-to {
  transform: translateX(-100%);
}

.x-drawer-slide-top-enter-from,
.x-drawer-slide-top-leave-to {
  transform: translateY(-100%);
}

.x-drawer-slide-bottom-enter-from,
.x-drawer-slide-bottom-leave-to {
  transform: translateY(100%);
}
</style>
