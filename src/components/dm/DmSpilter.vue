<template>
  <div ref="splitterRef" :class="splitterClasses" :style="splitterStyles">
    <div class="dm-splitter-pane dm-splitter-pane-first" :style="firstPaneStyles">
      <slot name="first"></slot>
    </div>
    <div 
      ref="resizerRef"
      class="dm-splitter-resizer"
      @mousedown="handleMouseDown"
      @touchstart="handleTouchStart"
    >
      <div class="dm-splitter-resizer-line"></div>
      <div class="dm-splitter-resizer-handle"></div>
    </div>
    <div class="dm-splitter-pane dm-splitter-pane-second" :style="secondPaneStyles">
      <slot name="second"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SplitterProps {
  direction?: 'horizontal' | 'vertical'
  defaultPercent?: number
  minPercent?: number
  maxPercent?: number
  minSize?: number
  maxSize?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<SplitterProps>(), {
  direction: 'horizontal',
  defaultPercent: 50,
  minPercent: 10,
  maxPercent: 90,
  minSize: 0,
  maxSize: 0,
  disabled: false
})

const emit = defineEmits<{
  resize: [percent: number]
  resizeStart: []
  resizeEnd: []
}>()

const splitterRef = ref<HTMLElement>()
const resizerRef = ref<HTMLElement>()
const isResizing = ref(false)
const currentPercent = ref(props.defaultPercent)
const startPosition = ref(0)
const startPercent = ref(0)
const containerSize = ref(0)

// Suppress TypeScript warning - resizerRef is used in template
void resizerRef

const splitterClasses = computed(() => [
  'dm-splitter',
  `dm-splitter-${props.direction}`,
  {
    'dm-splitter-resizing': isResizing.value,
    'dm-splitter-disabled': props.disabled
  }
])

const splitterStyles = computed(() => ({
  cursor: props.disabled ? 'default' : undefined
}))

const firstPaneStyles = computed(() => {
  if (props.direction === 'horizontal') {
    return {
      width: `${currentPercent.value}%`,
      minWidth: props.minSize ? `${props.minSize}px` : undefined,
      maxWidth: props.maxSize ? `${props.maxSize}px` : undefined
    }
  } else {
    return {
      height: `${currentPercent.value}%`,
      minHeight: props.minSize ? `${props.minSize}px` : undefined,
      maxHeight: props.maxSize ? `${props.maxSize}px` : undefined
    }
  }
})

const secondPaneStyles = computed(() => {
  if (props.direction === 'horizontal') {
    return {
      width: `${100 - currentPercent.value}%`
    }
  } else {
    return {
      height: `${100 - currentPercent.value}%`
    }
  }
})

const updateContainerSize = () => {
  if (splitterRef.value) {
    const rect = splitterRef.value.getBoundingClientRect()
    containerSize.value = props.direction === 'horizontal' ? rect.width : rect.height
  }
}

const handleMouseDown = (e: MouseEvent) => {
  if (props.disabled) return
  
  e.preventDefault()
  startResize(e.clientX, e.clientY)
}

const handleTouchStart = (e: TouchEvent) => {
  if (props.disabled) return
  
  e.preventDefault()
  startResize(e.touches[0].clientX, e.touches[0].clientY)
}

const startResize = (clientX: number, clientY: number) => {
  isResizing.value = true
  startPosition.value = props.direction === 'horizontal' ? clientX : clientY
  startPercent.value = currentPercent.value
  updateContainerSize()
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.addEventListener('touchmove', handleTouchMove, { passive: false })
  document.addEventListener('touchend', handleTouchEnd)
  
  emit('resizeStart')
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isResizing.value) return
  
  const clientPosition = props.direction === 'horizontal' ? e.clientX : e.clientY
  updatePercent(clientPosition)
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isResizing.value) return
  
  e.preventDefault()
  const clientPosition = props.direction === 'horizontal' ? e.touches[0].clientX : e.touches[0].clientY
  updatePercent(clientPosition)
}

const updatePercent = (clientPosition: number) => {
  const delta = clientPosition - startPosition.value
  const deltaPercent = (delta / containerSize.value) * 100
  let newPercent = startPercent.value + deltaPercent
  
  if (props.direction === 'horizontal') {
    newPercent = Math.max(props.minPercent, Math.min(props.maxPercent, newPercent))
  } else {
    newPercent = Math.max(props.minPercent, Math.min(props.maxPercent, newPercent))
  }
  
  currentPercent.value = newPercent
  emit('resize', newPercent)
}

const handleMouseUp = () => {
  stopResize()
}

const handleTouchEnd = () => {
  stopResize()
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  
  emit('resizeEnd')
}

onMounted(() => {
  updateContainerSize()
  window.addEventListener('resize', updateContainerSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerSize)
  stopResize()
})

defineExpose({
  currentPercent
})
</script>

<style scoped>
.dm-splitter {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.dm-splitter.dm-splitter-horizontal {
  flex-direction: row;
}

.dm-splitter.dm-splitter-vertical {
  flex-direction: column;
}

.dm-splitter.dm-splitter-resizing {
  user-select: none;
}

.dm-splitter.dm-splitter-resizing .dm-splitter-resizer {
  background-color: var(--brand);
}

.dm-splitter.dm-splitter-disabled .dm-splitter-resizer {
  cursor: not-allowed;
}

.dm-splitter.dm-splitter-disabled .dm-splitter-resizer:hover {
  background-color: var(--border-lighter);
}

.dm-splitter-pane {
  overflow: auto;
  position: relative;
}

.dm-splitter-pane.dm-splitter-pane-first {
  flex-shrink: 0;
}

.dm-splitter-pane.dm-splitter-pane-second {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

.dm-splitter-resizer {
  position: relative;
  transition: background-color 0.2s;
  z-index: 10;
}

.dm-splitter-horizontal .dm-splitter-resizer {
  width: 4px;
  cursor: col-resize;
  margin: 0 -2px;
}

.dm-splitter-horizontal .dm-splitter-resizer:hover {
  background-color: var(--brand);
}

.dm-splitter-vertical .dm-splitter-resizer {
  height: 4px;
  cursor: row-resize;
  margin: -2px 0;
  width: 100%;
}

.dm-splitter-vertical .dm-splitter-resizer:hover {
  background-color: var(--brand);
}

.dm-splitter-resizing .dm-splitter-resizer {
  transition: none;
}

.dm-splitter-resizer-line {
  position: absolute;
  background-color: var(--border-lighter);
  opacity: 0.3;
}

.dm-splitter-horizontal .dm-splitter-resizer-line {
  width: 1px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.dm-splitter-vertical .dm-splitter-resizer-line {
  width: 100%;
  height: 1px;
  top: 50%;
  transform: translateY(-50%);
  left: 0;
}

.dm-splitter-resizer-handle {
  position: absolute;
  background-color: var(--brand);
  opacity: 0.3;
}

.dm-splitter-horizontal .dm-splitter-resizer-handle {
  width: 4px;
  height: 24px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
}

.dm-splitter-vertical .dm-splitter-resizer-handle {
  width: 24px;
  height: 4px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 2px;
}

.dm-splitter-resizer:hover .dm-splitter-resizer-handle {
  background-color: white;
  opacity: 1;
}

.dm-splitter-resizing .dm-splitter-resizer-handle {
  background-color: white;
  opacity: 1;
}
</style>
