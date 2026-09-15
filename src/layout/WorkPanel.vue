<template>
  <aside class="dm-work">
    <div class="dm-work__header">
      <span class="dm-work__title">{{ t('layout.work.title') }}</span>
    </div>

    <div class="dm-work__actions">
      <button class="dm-work__new" @click="emit('create')">
        <Icon name="plus" :size="13" />
        <span>{{ t('layout.work.create') }}</span>
      </button>
      <button class="dm-icon-btn" :data-tip="t('layout.work.organize')" @click="emit('collapse')">
        <Icon name="swap" :size="14" />
      </button>
    </div>

    <div class="dm-work__tree">
      <template v-for="node in tree" :key="node.name">
        <!-- 文件夹 -->
        <button
          v-if="node.type === 'folder'"
          class="dm-work__row dm-work__folder"
          @click="node.open = !node.open"
        >
          <span :class="['dm-work__chevron', { 'is-open': node.open }]">
            <Icon name="chevron-right" :size="12" />
          </span>
          <Icon name="folder" :size="14" />
          <span class="dm-work__name">{{ node.name }}</span>
        </button>

        <!-- 子文件 -->
        <template v-if="node.type === 'folder' && node.open">
          <button
            v-for="child in node.children"
            :key="child.name"
            :class="['dm-work__row', 'dm-work__file', { 'is-active': activeFile === child.name }]"
            @click="activeFile = child.name"
          >
            <span class="dm-work__indent" />
            <Icon :name="child.icon" :size="14" :class="['dm-work__file-icon', `is-${child.icon}`]" />
            <span class="dm-work__name">{{ child.name }}</span>
          </button>
        </template>
      </template>
    </div>
  </aside>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { Icon } from './icons';
import { useLocale } from '../composables/useLocale';

const emit = defineEmits(['create', 'collapse']);

const { t } = useLocale();

const activeFile = ref('Create table');

const tree = reactive([
  {
    type: 'folder',
    name: '9月23日资产',
    open: true,
    children: [
      { type: 'file', name: 'Create table', icon: 'table' },
      { type: 'file', name: '通用需求记录', icon: 'file-text' },
      { type: 'file', name: '实时开发任务-数据排查', icon: 'zap' },
    ],
  },
]);
</script>

<style scoped>
.dm-work {
  display: flex;
  flex-direction: column;
  width: 240px;
  flex-shrink: 0;
  height: 100%;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-lighter);
  transition: background-color 0.2s ease;
}

.dm-work__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 8px;
}

.dm-work__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.dm-work__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px 10px;
}

.dm-work__new {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  flex: 1;
  height: 30px;
  font-size: 13px;
  color: var(--brand);
  background: color-mix(in srgb, var(--brand) 10%, transparent);
  border: 0;
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.dm-work__new:hover {
  background: color-mix(in srgb, var(--brand) 16%, transparent);
}

.dm-work__tree {
  flex: 1;
  padding: 4px 8px;
  overflow-y: auto;
}

.dm-work__row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.dm-work__row:hover { background: var(--bg-hover); }

.dm-work__chevron {
  display: inline-flex;
  color: var(--text-tertiary);
  transition: transform 0.15s;
}
.dm-work__chevron.is-open { transform: rotate(90deg); }

.dm-work__indent { width: 12px; flex-shrink: 0; }

.dm-work__name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dm-work__file-icon { color: var(--text-tertiary); }
.dm-work__file-icon.is-table { color: var(--brand); }
.dm-work__file-icon.is-zap { color: var(--warning); }

.dm-work__file.is-active {
  color: var(--brand);
  background: color-mix(in srgb, var(--brand) 8%, transparent);
}
.dm-work__file.is-active .dm-work__file-icon { color: var(--brand); }

/* tooltip */
.dm-icon-btn {
  position: relative;
}
.dm-icon-btn::after {
  content: attr(data-tip);
  position: absolute;
  left: 50%;
  top: calc(100% + 6px);
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
  z-index: 20;
}
.dm-icon-btn:hover::after { opacity: 1; }
</style>
