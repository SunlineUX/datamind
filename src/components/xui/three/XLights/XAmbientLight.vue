<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  color?: string | number
  intensity?: number
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', light: THREE.AmbientLight): void
}>()

const light = ref<THREE.AmbientLight>()

onMounted(() => {
  if (!props.scene) return
  
  light.value = new THREE.AmbientLight(
    props.color ?? 0xffffff,
    props.intensity ?? 1
  )
  
  props.scene.add(light.value)
  emit('created', light.value)
})

onUnmounted(() => {
  if (props.scene && light.value) {
    props.scene.remove(light.value)
  }
})

watch(() => [props.color, props.intensity], () => {
  if (light.value) {
    if (props.color !== undefined) {
      light.value.color.set(props.color)
    }
    if (props.intensity !== undefined) {
      light.value.intensity = props.intensity
    }
  }
})
</script>
