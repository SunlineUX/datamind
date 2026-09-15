<template>
  <li
    :class="itemClasses"
    :style="itemStyle"
    role="menuitem"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="x-menu-item-icon">
      <slot name="icon"></slot>
    </span>
    <span class="x-menu-item-content">
      <slot></slot>
    </span>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue'

interface MenuItemProps {
  key?: string
  disabled?: boolean
  danger?: boolean
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  key: '',
  disabled: false,
  danger: false
})

const emit = defineEmits<{
  click: [keyEvent: MouseEvent]
}>()

const instance = getCurrentInstance()
const menuContext: any = inject('x-menu', null)

const itemKey = computed(() => props.key || instance?.uid?.toString() || '')

const itemClasses = computed(() => {
  const classes = ['x-menu-item']

  if (menuContext) {
    if (menuContext.selectedKeys.value.includes(itemKey.value)) {
      classes.push('x-menu-item-selected')
    }
  }

  if (props.disabled) {
    classes.push('x-menu-item-disabled')
  }

  if (props.danger) {
    classes.push('x-menu-item-danger')
  }

  return classes
})

const itemStyle = computed(() => {
  const styles: Record<string, any> = {}

  if (menuContext && menuContext.props.mode === 'inline') {
    const level = (instance?.parent?.type?.name === 'XSubMenu' ? 1 : 0)
    styles.paddingLeft = `calc(${level * menuContext.props.inlineIndent}px + 24px)`
  }

  return styles
})

const handleClick = (event: MouseEvent) => {
  if (props.disabled) return

  emit('click', event)

  if (menuContext) {
    menuContext.handleSelect(itemKey.value)
  }
}
</script>

<style scoped lang="less">
.x-menu-item {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  margin: 0;
  padding: 0 16px;
  color: inherit;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
  font-size: 14px;
  line-height: 40px;
  white-space: nowrap;
  list-style: none;

  &:hover {
    color: var(--color-primary);
    background: var(--color-primaryLight);
  }

  &-selected {
    color: var(--color-primary);
    background: var(--color-primaryFocus);

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      border-right: 3px solid var(--color-primary);
      content: '';
    }
  }

  &-disabled {
    color: var(--color-textTertiary);
    cursor: not-allowed;

    &:hover {
      color: var(--color-textTertiary);
      background: transparent;
    }
  }

  &-danger {
    color: var(--x-error);

    &:hover {
      color: var(--x-error);
      background: rgba(255, 77, 79, 0.1);
    }

    &.x-menu-item-selected {
      color: var(--x-error);
      background: rgba(255, 77, 79, 0.1);

      &::after {
        border-right-color: var(--x-error);
      }
    }
  }

  &-icon {
    min-width: 14px;
    margin-right: 10px;
    font-size: 14px;
    transition: font-size 0.3s;
  }

  &-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.x-menu-dark .x-menu-item {
  color: rgba(255, 255, 255, 0.65);

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  &-selected {
    color: #fff;
    background: var(--color-primary);
  }

  &-disabled {
    color: rgba(255, 255, 255, 0.25);

    &:hover {
      color: rgba(255, 255, 255, 0.25);
      background: transparent;
    }
  }

  &-danger {
    color: #ff4d4f;

    &:hover {
      color: #ff4d4f;
      background: rgba(255, 77, 79, 0.15);
    }

    &.x-menu-item-selected {
      color: #fff;
      background: #ff4d4f;
    }
  }
}
</style>
