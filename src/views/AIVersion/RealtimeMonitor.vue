<template>
  <div class="dm-monitor">
    <!-- ① 顶部统计卡片区 -->
    <section class="dm-monitor__stats">
      <div
        v-for="card in statsCards"
        :key="card.key"
        class="dm-monitor__stat"
        :class="[card.key, { 'is-total': card.key === 'total' }]"
        @click="activeStatus = card.key === 'total' ? '' : card.key"
      >
        <div class="dm-monitor__stat-left">
          <div class="dm-monitor__stat-count">{{ card.count }}</div>
          <div class="dm-monitor__stat-label">{{ t(`monitor.${card.key}`) }}</div>
          <div v-if="card.key === 'total'" class="dm-monitor__stat-sub">
            <span>{{ t('monitor.batch') }}: 1</span>
            <span>{{ t('monitor.stream') }}: 45</span>
          </div>
        </div>
        <div class="dm-monitor__stat-icon">
          <DmIcon :name="card.icon" :size="22" />
        </div>
      </div>
    </section>

    <!-- ② 下方主区域：左树 + 右表 -->
    <section class="dm-monitor__main">
      <!-- 左侧：任务分组树 -->
      <aside class="dm-monitor__tree">
        <div class="dm-monitor__tree-search">
          <DmIcon name="Search" :size="14" class="dm-monitor__tree-search-icon" />
          <input
            v-model="treeKeyword"
            :placeholder="t('monitor.treeSearch')"
            class="dm-monitor__tree-search-input"
          />
          <button class="dm-monitor__tree-action" :title="t('monitor.treeExpandAll')" @click="expandAllTree">
            <DmIcon name="LayoutLeft" :size="14" />
          </button>
          <button class="dm-monitor__tree-action" :title="t('monitor.treeCollapseAll')" @click="collapseAllTree">
            <DmIcon name="LayoutRight" :size="14" />
          </button>
        </div>
        <ul class="dm-monitor__tree-list">
          <li
            v-for="node in filteredTree"
            :key="node.key"
            class="dm-monitor__tree-node"
            :class="{ 'is-open': treeOpenSet.has(node.key) }"
          >
            <div class="dm-monitor__tree-row" @click="toggleNode(node.key)">
              <DmIcon
                :name="treeOpenSet.has(node.key) ? 'ArrowDown' : 'ArrowRight'"
                :size="14"
                class="dm-monitor__tree-chevron"
              />
              <DmIcon :name="node.icon" :size="14" class="dm-monitor__tree-icon" />
              <span class="dm-monitor__tree-label">{{ node.label }}</span>
            </div>
            <ul v-if="node.children" class="dm-monitor__tree-children">
              <li
                v-for="child in node.children"
                :key="child.key"
                class="dm-monitor__tree-node is-leaf"
                :class="{ 'is-active': activeGroup === child.key }"
              >
                <div class="dm-monitor__tree-row" @click="activeGroup = child.key">
                  <span class="dm-monitor__tree-chevron dm-monitor__tree-chevron--placeholder" />
                  <DmIcon name="Folder" :size="14" class="dm-monitor__tree-icon" />
                  <span class="dm-monitor__tree-label">{{ child.label }}</span>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </aside>

      <!-- 右侧：筛选 + 表格 + 分页 -->
      <div class="dm-monitor__right">
        <!-- 搜索 + 筛选 + 刷新 -->
        <div class="dm-monitor__toolbar">
          <div class="dm-monitor__toolbar-search">
            <input
              v-model="tableKeyword"
              :placeholder="t('monitor.tableSearch')"
              class="dm-monitor__toolbar-input"
            />
            <button class="dm-monitor__toolbar-search-btn">
              <DmIcon name="Search" :size="14" />
            </button>
          </div>
          <div class="dm-monitor__filter">
            <button
              v-for="tab in filterTabs"
              :key="tab.key"
              class="dm-monitor__filter-btn"
              :class="{ 'is-active': activeFilter === tab.key }"
              @click="activeFilter = tab.key"
            >{{ t(`monitor.filter${tab.label}`) }}</button>
          </div>
          <button class="dm-monitor__refresh-btn" @click="refreshTable">
            <DmIcon name="Swap" :size="14" />
          </button>
        </div>

        <!-- 表格 -->
        <div class="dm-monitor__table-wrap">
          <table class="dm-monitor__table">
            <thead>
              <tr>
                <th>{{ t('monitor.colTaskName') }}</th>
                <th>{{ t('monitor.colRunMode') }}</th>
                <th>{{ t('monitor.colFlinkJobId') }}</th>
                <th>{{ t('monitor.colOwner') }}</th>
                <th>{{ t('monitor.colMaintainer') }}</th>
                <th>{{ t('monitor.colCreatedAt') }}</th>
                <th class="col-action">{{ t('monitor.colAction') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pagedRows" :key="row.id">
                <td class="col-task">
                  <div class="dm-monitor__task-name">{{ row.name }}</div>
                  <span
                    class="dm-monitor__status-tag"
                    :class="row.status === 'developing' ? 'status-developing' : 'status-published'"
                  >{{ t(`monitor.status${row.status === 'developing' ? 'Developing' : 'Published'}`) }}</span>
                </td>
                <td class="col-mode">
                  <DmIcon name="Clock" :size="12" class="dm-monitor__mode-history" />
                  <span class="dm-monitor__mode-label">{{ t('monitor.modeHistory') }}</span>
                  <span class="dm-monitor__mode-type">{{ row.mode }}</span>
                </td>
                <td class="col-jobid">
                  <div class="dm-monitor__jobid">{{ row.flinkJobId }}</div>
                  <DmIcon name="Copy" :size="12" class="dm-monitor__copy-btn" @click="copyJobId(row.flinkJobId)" />
                </td>
                <td>{{ row.owner }}</td>
                <td>{{ row.maintainer }}</td>
                <td class="col-date">{{ row.createdAt }}</td>
                <td class="col-action">
                  <button class="dm-monitor__view-btn" :title="t('monitor.view')">
                    <DmIcon name="CouponCheck" :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 底部分页 -->
        <div class="dm-monitor__pagination">
          <button
            class="dm-monitor__page-btn"
            :disabled="page === 1"
            @click="page--"
          >
            <DmIcon name="ArrowLeft" :size="14" />
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="dm-monitor__page-btn"
            :class="{ 'is-active': p === page }"
            @click="page = p"
          >{{ p }}</button>
          <button
            class="dm-monitor__page-btn"
            :disabled="page === totalPages"
            @click="page++"
          >
            <DmIcon name="ArrowRight" :size="14" />
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';
import { DmIcon } from '@/components/dm';
import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();

/* ============== Mock 数据 ============== */

const statsCards = [
  { key: 'total',     count: 84, icon: 'Sparkle' },
  { key: 'running',   count: 0,  icon: 'ArrowRight' },
  { key: 'canceled',  count: 21, icon: 'Close' },
  { key: 'failed',    count: 8,  icon: 'Remind' },
  { key: 'restarting',count: 0,  icon: 'Refresh' },
  { key: 'completed', count: 1,  icon: 'CouponCheck' },
  { key: 'unknown',   count: 16, icon: 'Compass' },
];

const treeData = [
  {
    key: 'group-a', icon: 'Folder', label: '数据采集',
    children: [
      { key: 'rt-mysql-pg',  icon: 'Folder', label: '实时数据采集 Mysql->PG' },
      { key: 'rt-mq-sync',   icon: 'Folder', label: '实时采集+计算' },
      { key: 'test-of-sync', icon: 'Folder', label: 'test_of_sync' },
    ],
  },
  {
    key: 'group-b', icon: 'Folder', label: '数据建模',
    children: [
      { key: '360-profiling', icon: 'Folder', label: '360-degree User Profiling Scenarios' },
      { key: 'vip-tagging',   icon: 'Folder', label: 'Rules for tagging VIP customers' },
    ],
  },
  {
    key: 'group-c', icon: 'Folder', label: '金融风控',
    children: [
      { key: 'hot-ac',             icon: 'Folder', label: 'HOT-AC' },
      { key: 'abnormal-detection', icon: 'Folder', label: 'Abnormal Detection' },
      { key: 'product-bundling',   icon: 'Folder', label: 'Product Bundling' },
      { key: 'maybank-poc',        icon: 'Folder', label: 'MayBank-POC' },
      { key: 'screen',             icon: 'Folder', label: '大屏' },
      { key: 'test1',              icon: 'Folder', label: 'Test1' },
      { key: 'ca-scene',           icon: 'Folder', label: '国航场景' },
      { key: 'liaoshen-poc',       icon: 'Folder', label: 'LiaoShenBank-POC' },
      { key: 'mq',                 icon: 'Folder', label: 'mq' },
      { key: 'ai-scene',           icon: 'Folder', label: 'AI场景' },
      { key: 'hot-account-ai',     icon: 'Folder', label: 'hot-account-ai' },
      { key: 'dm-gova',            icon: 'Folder', label: 'dm_gova' },
    ],
  },
];

const tableData = [
  { id: 1,  name: 'data acquisition',               status: 'developing',  mode: 'local',       runStatus: 'running',   flinkJobId: '893310f9d8606aff2b2e708b2fb7b7', owner: '1', maintainer: '-', createdAt: '2025-06-12' },
  { id: 2,  name: 'aaa',                            status: 'developing',  mode: 'standalone',  runStatus: 'failed',    flinkJobId: '4c41e64bca2aafa7a997425f6e7bac1f', owner: '1', maintainer: '-', createdAt: '2026-01-05' },
  { id: 3,  name: 'abnormal-detection-process-pg-udtf',  status: 'developing', mode: 'standalone', runStatus: 'running', flinkJobId: '452092c2b7fd1fa6fcd1635f4347bb', owner: '1', maintainer: '-', createdAt: '2026-01-10' },
  { id: 4,  name: 'abnormal-detection-refresh-pg-udtf',  status: 'developing', mode: 'standalone', runStatus: 'completed', flinkJobId: '3475f35dcfe3a7361d2b998d18eb5d43', owner: '1', maintainer: '-', createdAt: '2026-02-18' },
  { id: 5,  name: 'abnormal-transaction-task01',    status: 'developing',  mode: 'standalone',  runStatus: 'canceled',  flinkJobId: '5a707d6645743b1028f34c087563c4d2', owner: '1', maintainer: '-', createdAt: '2026-03-02' },
  { id: 6,  name: 'abnormal-transaction-task02',    status: 'developing',  mode: 'standalone',  runStatus: 'unknown',  flinkJobId: '6352f630c31ca6bcf3f34b6082370dfe', owner: '1', maintainer: '-', createdAt: '2026-03-08' },
  { id: 7,  name: 'abnormal-transaction-task03',    status: 'developing',  mode: 'standalone',  runStatus: 'canceled',  flinkJobId: '7e884521371deb22bfddf6d1802c37f', owner: '1', maintainer: '-', createdAt: '2026-03-15' },
  { id: 8,  name: 'abnormal-transaction-task04',    status: 'published',   mode: 'standalone',  runStatus: 'failed',    flinkJobId: '23f9a874d85f4b88a2514c4e8f2a9b10', owner: '2', maintainer: '-', createdAt: '2026-03-20' },
  { id: 9,  name: 'abnormal-transaction-task05',    status: 'developing',  mode: 'local',       runStatus: 'running',   flinkJobId: 'b7c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f', owner: '1', maintainer: '-', createdAt: '2026-04-01' },
  { id: 10, name: 'hot-account-detection',          status: 'published',   mode: 'standalone',  runStatus: 'restarting', flinkJobId: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', owner: '3', maintainer: '-', createdAt: '2026-04-10' },
  { id: 11, name: 'mq-consumer-batch',              status: 'developing',  mode: 'standalone',  runStatus: 'canceled',  flinkJobId: 'f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b', owner: '1', maintainer: '-', createdAt: '2026-04-18' },
  { id: 12, name: 'screen-dashboard-realtime',      status: 'developing',  mode: 'local',       runStatus: 'unknown',   flinkJobId: '1234567890abcdef1234567890abcdef', owner: '4', maintainer: '-', createdAt: '2026-05-02' },
];

/* ============== 状态 ============== */

const treeKeyword = ref('');
const tableKeyword = ref('');
const activeFilter = ref('all');   // all | published | developing
const activeStatus = ref('');      // 点击统计卡筛选
const activeGroup = ref('rt-mysql-pg');
const page = ref(1);
const pageSize = 7;

// 默认展开全部一级分组
const treeOpenSet = reactive(new Set(treeData.map(n => n.key)));

const filterTabs = [
  { key: 'all',        label: 'All' },
  { key: 'published',  label: 'Published' },
  { key: 'developing', label: 'Developing' },
];

/* ============== 计算 ============== */

const filteredTree = computed(() => {
  if (!treeKeyword.value) return treeData;
  const kw = treeKeyword.value.toLowerCase();
  return treeData
    .map(group => ({
      ...group,
      children: (group.children || []).filter(c => c.label.toLowerCase().includes(kw)),
    }))
    .filter(group =>
      group.label.toLowerCase().includes(kw) ||
      (group.children && group.children.length > 0)
    );
});

const filteredRows = computed(() => {
  let rows = [...tableData];
  // 右侧筛选 tab
  if (activeFilter.value !== 'all') {
    rows = rows.filter(r => r.status === activeFilter.value);
  }
  // 统计卡点击 → 按运行状态筛选
  if (activeStatus.value && activeStatus.value !== 'total') {
    rows = rows.filter(r => r.runStatus === activeStatus.value);
  }
  // 左侧树节点选中 → 按分组关键词筛选（mock 映射：节点 key → 相关任务名片段）
  if (activeGroup.value) {
    rows = rows.filter(r => {
      // 简单映射：选中节点 label 做 name 包含匹配（mock 数据，够展示）
      const nodeKeyMap = {
        'rt-mysql-pg':  ['data acquisition'],
        'rt-mq-sync':   ['aaa', 'mq-consumer'],
        'test-of-sync': ['test'],
        '360-profiling':['screen'],
        'vip-tagging':  [],
        'hot-ac':       ['hot-account'],
        'abnormal-detection': ['abnormal-detection'],
        'product-bundling': [],
        'maybank-poc':  [],
        'screen':       ['screen'],
        'test1':        [],
        'ca-scene':     [],
        'liaoshen-poc': [],
        'mq':           ['mq'],
        'ai-scene':     [],
        'hot-account-ai': ['hot-account'],
        'dm-gova':      [],
      };
      const kws = nodeKeyMap[activeGroup.value];
      if (!kws) return true;
      return kws.some(kw => r.name.toLowerCase().includes(kw.toLowerCase()));
    });
  }
  if (tableKeyword.value) {
    const kw = tableKeyword.value.toLowerCase();
    rows = rows.filter(r => r.name.toLowerCase().includes(kw) || r.flinkJobId.toLowerCase().includes(kw));
  }
  // 页码重置
  if (page.value > Math.max(1, Math.ceil(rows.length / pageSize))) page.value = 1;
  return rows;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredRows.value.length / pageSize)));

const pagedRows = computed(() => {
  const start = (page.value - 1) * pageSize;
  return filteredRows.value.slice(start, start + pageSize);
});

/* ============== 方法 ============== */

function toggleNode(key) {
  if (treeOpenSet.has(key)) treeOpenSet.delete(key);
  else treeOpenSet.add(key);
}
function expandAllTree() { treeData.forEach(n => treeOpenSet.add(n.key)); }
function collapseAllTree() { treeData.forEach(n => treeOpenSet.delete(n.key)); }

function refreshTable() {
  tableKeyword.value = '';
  activeFilter.value = 'all';
  page.value = 1;
}

async function copyJobId(id) {
  try { await navigator.clipboard.writeText(id); } catch (_) { /* noop */ }
}
</script>

<style scoped>
.dm-monitor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  padding: var(--space);
  gap: var(--space);
}

/* ---------- ① 统计卡片区 ---------- */
.dm-monitor__stats {
  display: flex;
  gap: var(--space);
  flex-shrink: 0;
  overflow-x: auto;
}

.dm-monitor__stat {
  position: relative;
  flex: 1;
  min-width: 140px;
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-main);
  background: var(--bg-panel);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
  overflow: hidden;
}
.dm-monitor__stat:hover { box-shadow: var(--shadow); transform: translateY(-1px); }
.dm-monitor__stat.is-active { outline: 2px solid var(--brand); }

