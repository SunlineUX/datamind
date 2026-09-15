<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  color?: string | number
  wireframe?: boolean
  transparent?: boolean
  opacity?: number
  side?: THREE.Side
}>()

const emit = defineEmits<{
  (e: 'created', material: THREE.MeshLambertMaterial): void
}>()

const material = ref<THREE.MeshLambertMaterial>(new THREE.MeshLambertMaterial({
  color: props.color ?? 0xffffff,
  wireframe: props.wireframe ?? false,
  transparent: props.transparent ?? false,
  opacity: props.opacity ?? 1,
  side: props.side
}))

provide('three-material', material.value)

onMounted(() => {
  emit('created', material.value)
})

watch(() => [props.color, props.wireframe, props.transparent, props.opacity, props.side], () => {
  if (material.value) {
    material.value.color.set(props.color ?? 0xffffff)
    material.value.wireframe = props.wireframe ?? false
    material.value.transparent = props.transparent ?? false
    material.value.opacity = props.opacity ?? 1
    if (props.side !== undefined) {
      material.value.side = props.side
    }
  }
}, { deep: true })
</script>
