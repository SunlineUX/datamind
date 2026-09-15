<template>
  <slot></slot>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const props = defineProps<{
  enableDamping?: boolean
  dampingFactor?: number
  enableZoom?: boolean
  enablePan?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  minDistance?: number
  maxDistance?: number
  minPolarAngle?: number
  maxPolarAngle?: number
  camera?: THREE.PerspectiveCamera
  renderer?: THREE.WebGLRenderer
}>()

const emit = defineEmits<{
  (e: 'created', controls: OrbitControls): void
}>()

const controls = ref<OrbitControls>()

onMounted(() => {
  if (!props.camera || !props.renderer) return
  
  controls.value = new OrbitControls(props.camera, props.renderer.domElement)
  
  if (props.enableDamping !== undefined) {
    controls.value.enableDamping = props.enableDamping
  }
  
  if (props.dampingFactor !== undefined) {
    controls.value.dampingFactor = props.dampingFactor
  }
  
  if (props.enableZoom !== undefined) {
    controls.value.enableZoom = props.enableZoom
  }
  
  if (props.enablePan !== undefined) {
    controls.value.enablePan = props.enablePan
  }
  
  if (props.autoRotate !== undefined) {
    controls.value.autoRotate = props.autoRotate
  }
  
  if (props.autoRotateSpeed !== undefined) {
    controls.value.autoRotateSpeed = props.autoRotateSpeed
  }
  
  if (props.minDistance !== undefined) {
    controls.value.minDistance = props.minDistance
  }
  
  if (props.maxDistance !== undefined) {
    controls.value.maxDistance = props.maxDistance
  }
  
  if (props.minPolarAngle !== undefined) {
    controls.value.minPolarAngle = props.minPolarAngle
  }
  
  if (props.maxPolarAngle !== undefined) {
    controls.value.maxPolarAngle = props.maxPolarAngle
  }
  
  const animate = () => {
    requestAnimationFrame(animate)
    controls.value?.update()
  }
  animate()
  
  emit('created', controls.value)
})

onUnmounted(() => {
  if (controls.value) {
    controls.value.dispose()
  }
})

// 移除深度监听，避免递归更新
watch(() => [props.enableDamping, props.dampingFactor, props.enableZoom, props.enablePan, props.autoRotate, props.autoRotateSpeed, props.minDistance, props.maxDistance, props.minPolarAngle, props.maxPolarAngle], () => {
  if (controls.value) {
    if (props.enableDamping !== undefined) {
      controls.value.enableDamping = props.enableDamping
    }
    if (props.dampingFactor !== undefined) {
      controls.value.dampingFactor = props.dampingFactor
    }
    if (props.enableZoom !== undefined) {
      controls.value.enableZoom = props.enableZoom
    }
    if (props.enablePan !== undefined) {
      controls.value.enablePan = props.enablePan
    }
    if (props.autoRotate !== undefined) {
      controls.value.autoRotate = props.autoRotate
    }
    if (props.autoRotateSpeed !== undefined) {
      controls.value.autoRotateSpeed = props.autoRotateSpeed
    }
    if (props.minDistance !== undefined) {
      controls.value.minDistance = props.minDistance
    }
    if (props.maxDistance !== undefined) {
      controls.value.maxDistance = props.maxDistance
    }
    if (props.minPolarAngle !== undefined) {
      controls.value.minPolarAngle = props.minPolarAngle
    }
    if (props.maxPolarAngle !== undefined) {
      controls.value.maxPolarAngle = props.maxPolarAngle
    }
  }
})

watch(() => [props.camera, props.renderer], () => {
  if (props.camera && props.renderer && !controls.value) {
    controls.value = new OrbitControls(props.camera, props.renderer.domElement)
    emit('created', controls.value)
  }
})
</script>
