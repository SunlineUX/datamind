<template>
  <ul :class="menuClasses">
    <slot></slot>
  </ul>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'

export interface DropdownMenuProps {
  selectable?: boolean
  multiple?: boolean
  selectedKeys?: (string | number)[]
  defaultSelectedKeys?: (string | number)[]
}

const props = withDefaults(defineProps<DropdownMenuProps>(), {
  selectable: false,
  multiple: false,
  selectedKeys: () => [],
  defaultSelectedKeys: () => []
})

const emit = defineEmits<{
  select: [key: string | number, item: any]
  deselect: [key: string | number, item: any]
}>()

const selectedKeys = ref(props.selectedKeys.length > 0 ? props.selectedKeys : props.defaultSelectedKeys)

const menuClasses = computed(() => [
  'x-dropdown-menu-list'
])

const selectItem = (key: string | number, item: any) => {
  if (!props.selectable) return

  if (props.multiple) {
    const index = selectedKeys.value.indexOf(key)
    if (index > -1) {
      selectedKeys.value.splice(index, 1)
      emit('deselect', key, item)
    } else {
      selectedKeys.value.push(key)
      emit('select', key, item)
    }
  } else {
    if (selectedKeys.value[0] !== key) {
      const oldKey = selectedKeys.value[0]
      if (oldKey !== undefined) {
        emit('deselect', oldKey, null)
      }
      selectedKeys.value = [key]
      emit('select', key, item)
    }
  }
}

const isSelected = (key: string | number) => {
  return selectedKeys.value.includes(key)
}

provide('x-dropdown-menu', {
  selectable: props.selectable,
  multiple: props.multiple,
  selectItem,
  isSelected
})

defineExpose({
  selectedKeys
})
</script>

<style lang="less" scoped>
.x-dropdown-menu-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 120px;
}
</style>
