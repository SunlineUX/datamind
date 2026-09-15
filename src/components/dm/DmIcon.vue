<template>
  <i
    :class="['dm-icon', 'iconfont', computedClass]"
    :style="iconStyle"
    aria-hidden="true"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue';

/**
 * DmIcon —— iconfont 图标组件
 * 基于 src/assets/font/iconfont（font-family: iconfont，class 前缀 Dm-）
 *
 * 用法：
 *   <DmIcon name="Home" />          // PascalCase（推荐，与 iconfont font_class 一致）
 *   <DmIcon name="file-text" />     // kebab-case，自动转 FileText
 *   <DmIcon name="ArrowDown" :size="20" color="#0e6fda" />
 *   <DmIcon name="Loading" spin />  // 旋转动画
 */
const props = defineProps({
  /** 图标名，不含 Dm- 前缀。支持 PascalCase（Home）、kebab-case（file-text）或直接传完整 class（Dm-Home） */
  name: { type: String, required: true },
  /** 图标尺寸，数字按 px 处理 */
  size: { type: [Number, String], default: 16 },
  /** 图标颜色，默认跟随父级 currentColor */
  color: { type: String, default: 'currentColor' },
  /** 是否旋转动画（用于 loading 等） */
  spin: { type: Boolean, default: false },
});

// kebab/camel → PascalCase，兼容用户传 'file-text' 这种
function toPascalCase(s) {
  return s
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
}

const computedClass = computed(() => {
  let n = props.name || '';
  if (n.startsWith('Dm-')) return n; // 已带前缀，直接用
  return 'Dm-' + toPascalCase(n);
});

const iconStyle = computed(() => {
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return {
    fontSize: s,
    color: props.color,
    animation: props.spin ? 'dm-icon-spin 1s linear infinite' : undefined,
  };
});
</script>

<style>
.dm-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
  line-height: 1;
  vertical-align: -0.125em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@keyframes dm-icon-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
