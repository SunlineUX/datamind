<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  size?: number
  divisions?: number
  colorCenterLine?: string | number
  colorGrid?: string | number
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', helper: THREE.GridHelper): void
}>()

const helper = ref<THREE.GridHelper>()

onMounted(() => {
  if (!props.scene) return
  
  helper.value = new THREE.GridHelper(
    props.size ?? 10,
    props.divisions ?? 10,
    props.colorCenterLine ?? 0x444444,
    props.colorGrid ?? 0x888888
  )
  
  props.scene.add(helper.value)
  emit('created', helper.value)
})

onUnmounted(() => {
  if (props.scene && helper.value) {
    props.scene.remove(helper.value)
  }
})

// 移除深度监听，避免递归更新
watch(() => [props.size, props.divisions, props.colorCenterLine, props.colorGrid], () => {
  if (props.scene && helper.value) {
    props.scene.remove(helper.value)
    
    helper.value = new THREE.GridHelper(
      props.size ?? 10,
      props.divisions ?? 10,
      props.colorCenterLine ?? 0x444444,
      props.colorGrid ?? 0x888888
    )
    
    props.scene.add(helper.value)
  }
})
</script>
