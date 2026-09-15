<template>
  <div v-show="isActive" :class="tabPaneClasses">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref } from 'vue'

export interface TabPaneProps {
  key?: string | number
  tab?: string
  disabled?: boolean
  closable?: boolean
  forceRender?: boolean
  icon?: any
}

const props = withDefaults(defineProps<TabPaneProps>(), {
  key: '',
  tab: '',
  disabled: false,
  closable: false,
  forceRender: false,
  icon: null
})

const tabsContext: any = inject('x-tabs', null)
const tabRef = ref<any>(null)

const isActive = computed(() => {
  if (!tabsContext) return false
  return tabsContext.activeKey.value === props.key
})

const tabPaneClasses = computed(() => [
  'x-tabs-tabpane',
  {
    'x-tabs-tabpane-active': isActive.value,
    'x-tabs-tabpane-hidden': !isActive.value && !props.forceRender
  }
])

onMounted(() => {
  if (tabsContext) {
    tabsContext.addPane({
      key: props.key,
      title: props.tab,
      disabled: props.disabled,
      closable: props.closable,
      icon: props.icon,
      ref: tabRef
    })
  }
})

onUnmounted(() => {
  if (tabsContext) {
    tabsContext.removePane({
      key: props.key,
      title: props.tab,
      disabled: props.disabled,
      closable: props.closable,
      icon: props.icon,
      ref: tabRef
    })
  }
})
</script>

<style lang="less" scoped>
.x-tabs-tabpane {
  width: 100%;
  
  &-hidden {
    display: none;
  }
}
</style>
