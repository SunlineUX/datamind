<template>
  <div class="codespace">
    <!-- 左侧目录区：新建菜单 + 搜索 + 平铺树（不分组） -->
    <aside v-show="dirVisible" class="codespace__directory">
      <!-- 头部：新建 + 工具按钮 -->
      <div class="codespace__head">
        <DmPopover trigger="click" placement="bottomLeft">
          <template #default>
            <DmButton type="secondary" size="small">
              <DmIcon name="CircleAdd" :size="14" />
              <span>{{ t('layout.work.create') }}</span>
            </DmButton>
          </template>
          <template #content>
            <div class="codespace__menu">
              <div class="codespace__menu-item" @click="createFolder('scene')">
                <DmIcon name="FolderPerson" :size="15" />
                <span>{{ t('develop.groups.scene') }}</span>
              </div>
              <div class="codespace__menu-item" @click="createFolder('folder')">
                <DmIcon name="Folder" :size="15" />
                <span>{{ t('develop.menuFolder') }}</span>
              </div>
              <div class="codespace__menu-divider" />
              <div class="codespace__menu-label">{{ t('develop.groups.batch') }}</div>
              <div
                v-for="type in BATCH_TYPES"
                :key="type"
                class="codespace__menu-item"
                @click="createNode(type)"
              >
                <span v-if="type === 'batch-modeling'" class="codespace__sql">SQL</span>
                <DmIcon v-else :name="typeMeta[type].menuIcon" :size="14" />
                <span>{{ t(`develop.menu.${type}`) }}</span>
              </div>
              <div class="codespace__menu-divider" />
              <div class="codespace__menu-label">{{ t('develop.groups.realtime') }}</div>
              <div
                v-for="type in REALTIME_TYPES"
                :key="type"
                class="codespace__menu-item"
                @click="createNode(type)"
              >
                <DmIcon :name="typeMeta[type].menuIcon" :size="14" />
                <span>{{ t(`develop.menu.${type}`) }}</span>
              </div>
            </div>
          </template>
        </DmPopover>
        <span class="codespace__head-spacer" />
        <button class="codespace__tool" :title="t('develop.searchPlaceholder')" @click="focusSearch">
          <DmIcon name="Search" :size="15" />
        </button>
        <button class="codespace__tool" :title="t('develop.refresh')" @click="resetTree">
          <DmIcon name="Refresh" :size="15" />
        </button>
        <button
          :class="['codespace__tool', { 'is-on': sortMode }]"
          :title="t('develop.sort')"
          @click="sortMode = !sortMode"
        >
          <DmIcon name="Category" :size="15" />
        </button>
        <button class="codespace__tool codespace__tool--separated" :title="t('develop.toggleDirectory')" @click="dirVisible = false">
          <DmIcon name="LayoutLeft" :size="15" />
        </button>
      </div>

      <!-- 搜索框 -->
      <div class="">
        <DmInput size="small" ref="searchRef" v-model="keyword" :placeholder="t('develop.searchPlaceholder')" type="search" />
      </div>

      <!-- 平铺树 -->
      <div class="codespace__tree">
        <template v-for="node in visibleTree" :key="node.key">
          <!-- 文件夹 -->
          <div v-if="node.kind === 'folder'" class="codespace__row codespace__row--folder" @click="onRowClick(node, $event)">
            <DmIcon
              name="ArrowDown"
              :size="13"
              :class="['codespace__chevron', { 'is-collapsed': !isExpanded(node) }]"
            />
            <DmIcon :name="node.scene ? 'FolderPerson' : 'Folder'" :size="14" class="codespace__file-icon" />
            <input
              v-if="renamingKey === node.key"
              v-focus
              v-model="renameValue"
              class="codespace__rename"
              @click.stop
              @keyup.enter="confirmRename(node)"
              @keyup.esc="cancelRename"
              @blur="confirmRename(node)"
            />
            <span v-else class="codespace__name">{{ node.name }}</span>
            <!-- <MoreMenu @rename="startRename(node)" @remove="removeNode(node)" /> -->
          </div>
          <!-- 文件夹内文件 -->
          <template v-if="node.kind === 'folder' && isExpanded(node)">
            <div
              v-for="child in visibleChildren(node)"
              :key="child.key"
              :class="['codespace__row', 'codespace__row--file', { 'is-active': activeTabKey === child.key }]"
              @click="onFileClick(child, $event)"
            >
              <span v-if="child.type === 'batch-modeling'" class="codespace__sql">SQL</span>
              <DmIcon v-else :name="typeMeta[child.type].icon" :size="14" class="codespace__file-icon" />
              <input
                v-if="renamingKey === child.key"
                v-focus
                v-model="renameValue"
                class="codespace__rename"
                @click.stop
                @keyup.enter="confirmRename(child)"
                @keyup.esc="cancelRename"
                @blur="confirmRename(child)"
              />
              <span v-else class="codespace__name">{{ child.name }}</span>
              <!-- <MoreMenu @rename="startRename(child)" @remove="removeNode(child)" /> -->
            </div>
            <div v-if="!visibleChildren(node).length" class="codespace__row codespace__row--empty">
              {{ t('develop.noData') }}
            </div>
          </template>
          <!-- 根级文件 -->
          <div
            v-else-if="node.kind !== 'folder'"
            :class="['codespace__row', 'codespace__row--file', { 'is-active': activeTabKey === node.key }]"
            @click="onFileClick(node, $event)"
          >
            <DmIcon :name="node.icon" :size="14" class="codespace__file-icon" />
            <input
              v-if="renamingKey === node.key"
              v-focus
              v-model="renameValue"
              class="codespace__rename"
              @click.stop
              @keyup.enter="confirmRename(node)"
              @keyup.esc="cancelRename"
              @blur="confirmRename(node)"
            />
            <span v-else class="codespace__name">{{ node.name }}</span>
            <!-- <MoreMenu @rename="startRename(node)" @remove="removeNode(node)" /> -->
          </div>
        </template>
        <div v-if="!visibleTree.length" class="codespace__row codespace__row--empty">
          {{ t('develop.noData') }}
        </div>
      </div>
    </aside>

    <!-- 右侧：标签栏 + 内容区 -->
    <div class="codespace__main">
      <div class="codespace__tabs">
        <button class="codespace__dir-toggle" :title="t('develop.toggleDirectory')" @click="dirVisible = !dirVisible">
          <DmIcon name="LayoutLeft" :size="15" />
        </button>
        <div
          v-for="tab in tabs"
          :key="tab.key"
          :class="['codespace__tab', { 'is-active': activeTabKey === tab.key }]"
          @click="activeTabKey = tab.key"
        >
          <span v-if="tab.type === 'batch-modeling'" class="codespace__sql">SQL</span>
          <DmIcon v-else :name="typeMeta[tab.type].icon" :size="13" class="codespace__tab-icon" />
          <span class="codespace__tab-name">{{ tab.name }}</span>
          <span class="codespace__tab-close" @click.stop="closeTab(tab.key)">
            <DmIcon name="Close" :size="12" />
          </span>
        </div>
      </div>

      <div class="codespace__content">
        <!-- SQL 文件：IDE 编辑器 -->
        <SqlEditor
          v-if="activeNode && typeMeta[activeNode.type].kind === 'sql'"
          :key="activeNode.key"
          v-model="activeNode.content"
          v-model:logs="activeNode.logs"
        />
        <!-- JSON 配置：schema 动态表单 -->
        <JsonForm
          v-else-if="activeNode && typeMeta[activeNode.type].kind === 'form'"
          :key="activeNode.key"
          :schema="FORM_SCHEMAS[activeNode.type]"
          :form-data="activeNode.formData"
        />
        <!-- 空态 -->
        <div v-else class="codespace__empty">
          <DmIcon name="FileText" :size="28" />
          <div class="codespace__empty-title">{{ t('develop.emptyTitle') }}</div>
          <div class="codespace__empty-hint">{{ t('develop.emptyHint') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h, ref } from 'vue';
import { DmPopover, DmButton, DmInput, DmIcon } from '@/components/dm';
import { useLocale } from '@/composables/useLocale';
import { FORM_SCHEMAS, SQL_TEMPLATES, defaultFormData } from './develop/schemas';
import SqlEditor from './develop/SqlEditor.vue';
import JsonForm from './develop/JsonForm.vue';

const { t } = useLocale();

/** 重命名输入框自动聚焦 */
const vFocus = { mounted: (el) => el.focus() };

/* ---------- 节点类型 ---------- */
const typeMeta = {
  'batch-modeling': { icon: 'Table', menuIcon: 'Table', kind: 'sql' },
  'batch-script': { icon: 'Code', kind: 'sql' },
  'batch-schedule': { icon: 'Dataflow01', kind: 'form' },
  'batch-exchange': { icon: 'Swap', kind: 'form' },
  'realtime-compute': { icon: 'Sparkle', kind: 'sql' },
  'realtime-collect': { icon: 'Database01', kind: 'sql' },
};
const BATCH_TYPES = ['batch-modeling', 'batch-script', 'batch-schedule', 'batch-exchange'];
const REALTIME_TYPES = ['realtime-compute', 'realtime-collect'];

/* ---------- 目录数据（平铺树：文件夹 + 文件） ---------- */
let seq = 1;
const nextKey = () => `n-${seq++}`;

function makeNode(type, name) {
  const node = { key: nextKey(), type, name };
  if (typeMeta[type].kind === 'sql') node.content = SQL_TEMPLATES[type];
  if (typeMeta[type].kind === 'form') {
    node.formData = defaultFormData(FORM_SCHEMAS[type]);
    node.formData.taskName = name;
  }
  return node;
}

function makeFolder(name, scene = false) {
  return { key: nextKey(), kind: 'folder', name, scene, children: [] };
}

function buildInitialTree() {
  const f1 = makeFolder('9月23资产', true);
  f1.children.push(makeNode('batch-modeling', '建模文件'));
  f1.children.push(makeNode('batch-script', '脚本文件'));
  const newNode = makeNode('batch-script', 'New');
  newNode.content = '';
  f1.children.push(newNode);
  return [
    f1,
    makeFolder('11月18资产'),
    makeFolder('12月01资产'),
    { key: nextKey(), kind: 'static', icon: 'Code', name: '报表预览.html' },
    { key: nextKey(), kind: 'static', icon: 'Table', name: 'ai_create.xlsl' },
  ];
}

const tree = ref(buildInitialTree());
const expanded = ref(new Set([tree.value[0].key]));

/* ---------- 展开 / 搜索 / 排序 ---------- */
const keyword = ref('');
const sortMode = ref(false);
const searchRef = ref(null);

function isExpanded(node) {
  return expanded.value.has(node.key) || !!keyword.value.trim();
}

function matchNode(node, kw) {
  if (node.name.toLowerCase().includes(kw)) return true;
  return node.kind === 'folder' && node.children.some((c) => matchNode(c, kw));
}

function visibleChildren(folder) {
  const kw = keyword.value.trim().toLowerCase();
  return kw ? folder.children.filter((c) => matchNode(c, kw)) : folder.children;
}

const visibleTree = computed(() => {
  const kw = keyword.value.trim().toLowerCase();
  let list = tree.value;
  if (sortMode.value) {
    list = [...list].sort((a, b) =>
      a.kind === b.kind ? a.name.localeCompare(b.name, 'zh-CN') : a.kind === 'folder' ? -1 : 1,
    );
  }
  return kw ? list.filter((n) => matchNode(n, kw)) : list;
});

function toggle(key) {
  const set = new Set(expanded.value);
  set.has(key) ? set.delete(key) : set.add(key);
  expanded.value = set;
}

// 点在悬浮操作（⋯ 菜单）上时不触发展开/收起
function onRowClick(node, e) {
  if (e.target.closest('.codespace__op')) return;
  toggle(node.key);
}

// 文件行：⋯ 按钮点击不触发打开文件；静态文件不可打开
function onFileClick(node, e) {
  if (e.target.closest('.codespace__op')) return;
  if (node.kind === 'static') return;
  openFile(node);
}

function focusSearch() {
  searchRef.value?.focus();
}

/** 刷新：恢复初始演示数据 */
function resetTree() {
  tree.value = buildInitialTree();
  expanded.value = new Set([tree.value[0].key]);
  keyword.value = '';
  tabs.value = [];
  activeTabKey.value = null;
  const first = tree.value[0];
  openFile(first.children[first.children.length - 1]);
}

/* ---------- 重命名 / 删除（⋯ 更多操作） ---------- */
const renamingKey = ref(null);
const renameValue = ref('');

function closeMoreMenu() {
  // 派发 mousedown 触发弹层的点击外部收起逻辑
  document.dispatchEvent(new MouseEvent('mousedown'));
}

function startRename(node) {
  closeMoreMenu();
  renamingKey.value = node.key;
  renameValue.value = node.name;
}

function confirmRename(node) {
  if (renamingKey.value !== node.key) return;
  const name = renameValue.value.trim();
  if (name && name !== node.name) {
    node.name = name;
    const tab = tabs.value.find((tb) => tb.key === node.key);
    if (tab) tab.name = name;
  }
  renamingKey.value = null;
}

function cancelRename() {
  renamingKey.value = null;
}

function removeNode(node) {
  closeMoreMenu();
  if (node.kind === 'folder') {
    const collect = (nodes) =>
      nodes.forEach((n) => {
        if (n.kind === 'folder') collect(n.children);
        else closeTab(n.key);
      });
    collect(node.children);
  } else {
    closeTab(node.key);
  }
  // 递归查找删除（节点可能位于文件夹内，不能只查根层数组）
  const removeFrom = (nodes) => {
    const index = nodes.indexOf(node);
    if (index > -1) {
      nodes.splice(index, 1);
      return true;
    }
    return nodes.some((n) => n.kind === 'folder' && removeFrom(n.children));
  };
  removeFrom(tree.value);
}

/* ---------- 新建（分组菜单） ---------- */
function countFolder(kind) {
  return tree.value.filter((n) => n.kind === 'folder' && (kind === 'scene') === !!n.scene).length;
}

function createFolder(kind) {
  closeMoreMenu();
  const prefix = kind === 'scene' ? t('develop.defaultScenarioName') : t('develop.defaultFolderName');
  const folder = makeFolder(`${prefix}-${countFolder(kind) + 1}`, kind === 'scene');
  tree.value.push(folder);
  expanded.value = new Set([...expanded.value, folder.key]);
}

function typeCount(type) {
  let count = 0;
  const walk = (nodes) =>
    nodes.forEach((n) => {
      if (n.type === type) count++;
      if (n.kind === 'folder') walk(n.children);
    });
  walk(tree.value);
  return count;
}

function createNode(type) {
  closeMoreMenu();
  const name = `${t(`develop.names.${type}`)}-${typeCount(type) + 1}`;
  const node = makeNode(type, name);
  tree.value.push(node);
  openFile(node);
}

/* ---------- 标签页 ---------- */
const tabs = ref([]);
const activeTabKey = ref(null);
const dirVisible = ref(true);

// 初始打开「New」标签，与参考布局一致
const initFolder = tree.value[0];
tabs.value.push({
  key: initFolder.children[initFolder.children.length - 1].key,
  name: 'New',
  type: 'batch-script',
});
activeTabKey.value = tabs.value[0].key;

const activeNode = computed(() => {
  const found = [];
  const walk = (nodes) =>
    nodes.forEach((n) => {
      if (n.kind === 'folder') walk(n.children);
      else if (n.key === activeTabKey.value) found.push(n);
    });
  walk(tree.value);
  return found[0] || null;
});

function openFile(node) {
  if (node.kind === 'static') return;
  if (!tabs.value.some((tab) => tab.key === node.key)) {
    tabs.value.push({ key: node.key, name: node.name, type: node.type });
  }
  activeTabKey.value = node.key;
}

function closeTab(key) {
  const index = tabs.value.findIndex((tab) => tab.key === key);
  if (index === -1) return;
  tabs.value.splice(index, 1);
  if (activeTabKey.value === key) {
    const next = tabs.value[index] || tabs.value[index - 1];
    activeTabKey.value = next ? next.key : null;
  }
}

/** 行尾「⋯ 更多操作」菜单（重命名 / 删除） */
function MoreMenu(_props, { emit }) {
  return h(DmPopover, { trigger: 'click', placement: 'bottomRight' }, {
    default: () =>
      h('button', { class: 'codespace__op', title: t('develop.more') }, [
        h(DmIcon, { name: 'More', size: 14 }),
      ]),
    content: () =>
      h('div', { class: 'codespace__menu' }, [
        h('div', { class: 'codespace__menu-item', onClick: () => emit('rename') }, [
          h(DmIcon, { name: 'Edit', size: 14 }),
          h('span', t('develop.rename')),
        ]),
        h('div', { class: 'codespace__menu-item', onClick: () => emit('remove') }, [
          h(DmIcon, { name: 'Delete', size: 14 }),
          h('span', t('develop.delete')),
        ]),
      ]),
  });
}
</script>

<style scoped>
.codespace {
  display: flex;
  height: 100%;
  min-height: 0;
  width: 100%;
}

/* ---------- 左侧目录 ---------- */
.codespace__directory {
  display: flex;
  flex-direction: column;
  width: 264px;
  flex-shrink: 0;
  height: 100%;
  background: var(--bg-panel);
  border-right: 1px solid var(--border-lighter);
  padding: 10px 10px 0;
}

/* 头部工具栏 */
.codespace__head {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 10px;
  flex-shrink: 0;
}
.codespace__head-spacer { flex: 1; }
.codespace__new-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-hover);
  border: 1px solid var(--border-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.codespace__new-btn:hover { background: var(--bg-panel); border-color: var(--border-light); }
.codespace__tool {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 0;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}
.codespace__tool:hover { color: var(--text-primary); background: var(--bg-hover); }
.codespace__tool.is-on { color: var(--brand); background: var(--brand-light); }
.codespace__tool--separated { margin-left: 4px; }

/* 搜索框 */
.codespace__search {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
  margin-bottom: 8px;
  flex-shrink: 0;
  color: var(--text-disabled);
  background: var(--bg-panel);
  border: 1px solid var(--border-lighter);
  border-radius: 6px;
  transition: border-color 0.15s;
}
.codespace__search:focus-within { border-color: var(--brand); }
.codespace__search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13px;
  color: var(--text-primary);
}
.codespace__search input::placeholder { color: var(--text-disabled); }

