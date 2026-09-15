<template>
  <!-- 占位容器：决定侧边栏占位宽度；悬浮展开时 aside 绝对定位浮层覆盖内容区，不推挤布局 -->
  <div class="dm-sidebar-wrap" :class="{ 'is-expanded': sidebarMode === 'expanded' }">
    <aside
      class="dm-sidebar"
      :class="[sidebarOpen ? 'is-open' : 'is-closed', { 'is-floating': isFloating }]"
      @mouseenter="hovering = true"
      @mouseleave="hovering = false"
    >
    <!-- Logo -->
    <div class="dm-sidebar__logo-container">
      <div class="dm-sidebar__logo" title="DataMind">
        <img src="../assets/logo.png" alt="DataMind" width="32" height="32" />
      </div>
      <!-- 侧边栏控制：弹出单选面板（展开 / 收起 / 悬浮时展开） -->
      <DmPopover trigger="click" placement="bottom">
        <template #default>
          <div class="dm-sidebar__control" :title="t('layout.sidebar.control')">
            <DmIcon name="LayoutLeft" :size="16" />
          </div>
        </template>
        <template #content>
          <div class="sidebar-control">
            <div class="sidebar-control__title">{{ t('layout.sidebar.control') }}</div>
            <div class="sidebar-control__divider" />
            <div
              v-for="mode in sidebarModes"
              :key="mode"
              :class="['sidebar-control__item', { 'is-active': sidebarMode === mode }]"
              @click="sidebarMode = mode"
            >
              <span class="sidebar-control__dot" />
              <span>{{ t(`layout.sidebar.${mode}`) }}</span>
            </div>
          </div>
        </template>
      </DmPopover>
    </div>
    <!-- 导航（菜单配置见 ./menu.js，按业务区块分组，组间分隔线划分） -->
    <nav class="dm-sidebar__nav">
      <div v-for="(group, gi) in menuGroups" :key="group.key" class="dm-sidebar__nav-group">
        <DmDivider v-if="gi > 0" direction="horizontal" />
        <div v-for="item in group.items" :key="item.key" class="dm-sidebar__nav-slot">
          <!-- 有子菜单：用 DmPopover 承载二级菜单 -->
          <DmPopover
            v-if="item.children"
            trigger="hover"
            placement="right"
            @open-change="(v) => openKey = v ? item.key : null"
            block
          >
            <template #default>
              <div
                :class="['dm-sidebar__nav-item', { 'is-active': isActive(item), 'is-open': openKey === item.key }]"
                :data-tip="t(item.labelKey)"
              >
                <!-- <DmTooltip v-if="!sidebarOpen" :title="t(item.labelKey)" placement="left">
                  <DmIcon :name="item.icon" :size="18" />
                </DmTooltip> -->
                <div class="dm-sidebar__nav-item-content">
                  <DmIcon :name="item.icon" :size="18" />
                  <span v-if="sidebarOpen">{{ t(item.labelKey) }}</span>
                </div>
              </div>
            </template>
            <template #content>
              <div class="dm-sidebar__submenu-list">
                <div
                  v-for="child in item.children"
                  :key="child.key"
                  :class="['dm-sidebar__submenu-item', { 'is-active': route.path === child.to }]"
                  @click="go(child)"
                >
                  {{ t(child.labelKey) }}
                </div>
              </div>
            </template>
          </DmPopover>

          <!-- 无子菜单 -->
          <div
            v-else
            :class="['dm-sidebar__nav-item', { 'is-active': isActive(item) }]"
            :data-tip="t(item.labelKey)"
            @click="handleClick(item)"
          >
            <DmTooltip v-if="!sidebarOpen" :title="t(item.labelKey)" placement="left">
              <DmIcon :name="item.icon" :size="18" />
            </DmTooltip>
            <div v-else class="dm-sidebar__nav-item-content">
              <DmIcon :name="item.icon" :size="18" />
              <span>{{ t(item.labelKey) }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 底部：用户菜单 -->
    <div class="dm-sidebar__bottom">
      <div class="dm-sidebar__space-change">
        团队空间切换
      </div>
      <DmDivider direction="horizontal" />
      <div class="dm-sidebar__user-container">
      <DmDropdown trigger="hover" placement="topLeft" @open-change="menuOpen = $event">
        <div class="dm-sidebar__avatar" :class="{ 'is-open': menuOpen }">
          <img :src="avatarUrl" alt="用户头像" width="32" height="32" class="dm-sidebar__avatar-img" />
          <div class="dm-sidebar__avatar-info" v-if="sidebarOpen">
            <div class="dm-sidebar__avatar-name">{{ t('layout.user.name') }}</div>
            <div class="dm-sidebar__avatar-role">{{ t('layout.user.role') }}</div>
          </div>
        </div>
        <template #overlay>
          <div class="user-menu">
            <div class="user-menu__item" @click="emit('userCenter')">
              <DmIcon name="UserInfo" :size="14" />
              <span>{{ t('layout.user.center') }}</span>
            </div>
            <div class="user-menu__item" @click="emit('changePassword')">
              <DmIcon name="Lock" :size="14" />
              <span>{{ t('layout.user.password') }}</span>
            </div>

            <div class="user-menu__divider" />
            <div class="user-menu__section">{{ t('theme.label') }}</div>
            <div
              v-for="mode in themeOrder"
              :key="mode"
              :class="['user-menu__item', 'user-menu__radio', { 'is-active': themeMode === mode }]"
              @click="setTheme(mode)"
            >
              <span class="user-menu__radio-dot" />
              <span>{{ t(`theme.${mode}`) }}</span>
            </div>

            <div class="user-menu__divider" />
            <div class="user-menu__section">{{ t('language.label') }}</div>
            <div
              v-for="code in localeCodes"
              :key="code"
              :class="['user-menu__item', 'user-menu__radio', { 'is-active': locale === code }]"
              @click="setLocale(code)"
            >
              <span class="user-menu__radio-dot" />
              <span>{{ LANGUAGE_NAMES[code] }}</span>
            </div>

            <div class="user-menu__divider" />
            <div class="user-menu__item" @click="emit('logout')">
              <DmIcon name="Swap" :size="14" />
              <span>{{ t('layout.user.logout') }}</span>
            </div>
          </div>
        </template>
      </DmDropdown>
      </div>
    </div>
  </aside>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import DmDropdown from '../components/dm/DmDropdown.vue';
import { DmIcon, DmDivider, DmTooltip, DmPopover } from '../components/dm';
import { menuGroups } from './menu';
import { useTheme } from '../composables/useTheme';
import { useLocale } from '../composables/useLocale';
import { LANGUAGE_NAMES } from '../locales';
// 强制头像作为独立文件输出（绕过 Vite assetsInlineLimit 的 base64 内联）
import avatarUrl from '../assets/avatar.png?url';

const emit = defineEmits(['create', 'userCenter', 'changePassword', 'logout']);

const route = useRoute();
const router = useRouter();
const { themeMode, setTheme } = useTheme();
const { locale, localeCodes, setLocale, t } = useLocale();

const activeKey = ref('develop');
const openKey = ref(null); // 当前展开二级菜单的一级菜单 key
const menuOpen = ref(false); // 用户菜单展开态

/* ---------- 侧边栏显示模式：expanded 展开 / collapsed 收起 / hover 悬浮时展开 ---------- */
const SIDEBAR_MODES = ['expanded', 'collapsed', 'hover'];
const SIDEBAR_MODE_KEY = 'dm-ai.sidebarMode';
const sidebarModes = SIDEBAR_MODES;

function loadSidebarMode() {
  try {
    const saved = localStorage.getItem(SIDEBAR_MODE_KEY);
    return SIDEBAR_MODES.includes(saved) ? saved : 'expanded';
  } catch {
    return 'expanded';
  }
}

const sidebarMode = ref(loadSidebarMode());
const hovering = ref(false); // 鼠标是否悬浮在侧边栏上（hover 模式用）

watch(sidebarMode, (mode) => {
  try { localStorage.setItem(SIDEBAR_MODE_KEY, mode); } catch { /* ignore */ }
});

// 展开/收起判定：hover 模式下悬浮、或二级菜单/用户菜单面板打开时临时展开
const sidebarOpen = computed(() => {
  if (sidebarMode.value === 'expanded') return true;
  if (sidebarMode.value === 'collapsed') return false;
  return hovering.value || openKey.value !== null || menuOpen.value;
});

// 浮层态：仅 hover 模式悬浮展开时，aside 以浮层覆盖内容区（占位宽度保持收起态不变）
const isFloating = computed(() => sidebarMode.value === 'hover' && sidebarOpen.value);

// 主题展示顺序：跟随系统 / 深色 / 浅色
const themeOrder = ['system', 'dark', 'light'];

// 菜单高亮：有 to 按 route.path 匹配，无 to 用本地 activeKey
function isActive(item) {
  if (item.children) {
    return item.children.some((c) => c.to && route.path === c.to);
  }
  if (item.to) return route.path === item.to;
  return activeKey.value === item.key;
}

function handleClick(item) {
  openKey.value = null;
  activeKey.value = item.key;
  if (item.to) router.push(item.to);
}

function go(child) {
  openKey.value = null;
  activeKey.value = child.key;
  if (child.to) router.push(child.to);
}



// 路由变化时收起子菜单
watch(() => route.path, () => { openKey.value = null; });

// 点击菜单区域外部时收起子菜单（DmPopover 面板 teleport 到 body，需放行面板内点击）
function onDocClick(e) {
  if (e.target.closest('.dm-sidebar__nav-slot')) return;
  if (e.target.closest('.dm-popover__panel')) return;
  openKey.value = null;
}
document.addEventListener('click', onDocClick);
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<style scoped>
/* 占位容器：expanded 占 180px，其余模式占 48px（悬浮展开时 aside 浮层覆盖、不推挤布局） */
.dm-sidebar-wrap {
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 100%;
  z-index: 20;
}
.dm-sidebar-wrap.is-expanded {
  width: 180px;
}

.dm-sidebar {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 48px;
  height: 100%;
  background: var(--sidebar);
  border-right: 1px solid var(--border-main);
  transition: all 0.2s ease;
}
.dm-sidebar.is-open {
  width: 180px;
}
/* 悬浮浮层态：投影增强层次感 */
.dm-sidebar.is-floating {
  box-shadow: var(--shadow);
}

.dm-sidebar__logo-container{
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 48px;
}
.dm-sidebar__logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}
.is-open .dm-sidebar__logo {
  transform: translateX(12px);
}
.is-closed .dm-sidebar__logo {
  transform: translateX(0px);
}
.dm-sidebar__control {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--control);
  height: var(--control);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  margin-right: 8px;
  border-radius: 4px;
  color: var(--text-secondary);
}
.dm-sidebar__control:hover {
  background: var(--bg-dark);
  color: var(--text-primary);
}

