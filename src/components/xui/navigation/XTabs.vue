<template>
  <div :class="tabsClasses">
    <div :class="navClasses">
      <div ref="navWrapperRef" :class="navWrapperClasses">
        <div ref="navRef" :class="navScrollClasses" :style="navScrollStyle">
          <div
            v-for="(tab, index) in panes"
            :key="index"
            :class="tabClasses(tab)"
            @click="handleTabClick(tab)"
          >
            <div class="x-tab-item-content">
              <slot name="tab" :tab="tab" :index="index">
                <span v-if="tab.icon" class="x-tab-icon">
                  <component :is="tab.icon" />
                </span>
                <span class="x-tab-title">{{ tab.title }}</span>
              </slot>
              <span
                v-if="tab.closable && !tab.disabled"
                class="x-tab-close"
                @click.stop="handleClose(tab, index)"
              >
                ×
              </span>
            </div>
          </div>
          <div v-if="type === 'line'" :class="inkBarClasses" :style="inkBarStyle"></div>
        </div>
      </div>
      <div v-if="showAddButton && type === 'editable-card'" class="x-tab-add" @click="handleAdd">
        <span>+</span>
      </div>
    </div>
    <div class="x-tabs-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref, watch, onMounted, nextTick } from 'vue'

export interface TabsProps {
  activeKey?: string | number
  defaultActiveKey?: string | number
  type?: 'line' | 'card' | 'editable-card'
  tabPosition?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'small' | 'default' | 'large'
  hideAdd?: boolean
  animated?: boolean
  tabGutter?: number
  centered?: boolean
}

const props = withDefaults(defineProps<TabsProps>(), {
  defaultActiveKey: '',
  type: 'line',
  tabPosition: 'top',
  size: 'default',
  hideAdd: false,
  animated: true,
  tabGutter: 0,
  centered: false
})

const emit = defineEmits<{
  change: [key: string | number]
  tabClick: [key: string | number, event: Event]
  edit: [targetKey: string | number, action: 'add' | 'remove']
}>()

const panes = ref<any[]>([])
const activeKey = ref(props.activeKey || props.defaultActiveKey)
const navRef = ref<HTMLElement>()
const navWrapperRef = ref<HTMLElement>()
const inkBarStyle = ref<Record<string, any>>({})

// Suppress TypeScript warning - navWrapperRef is used in template
void navWrapperRef

const showAddButton = computed(() => {
  return props.type === 'editable-card' && !props.hideAdd
})

const tabsClasses = computed(() => [
  'x-tabs',
  `x-tabs-${props.tabPosition}`,
  `x-tabs-${props.size}`,
  {
    'x-tabs-animated': props.animated,
    'x-tabs-centered': props.centered
  }
])

const navClasses = computed(() => [
  'x-tabs-nav',
  `x-tabs-nav-${props.tabPosition}`,
  {
    'x-tabs-nav-scrollable': panes.value.length > 0
  }
])

const navWrapperClasses = computed(() => [
  'x-tabs-nav-wrap',
  `x-tabs-nav-wrap-${props.tabPosition}`
])

const navScrollClasses = computed(() => [
  'x-tabs-nav-scroll',
  `x-tabs-nav-scroll-${props.tabPosition}`
])

const navScrollStyle = computed(() => {
  const style: Record<string, any> = {}
  if (props.tabGutter) {
    style.marginLeft = props.tabGutter + 'px'
  }
  return style
})

const inkBarClasses = computed(() => [
  'x-tabs-ink-bar',
  `x-tabs-ink-bar-${props.tabPosition}`
])

const tabClasses = (tab: any) => [
  'x-tab-item',
  {
    'x-tab-item-active': tab.key === activeKey.value,
    'x-tab-item-disabled': tab.disabled,
    'x-tab-item-closable': tab.closable
  }
]

const addPane = (pane: any) => {
  if (pane && !panes.value.includes(pane)) {
    panes.value.push(pane)
  }
}

const removePane = (pane: any) => {
  const index = panes.value.indexOf(pane)
  if (index > -1) {
    panes.value.splice(index, 1)
  }
}

const handleTabClick = (tab: any) => {
  if (tab.disabled) return

  activeKey.value = tab.key
  emit('change', tab.key)
  emit('tabClick', tab.key, {} as Event)
  
  updateInkBar()
}

const handleClose = (tab: any, index: number) => {
  emit('edit', tab.key, 'remove')
  
  if (tab.key === activeKey.value) {
    const nextTab = panes.value[index + 1] || panes.value[index - 1]
    if (nextTab) {
      activeKey.value = nextTab.key
    }
  }
}

