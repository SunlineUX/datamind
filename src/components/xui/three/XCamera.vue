<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  position?: [number, number, number]
  rotation?: [number, number, number]
  fov?: number
  aspect?: number
  near?: number
  far?: number
  zoom?: number
  camera?: THREE.PerspectiveCamera
}>()

const emit = defineEmits<{
  (e: 'created', camera: THREE.PerspectiveCamera): void
}>()

const camera = ref<THREE.PerspectiveCamera>(props.camera!)

onMounted(() => {
  if (!camera.value) return
  
  if (props.position) {
    camera.value.position.set(...props.position)
  }
  
  if (props.rotation) {
    camera.value.rotation.set(...props.rotation)
  }
  
  if (props.fov) {
    camera.value.fov = props.fov
  }
  
  if (props.aspect) {
    camera.value.aspect = props.aspect
  }
  
  if (props.near !== undefined) {
    camera.value.near = props.near
  }
  
  if (props.far !== undefined) {
    camera.value.far = props.far
  }
  
  if (props.zoom !== undefined) {
    camera.value.zoom = props.zoom
  }
  
  camera.value.updateProjectionMatrix()
  emit('created', camera.value)
})

watch(() => props.position, (newPosition) => {
  if (camera.value && newPosition) {
    camera.value.position.set(...newPosition)
  }
}, { deep: true })

watch(() => props.rotation, (newRotation) => {
  if (camera.value && newRotation) {
    camera.value.rotation.set(...newRotation)
  }
}, { deep: true })

watch(() => [props.fov, props.aspect, props.near, props.far, props.zoom], () => {
  if (camera.value) {
    if (props.fov) camera.value.fov = props.fov
    if (props.aspect) camera.value.aspect = props.aspect
    if (props.near !== undefined) camera.value.near = props.near
    if (props.far !== undefined) camera.value.far = props.far
    if (props.zoom !== undefined) camera.value.zoom = props.zoom
    camera.value.updateProjectionMatrix()
  }
}, { deep: true })

watch(() => props.camera, (newCamera) => {
  if (newCamera) {
    camera.value = newCamera
  }
})
</script>
