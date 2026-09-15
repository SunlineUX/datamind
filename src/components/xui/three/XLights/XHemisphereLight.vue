<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  skyColor?: string | number
  groundColor?: string | number
  intensity?: number
  position?: [number, number, number]
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', light: THREE.HemisphereLight): void
}>()

const light = ref<THREE.HemisphereLight>()

onMounted(() => {
  if (!props.scene) return
  
  light.value = new THREE.HemisphereLight(
    props.skyColor ?? 0xffffff,
    props.groundColor ?? 0x000000,
    props.intensity ?? 1
  )
  
  if (props.position) {
    light.value.position.set(...props.position)
  }
  
  props.scene.add(light.value)
  emit('created', light.value)
})

onUnmounted(() => {
  if (props.scene && light.value) {
    props.scene.remove(light.value)
  }
})

// 移除深度监听，避免递归更新
watch(() => [props.skyColor, props.groundColor, props.intensity, props.position], () => {
  if (light.value) {
    if (props.skyColor !== undefined) {
      light.value.color.set(props.skyColor)
    }
    if (props.groundColor !== undefined) {
      light.value.groundColor.set(props.groundColor)
    }
    if (props.intensity !== undefined) {
      light.value.intensity = props.intensity
    }
    if (props.position) {
      light.value.position.set(...props.position)
    }
  }
})
</script>
