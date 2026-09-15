<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  color?: string | number
  metalness?: number
  roughness?: number
  wireframe?: boolean
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
}>()

const emit = defineEmits<{
  (e: 'created', material: THREE.MeshStandardMaterial): void
}>()

const material = ref<THREE.MeshStandardMaterial>(new THREE.MeshStandardMaterial({
  color: props.color ?? 0xffffff,
  metalness: props.metalness ?? 0.5,
  roughness: props.roughness ?? 0.5,
  wireframe: props.wireframe ?? false,
  transparent: props.transparent ?? false,
  opacity: props.opacity ?? 1,
  side: props.side
}))

provide('three-material', material.value)

onMounted(() => {
  emit('created', material.value)
})

watch(() => [props.color, props.metalness, props.roughness, props.wireframe, props.transparent, props.opacity, props.side], () => {
  if (material.value) {
    material.value.color.set(props.color ?? 0xffffff)
    material.value.metalness = props.metalness ?? 0.5
    material.value.roughness = props.roughness ?? 0.5
    material.value.wireframe = props.wireframe ?? false
    material.value.transparent = props.transparent ?? false
    material.value.opacity = props.opacity ?? 1
    if (props.side !== undefined) {
      material.value.side = props.side
    }
  }
}, { deep: true })
</script>
