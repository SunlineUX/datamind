<template>
  <div :class="itemClasses" :style="itemStyle" @click="handleClick">
    <div v-if="actions && actions.length" class="x-list-item-action">
      <slot name="actions">
        <span v-for="(action, index) in actions" :key="index" class="x-list-item-action-item">
          <a v-if="action.text" @click.stop="action.onClick">{{ action.text }}</a>
          <component v-else :is="action" />
        </span>
      </slot>
    </div>

    <div class="x-list-item-main">
      <div v-if="extra" class="x-list-item-extra">
        <slot name="extra">
          <span>{{ extra }}</span>
        </slot>
      </div>

      <div v-if="$slots.avatar" class="x-list-item-avatar">
        <slot name="avatar"></slot>
      </div>

      <div class="x-list-item-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'

export interface ListItemProps {
  actions?: any[]
  extra?: string
  isItem?: boolean
}

const props = withDefaults(defineProps<ListItemProps>(), {
  actions: () => [],
  extra: '',
  isItem: true
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const slots = useSlots()

const itemClasses = computed(() => [
  'x-list-item',
  {
    'x-list-item-with-actions': props.actions && props.actions.length > 0,
    'x-list-item-with-extra': props.extra || slots.extra,
    'x-list-item-with-avatar': slots.avatar
  }
])

const itemStyle = computed(() => {
  return {}
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped lang="less">
.x-list-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  transition: background 0.3s;
  cursor: pointer;

  &:hover {
    background: rgba(0, 0, 0, 0.02);
  }

  &-action {
    flex: 0 0 auto;
    margin-left: 48px;
    padding: 0 12px;
    font-size: 0;
    text-align: right;
    list-style: none;
    border-left: 1px solid #f0f0f0;

    &-item {
      display: inline-block;
      margin: 0 8px;
      font-size: 14px;
      line-height: 22px;
      cursor: pointer;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }

      > a {
        color: #1890ff;
        text-decoration: none;
        transition: color 0.3s;

        &:hover {
          color: #40a9ff;
        }
      }
    }
  }

  &-extra {
    flex: 0 0 auto;
    margin-left: auto;
    padding-left: 40px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }

  &-avatar {
    flex: 0 0 auto;
    margin-right: 16px;
  }

  &-main {
    flex: 1 1 auto;
    display: flex;
    align-items: flex-start;
  }

  &-content {
    flex: 1 1 auto;
    color: var(--color-text);
    font-size: 14px;
    line-height: 1.5715;
  }

  &-with-actions {
    padding-right: 12px;
  }

  &-with-extra {
    padding-right: 0;
  }
}

.x-list-grid {
  .x-list-item {
    display: block;
    margin-bottom: 16px;
    padding: 24px;
    border: 1px solid #f0f0f0;
    border-radius: 2px;
    transition: all 0.3s;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
    }

    &-action {
      margin-top: 24px;
      margin-left: 0;
      padding-top: 24px;
      padding-left: 0;
      border-left: none;
      border-top: 1px solid #f0f0f0;
    }

    &-extra {
      margin-left: 0;
      padding-left: 0;
    }

    &-avatar {
      margin-right: 0;
      margin-bottom: 16px;
    }

    &-main {
      display: block;
    }
  }
}
</style>
