<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  color?: string | number
  intensity?: number
  position?: [number, number, number]
  target?: [number, number, number]
  castShadow?: boolean
  shadowMapSize?: [number, number]
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', light: THREE.DirectionalLight): void
}>()

const light = ref<THREE.DirectionalLight>()

onMounted(() => {
  if (!props.scene) return
  
  light.value = new THREE.DirectionalLight(
    props.color ?? 0xffffff,
    props.intensity ?? 1
  )
  
  if (props.position) {
    light.value.position.set(...props.position)
  }
  
  if (props.target) {
    light.value.target.position.set(...props.target)
    props.scene.add(light.value.target)
  }
  
  if (props.castShadow) {
    light.value.castShadow = true
    if (props.shadowMapSize) {
      light.value.shadow.mapSize.set(...props.shadowMapSize)
    }
  }
  
  props.scene.add(light.value)
  emit('created', light.value)
})

onUnmounted(() => {
  if (props.scene && light.value) {
    props.scene.remove(light.value)
    if (light.value.target) {
      props.scene.remove(light.value.target)
    }
  }
})

// 移除深度监听，避免递归更新
watch(() => [props.color, props.intensity, props.position, props.target, props.castShadow, props.shadowMapSize], () => {
  if (light.value) {
    if (props.color !== undefined) {
      light.value.color.set(props.color)
    }
    if (props.intensity !== undefined) {
      light.value.intensity = props.intensity
    }
    if (props.position) {
      light.value.position.set(...props.position)
    }
    if (props.target && light.value.target) {
      light.value.target.position.set(...props.target)
    }
    if (props.castShadow !== undefined) {
      light.value.castShadow = props.castShadow
    }
    if (props.shadowMapSize && light.value.castShadow) {
      light.value.shadow.mapSize.set(...props.shadowMapSize)
    }
  }
})
</script>
