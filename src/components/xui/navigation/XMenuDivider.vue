<template>
  <li class="x-menu-divider" role="separator"></li>
</template>

<script setup lang="ts">
</script>

<style scoped lang="less">
.x-menu-divider {
  height: 1px;
  margin: 4px 0;
  overflow: hidden;
  line-height: 0;
  background-color: #f0f0f0;
  list-style: none;
}

.x-menu-dark .x-menu-divider {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>
