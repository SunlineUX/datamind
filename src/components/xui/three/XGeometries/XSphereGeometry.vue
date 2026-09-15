<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  radius?: number
  widthSegments?: number
  heightSegments?: number
  phiStart?: number
  phiLength?: number
  thetaStart?: number
  thetaLength?: number
}>()

const emit = defineEmits<{
  (e: 'created', geometry: THREE.SphereGeometry): void
}>()

const geometry = ref<THREE.SphereGeometry>(new THREE.SphereGeometry(
  props.radius ?? 1,
  props.widthSegments ?? 32,
  props.heightSegments ?? 32,
  props.phiStart ?? 0,
  props.phiLength ?? Math.PI * 2,
  props.thetaStart ?? 0,
  props.thetaLength ?? Math.PI
))

provide('three-geometry', geometry.value)

onMounted(() => {
  emit('created', geometry.value)
})

watch(() => [props.radius, props.widthSegments, props.heightSegments, props.phiStart, props.phiLength, props.thetaStart, props.thetaLength], () => {
  if (geometry.value) {
    geometry.value.dispose()
    geometry.value = new THREE.SphereGeometry(
      props.radius ?? 1,
      props.widthSegments ?? 32,
      props.heightSegments ?? 32,
      props.phiStart ?? 0,
      props.phiLength ?? Math.PI * 2,
      props.thetaStart ?? 0,
      props.thetaLength ?? Math.PI
    )
    provide('three-geometry', geometry.value)
  }
}, { deep: true })
</script>