/* 默认配色（全部作业最醒目） */
.dm-monitor__stat.is-total {
  flex: 1.3;
  background: var(--brand);
  color: var(--text-on-primary);
  border-color: var(--brand);
}
.dm-monitor__stat.is-total .dm-monitor__stat-sub { color: rgba(255,255,255,0.85); }

/* 状态色 */
.dm-monitor__stat.running    { background: var(--brand-light);      color: var(--brand); }
.dm-monitor__stat.canceled   { background: var(--warning-light);    color: var(--warning); }
.dm-monitor__stat.failed     { background: var(--error-light);      color: var(--error); }
.dm-monitor__stat.restarting { background: var(--bg-light);         color: var(--text-secondary); }
.dm-monitor__stat.completed  { background: var(--success-light);    color: var(--success); }
.dm-monitor__stat.unknown    { background: #fff8e6;                 color: #b7791f; } /* 浅黄色背景 */

.dm-monitor__stat-count {
  font-size: 28px;
  font-weight: var(--font-weight-heavy);
  line-height: 1.1;
}
.dm-monitor__stat-label {
  font-size: 12px;
  opacity: 0.85;
  margin-top: 2px;
}
.dm-monitor__stat-sub {
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  gap: 10px;
}

.dm-monitor__stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255,255,255,0.35);
}
.dm-monitor__stat-icon svg { stroke-width: 1.8; }

