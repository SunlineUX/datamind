<template>
  <i v-if="iconType === 'default'" :class="iconClasses" :style="iconStyle" v-bind="restProps" @click="handleClick"></i>
  <img v-else :src="svgIconPath" :class="iconClasses" :style="iconStyle" v-bind="restProps" @click="handleClick" alt="" />
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";

// 定义Icon的Props
interface IconProps {
  // 图标名称
  name: string;
  // 图标大小
  size?: number | string;
  // 图标颜色
  color?: string;
  // 图标前缀，默认为icon-（iconfont标准前缀）
  prefix?: string;
  // 是否为禁用状态
  disabled?: boolean;
  // 是否旋转动画
  spin?: boolean;
  // 图标类型：default（图标字体）、light、gray、colorful、glass（svg图片）、3d
  iconType?: 'default' | 'light' | 'gray' | 'colorful' | 'glass' | '3d';
}

// 使用withDefaults定义默认值
const props = withDefaults(defineProps<IconProps>(), {
  name: "",
  size: "inherit",
  color: "",
  prefix: "sd-",
  disabled: false,
  spin: false,
  iconType: "default",
});

// 定义事件
const emit = defineEmits(["click"]);

// 获取attrs，用于过滤出需要传递给底层组件的属性
const attrs = useAttrs();

// 计算图标类名
const iconClasses = computed(() => {
  const classNames: Record<string, string | boolean> = {
    // 基础类名
    "s-icon": true,
    // iconfont标准类名（仅默认类型）
    iconfont: props.iconType === 'default',
    // 图标名称类（仅默认类型）
    [`${props.prefix}${props.name}`]: props.iconType === 'default' && props.name,
    // 旋转动画类
    "s-icon-spin": props.spin,
    // 禁用状态类
    "s-icon-disabled": props.disabled,
  };

  return classNames;
});

// 计算图标样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {};

  // 设置大小样式
  if (props.size) {
    style.fontSize = typeof props.size === "number" ? `${props.size}px` : props.size;
    style.width = typeof props.size === "number" ? `${props.size}px` : props.size;
    style.height = typeof props.size === "number" ? `${props.size}px` : props.size;
  }

  // 设置颜色样式
  if (props.color) {
    style.color = props.color;
  }

  return style;
});

// 计算SVG图标路径
const svgIconPath = computed(() => {
  const iconTypeMap: Record<string, string> = {
    light: 'light',
    gray: 'gray',
    colorful: 'colorful',
    glass: 'glass',
    '3d': '3d',
  };
  
  const typeFolder = iconTypeMap[props.iconType] || 'light' ;
  return new URL(`./svg/${typeFolder}/${props.name}.svg`, import.meta.url).href;
});

// 过滤出需要传递给底层组件的属性
const restProps = computed(() => {
  // 复制attrs对象
  const rest = { ...attrs };

  // 删除已在props中定义的属性，避免重复传递
  delete rest.name;
  delete rest.size;
  delete rest.color;
  delete rest.prefix;
  delete rest.disabled;
  delete rest.spin;
  delete rest.iconType;

  return rest;
});

// 处理点击事件
const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit("click", e);
  }
};
</script>

<style scoped lang="less">
// @import "../variable.scss";
@import "./font/iconfont.less";

// 基础样式
.s-icon {
  // 确保图标作为内联元素可以设置宽高
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // 默认行高，避免影响布局
  line-height: 1;
  // 过渡效果
  transition: all 0.3s ease;
  // 允许用户选择文本
  user-select: none;
  // 禁用状态样式
  &.s-icon-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  // 旋转动画
  &.s-icon-spin {
    animation: spin 1s linear infinite;
  }
}

// 旋转动画定义
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
