<template>
  <div ref="itemRef" :class="itemClasses">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'

interface MasonryItemProps {
  span?: number
}

const props = withDefaults(defineProps<MasonryItemProps>(), {
  span: 1
})

const itemRef = ref<HTMLElement>()
const masonry = inject<{ registerItem: (item: HTMLElement) => void, unregisterItem: (item: HTMLElement) => void }>('masonry')

const itemClasses = computed(() => [
  'x-masonry-item'
])

onMounted(() => {
  if (itemRef.value && masonry) {
    masonry.registerItem(itemRef.value)
  }
})

onUnmounted(() => {
  if (itemRef.value && masonry) {
    masonry.unregisterItem(itemRef.value)
  }
})
</script>

<style scoped lang="less">
.x-masonry-item {
  position: absolute;
  box-sizing: border-box;
  transition: left 0.3s ease, top 0.3s ease;
}
</style>