/* ---------- ② 主区域 ---------- */
.dm-monitor__main {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: var(--space);
}

/* ---------- 左树 ---------- */
.dm-monitor__tree {
  width: 260px;
  flex-shrink: 0;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dm-monitor__tree-search {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space);
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.dm-monitor__tree-search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}
.dm-monitor__tree-search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}
.dm-monitor__tree-search-input::placeholder { color: var(--text-tertiary); }

.dm-monitor__tree-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.dm-monitor__tree-action:hover { background: var(--bg-hover); color: var(--brand); }

.dm-monitor__tree-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  list-style: none;
  margin: 0;
  padding: var(--space-xs) 0;
}

.dm-monitor__tree-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px var(--space);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.12s;
  user-select: none;
}
.dm-monitor__tree-row:hover { background: var(--bg-hover); color: var(--text-primary); }

.dm-monitor__tree-chevron {
  width: 14px;
  height: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  flex-shrink: 0;
}
.dm-monitor__tree-chevron--placeholder { visibility: hidden; }
.dm-monitor__tree-icon { flex-shrink: 0; color: var(--brand); }

.dm-monitor__tree-children {
  list-style: none;
  margin: 0;
  padding: 0;
}
.dm-monitor__tree-children .dm-monitor__tree-row {
  padding-left: calc(var(--space) + 14px + 4px);
}

