<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  width?: number
  height?: number
  depth?: number
  widthSegments?: number
  heightSegments?: number
  depthSegments?: number
}>()

const emit = defineEmits<{
  (e: 'created', geometry: THREE.BoxGeometry): void
}>()

const geometry = ref<THREE.BoxGeometry>(new THREE.BoxGeometry(
  props.width ?? 1,
  props.height ?? 1,
  props.depth ?? 1,
  props.widthSegments ?? 1,
  props.heightSegments ?? 1,
  props.depthSegments ?? 1
))

provide('three-geometry', geometry.value)

onMounted(() => {
  emit('created', geometry.value)
})

watch(() => [props.width, props.height, props.depth, props.widthSegments, props.heightSegments, props.depthSegments], () => {
  if (geometry.value) {
    geometry.value.dispose()
    geometry.value = new THREE.BoxGeometry(
      props.width ?? 1,
      props.height ?? 1,
      props.depth ?? 1,
      props.widthSegments ?? 1,
      props.heightSegments ?? 1,
      props.depthSegments ?? 1
    )
    provide('three-geometry', geometry.value)
  }
}, { deep: true })
</script>
