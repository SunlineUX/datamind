<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  radiusTop?: number
  radiusBottom?: number
  height?: number
  radialSegments?: number
  heightSegments?: number
  openEnded?: boolean
  thetaStart?: number
  thetaLength?: number
}>()

const emit = defineEmits<{
  (e: 'created', geometry: THREE.CylinderGeometry): void
}>()

const geometry = ref<THREE.CylinderGeometry>(new THREE.CylinderGeometry(
  props.radiusTop ?? 1,
  props.radiusBottom ?? 1,
  props.height ?? 1,
  props.radialSegments ?? 32,
  props.heightSegments ?? 1,
  props.openEnded ?? false,
  props.thetaStart ?? 0,
  props.thetaLength ?? Math.PI * 2
))

provide('three-geometry', geometry.value)

onMounted(() => {
  emit('created', geometry.value)
})

watch(() => [props.radiusTop, props.radiusBottom, props.height, props.radialSegments, props.heightSegments, props.openEnded, props.thetaStart, props.thetaLength], () => {
  if (geometry.value) {
    geometry.value.dispose()
    geometry.value = new THREE.CylinderGeometry(
      props.radiusTop ?? 1,
      props.radiusBottom ?? 1,
      props.height ?? 1,
      props.radialSegments ?? 32,
      props.heightSegments ?? 1,
      props.openEnded ?? false,
      props.thetaStart ?? 0,
      props.thetaLength ?? Math.PI * 2
    )
    provide('three-geometry', geometry.value)
  }
}, { deep: true })
</script>