.dm-monitor__tree-node.is-leaf.is-active .dm-monitor__tree-row {
  background: var(--brand-light);
  color: var(--brand);
  font-weight: var(--font-weight-bold);
}

/* ---------- 右侧 ---------- */
.dm-monitor__right {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: var(--radius-md);
  overflow: hidden;
}

/* 工具栏 */
.dm-monitor__toolbar {
  display: flex;
  align-items: center;
  gap: var(--space);
  padding: var(--space) var(--space-md);
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.dm-monitor__toolbar-search {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  background: var(--bg-input);
  padding: 0 var(--space-sm);
  height: var(--control);
  width: 220px;
  transition: border-color 0.15s;
}
.dm-monitor__toolbar-search:focus-within { border-color: var(--brand); }
.dm-monitor__toolbar-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size);
  color: var(--text-primary);
}
.dm-monitor__toolbar-input::placeholder { color: var(--text-tertiary); }
.dm-monitor__toolbar-search-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  padding: 0 4px;
}
.dm-monitor__toolbar-search-btn:hover { color: var(--brand); }

/* 筛选 */
.dm-monitor__filter {
  display: flex;
  gap: 4px;
  margin-left: auto;
}
.dm-monitor__filter-btn {
  padding: 6px 14px;
  font-size: var(--font-size-sm);
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  background: var(--bg-panel);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.dm-monitor__filter-btn:hover { border-color: var(--brand); color: var(--brand); }
.dm-monitor__filter-btn.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--text-on-primary);
}

