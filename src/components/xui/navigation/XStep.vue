<template>
  <div :class="stepClasses">
    <div :class="tailClasses"></div>
    <div class="x-step-item-container">
      <div :class="iconClasses">
        <slot name="icon">
          <span v-if="stepStatus === 'finish'">✓</span>
          <span v-else-if="stepStatus === 'error'">✕</span>
          <span v-else>{{ index + 1 }}</span>
        </slot>
      </div>
      <div class="x-step-content">
        <div :class="titleClasses">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="$slots.description || description" class="x-step-description">
          <slot name="description">{{ description }}</slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, useSlots } from 'vue'

export interface StepProps {
  title?: string
  description?: string
  icon?: any
  status?: 'wait' | 'process' | 'finish' | 'error'
  disabled?: boolean
}

const props = withDefaults(defineProps<StepProps>(), {
  title: '',
  description: '',
  icon: null,
  status: undefined,
  disabled: false
})

const slots = useSlots()
const stepsContext: any = inject('x-steps', null)

const index = computed(() => {
  if (!stepsContext) return 0
  return stepsContext.steps.value.findIndex((step: any) => step === stepRef)
})

const stepRef = computed(() => ({
  props,
  index: index.value
}))

const stepStatus = computed(() => {
  if (props.status) return props.status

  if (!stepsContext) return 'wait'

  const current = stepsContext.props.current
  const stepIndex = index.value

  if (stepIndex < current) return 'finish'
  if (stepIndex === current) return stepsContext.props.status
  return 'wait'
})

const stepClasses = computed(() => [
  'x-step',
  `x-step-${stepStatus.value}`,
  {
    'x-step-disabled': props.disabled
  }
])

const tailClasses = computed(() => [
  'x-step-tail',
  {
    'x-step-tail-finish': stepStatus.value === 'finish'
  }
])

const iconClasses = computed(() => [
  'x-step-icon',
  {
    'x-step-icon-custom': slots.icon || props.icon
  }
])

const titleClasses = computed(() => [
  'x-step-title'
])

onMounted(() => {
  if (stepsContext) {
    stepsContext.addStep(stepRef.value)
  }
})

onUnmounted(() => {
  if (stepsContext) {
    stepsContext.removeStep(stepRef.value)
  }
})
</script>

<style scoped lang="less">
.x-step {
  position: relative;
  display: inline-flex;
  flex: 1;
  overflow: hidden;
  vertical-align: top;

  &:last-child {
    flex: 0 1 auto;

    .x-step-tail {
      display: none;
    }
  }

  &-tail {
    position: absolute;
    top: 16px;
    left: 0;
    width: 100%;
    padding: 0 10px;
    height: 1px;
    background: #e8e8e8;
    transition: all 0.3s;

    &::after {
      display: block;
      width: 100%;
      height: 100%;
      background: #e8e8e8;
      border-radius: 1px;
      transition: all 0.3s;
    }

    &-finish::after {
      background: #1890ff;
    }
  }

  &-item-container {
    display: inline-block;
    vertical-align: top;
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
    position: relative;
    z-index: 1;
  }

  &-icon-custom {
    background: transparent;
    border: none;
    width: auto;
    height: auto;
    line-height: 1;
  }

  &-content {
    display: inline-block;
    vertical-align: top;
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

  &-disabled {
    cursor: not-allowed;

    .x-step-icon {
      background-color: #f5f5f5;
      border-color: #d9d9d9;
      color: rgba(0, 0, 0, 0.25);
    }

    .x-step-title {
      color: rgba(0, 0, 0, 0.25);
    }

    .x-step-description {
      color: rgba(0, 0, 0, 0.25);
    }
  }
}

.x-steps-vertical {
  .x-step {
    display: block;
    flex: 1 0 auto;
    padding-left: 0;

    &:not(:last-child) {
      margin-bottom: 16px;
    }

    &-tail {
      position: absolute;
      top: 0;
      left: 16px;
      width: 1px;
      height: 100%;
      padding: 32px 0 4px;

      &::after {
        width: 1px;
        height: 100%;
      }
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
  .x-step {
    &-icon {
      margin-right: 16px;
    }

    &-content {
      display: block;
    }
  }
}

.x-steps-small {
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

.x-steps-dot {
  .x-step {
    &-icon {
      width: 8px;
      height: 8px;
      line-height: 8px;
      background: #ccc;
      border-radius: 100px;
      margin-right: 8px;
      border: none;

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
</style>
