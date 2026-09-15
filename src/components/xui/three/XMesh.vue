<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, inject, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: [number, number, number]
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', mesh: THREE.Mesh): void
}>()

const geometry = inject<THREE.BufferGeometry>('three-geometry')
const material = inject<THREE.Material>('three-material')
const mesh = ref<THREE.Mesh>()

onMounted(() => {
  if (!props.scene || !geometry || !material) return
  
  mesh.value = new THREE.Mesh(geometry, material)
  
  if (props.position) {
    mesh.value.position.set(...props.position)
  }
  
  if (props.rotation) {
    mesh.value.rotation.set(...props.rotation)
  }
  
  if (props.scale) {
    mesh.value.scale.set(...props.scale)
  }
  
  props.scene.add(mesh.value)
  emit('created', mesh.value)
})

onUnmounted(() => {
  if (props.scene && mesh.value) {
    props.scene.remove(mesh.value)
  }
})

watch(() => [props.position, props.rotation, props.scale], () => {
  if (mesh.value) {
    if (props.position) {
      mesh.value.position.set(...props.position)
    }
    if (props.rotation) {
      mesh.value.rotation.set(...props.rotation)
    }
    if (props.scale) {
      mesh.value.scale.set(...props.scale)
    }
  }
}, { deep: true })

// 只监听 geometry 和 material 的变化，避免监听 scene 导致的递归
watch([() => geometry, () => material], () => {
  if (props.scene && geometry && material) {
    if (mesh.value) {
      props.scene.remove(mesh.value)
    }
    
    mesh.value = new THREE.Mesh(geometry, material)
    
    if (props.position) {
      mesh.value.position.set(...props.position)
    }
    
    if (props.rotation) {
      mesh.value.rotation.set(...props.rotation)
    }
    
    if (props.scale) {
      mesh.value.scale.set(...props.scale)
    }
    
    props.scene.add(mesh.value)
  }
})
</script>