.dm-monitor__refresh-btn {
  width: var(--control);
  height: var(--control);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  background: var(--bg-panel);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
}
.dm-monitor__refresh-btn:hover { border-color: var(--brand); color: var(--brand); }

/* 表格 */
.dm-monitor__table-wrap {
  flex: 1;
  min-height: 0;
  overflow: auto;
}
.dm-monitor__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size);
}
.dm-monitor__table thead {
  position: sticky;
  top: 0;
  background: var(--bg-head);
  z-index: 1;
}
.dm-monitor__table th {
  text-align: left;
  padding: 10px var(--space-sm);
  font-weight: var(--font-weight);
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-main);
  white-space: nowrap;
  font-size: var(--font-size-sm);
}
.dm-monitor__table td {
  padding: 12px var(--space-sm);
  border-bottom: 1px solid var(--border-lighter);
  color: var(--text-primary);
  vertical-align: top;
}
.dm-monitor__table tbody tr { transition: background 0.12s; }
.dm-monitor__table tbody tr:hover { background: var(--bg-hover); }

/* 单元格样式 */
.col-task { min-width: 220px; }
.dm-monitor__task-name {
  font-weight: var(--font-weight);
  color: var(--text-primary);
  margin-bottom: 4px;
}
.dm-monitor__status-tag {
  display: inline-block;
  font-size: 11px;
  line-height: 1.4;
  padding: 1px 8px;
  border-radius: var(--radius-sm);
}
.dm-monitor__status-tag.status-developing {
  background: var(--brand-light);
  color: var(--brand);
}
.dm-monitor__status-tag.status-published {
  background: var(--success-light);
  color: var(--success);
}

