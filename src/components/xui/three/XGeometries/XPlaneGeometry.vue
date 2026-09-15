<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  width?: number
  height?: number
  widthSegments?: number
  heightSegments?: number
}>()

const emit = defineEmits<{
  (e: 'created', geometry: THREE.PlaneGeometry): void
}>()

const geometry = ref<THREE.PlaneGeometry>(new THREE.PlaneGeometry(
  props.width ?? 1,
  props.height ?? 1,
  props.widthSegments ?? 1,
  props.heightSegments ?? 1
))

provide('three-geometry', geometry.value)

onMounted(() => {
  emit('created', geometry.value)
})

watch(() => [props.width, props.height, props.widthSegments, props.heightSegments], () => {
  if (geometry.value) {
    geometry.value.dispose()
    geometry.value = new THREE.PlaneGeometry(
      props.width ?? 1,
      props.height ?? 1,
      props.widthSegments ?? 1,
      props.heightSegments ?? 1
    )
    provide('three-geometry', geometry.value)
  }
}, { deep: true })
</script>
