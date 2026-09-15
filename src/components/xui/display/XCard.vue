<template>
  <div :class="cardClasses" :style="wrapperStyle">
    <div v-if="title || $slots.title || $slots.extra" class="x-card-head" :style="headStyle">
      <div class="x-card-head-wrapper">
        <div v-if="title || $slots.title" class="x-card-head-title">
          <slot name="title">{{ title }}</slot>
        </div>
        <div v-if="$slots.extra" class="x-card-extra">
          <slot name="extra" />
        </div>
      </div>
    </div>
    <div v-if="cover || $slots.cover" class="x-card-cover">
      <slot name="cover">
        <img :src="cover" alt="cover" />
      </slot>
    </div>
    <div v-if="loading" class="x-card-loading-content">
      <div class="x-card-loading-block" v-for="i in 4" :key="i"></div>
    </div>
    <div v-else class="x-card-body" :style="bodyStyle">
      <slot />
    </div>
    <div v-if="$slots.actions" class="x-card-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface CardProps {
  title?: string
  extra?: string
  bordered?: boolean
  hoverable?: boolean
  loading?: boolean
  size?: 'default' | 'small'
  type?: 'inner'
  cover?: string
  headStyle?: Record<string, any>
  bodyStyle?: Record<string, any>
}

const props = withDefaults(defineProps<CardProps>(), {
  title: '',
  extra: '',
  bordered: true,
  hoverable: false,
  loading: false,
  size: 'default',
  type: undefined,
  cover: '',
  headStyle: () => ({}),
  bodyStyle: () => ({})
})

const cardClasses = computed(() => [
  'x-card',
  `x-card-${props.size}`,
  {
    'x-card-bordered': props.bordered,
    'x-card-hoverable': props.hoverable,
    'x-card-loading': props.loading,
    'x-card-type-inner': props.type === 'inner'
  }
])

const wrapperStyle = computed(() => ({
  ...props.bodyStyle
}))
</script>

<style scoped lang="less">
.x-card {
  position: relative;
  background: var(--color-bg-container);
  border-radius: 8px;
  transition: all 0.3s;

  &.x-card-bordered {
    border: 1px solid var(--color-border);
  }

  &.x-card-hoverable {
    cursor: pointer;

    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
    }
  }

  &.x-card-small {
    font-size: 14px;
  }

  &.x-card-type-inner {
    border: none;
    box-shadow: none;
  }
}

.x-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  margin-bottom: -1px;
  padding: 0 24px;
  color: var(--color-text);
  font-weight: 500;
  font-size: 16px;
  background: transparent;
  border-bottom: 1px solid transparent;
  border-radius: 8px 8px 0 0;

  .x-card-bordered & {
    border-bottom: 1px solid var(--color-border);
  }

  .x-card-small & {
    min-height: 48px;
    padding: 0 16px;
    font-size: 14px;
  }
}

.x-card-head-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.x-card-head-title {
  display: inline-block;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.x-card-extra {
  margin-left: auto;
  font-weight: normal;
  font-size: 14px;
  color: var(--color-text);

  .x-card-small & {
    font-size: 14px;
  }
}

.x-card-cover {
  margin-right: -1px;
  margin-left: -1px;

  > * {
    display: block;
    width: 100%;
  }

  img {
    border-radius: 8px 8px 0 0;
  }
}

.x-card-body {
  padding: 24px;

  .x-card-small & {
    padding: 16px;
  }

  .x-card-type-inner & {
    padding: 0;
  }
}

.x-card-loading-content {
  padding: 24px;

  .x-card-small & {
    padding: 16px;
  }
}

.x-card-loading-block {
  height: 16px;
  margin-bottom: 16px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
  border-radius: 4px;
  animation: card-loading 1.4s ease infinite;

  &:last-child {
    margin-bottom: 0;
  }
}
[data-theme="dark"] & .x-card-loading-block {
  background: linear-gradient(90deg, #3d4c61 25%, #152538 37%, #333333 63%);
  background-size: 400% 100%;
}
@keyframes card-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}

.x-card-actions {
  display: flex;
  border-top: 1px solid var(--color-border);
  list-style: none;
  margin: 0;
  padding: 0;

  > li {
    margin: 12px 0;
    color: var(--color-text);
    text-align: center;

    &:not(:last-child) {
      border-right: 1px solid var(--color-border);
    }

    > span {
      display: block;
      min-width: 32px;
      font-size: 14px;
      line-height: 1.5715;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
</style>