.col-mode { white-space: nowrap; }
.dm-monitor__mode-history {
  display: inline-block;
  margin-right: 3px;
  color: var(--text-tertiary);
  vertical-align: middle;
}
.dm-monitor__mode-label {
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
  margin-right: 6px;
}
.dm-monitor__mode-type {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
}

.col-jobid {
  max-width: 220px;
}
.dm-monitor__jobid {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
  margin-bottom: 2px;
  line-height: 1.4;
}
.dm-monitor__copy-btn {
  color: var(--text-tertiary);
  cursor: pointer;
  transition: color 0.15s;
}
.dm-monitor__copy-btn:hover { color: var(--brand); }

.col-date { white-space: nowrap; color: var(--text-tertiary); }
.col-action { text-align: center; width: 60px; }
.dm-monitor__view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--brand);
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.dm-monitor__view-btn:hover { background: var(--brand-light); }

/* 分页 */
.dm-monitor__pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  border-top: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.dm-monitor__page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  font-size: var(--font-size-sm);
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  background: var(--bg-panel);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.dm-monitor__page-btn:hover:not(:disabled) { border-color: var(--brand); color: var(--brand); }
.dm-monitor__page-btn.is-active {
  background: var(--brand);
  border-color: var(--brand);
  color: var(--text-on-primary);
}
.dm-monitor__page-btn:disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
  opacity: 0.6;
}

/* 滚动条细一点 */
.dm-monitor__table-wrap::-webkit-scrollbar,
.dm-monitor__tree-list::-webkit-scrollbar,
.dm-monitor__stats::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.dm-monitor__table-wrap::-webkit-scrollbar-thumb,
.dm-monitor__tree-list::-webkit-scrollbar-thumb,
.dm-monitor__stats::-webkit-scrollbar-thumb {
  background: var(--border-main);
  border-radius: 3px;
}
</style>
