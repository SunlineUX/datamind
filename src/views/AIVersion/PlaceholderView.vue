<template>
  <div class="placeholder">
    <Icon name="file-text" :size="28" />
    <div class="placeholder__title">{{ t(titleKey) }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from '../../layout/icons';
import { useLocale } from '../../composables/useLocale';

/** 通用占位页：显示路由 meta.titleKey 对应的标题 */
const route = useRoute();
const { t } = useLocale();

const titleKey = computed(() => route.meta.titleKey || 'app.title');
</script>

<style scoped>
.placeholder {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-tertiary);
  background: var(--bg-panel);
}

.placeholder__title {
  font-size: 15px;
  color: var(--text-secondary);
}
</style>
