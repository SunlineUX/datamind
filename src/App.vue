<template>
  <router-view />
</template>

<script setup>
import { useTheme } from './composables/useTheme';
import { useLocale } from './composables/useLocale';

// 应用启动时初始化主题（light/dark/system）与语言（zh-CN/en-US）
useTheme();
useLocale();
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