.is-closed:hover .dm-sidebar__logo,
.is-closed .dm-sidebar__control {
  display: none;
  transition: all 0.2s ease;
}
.is-closed:hover .dm-sidebar__control {
  display: flex;
  margin: 0 auto;
  text-align: center;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  transform: translateX(10px);
}

.dm-sidebar__bottom {
  display: flex;
  flex-direction: column;
  /* border-top: 1px solid var(--border-main); */
  margin: 0 var(--space-sm);
}
.dm-sidebar__user-container{
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-sm);
  border-radius: var(--border-radius);
  height: 48px;
  overflow: hidden;
}
.dm-sidebar__user-container:hover{
  background: var(--bg-hover);
}
.dm-sidebar__space-change{
  padding: var(--space-sm);
  background: var(--bg-layout);
  margin-top: var(--space-sm);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.is-closed .dm-sidebar__space-change{
  transform: translateX(-200px);
}

.dm-sidebar__avatar {
  display: flex;
  cursor: pointer;
  transition: all 0.15s;
  gap: 8px;
  padding: var(--space-sm);
  width: 100%;
}
.is-closed .dm-sidebar__avatar{
  padding: var(--space-sm) 0;
}
.dm-sidebar__avatar-img {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  border: 1px solid var(--border-main);
  box-sizing: border-box;
}

.dm-sidebar__avatar:hover,
.dm-sidebar__avatar.is-open { border-color: var(--brand); }
.dm-sidebar__avatar-info {
  flex: 1;
  gap: 4px;
}

.dm-sidebar__avatar-info{
  line-height: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.dm-sidebar__avatar-name {
  font-size: var(--font-size);
  color: var(--text-primary);
}
.dm-sidebar__avatar-role {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-light);
  color: var(--text-tertiary);
}

/* 用户菜单（DmDropdown overlay 插槽内容） */
.user-menu {
  /* width: 200px; */
}

.dm-sidebar__nav {
  flex: 1;
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 var(--space-sm);
  margin-top: var(--space);
}

.dm-sidebar__nav-group {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: var(--space-xs);
}
.dm-sidebar__nav-slot {
  position: relative;
  flex-shrink: 0;
}

.dm-sidebar__nav-item {
  position: relative;
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.15s;
  height: var(--control);
  padding: 0 var(--space-sm);
}
.dm-sidebar__nav-item-content{
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}
.dm-sidebar__nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.dm-sidebar__nav-item.is-active {
  background: var(--brand-light);
  color: var(--brand);
}

.user-menu__item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  font-size: 13px;
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s;
}
.user-menu__item:hover { background: var(--bg-hover); }



