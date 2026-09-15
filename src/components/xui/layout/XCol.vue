<template>
  <div :class="['x-col', ...colClasses]" :style="colStyles">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

interface ColProps {
  span?: number
  order?: number
  offset?: number
  push?: number
  pull?: number
  xs?: number | ColSpanObject
  sm?: number | ColSpanObject
  md?: number | ColSpanObject
  lg?: number | ColSpanObject
  xl?: number | ColSpanObject
  xxl?: number | ColSpanObject
  flex?: string | number
}

interface ColSpanObject {
  span?: number
  order?: number
  offset?: number
  push?: number
  pull?: number
}

const props = withDefaults(defineProps<ColProps>(), {
  span: 24
})

const rowGutter = inject<{ gutter: number | [number, number] }>('rowGutter', { gutter: 0 })

const colClasses = computed(() => {
  const classes: string[] = []

  if (props.span !== undefined) {
    classes.push(`x-col-${props.span}`)
  }

  if (props.order !== undefined) {
    classes.push(`x-col-order-${props.order}`)
  }

  if (props.offset !== undefined) {
    classes.push(`x-col-offset-${props.offset}`)
  }

  if (props.push !== undefined) {
    classes.push(`x-col-push-${props.push}`)
  }

  if (props.pull !== undefined) {
    classes.push(`x-col-pull-${props.pull}`)
  }

  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

  breakpoints.forEach((bp) => {
    const value = props[bp]
    if (value !== undefined) {
      if (typeof value === 'number') {
        classes.push(`x-col-${bp}-${value}`)
      } else {
        if (value.span !== undefined) {
          classes.push(`x-col-${bp}-${value.span}`)
        }
        if (value.order !== undefined) {
          classes.push(`x-col-${bp}-order-${value.order}`)
        }
        if (value.offset !== undefined) {
          classes.push(`x-col-${bp}-offset-${value.offset}`)
        }
        if (value.push !== undefined) {
          classes.push(`x-col-${bp}-push-${value.push}`)
        }
        if (value.pull !== undefined) {
          classes.push(`x-col-${bp}-pull-${value.pull}`)
        }
      }
    }
  })

  return classes
})

const colStyles = computed(() => {
  const styles: Record<string, string> = {}

  if (rowGutter.gutter !== 0) {
    if (Array.isArray(rowGutter.gutter)) {
      styles.paddingLeft = `${rowGutter.gutter[0] / 2}px`
      styles.paddingRight = `${rowGutter.gutter[0] / 2}px`
      styles.paddingTop = `${rowGutter.gutter[1] / 2}px`
      styles.paddingBottom = `${rowGutter.gutter[1] / 2}px`
    } else {
      styles.paddingLeft = `${rowGutter.gutter / 2}px`
      styles.paddingRight = `${rowGutter.gutter / 2}px`
    }
  }

  if (props.flex !== undefined) {
    styles.flex = typeof props.flex === 'number' ? `${props.flex} ${props.flex} auto` : props.flex
  }

  return styles
})
</script>

<style scoped lang="less">
.x-col {
  position: relative;
  max-width: 100%;
  min-height: 1px;
  box-sizing: border-box;

  > :not(.x-row):not(.x-col) {
    margin-left: calc(var(--x-gutter-x, 0) / 2);
    margin-right: calc(var(--x-gutter-x, 0) / 2);
    margin-top: calc(var(--x-gutter-y, 0) / 2);
    margin-bottom: calc(var(--x-gutter-y, 0) / 2);
  }
}

.loop(@counter) when (@counter > 0) {
  .x-col-@{counter} {
    display: block;
    flex: 0 0 (@counter * (100% / 24));
    max-width: @counter * (100% / 24);
    box-sizing: border-box;
  }

  .x-col-push-@{counter} {
    left: @counter * (100% / 24);
  }

  .x-col-pull-@{counter} {
    right: @counter * (100% / 24);
  }

  .x-col-offset-@{counter} {
    margin-left: @counter * (100% / 24);
  }

  .x-col-order-@{counter} {
    order: @counter;
  }

  .loop((@counter - 1));
}

.loop(24);

@media (min-width: 576px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-xs-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-xs-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-xs-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-xs-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-xs-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}

@media (min-width: 768px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-sm-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-sm-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-sm-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-sm-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-sm-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}

@media (min-width: 992px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-md-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-md-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-md-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-md-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-md-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}

@media (min-width: 1200px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-lg-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-lg-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-lg-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-lg-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-lg-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}

@media (min-width: 1600px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-xl-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-xl-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-xl-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-xl-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-xl-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}

@media (min-width: 2000px) {
  .loop(@counter) when (@counter > 0) {
    .x-col-xxl-@{counter} {
      display: block;
      flex: 0 0 (@counter * (100% / 24));
      max-width: @counter * (100% / 24);
      box-sizing: border-box;
    }

    .x-col-xxl-push-@{counter} {
      left: @counter * (100% / 24);
    }

    .x-col-xxl-pull-@{counter} {
      right: @counter * (100% / 24);
    }

    .x-col-xxl-offset-@{counter} {
      margin-left: @counter * (100% / 24);
    }

    .x-col-xxl-order-@{counter} {
      order: @counter;
    }

    .loop((@counter - 1));
  }

  .loop(24);
}
</style>
