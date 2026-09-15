<template>
  <ul :class="menuClasses" :style="menuStyle" role="menu">
    <slot></slot>
  </ul>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'

export interface MenuProps {
  mode?: 'vertical' | 'horizontal' | 'inline'
  theme?: 'light' | 'dark'
  inlineIndent?: number
  inlineCollapsed?: boolean
  selectedKeys?: string[]
  defaultSelectedKeys?: string[]
  openKeys?: string[]
  defaultOpenKeys?: string[]
  selectable?: boolean
  multiple?: boolean
}

const props = withDefaults(defineProps<MenuProps>(), {
  mode: 'vertical',
  theme: 'light',
  inlineIndent: 24,
  inlineCollapsed: false,
  selectedKeys: () => [],
  defaultSelectedKeys: () => [],
  openKeys: () => [],
  defaultOpenKeys: () => [],
  selectable: true,
  multiple: false
})

const emit = defineEmits<{
  select: [key: string, selectedKeys: string[]]
  openChange: [openKeys: string[]]
}>()

const internalSelectedKeys = ref(props.defaultSelectedKeys)
const internalOpenKeys = ref(props.defaultOpenKeys)

const menuClasses = computed(() => [
  'x-menu',
  `x-menu-${props.theme}`,
  `x-menu-${props.mode}`,
  {
    'x-menu-inline-collapsed': props.inlineCollapsed
  }
])

const menuStyle = computed(() => ({
  '--inline-indent': `${props.inlineIndent}px`
}))

const selectedKeys = computed(() => props.selectedKeys || internalSelectedKeys.value)
const openKeys = computed(() => props.openKeys || internalOpenKeys.value)

const handleSelect = (key: string) => {
  if (!props.selectable) return

  let newSelectedKeys: string[]

  if (props.multiple) {
    if (selectedKeys.value.includes(key)) {
      newSelectedKeys = selectedKeys.value.filter(k => k !== key)
    } else {
      newSelectedKeys = [...selectedKeys.value, key]
    }
  } else {
    newSelectedKeys = [key]
  }

  internalSelectedKeys.value = newSelectedKeys
  emit('select', key, newSelectedKeys)
}

const handleOpenChange = (key: string) => {
  let newOpenKeys: string[]

  if (openKeys.value.includes(key)) {
    newOpenKeys = openKeys.value.filter(k => k !== key)
  } else {
    newOpenKeys = [...openKeys.value, key]
  }

  internalOpenKeys.value = newOpenKeys
  emit('openChange', newOpenKeys)
}

provide('x-menu', {
  props,
  selectedKeys,
  openKeys,
  handleSelect,
  handleOpenChange
})

defineExpose({
  selectedKeys,
  openKeys
})
</script>

<style scoped lang="less">
.x-menu {
  margin: 0;
  padding: 0;
  list-style: none;
  outline: none;
  transition: background 0.3s, width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: var(--color-text);
  background: #fff;
  line-height: 0;
  font-size: 14px;

  &-light {
    background: #fff;
  }

  &-dark {
    background: #001529;
    color: rgba(255, 255, 255, 0.65);
  }

  &-vertical {
    min-width: 100%;
  }

  &-horizontal {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    &.x-menu-dark {
      background: #001529;
      border-bottom-color: #001529;
    }
  }

  &-inline {
    width: 100%;
  }

  &-inline-collapsed {
    width: 64px;

    > :deep(.x-submenu) {
      > .x-submenu-title {
        padding: 0 calc(50% - 8px);
        text-align: center;

        > .x-submenu-arrow {
          display: none;
        }
      }

      > .x-menu {
        display: none;
      }
    }

    > :deep(.x-menu-item) {
      padding: 0 calc(50% - 8px);
      text-align: center;

      > span,
      > a {
        display: none;
      }

      > .x-menu-item-icon {
        margin: 0;
        font-size: 16px;
        line-height: 40px;
      }
    }
  }
}
</style>
