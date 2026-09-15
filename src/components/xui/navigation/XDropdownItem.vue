<template>
  <li v-if="!divider" :class="itemClasses" @click="handleClick">
    <span v-if="icon" class="x-dropdown-item-icon">
      <component :is="icon" />
    </span>
    <span class="x-dropdown-item-content">
      <slot></slot>
    </span>
    <span v-if="selected" class="x-dropdown-item-selected">✓</span>
  </li>
  <li v-else :class="dividerClasses"></li>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'

export interface DropdownItemProps {
  key?: string | number
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  icon?: any
}

const props = withDefaults(defineProps<DropdownItemProps>(), {
  key: '',
  disabled: false,
  danger: false,
  divider: false,
  icon: null
})

const emit = defineEmits<{
  click: [key: string | number, event: MouseEvent]
}>()

const menuContext: any = inject('x-dropdown-menu', null)

const itemClasses = computed(() => [
  'x-dropdown-item',
  {
    'x-dropdown-item-disabled': props.disabled,
    'x-dropdown-item-danger': props.danger,
    'x-dropdown-item-selected': selected.value
  }
])

const dividerClasses = computed(() => [
  'x-dropdown-item-divider'
])

const selected = computed(() => {
  if (!menuContext || !menuContext.selectable) return false
  return menuContext.isSelected(props.key)
})

const handleClick = (e: MouseEvent) => {
  if (props.disabled) return

  emit('click', props.key, e)

  if (menuContext && menuContext.selectable) {
    menuContext.selectItem(props.key, {
      key: props.key,
      disabled: props.disabled,
      danger: props.danger
    })
  }
}
</script>

<style lang="less" scoped>
.x-dropdown-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 5px 12px;
  margin: 0;
  clear: both;
  font-size: 14px;
  line-height: 22px;
  color: rgba(0, 0, 0, 0.88);
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &-disabled {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }

  &-danger {
    color: #ff4d4f;

    &:hover {
      background-color: #fff1f0;
    }

    &.x-dropdown-item-disabled {
      color: rgba(0, 0, 0, 0.25);

      &:hover {
        background-color: transparent;
      }
    }
  }

  &-selected {
    background-color: #e6f7ff;

    &:hover {
      background-color: #bae7ff;
    }
  }

  &-icon {
    display: inline-flex;
    align-items: center;
    margin-right: 8px;
    font-size: 14px;
  }

  &-content {
    flex: 1;
  }

  &-selected {
    position: absolute;
    right: 12px;
    color: #1890ff;
    font-weight: bold;
  }

  &-divider {
    height: 1px;
    margin: 4px 0;
    overflow: hidden;
    line-height: 0;
    background-color: #f0f0f0;
  }
}
</style>