/* 二级菜单（DmPopover content 插槽内容） */
.dm-sidebar__submenu-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dm-sidebar__submenu-item {
  display: block;
  width: 100%;
  padding: 6px 10px;
  text-align: left;
  color: var(--text-primary);
  background: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s, color 0.15s;
}
.dm-sidebar__submenu-item:hover { background: var(--bg-hover); }
.dm-sidebar__submenu-item.is-active { color: var(--brand); background: var(--brand-light); }


.user-menu__section {
  padding: 4px 8px 2px;
  font-size: 12px;
  color: var(--text-tertiary);
}

.user-menu__radio-dot {
  width: 14px;
  height: 14px;
  margin-right: 2px;
  border: 1px solid var(--text-disabled);
  border-radius: 50%;
  transition: all 0.15s;
}
.user-menu__radio.is-active { color: var(--text-primary); }
.user-menu__radio.is-active .user-menu__radio-dot {
  border-color: var(--brand);
  border-width: 4px;
}

/* 侧边栏控制面板（DmPopover content 插槽内容） */
.sidebar-control {
  min-width: 160px;
  padding: 4px;
}
.sidebar-control__title {
  padding: 8px 10px;
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}
.sidebar-control__divider {
  height: 1px;
  background: var(--border-lighter);
}
.sidebar-control__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.sidebar-control__item:hover { background: var(--bg-hover); }
.sidebar-control__dot {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border: 1px solid var(--text-disabled);
  border-radius: 50%;
  transition: all 0.15s;
}
.sidebar-control__item.is-active .sidebar-control__dot {
  border-color: var(--brand);
  border-width: 4px;
}

.user-menu__divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border-lighter);
}
</style>
