<template>
  <div ref="masonryRef" :class="masonryClasses" :style="masonryStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, provide } from 'vue'

interface Breakpoint {
  width: number
  columns: number
}

interface MasonryProps {
  gutter?: number | [number, number]
  breakpoints?: Breakpoint[]
  defaultColumns?: number
  minWidth?: number
  columnWidth?: number
}

const props = withDefaults(defineProps<MasonryProps>(), {
  gutter: 16,
  breakpoints: () => [
    { width: 600, columns: 1 },
    { width: 900, columns: 2 },
    { width: 1200, columns: 3 },
    { width: 1500, columns: 4 },
    { width: 1800, columns: 6 },
    { width: 2100, columns: 8 }
  ],
  defaultColumns: 4,
  minWidth: 0,
  columnWidth: 0
})

const masonryRef = ref<HTMLElement>()
const containerWidth = ref(0)
const currentColumns = ref(props.defaultColumns)
const columnHeights = ref<number[]>([])
const items = ref<HTMLElement[]>([])

const updateContainerWidth = () => {
  if (masonryRef.value) {
    const rect = masonryRef.value.getBoundingClientRect()
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

const masonryClasses = computed(() => [
  'x-masonry'
])

const masonryStyles = computed(() => {
  const styles: Record<string, string> = {
    '--x-masonry-columns': currentColumns.value.toString()
  }

  if (props.gutter !== 0) {
    if (Array.isArray(props.gutter)) {
      styles['--x-gutter-x'] = `${props.gutter[0]}px`
      styles['--x-gutter-y'] = `${props.gutter[1]}px`
    } else {
      styles['--x-gutter-x'] = `${props.gutter}px`
      styles['--x-gutter-y'] = `${props.gutter}px`
    }
  }

  return styles
})

const registerItem = (item: HTMLElement) => {
  items.value.push(item)
  nextTick(() => {
    layoutItems()
  })
}

const unregisterItem = (item: HTMLElement) => {
  const index = items.value.indexOf(item)
  if (index > -1) {
    items.value.splice(index, 1)
    nextTick(() => {
      layoutItems()
    })
  }
}

const layoutItems = () => {
  if (!masonryRef.value || items.value.length === 0) return

  const columns = currentColumns.value
  const gutterX = Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
  const gutterY = Array.isArray(props.gutter) ? props.gutter[1] : props.gutter
  
  const containerRect = masonryRef.value.getBoundingClientRect()
  const columnWidth = (containerRect.width - gutterX * (columns - 1)) / columns
  
  columnHeights.value = new Array(columns).fill(0)
  
  items.value.forEach((item, index) => {
    const columnIndex = index % columns
    
    const x = columnIndex * (columnWidth + gutterX)
    const y = columnHeights.value[columnIndex]
    
    item.style.position = 'absolute'
    item.style.left = `${x}px`
    item.style.top = `${y}px`
    item.style.width = `${columnWidth}px`
    
    const itemHeight = item.offsetHeight
    columnHeights.value[columnIndex] = y + itemHeight + gutterY
  })
  
  const maxHeight = Math.max(...columnHeights.value)
  if (masonryRef.value) {
    masonryRef.value.style.height = `${maxHeight}px`
  }
}

const recalculate = () => {
  updateContainerWidth()
  layoutItems()
}

provide('masonry', {
  registerItem,
  unregisterItem,
  columnWidth: computed(() => {
    if (!masonryRef.value) return 0
    const columns = currentColumns.value
    const gutterX = Array.isArray(props.gutter) ? props.gutter[0] : props.gutter
    const containerRect = masonryRef.value.getBoundingClientRect()
    return (containerRect.width - gutterX * (columns - 1)) / columns
  })
})

let resizeObserver: ResizeObserver | null = null
let mutationObserver: MutationObserver | null = null

onMounted(() => {
  updateContainerWidth()
  
  if (masonryRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateContainerWidth()
      nextTick(() => {
        layoutItems()
      })
    })
    
    resizeObserver.observe(masonryRef.value)
    
    mutationObserver = new MutationObserver(() => {
      nextTick(() => {
        layoutItems()
      })
    })
    
    mutationObserver.observe(masonryRef.value, {
      childList: true,
      subtree: true
    })
  }
  
  nextTick(() => {
    layoutItems()
  })
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (mutationObserver) {
    mutationObserver.disconnect()
  }
})

watch(() => props.gutter, () => {
  nextTick(() => {
    layoutItems()
  })
})

watch(() => props.breakpoints, () => {
  updateContainerWidth()
  nextTick(() => {
    layoutItems()
  })
}, { deep: true })

defineExpose({
  containerWidth,
  currentColumns,
  columnHeights,
  recalculate
})
</script>

<style scoped lang="less">
.x-masonry {
  position: relative;
  width: 100%;
  box-sizing: border-box;
}
</style>