/* 树 */
.codespace__tree {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-bottom: 10px;
  margin-top: var(--space-sm);
}

.codespace__row {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  user-select: none;
}
.codespace__row--folder {
  color: var(--text-primary);
  font-weight: 500;
}
.codespace__row--file {
  padding-left: 28px;
  color: var(--text-secondary);
}
.codespace__row:hover { background: var(--bg-hover); }
.codespace__row.is-active {
  color: var(--brand);
  background: var(--brand-light);
}

.codespace__chevron {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: transform 0.15s;
}
.codespace__chevron.is-collapsed { transform: rotate(-90deg); }
.codespace__file-icon { flex-shrink: 0; color: var(--text-tertiary); }
.codespace__row.is-active .codespace__file-icon { color: var(--brand); }

.codespace__name {
  flex: 1;
  min-width: 0;
  font-size: 13px;
  font-weight: inherit;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 重命名输入框 */
.codespace__rename {
  flex: 1;
  min-width: 0;
  height: 22px;
  padding: 0 6px;
  font-size: 13px;
  color: var(--text-primary);
  background: var(--bg-panel);
  border: 1px solid var(--brand);
  border-radius: 4px;
  outline: 0;
}

/* SQL 徽标（建模文件） */
.codespace__sql {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 14px;
  padding: 0 3px;
  flex-shrink: 0;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.5px;
  color: var(--brand);
  border: 1px solid currentColor;
  border-radius: 3px;
  box-sizing: border-box;
}

/* 空态 */
.codespace__row--empty {
  padding-left: 28px;
  font-size: 12px;
  color: var(--text-disabled);
  cursor: default;
}

/* 行尾悬浮操作（⋯ / 重命名输入时隐藏其余按钮） */
.codespace__op {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
  opacity: 0;
}
.codespace__row:hover .codespace__op { opacity: 1; }
.codespace__op:hover { color: var(--brand); background: var(--bg-panel); }

/* 新建 / 更多操作菜单（DmPopover content） */
.codespace__menu {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 148px;
}
.codespace__menu-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  font-size: 13px;
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.codespace__menu-item:hover { background: var(--bg-hover); color: var(--brand); }
.codespace__menu-item .codespace__sql { min-width: 30px; }
.codespace__menu-divider {
  height: 1px;
  margin: 5px 0;
  background: var(--border-lighter);
}
.codespace__menu-label {
  padding: 5px 10px 3px;
  font-size: 12px;
  color: var(--text-disabled);
  cursor: default;
}
.codespace__menu-label:hover { background: transparent; color: var(--text-disabled); }

/* ---------- 右侧主区 ---------- */
.codespace__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 标签栏 */
.codespace__tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 40px;
  padding: 0 8px 0 4px;
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
  overflow-x: auto;
}
.codespace__dir-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border: 0;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s;
}
.codespace__dir-toggle:hover { color: var(--text-primary); background: var(--bg-hover); }

.codespace__tab {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 10px;
  font-size: 13px;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, color 0.15s;
}
.codespace__tab:hover { background: var(--bg-hover); }
.codespace__tab.is-active {
  color: var(--text-primary);
  background: var(--bg-hover);
}
.codespace__tab-icon { color: var(--text-tertiary); }
.codespace__tab.is-active .codespace__tab-icon { color: var(--brand); }
.codespace__tab-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.codespace__tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: var(--text-disabled);
  transition: all 0.15s;
}
.codespace__tab-close:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
}

/* 内容区 */
.codespace__content {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

/* 编辑区空态占位 */
.codespace__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: var(--text-disabled);
}
.codespace__empty-title {
  font-size: 15px;
  color: var(--text-secondary);
}
.codespace__empty-hint {
  font-size: 12px;
  color: var(--text-disabled);
}
</style>