const handleAdd = () => {
  emit('edit', '', 'add')
}

const updateInkBar = () => {
  if (props.type !== 'line' || !navRef.value) return

  nextTick(() => {
    const activeTab = navRef.value?.querySelector('.x-tab-item-active') as HTMLElement
    if (activeTab) {
      inkBarStyle.value = {
        width: activeTab.offsetWidth + 'px',
        transform: `translateX(${activeTab.offsetLeft}px)`
      }
    }
  })
}

watch(() => props.activeKey, (newVal) => {
  if (newVal !== undefined) {
    activeKey.value = newVal
  }
})

watch(activeKey, () => {
  updateInkBar()
})

watch(() => panes.value.length, () => {
  updateInkBar()
})

onMounted(() => {
  updateInkBar()
})

provide('x-tabs', {
  activeKey,
  addPane,
  removePane
})

defineExpose({
  activeKey
})
</script>

<style lang="less" scoped>
.x-tabs {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  &-top {
    flex-direction: column;
  }

  &-right {
    flex-direction: row;
  }

  &-bottom {
    flex-direction: column-reverse;
  }

  &-left {
    flex-direction: row-reverse;
  }

  &-small {
    font-size: 12px;
  }

  &-default {
    font-size: 14px;
  }

  &-large {
    font-size: 16px;
  }

  &-nav {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;

    &::before {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      border-top: 1px solid #f0f0f0;
      content: '';
    }

    &-right {
      flex-direction: column;
      border-bottom: none;
      border-left: 1px solid #f0f0f0;

      &::before {
        left: auto;
        right: 0;
        top: 0;
        bottom: auto;
        width: auto;
        height: 100%;
        border-top: none;
        border-right: 1px solid #f0f0f0;
      }
    }

    &-bottom {
      border-bottom: none;
      border-top: 1px solid #f0f0f0;

      &::before {
        top: 0;
        bottom: auto;
      }
    }

    &-left {
      flex-direction: column-reverse;
      border-bottom: none;
      border-right: 1px solid #f0f0f0;

      &::before {
        left: auto;
        right: 0;
        top: 0;
        bottom: auto;
        width: auto;
        height: 100%;
        border-top: none;
        border-right: 1px solid #f0f0f0;
      }
    }

    &-wrap {
      flex: 1;
      overflow: hidden;
      white-space: nowrap;

      &-top,
      &-bottom {
        width: 100%;
      }

      &-left,
      &-right {
        height: 100%;
      }
    }

    &-scroll {
      position: relative;
      display: flex;
      flex-direction: row;
      transition: transform 0.3s;

      &-left,
      &-right {
        flex-direction: column;
      }
    }
  }

  &-ink-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    background-color: #1890ff;
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

    &-right {
      bottom: auto;
      left: auto;
      right: 0;
      top: 0;
      width: 2px;
      height: auto;
    }

    &-bottom {
      top: 0;
      bottom: auto;
    }

    &-left {
      bottom: auto;
      left: 0;
      right: auto;
      top: auto;
      width: 2px;
      height: auto;
    }
  }

  &-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.3s;
    user-select: none;

    &:hover {
      color: #1890ff;
    }

    &-active {
      color: #1890ff;
      font-weight: 500;
    }

    &-disabled {
      color: rgba(0, 0, 0, 0.25);
      cursor: not-allowed;

      &:hover {
        color: rgba(0, 0, 0, 0.25);
      }
    }

    &-content {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  &-icon {
    display: inline-flex;
    align-items: center;
  }

  &-title {
    display: inline-block;
  }

  &-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 8px;
    font-size: 12px;
    border-radius: 2px;
    transition: all 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
      color: rgba(0, 0, 0, 0.88);
    }
  }

  &-add {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    margin-left: 8px;
    font-size: 16px;
    cursor: pointer;
    border: 1px dashed #d9d9d9;
    border-radius: 2px;
    transition: all 0.3s;

    &:hover {
      color: #1890ff;
      border-color: #1890ff;
    }
  }

  &-content {
    position: relative;
    flex: 1;
  }

  &-animated &-content {
    transition: opacity 0.3s;
  }

  &-centered &-nav-scroll {
    justify-content: center;
  }

  &-card &-item {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    margin-right: 2px;
    padding: 8px 16px;

    &-active {
      background: #fff;
      border-bottom-color: #fff;
    }
  }

  &-editable-card &-item {
    background: #fafafa;
    border: 1px solid #f0f0f0;
    border-radius: 2px 2px 0 0;
    margin-right: 2px;
    padding: 8px 16px;

    &-active {
      background: #fff;
      border-bottom-color: #fff;
    }
  }
}
</style>
