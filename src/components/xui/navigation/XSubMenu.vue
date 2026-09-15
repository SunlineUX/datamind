<template>
  <li :class="submenuClasses" role="none">
    <div
      :class="titleClasses"
      :style="titleStyle"
      role="menuitem"
      @click="handleTitleClick"
    >
      <span v-if="$slots.icon" class="x-submenu-icon">
        <slot name="icon"></slot>
      </span>
      <span class="x-submenu-title-content">
        <slot name="title"></slot>
      </span>
      <span v-if="!isInlineCollapsed" class="x-submenu-arrow">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="down" width="10px" height="10px" fill="currentColor" aria-hidden="true">
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3 0.1-12.7-6.4-12.7z"></path>
        </svg>
      </span>
    </div>
    <Transition name="x-submenu-fade">
      <ul
        v-show="isOpen"
        :class="contentClasses"
        :style="contentStyle"
        role="menu"
      >
        <slot></slot>
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
import { computed, inject, getCurrentInstance } from 'vue'

interface SubMenuProps {
  key?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<SubMenuProps>(), {
  key: '',
  disabled: false
})

const emit = defineEmits<{
  titleClick: [keyEvent: MouseEvent]
}>()

const instance = getCurrentInstance()
const menuContext: any = inject('x-menu', null)

const itemKey = computed(() => props.key || instance?.uid?.toString() || '')

const isOpen = computed(() => {
  if (!menuContext) return false
  return menuContext.openKeys.value.includes(itemKey.value)
})

const isInlineCollapsed = computed(() => {
  if (!menuContext) return false
  return menuContext.props.inlineCollapsed
})

const submenuClasses = computed(() => {
  const classes = ['x-submenu']

  if (isOpen.value) {
    classes.push('x-submenu-open')
  }

  if (props.disabled) {
    classes.push('x-submenu-disabled')
  }

  return classes
})

const titleClasses = computed(() => {
  const classes = ['x-submenu-title']

  if (props.disabled) {
    classes.push('x-submenu-title-disabled')
  }

  return classes
})

const titleStyle = computed(() => {
  const styles: Record<string, any> = {}

  if (menuContext && menuContext.props.mode === 'inline') {
    const level = (instance?.parent?.type?.name === 'XSubMenu' ? 1 : 0)
    styles.paddingLeft = `calc(${level * menuContext.props.inlineIndent}px + 24px)`
  }

  return styles
})

const contentClasses = computed(() => {
  const classes = ['x-submenu-menu']

  if (menuContext) {
    classes.push(`x-submenu-menu-${menuContext.props.mode}`)
  }

  return classes
})

const contentStyle = computed(() => {
  const styles: Record<string, any> = {}

  if (menuContext && menuContext.props.mode === 'inline') {
    const level = (instance?.parent?.type?.name === 'XSubMenu' ? 1 : 0)
    styles.paddingLeft = `${(level + 1) * menuContext.props.inlineIndent}px`
  }

  return styles
})

const handleTitleClick = (event: MouseEvent) => {
  if (props.disabled) return

  emit('titleClick', event)

  if (menuContext) {
    menuContext.handleOpenChange(itemKey.value)
  }
}
</script>

<style scoped lang="less">
.x-submenu {
  list-style: none;

  &-title {
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
    user-select: none;

    &:hover {
      color: var(--color-primary);
      background: rgba(0, 0, 0, 0.06);
    }

    &-disabled {
      color: var(--color-textTertiary);
      cursor: not-allowed;

      &:hover {
        color: var(--color-textTertiary);
        background: transparent;
      }
    }

    &-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-icon {
    min-width: 14px;
    margin-right: 10px;
    font-size: 14px;
    transition: font-size 0.3s;
  }

  &-arrow {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    transition: transform 0.3s;
    font-size: 10px;
  }

  &-open &-arrow {
    transform: translateY(-50%) rotate(180deg);
  }

  &-menu {
    list-style: none;
    padding: 0;
    margin: 0;

    &-vertical {
      position: absolute;
      left: 100%;
      top: 0;
      min-width: 100%;
      margin-left: 4px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      z-index: 1050;
    }

    &-horizontal {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 100%;
      margin-top: 4px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
      z-index: 1050;
    }

    &-inline {
      padding: 0;
      overflow: hidden;
    }
  }
}

.x-menu-dark .x-submenu {
  &-title {
    color: rgba(255, 255, 255, 0.65);

    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.08);
    }

    &-disabled {
      color: rgba(255, 255, 255, 0.25);

      &:hover {
        color: rgba(255, 255, 255, 0.25);
        background: transparent;
      }
    }
  }

  &-menu {
    &-vertical,
    &-horizontal {
      background: #001529;
    }
  }
}

.x-submenu-fade-enter-active,
.x-submenu-fade-leave-active {
  transition: all 0.3s ease-in-out;
  overflow: hidden;
}

.x-submenu-fade-enter-from,
.x-submenu-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.x-submenu-fade-enter-to,
.x-submenu-fade-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
