<template>
  <div :class="rowClasses" :style="rowStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'

interface RowProps {
  gutter?: number | [number, number]
  type?: 'flex'
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly'
  align?: 'top' | 'middle' | 'bottom' | 'stretch'
}

const props = withDefaults(defineProps<RowProps>(), {
  gutter: 0,
  type: undefined,
  justify: 'start',
  align: 'top'
})

provide('rowGutter', {
  gutter: computed(() => props.gutter)
})

const rowClasses = computed(() => [
  'x-row',
  {
    [`x-row-${props.type}`]: props.type,
    [`x-row-justify-${props.justify}`]: props.type === 'flex',
    [`x-row-align-${props.align}`]: props.type === 'flex'
  }
])

const rowStyles = computed(() => {
  const styles: Record<string, string> = {}

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
</script>

<style scoped lang="less">
.x-row {
  display: flex;
  flex-flow: row wrap;
  min-width: 0;
  box-sizing: border-box;

  &::before,
  &::after {
    display: table;
    content: '';
  }

  &::after {
    clear: both;
  }

  &.x-row-flex {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    &::before,
    &::after {
      display: none;
    }
  }

  &.x-row-justify-start {
    justify-content: flex-start;
  }

  &.x-row-justify-end {
    justify-content: flex-end;
  }

  &.x-row-justify-center {
    justify-content: center;
  }

  &.x-row-justify-space-around {
    justify-content: space-around;
  }

  &.x-row-justify-space-between {
    justify-content: space-between;
  }

  &.x-row-justify-space-evenly {
    justify-content: space-evenly;
  }

  &.x-row-align-top {
    align-items: flex-start;
  }

  &.x-row-align-middle {
    align-items: center;
  }

  &.x-row-align-bottom {
    align-items: flex-end;
  }

  &.x-row-align-stretch {
    align-items: stretch;
  }
}
</style>
