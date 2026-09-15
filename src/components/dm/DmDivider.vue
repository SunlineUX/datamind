<template>
  <div
    class="dm-divider"
    :class="[`dm-divider--${direction}`, `is-${lineType}`]"
    role="separator"
    :aria-orientation="direction"
  />
</template>

<script setup>
/**
 * DmDivider —— 分割线
 * 支持方向（horizontal / vertical）与线条类型（solid / dashed / dotted）。
 *
 * 用法：
 *   <DmDivider />                            水平实线
 *   <DmDivider direction="vertical" />       垂直实线
 *   <DmDivider line-type="dashed" />         水平虚线
 *   <DmDivider direction="vertical" line-type="dotted" />
 */
const props = defineProps({
  /** 方向：horizontal / vertical */
  direction: { type: String, default: 'horizontal' },
  /** 线条类型：solid / dashed / dotted */
  lineType: { type: String, default: 'solid' },
});
</script>

<style scoped>
.dm-divider {
  border: 0;
  flex-shrink: 0;
}

/* 水平：横线，占满宽度 */
.dm-divider--horizontal {
  display: block;
  width: 100%;
  margin: var(--space-sm) 0;
  border-top: 1px solid var(--border-lighter);
}

/* 垂直：竖线，默认高度 0.9em，在行内元素间分隔 */
.dm-divider--vertical {
  display: inline-block;
  height: 0.9em;
  margin: 0 var(--space-sm);
  vertical-align: middle;
  border-left: 1px solid var(--border-lighter);
}

/* 线条类型 */
.dm-divider.is-dashed {
  border-top-style: dashed;
  border-left-style: dashed;
}
.dm-divider.is-dotted {
  border-top-style: dotted;
  border-left-style: dotted;
}
</style>
