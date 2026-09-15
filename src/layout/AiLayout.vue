<template>
  <div class="dm-layout">
    <Sidebar @create="emit('create')" @user-center="emit('userCenter')" @change-password="emit('changePassword')" @logout="emit('logout')" />


    <!-- 主内容区（由嵌套路由渲染子页面） -->
    <main class="dm-layout__main">
      <div class="dm-layout__inner">
        <router-view />
      </div>
    </main>

    <!-- AI 面板 -->
    <AiPanel v-if="!aiCollapsed" @collapse="aiCollapsed = true" @send="emit('aiSend', $event)" />

    <!-- 折叠后的展开入口 -->
    <button
      v-if="workCollapsed"
      class="dm-layout__edge dm-layout__edge--left"
      :data-tip="t('layout.work.title')"
      @click="workCollapsed = false"
    >
      <Icon name="panel-left" :size="14" />
    </button>
    <button
      v-if="aiCollapsed"
      class="dm-layout__edge dm-layout__edge--right"
      data-tip="Nova"
      @click="aiCollapsed = false"
    >
      <!-- <Icon name="panel-right" :size="14" /> -->
       Nova
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import WorkPanel from './WorkPanel.vue';
import AiPanel from './AiPanel.vue';
import { Icon } from './icons';
import { useLocale } from '../composables/useLocale';


const emit = defineEmits(['create', 'userCenter', 'changePassword', 'logout', 'aiSend']);

const { t } = useLocale();

const workCollapsed = ref(false);
const aiCollapsed = ref(false);
</script>
<style>
.w-full{
  width: 100%;
}
</style>

<style scoped>
.dm-layout {
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg-gradient);
}


.dm-layout__main {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* background: var(--bg-layout); */
  padding: var(--space) var(--space) var(--space) 0;
  overflow: hidden;
}

.dm-layout__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
  border: 1px solid var(--border-main);
  border-left: none;
  background: var(--bg-panel);
}



/* 折叠后的悬浮展开按钮 */
.dm-layout__edge {
  position: absolute;
  top: 8px;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: center;
  /* width: 28px; */
  height: 28px;
  border: 1px solid var(--border-main);
  border-radius: 8px;
  background: var(--bg-overlay);
  color: var(--text-secondary);
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: color 0.15s;
  padding: 0 var(--space)
}
.dm-layout__edge:hover { color: var(--brand); }
.dm-layout__edge--left { left: 56px; }
.dm-layout__edge--right { right: 8px; }

.dm-layout__edge::after {
  content: attr(data-tip);
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: 5px 8px;
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;
  color: var(--bg-panel);
  background: var(--text-primary);
  border-radius: 4px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s 0.3s;
}
.dm-layout__edge:hover::after { opacity: 1; }
</style>
