<template>
  <div ref="flexBoxRef" :class="flexBoxClasses" :style="flexBoxStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Breakpoint {
  width: number
  columns: number
}

interface FlexBoxProps {
  gutter?: number | [number, number]
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
  breakpoints?: Breakpoint[]
  defaultColumns?: number
  minWidth?: number
}

const props = withDefaults(defineProps<FlexBoxProps>(), {
  gutter: 16,
  justify: 'start',
  align: 'top',
  breakpoints: () => [
    { width: 600, columns: 1 },
    { width: 900, columns: 2 },
    { width: 1200, columns: 3 },
    { width: 1500, columns: 4 },
    { width: 1800, columns: 6 },
    { width: 2100, columns: 8 }
  ],
  defaultColumns: 4,
  minWidth: 0
})

const flexBoxRef = ref<HTMLElement>()
const containerWidth = ref(0)
const currentColumns = ref(props.defaultColumns)

const updateContainerWidth = () => {
  if (flexBoxRef.value) {
    const rect = flexBoxRef.value.getBoundingClientRect()
    containerWidth.value = rect.width
    updateColumns(rect.width)
  }
}

const updateColumns = (width: number) => {
  if (width < props.minWidth) {
    currentColumns.value = 1
    return
  }

  const sortedBreakpoints = [...props.breakpoints].sort((a, b) => b.width - a.width)
  
  for (const bp of sortedBreakpoints) {
    if (width >= bp.width) {
      currentColumns.value = bp.columns
      return
    }
  }
  
  currentColumns.value = props.defaultColumns
}

const flexBoxClasses = computed(() => [
  'x-flex-box',
  {
    [`x-flex-box-justify-${props.justify}`]: true,
    [`x-flex-box-align-${props.align}`]: true
  }
])

const flexBoxStyles = computed(() => {
  const styles: Record<string, string> = {
    '--x-flex-columns': currentColumns.value.toString()
  }

  if (props.gutter !== 0) {
    if (Array.isArray(props.gutter)) {
      styles.marginLeft = `-${props.gutter[0] / 2}px`
      styles.marginRight = `-${props.gutter[0] / 2}px`
      styles.marginTop = `-${props.gutter[1] / 2}px`
      styles.marginBottom = `-${props.gutter[1] / 2}px`
      styles['--x-gutter-x'] = `${props.gutter[0]}px`
      styles['--x-gutter-y'] = `${props.gutter[1]}px`
    } else {
      styles.marginLeft = `-${props.gutter / 2}px`
      styles.marginRight = `-${props.gutter / 2}px`
      styles['--x-gutter-x'] = `${props.gutter}px`
      styles['--x-gutter-y'] = `${props.gutter}px`
    }
  }

  return styles
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  updateContainerWidth()
  
  if (flexBoxRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const rect = entry.contentRect
        containerWidth.value = rect.width
        updateColumns(rect.width)
      }
    })
    
    resizeObserver.observe(flexBoxRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

defineExpose({
  containerWidth,
  currentColumns
})
</script>

<style scoped lang="less">
.x-flex-box {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  box-sizing: border-box;

  &::before,
  &::after {
    display: table;
    content: '';
  }

  &::after {
    clear: both;
  }

  &.x-flex-box-justify-start {
    justify-content: flex-start;
  }

  &.x-flex-box-justify-end {
    justify-content: flex-end;
  }

  &.x-flex-box-justify-center {
    justify-content: center;
  }

  &.x-flex-box-justify-space-around {
    justify-content: space-around;
  }

  &.x-flex-box-justify-space-between {
    justify-content: space-between;
  }

  &.x-flex-box-justify-space-evenly {
    justify-content: space-evenly;
  }

  &.x-flex-box-align-top {
    align-items: flex-start;
  }

  &.x-flex-box-align-middle {
    align-items: center;
  }

  &.x-flex-box-align-bottom {
    align-items: flex-end;
  }

  &.x-flex-box-align-stretch {
    align-items: stretch;
  }

  > * {
    flex: 0 0 calc((100% - (var(--x-flex-columns) - 1) * var(--x-gutter-x, 16px)) / var(--x-flex-columns));
    max-width: calc((100% - (var(--x-flex-columns) - 1) * var(--x-gutter-x, 16px)) / var(--x-flex-columns));
    box-sizing: border-box;
    padding-left: calc(var(--x-gutter-x, 16px) / 2);
    padding-right: calc(var(--x-gutter-x, 16px) / 2);
    padding-top: calc(var(--x-gutter-y, 16px) / 2);
    padding-bottom: calc(var(--x-gutter-y, 16px) / 2);
  }
}
</style>
