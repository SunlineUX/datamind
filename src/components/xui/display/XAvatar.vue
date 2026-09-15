<template>
  <span :class="avatarClasses" :style="avatarStyle">
    <img v-if="src && !loadError" :src="src" :alt="alt" :srcset="srcSet" @error="handleImgError" />
    <slot v-else-if="$slots.icon" name="icon"></slot>
    <span v-else-if="text" :class="textClasses">{{ displayText }}</span>
    <slot v-else></slot>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

export interface AvatarProps {
  shape?: 'circle' | 'square'
  size?: number | 'large' | 'small' | 'default'
  src?: string
  srcSet?: string
  icon?: any
  alt?: string
  gap?: number
  text?: string
}

const props = withDefaults(defineProps<AvatarProps>(), {
  shape: 'circle',
  size: 'default',
  src: '',
  srcSet: '',
  icon: null,
  alt: '',
  gap: 4,
  text: ''
})

const slots = useSlots()
const loadError = ref(false)

const avatarClasses = computed(() => [
  'x-avatar',
  `x-avatar-${props.shape}`,
  {
    [`x-avatar-${props.size}`]: typeof props.size === 'string',
    'x-avatar-icon': slots.icon || props.icon,
    'x-avatar-image': props.src && !loadError.value,
    'x-avatar-text': props.text && !props.src
  }
])

const avatarStyle = computed(() => {
  const style: Record<string, any> = {}

  if (typeof props.size === 'number') {
    style.width = `${props.size}px`
    style.height = `${props.size}px`
    style.lineHeight = `${props.size}px`
    style.fontSize = `${props.size / 2}px`
  }

  return style
})

const textClasses = computed(() => [
  'x-avatar-string',
  {
    'x-avatar-string-with-gap': props.text.length > 1
  }
])

const displayText = computed(() => {
  if (!props.text) return ''
  return props.text.slice(0, 2)
})

const handleImgError = () => {
  loadError.value = true
}
</script>

<style scoped lang="less">
.x-avatar {
  position: relative;
  display: inline-block;
  overflow: hidden;
  color: #fff;
  white-space: nowrap;
  text-align: center;
  vertical-align: middle;
  background: #ccc;
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 32px;
  height: 32px;
  line-height: 32px;
  font-size: 18px;
  transition: all 0.3s;

  &-circle {
    border-radius: 50%;
  }

  &-square {
    border-radius: 2px;
  }

  &-large {
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 24px;
  }

  &-small {
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-size: 14px;
  }

  &-image {
    background: transparent;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-icon {
    font-size: 18px;
  }

  &-large&-icon {
    font-size: 24px;
  }

  &-small&-icon {
    font-size: 14px;
  }

  &-string {
    position: absolute;
    left: 50%;
    transform-origin: 0 center;
  }

  &-string-with-gap {
    position: relative;
    left: auto;
    transform: translateX(-50%);
  }
}
</style>
