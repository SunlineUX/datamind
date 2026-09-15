<template>
  <div class="dm-layout" style="--headerHeight:40px">
    <Sidebar />
    <main class="dm-layout__main">
      <header class="v33-topbar">
        <div class="v33-topbar__tabs">
          <button v-if="tabsOverflow.left" class="v33-tabs__scroll" title="向左滚动" @click="scrollTabs(-1)">
            <DmIcon name="ArrowLeft" :size="14" />
          </button>
          <div ref="tabsViewport" class="v33-tabs__viewport" @scroll="updateTabsOverflow">
            <div class="v33-tabs__track">
              <button v-for="tab in tabs" :key="tab.path" :class="['v33-tab', { 'is-active': route.path === tab.path }]"
                @click="activateTab(tab)" @contextmenu.prevent="openTabMenu($event, tab)">
                <DmIcon v-if="tab.path === '/home'" name="Home" :size="14" />
                <span>{{ tab.label }}</span>
                <DmIcon v-if="!tab.fixed" class="v33-tab__close" name="Close" :size="10" @click.stop="closeTab(tab)" />
              </button>
            </div>
          </div>
          <button v-if="tabsOverflow.right" class="v33-tabs__scroll" title="向右滚动" @click="scrollTabs(1)">
            <DmIcon name="ArrowRight" :size="14" />
          </button>
        </div>
        <div class="v33-topbar__actions">
          <DmPopover trigger="click" placement="bottomRight">
            <!-- <button class="v33-favorites-trigger" :title="t('v33.favorites.title')">
              <DmIcon name="Star" :size="14" />
            </button> -->
            <DmTooltip  :title="t('v33.favorites.title')" placement="left">
              <button class="v33-favorites-trigger">
                <DmIcon name="Star" :size="14" />
              </button>
            </DmTooltip>
            <template #content>
              <div class="v33-favorites-menu">
                <!-- <div class="v33-favorites-menu__title">{{ t('v33.favorites.title') }}</div> -->
                <div v-if="favoriteTabs.length === 0" class="v33-favorites-menu__empty">{{ t('v33.favorites.empty') }}</div>
                <button v-for="item in favoriteTabs" :key="item.path" class="v33-favorite-item" @click="openFavorite(item.path)">
                  <span>{{ item.label }}</span>
                  <!-- <DmIcon name="StarFilled" :size="13" @click.stop="removeFavorite(item.path)" /> -->
                </button>
              </div>
            </template>
          </DmPopover>
          <DmDivider direction="vertical" class="h-full" />
          <DmDropdown trigger="click" placement="bottomRight">
            <button class="v33-topbar__user">
              <img class="avatar-img" :src="Avatar" />
              <DmIcon name="ArrowDown" :size="12" />
            </button>
            <template #overlay>
              <div class="v33-user-menu">
                <button class="v33-user-menu__item">
                  <DmIcon name="UserInfo" :size="14" /><span>{{ t('layout.user.center') }}</span>
                </button>
                <button class="v33-user-menu__item">
                  <DmIcon name="Lock" :size="14" /><span>{{ t('layout.user.password') }}</span>
                </button>
                <div class="v33-user-menu__divider" />
                <div class="v33-user-menu__section">{{ t('theme.label') }}</div>
                <button v-for="mode in themeOrder" :key="mode"
                  :class="['v33-user-menu__item', { 'is-active': themeMode === mode }]" @click="setTheme(mode)"><span
                    class="v33-user-menu__radio" /><span>{{ t(`theme.${mode}`) }}</span></button>
                <div class="v33-user-menu__divider" />
                <div class="v33-user-menu__section">{{ t('language.label') }}</div>
                <button v-for="code in localeCodes" :key="code"
                  :class="['v33-user-menu__item', { 'is-active': locale === code }]" @click="setLocale(code)"><span
                    class="v33-user-menu__radio" /><span>{{ LANGUAGE_NAMES[code] }}</span></button>
                <div class="v33-user-menu__divider" />
                <button class="v33-user-menu__item v33-user-menu__item--danger">
                  <DmIcon name="Swap" :size="14" /><span>{{ t('layout.user.logout') }}</span>
                </button>
              </div>
            </template>
          </DmDropdown>
        </div>
      </header>
      <div v-if="tabMenu.visible" class="v33-tab-menu" :style="{ left: `${tabMenu.x}px`, top: `${tabMenu.y}px` }"
        @mousedown.stop>
        <button @click="closeTab(tabMenu.tab)">{{ t('v33.tabs.closeCurrent') }}</button>
        <button @click="closeOtherTabs(tabMenu.tab)">{{ t('v33.tabs.closeOthers') }}</button>
        <button @click="closeAllTabs">{{ t('v33.tabs.closeAll') }}</button>
      </div>
      <div class="dm-layout__inner">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import Sidebar from './Sidebar.vue';
