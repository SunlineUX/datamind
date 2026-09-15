<template>
  <div :class="stepsClasses">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'

export interface StepsProps {
  current?: number
  direction?: 'horizontal' | 'vertical'
  labelPlacement?: 'horizontal' | 'vertical'
  size?: 'default' | 'small'
  status?: 'wait' | 'process' | 'finish' | 'error'
  initial?: number
  progressDot?: boolean | ((slot: { index: number; status: string; title: any; description: any }) => any)
}

const props = withDefaults(defineProps<StepsProps>(), {
  current: 0,
  direction: 'horizontal',
  labelPlacement: 'horizontal',
  size: 'default',
  status: 'process',
  initial: 0,
  progressDot: false
})

const steps = ref<any[]>([])

const addStep = (step: any) => {
  if (step) {
    steps.value.push(step)
  }
}

const removeStep = (step: any) => {
  if (step) {
    steps.value = steps.value.filter(s => s !== step)
  }
}

const stepsClasses = computed(() => [
  'x-steps',
  `x-steps-${props.direction}`,
  `x-steps-label-${props.labelPlacement}`,
  `x-steps-${props.size}`,
  {
    'x-steps-dot': props.progressDot
  }
])

provide('x-steps', {
  props,
  steps,
  addStep,
  removeStep
})

defineExpose({
  steps
})
</script>

<style scoped lang="less">
.x-steps {
  display: flex;
  width: 100%;
  font-size: 0;
  text-align: initial;

  &-horizontal {
    flex-direction: row;
  }

  &-vertical {
    flex-direction: column;
  }

  &-label-horizontal {
    .x-step {
      &-title {
        padding-right: 0;
        padding-left: 0;
      }

      &-description {
        max-width: 140px;
        white-space: normal;
      }
    }
  }

  &-label-vertical {
    .x-step {
      &-title {
        padding-right: 0;
        padding-left: 0;
        margin-bottom: 8px;
      }

      &-description {
        max-width: none;
      }
    }
  }

  &-small {
    .x-step {
      &-icon {
        width: 24px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        margin-right: 8px;
      }

      &-title {
        font-size: 14px;
        padding-bottom: 0;
      }

      &-description {
        font-size: 12px;
      }
    }
  }

  &-dot {
    .x-step {
      &-icon {
        width: 8px;
        height: 8px;
        line-height: 8px;
        background: #ccc;
        border-radius: 100px;
        margin-right: 8px;

        > * {
          display: none;
        }
      }

      &-process {
        .x-step-icon {
          background: #1890ff;
        }
      }

      &-finish {
        .x-step-icon {
          background: #1890ff;
        }
      }

      &-error {
        .x-step-icon {
          background: #ff4d4f;
        }
      }
    }
  }
}

:deep(.x-step) {
  position: relative;
  display: inline-block;
  flex: 1;
  overflow: hidden;
  vertical-align: top;

  &:last-child {
    flex: 0 1 auto;
  }

  &-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin: 0 8px 0 0;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.25);
    background-color: #fff;
    transition: all 0.3s;
  }

  &-title {
    display: inline-block;
    margin-bottom: 4px;
    padding-right: 16px;
    font-size: 16px;
    font-weight: 500;
    line-height: 32px;
    color: var(--color-text);
  }

  &-description {
    max-width: 140px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-process {
    .x-step-icon {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }

    .x-step-title {
      color: var(--color-text);
      font-weight: 500;
    }
  }

  &-finish {
    .x-step-icon {
      background-color: #fff;
      border-color: #1890ff;
      color: #1890ff;
    }

    .x-step-title {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  &-wait {
    .x-step-icon {
      background-color: #fff;
      border-color: rgba(0, 0, 0, 0.25);
      color: rgba(0, 0, 0, 0.25);
    }

    .x-step-title {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  &-error {
    .x-step-icon {
      background-color: #fff;
      border-color: #ff4d4f;
      color: #ff4d4f;
    }

    .x-step-title {
      color: #ff4d4f;
    }
  }
}

.x-steps-vertical {
  :deep(.x-step) {
    display: block;
    flex: 1 0 auto;
    padding-left: 0;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &-icon {
      float: left;
      margin-right: 16px;
    }

    &-content {
      display: block;
      min-height: 32px;
      overflow: hidden;
    }

    &-title {
      line-height: 32px;
    }
  }
}

.x-steps-label-vertical {
  :deep(.x-step) {
    &-icon {
      margin-right: 16px;
    }

    &-content {
      display: block;
    }
  }
}
</style>
