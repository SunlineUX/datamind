<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  color?: string | number
  intensity?: number
  distance?: number
  angle?: number
  penumbra?: number
  decay?: number
  position?: [number, number, number]
  target?: [number, number, number]
  castShadow?: boolean
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', light: THREE.SpotLight): void
}>()

const light = ref<THREE.SpotLight>()

onMounted(() => {
  if (!props.scene) return
  
  light.value = new THREE.SpotLight(
    props.color ?? 0xffffff,
    props.intensity ?? 1,
    props.distance ?? 0,
    props.angle ?? Math.PI / 4,
    props.penumbra ?? 0,
    props.decay ?? 2
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
watch(() => [props.color, props.intensity, props.distance, props.angle, props.penumbra, props.decay, props.position, props.target, props.castShadow], () => {
  if (light.value) {
    if (props.color !== undefined) {
      light.value.color.set(props.color)
    }
    if (props.intensity !== undefined) {
      light.value.intensity = props.intensity
    }
    if (props.distance !== undefined) {
      light.value.distance = props.distance
    }
    if (props.angle !== undefined) {
      light.value.angle = props.angle
    }
    if (props.penumbra !== undefined) {
      light.value.penumbra = props.penumbra
    }
    if (props.decay !== undefined) {
      light.value.decay = props.decay
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
  }
})
</script>
