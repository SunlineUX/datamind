<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  size?: number
  scene?: THREE.Scene
}>()

const emit = defineEmits<{
  (e: 'created', helper: THREE.AxesHelper): void
}>()

const helper = ref<THREE.AxesHelper>()

onMounted(() => {
  if (!props.scene) return
  
  helper.value = new THREE.AxesHelper(props.size ?? 5)
  props.scene.add(helper.value)
  emit('created', helper.value)
})

onUnmounted(() => {
  if (props.scene && helper.value) {
    props.scene.remove(helper.value)
  }
})

watch(() => props.size, (newSize) => {
  if (props.scene && helper.value) {
    props.scene.remove(helper.value)
    helper.value = new THREE.AxesHelper(newSize ?? 5)
    props.scene.add(helper.value)
  }
})
</script>
