<template>
  <div class="Home">
    Home
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DmButton } from '@/components/dm';
import { Icon } from '@/layout/icons';
import { useLocale } from '@/composables/useLocale';

const emit = defineEmits(['create']);

const { t } = useLocale();

const activeIndex = ref(0);
const tabs = ref([
  { name: 'Create table', icon: 'table' },
  { nameKey: 'workspace.tab', icon: 'file-text' },
]);

</script>

<style scoped>
.Home {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
}

</style>