import { DmDropdown, DmIcon, DmDivider, DmPopover, DmTooltip } from '@/components/dm';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { domains } from './menu';
import { useFavorites } from './useFavorites';
import { useTheme } from '@/composables/useTheme';
import { useLocale } from '@/composables/useLocale';
import { LANGUAGE_NAMES } from '@/locales';
import Avatar from '@/assets/avatar.png'

const { themeMode, setTheme } = useTheme();
const { locale, localeCodes, setLocale, t } = useLocale();
const themeOrder = ['system', 'dark', 'light'];
const route = useRoute();
const router = useRouter();
const tabsViewport = ref(null);
const tabs = ref([{ path: '/home', label: t('v33.home'), fixed: true }]);
const tabsOverflow = reactive({ left: false, right: false });
const tabMenu = reactive({ visible: false, x: 0, y: 0, tab: null });
const { favorites, removeFavorite } = useFavorites();

function findMenuItem(path) {
  for (const domain of domains) {
    for (const group of domain.groups) {
      for (const item of group.items) {
        if (item.to === path) return item;
        const child = item.children?.find((entry) => entry.to === path);
        if (child) return child;
      }
    }
  }
  return null;
}

function getTabLabel(path) {
  const item = findMenuItem(path);
  return item ? t(`v33.menu.${item.key}`) : t('v33.home');
}

const favoriteTabs = computed(() => favorites.value.map((path) => ({ path, label: getTabLabel(path) })));
function openFavorite(path) { router.push(path); }

function ensureTab(path) {
  if (path === '/home') return;
  if (!tabs.value.some((tab) => tab.path === path)) tabs.value.push({ path, label: getTabLabel(path), fixed: false });
  nextTick(updateTabsOverflow);
}

function activateTab(tab) {
  tabMenu.visible = false;
  router.push(tab.path);
}

function closeTab(tab) {
  if (!tab || tab.fixed) return;
  const index = tabs.value.findIndex((entry) => entry.path === tab.path);
  tabs.value.splice(index, 1);
  if (route.path === tab.path) router.push(tabs.value[Math.max(0, index - 1)].path);
  tabMenu.visible = false;
  nextTick(updateTabsOverflow);
}

function closeOtherTabs(tab) {
  tabs.value = tabs.value.filter((entry) => entry.fixed || entry.path === tab.path);
  if (route.path !== tab.path) router.push(tab.path);
  tabMenu.visible = false;
  nextTick(updateTabsOverflow);
}

function closeAllTabs() {
  tabs.value = tabs.value.filter((entry) => entry.fixed);
  if (route.path !== '/home') router.push('/home');
  tabMenu.visible = false;
  nextTick(updateTabsOverflow);
}

function openTabMenu(event, tab) {
  tabMenu.tab = tab;
  tabMenu.x = Math.min(event.clientX, window.innerWidth - 150);
  tabMenu.y = Math.min(event.clientY, window.innerHeight - 120);
  tabMenu.visible = true;
}

function updateTabsOverflow() {
  const element = tabsViewport.value;
  if (!element) return;
  tabsOverflow.left = element.scrollLeft > 0;
  tabsOverflow.right = element.scrollLeft + element.clientWidth < element.scrollWidth - 1;
}

function scrollTabs(direction) {
  tabsViewport.value?.scrollBy({ left: direction * 180, behavior: 'smooth' });
}

function closeTabMenu() { tabMenu.visible = false; }
watch(() => route.path, (path) => ensureTab(path), { immediate: true });
watch(locale, () => { tabs.value.forEach((tab) => { tab.label = tab.fixed ? t('v33.home') : getTabLabel(tab.path); }); });
onMounted(() => { document.addEventListener('click', closeTabMenu); nextTick(updateTabsOverflow); });
onBeforeUnmount(() => document.removeEventListener('click', closeTabMenu));
</script>
<style>
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
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
  background: var(--bg-layout);
}


.dm-layout__main {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-layout);
}

.dm-layout__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 0;
  background: transparent;
  z-index: 0;
}

