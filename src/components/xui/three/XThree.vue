<template>
  <div class="x-three-container" ref="containerRef" :style="containerStyle as any">
    <slot :scene="scene" :camera="camera" :renderer="renderer"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'

const props = defineProps<{
  width?: string | number
  height?: string | number
  background?: string
  antialias?: boolean
}>()

const emit = defineEmits<{
  (e: 'ready', renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): void
}>()

const containerRef = ref<HTMLElement>()
const renderer = ref<THREE.WebGLRenderer>()
const scene = ref<THREE.Scene>()
const camera = ref<THREE.PerspectiveCamera>()
const animationId = ref<number>()

const containerStyle = {
  width: props.width || '100%',
  height: props.height || '100%',
  position: 'relative',
  overflow: 'hidden'
}

const renderScene = () => {
  if (renderer.value && scene.value && camera.value) {
    renderer.value.render(scene.value, camera.value)
    animationId.value = requestAnimationFrame(renderScene)
  }
}

const resize = () => {
  if (renderer.value && camera.value && containerRef.value) {
    const width = containerRef.value.clientWidth
    const height = containerRef.value.clientHeight
    
    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    
    renderer.value.setSize(width, height)
    renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
}

onMounted(() => {
  if (!containerRef.value) return
  
  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight
  
  scene.value = new THREE.Scene()
  if (props.background) {
    scene.value.background = new THREE.Color(props.background)
  }
  
  camera.value = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.value.position.z = 5
  
  renderer.value = new THREE.WebGLRenderer({
    antialias: props.antialias ?? true
  })
  renderer.value.setSize(width, height)
  renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
  containerRef.value.appendChild(renderer.value.domElement)
  
  window.addEventListener('resize', resize)
  renderScene()
  
  emit('ready', renderer.value, scene.value, camera.value)
})

onUnmounted(() => {
  if (animationId.value) {
    cancelAnimationFrame(animationId.value)
  }
  window.removeEventListener('resize', resize)
  
  if (renderer.value && containerRef.value) {
    containerRef.value.removeChild(renderer.value.domElement)
    renderer.value.dispose()
  }
  
  if (scene.value) {
    scene.value.clear()
  }
})

watch(() => props.background, (newBackground) => {
  if (scene.value && newBackground) {
    scene.value.background = new THREE.Color(newBackground)
  }
})
</script>

<style scoped>
.x-three-container {
  background: #000;
}
</style>