.v33-topbar {
  height: var(--headerHeight);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: var(--bg-head);
}

.v33-topbar__tabs {
  min-width: 0;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: stretch;
}

.v33-tabs__viewport {
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.v33-tabs__track {
  display: inline-flex;
  min-width: 100%;
  height: 100%;
}

.v33-tabs__scroll {
  width: 28px;
  flex: 0 0 28px;
  display: grid;
  place-items: center;
  padding: 0 !important;
  border-right: 1px solid var(--border-lighter) !important;
  color: var(--text-tertiary) !important;
}

.v33-tabs__scroll:hover {
  background: var(--bg-hover) !important;
  color: var(--brand) !important;
}

.v33-tab {
  flex: 0 0 auto;
  width: max-content;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 13px !important;
  border-right: 1px solid var(--border-lighter) !important;
  color: var(--text-primary) !important;
  background: var(--bg-head) !important;
  font-size: var(--font-size-sm) !important;
  white-space: nowrap;
}

.v33-tab span {
  flex: 0 0 auto;
}

.v33-tab:hover {
  background: var(--bg-hover) !important;
}

.v33-tab.is-active {
  color: var(--brand) !important;
  background: var(--bg-layout) !important;
}

.v33-tab__close {
  color: var(--text-tertiary);
}

.v33-tab__close:hover {
  color: var(--error) !important;
}

.v33-tab-menu {
  position: fixed;
  z-index: calc(var(--z-popup) + 20);
  min-width: 140px;
  padding: 4px;
  border: 1px solid var(--border-lighter);
  border-radius: var(--radius);
  background: var(--bg-overlay);
  box-shadow: var(--shadow);
}

.v33-tab-menu button {
  width: 100%;
  height: 30px;
  padding: 0 9px;
  border: 0;
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  background: transparent;
  cursor: pointer;
  font-size: var(--font-size-sm);
  text-align: left;
}

.v33-tab-menu button:hover {
  color: var(--brand);
  background: var(--bg-hover);
}
.v33-favorites-menu { min-width: 210px; padding: 4px; }
.v33-favorites-menu__title { padding: 5px 8px 8px; color: var(--text-primary); font-size: 12px; font-weight: 600; border-bottom: 1px solid var(--border-lighter); }
.v33-favorites-menu__empty { padding: 18px 8px; color: var(--text-tertiary); font-size: 12px; text-align: center; }
.v33-favorite-item { width: 100%; min-height: 32px; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 5px 8px !important; border: 0; border-radius: var(--radius-sm); color: var(--text-primary) !important; background: transparent !important; text-align: left; }
.v33-favorite-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }.v33-favorite-item .dm-icon { flex: 0 0 auto; color: var(--warning); }.v33-favorite-item:hover { background: var(--bg-hover) !important; color: var(--brand) !important; }

.v33-topbar__actions {
  display: flex;
  height: var(--headerHeight);
  align-items: center;
  gap: var(--space-xs);
  padding-right: 12px;
  color: var(--text-tertiary);
}

.v33-topbar__actions button {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  height: var(--headerHeight);
  padding: 0 var(--space-sm);
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.v33-topbar__actions button:hover {
  color: var(--brand);
}

.v33-topbar__user {
  /* min-width: 112px; */
  justify-content: flex-end;
  height: var(--headerHeight);
}

.avatar-img {
  width: 24px;
  height: 24px;
}

.v33-user-menu {
  min-width: 190px;
  padding: 4px;
}

.v33-user-menu__item {
  width: 100%;
  min-height: 30px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 13px;
  text-align: left;
}

.v33-user-menu__item:hover,
.v33-user-menu__item.is-active {
  background: var(--bg-hover);
  color: var(--brand);
}

.v33-user-menu__item--danger {
  color: var(--error);
}

.v33-user-menu__divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border-lighter);
}

.v33-user-menu__section {
  padding: 4px 8px 2px;
  color: var(--text-tertiary);
  font-size: 12px;
}

.v33-user-menu__radio {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  border: 1px solid var(--text-disabled);
  border-radius: 50%;
}

.v33-user-menu__item.is-active .v33-user-menu__radio {
  border: 4px solid var(--brand);
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

.dm-layout__edge:hover {
  color: var(--brand);
}

.dm-layout__edge--left {
  left: 56px;
}

.dm-layout__edge--right {
  right: 8px;
}

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

.dm-layout__edge:hover::after {
  opacity: 1;
}
</style>
