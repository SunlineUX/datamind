<template>
    <div class="v33-sidebar-wrap" :class="{ 'is-expanded': sidebarMode === 'expanded' }">
        <aside class="v33-sidebar" :class="[sidebarOpen ? 'is-open' : 'is-closed', { 'is-floating': isFloating }]"
            @mouseenter="hovering = true" @mouseleave="hovering = false">
            <div class="v33-sidebar__brand"><img src="@/assets/logo.png" alt="DataMind" />
                <DmPopover trigger="click" placement="bottom">
                    <button class="v33-sidebar__control" title="侧栏设置">
                        <DmIcon name="LayoutLeft" :size="16" />
                    </button>
                    <template #content>
                        <div class="v33-sidebar__mode-picker">
                            <!-- <b>{{ t('layout.sidebar.control') }}</b> -->
                            <button v-for="mode in sidebarModes" :key="mode"
                                :class="{ 'is-active': sidebarMode === mode }"
                                @click="sidebarMode = mode"><span></span>{{ t(`layout.sidebar.${mode}`) }}</button>
                        </div>
                    </template>
                </DmPopover>
            </div>
            <DmPopover :key="popoverKey" trigger="click" placement="right" @open-change="domainOpen = $event">
                <button class="v33-sidebar__workspace" :data-tip="t(`v33.domain.${currentDomain.key}`)"><span
                        class="workspace-icon"><img :src="currentDomain.icon"
                            :alt="t(`v33.domain.${currentDomain.key}`)" /></span><span v-if="sidebarOpen">{{
                                t(`v33.domain.${currentDomain.key}`) }}</span>
                    <DmIcon v-if="sidebarOpen" name="ArrowDown" :size="12" color="var(--text-tertiary)" />
                </button>
                <template #content>
                    <div class="v33-domain-picker">
                        <div class="v33-domain-grid">
                            <button v-for="domain in domains" :key="domain.key"
                                :class="['v33-domain', { 'is-active': activeDomain === domain.key }]"
                                @click="selectDomain(domain.key)">
                                <img :src="domain.icon" :alt="t(`v33.domain.${domain.key}`)" />
                                <span>{{
                                    t(`v33.domain.${domain.key}`) }}</span>
                            </button>
                        </div>
                    </div>
                </template>
            </DmPopover>
            <div class="v33-sidebar__menu">
                <section v-for="group in currentDomain.groups" :key="group.key" class="v33-menu-group">
                    <h3>{{ t(`v33.menu.${group.key}`) }}</h3>
                    <div v-for="item in group.items" :key="item.key" class="v33-menu-slot">
                        <DmPopover v-if="item.children" trigger="hover" placement="right" block>
                            <template #default>
                                <button :class="['v33-menu-item', { 'is-active': isActive(item) }]"
                                    :aria-label="t(`v33.menu.${item.key}`)" :data-tip="t(`v33.menu.${item.key}`)">
                                    <DmIcon :name="item.icon || 'FileText'" :size="15" />
                                    <span v-if="sidebarOpen">{{
                                        t(`v33.menu.${item.key}`) }}</span>
                                    <DmIcon v-if="sidebarOpen" name="ArrowRight" :size="12" />
                                </button>
                            </template>
                            <template #content>
                                <div class="v33-submenu"><button v-for="child in item.children" :key="child.key"
                                        :class="{ 'is-active': route.path === child.to }" @click="navigate(child)">{{
                                            t(`v33.menu.${child.key}`) }}
                                        <DmIcon :name="isFavorite(child.to) ? 'StarFilled' : 'Star'" :size="13"
                                            @click.stop="toggleFavorite(child.to)" />
                                    </button></div>
                            </template>
                        </DmPopover>
                        <DmTooltip v-else-if="!sidebarOpen" :title="t(`v33.menu.${item.key}`)" placement="right">
                            <button :class="['v33-menu-item', { 'is-active': isActive(item) }]"
                                :data-tip="t(`v33.menu.${item.key}`)" @click="navigate(item)">
                                <DmIcon :name="item.icon || 'FileText'" :size="15" />
                                <DmIcon  v-if="sidebarOpen" :class="['v33-menu-item__favorite', { 'is-show': isFavorite(item.to) }]"
                                    :name="isFavorite(item.to) ? 'StarFilled' : 'Star'" :size="12"
                                    @click.stop="toggleFavorite(item.to)" />
                            </button>
                        </DmTooltip>
                        <button v-else :class="['v33-menu-item', { 'is-active': isActive(item) }]"
                            :data-tip="t(`v33.menu.${item.key}`)" @click="navigate(item)">
                            <DmIcon :name="item.icon || 'FileText'" :size="15" /><span>{{ t(`v33.menu.${item.key}`)
                            }}</span>
                            <DmIcon  :class="['v33-menu-item__favorite', { 'is-show': isFavorite(item.to) }]" :name="isFavorite(item.to) ? 'StarFilled' : 'Star'"
                                :size="12" @click.stop="toggleFavorite(item.to)" />
                        </button>
                    </div>
                </section>
            </div>
        </aside>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DmIcon, DmPopover, DmTooltip } from '@/components/dm';
import { domains } from './menu';
import { useLocale } from '@/composables/useLocale';
import { useFavorites } from './useFavorites';

const route = useRoute();
const router = useRouter();
const activeDomain = ref('data-dev');
const sidebarModes = ['expanded', 'collapsed', 'hover'];
const { t } = useLocale();
const { isFavorite, toggleFavorite } = useFavorites();
const sidebarMode = ref(loadSidebarMode());
const hovering = ref(false);
const domainOpen = ref(false);
const popoverKey = ref(0);
const currentDomain = computed(() => domains.find((domain) => domain.key === activeDomain.value) || domains[0]);
const isActive = (item) => item.to && route.path === item.to;
const navigate = (item) => item.to && router.push(item.to);
const sidebarOpen = computed(() => sidebarMode.value === 'expanded' || (sidebarMode.value === 'hover' && hovering.value));
const isFloating = computed(() => sidebarMode.value === 'hover' && sidebarOpen.value);
function loadSidebarMode() {
    try {
        const value = localStorage.getItem('dm-v33.sidebarMode');
        return sidebarModes.includes(value) ? value : 'expanded';
    } catch {
        return 'expanded';
    }
}
watch(sidebarMode, (mode) => {
    try { localStorage.setItem('dm-v33.sidebarMode', mode); } catch { /* ignore */ }
});
function selectDomain(key) {
    activeDomain.value = key;
    domainOpen.value = false;
    popoverKey.value += 1;
}
</script>

<style scoped>
.v33-sidebar-wrap {
    position: relative;
    width: 48px;
    height: 100%;
    flex-shrink: 0;
    z-index: 20;
}

.v33-sidebar-wrap.is-expanded {
    width: 172px;
}

.v33-sidebar {
    position: absolute;
    inset: 0 auto 0 0;
    width: 48px;
    display: flex;
    flex-direction: column;
    background: var(--bg-panel);
    border-right: 1px solid var(--border-lighter);
    color: var(--text-primary);
    transition: width .2s ease, box-shadow .2s ease;
}

.v33-sidebar.is-open {
    width: 172px;
}

.v33-sidebar.is-floating {
    box-shadow: var(--shadow);
}

.v33-sidebar__brand {
    height: 41px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px 0 12px;
    border-bottom: 1px solid var(--border-lighter);
    box-sizing: border-box;
    box-shadow: var(--shadow-xs);
    z-index: 2;
}

.v33-sidebar button {
    border: 0;
    background: transparent;
    cursor: pointer;
    color: inherit;
}

.v33-sidebar__brand button {
    color: var(--text-tertiary);
    padding: var(--space-sm);
}

.v33-sidebar__brand img {
    width: 32px;
}

.v33-sidebar__workspace {
    width: calc(100% - var(--space-sm) * 2);
    margin: var(--space-sm);
    padding: 0 var(--space-sm);
    height: 32px;
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    border: 1px solid var(--border-lighter) !important;
    border-radius: var(--radius-sm);
    font-size: var(--font-size);
}

.v33-sidebar__workspace>span:nth-child(2) {
    flex: 1;
    text-align: left;
}

.v33-sidebar__workspace>i {
    color: var(--text-disabled);
}

.workspace-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
}

.workspace-icon img {
    width: 32px;
    height: 32px;
    object-fit: contain;
}

.v33-domain-picker {
    min-width: 276px;
}

.v33-domain-picker__title {
    padding: 0 2px 9px;
    color: var(--text-primary);
    font-size: 12px;
    font-weight: 600;
    border-bottom: 1px solid var(--border-lighter);
}

.v33-domain-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(112px, 1fr));
    gap: 6px;
}

.v33-domain {
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 8px;
    padding: var(--space-md);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: var(--font-size);
    text-align: left;
    background: transparent;
}

.v33-domain img {
    width: 40px;
    height: 40px;
    object-fit: contain;
}

.v33-domain:hover,
.v33-domain.is-active {
    background: var(--brand-light);
    color: var(--brand) !important;
}

.v33-sidebar__menu {
    flex: 1;
    overflow: auto;
    padding: 9px 7px;
}

.v33-menu-group {
    margin-bottom: 12px;
}

.v33-menu-group h3 {
    padding: 3px 10px 5px;
    color: var(--text-tertiary);
    font-size: 11px;
    font-weight: 400;
}

.v33-menu-item {
    width: 100%;
    height: 32px;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 0 10px;
    border-radius: 5px;
    color: var(--text-secondary) !important;
    font-size: 12px;
    text-align: left;
}

.v33-menu-item span {
    flex: 1;
}

.v33-menu-item:hover,
.v33-menu-item.is-active {
    background: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground) !important;
}

.v33-sidebar__footer {
    padding: 8px;
    border-top: 1px solid var(--sidebar-border);
}

.v33-user {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px;
    text-align: left;
}

.avatar {
    width: 27px;
    height: 27px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e8f2ff;
    color: #287bd9;
    font-weight: 600;
}

.v33-user span:nth-child(2) {
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.3;
}

.v33-user b {
    font-size: 11px;
    font-weight: 500;
}

.v33-user small {
    color: var(--text-tertiary);
    font-size: 10px;
}

.v33-sidebar.is-closed .v33-sidebar__brand {
    justify-content: center;
    padding: 0;
}

.v33-sidebar.is-closed .v33-sidebar__brand img {
    width: 32px;
}

.v33-sidebar.is-closed .v33-sidebar__control {
    display: none;
}

.v33-sidebar.is-closed .v33-sidebar__brand:hover img {
    display: none;
}

.v33-sidebar.is-closed .v33-sidebar__brand:hover .v33-sidebar__control {
    display: inline-flex;
}

.v33-sidebar.is-closed .v33-sidebar__workspace {
    width: 32px;
    margin: var(--space-sm) auto;
    padding: 0;
    justify-content: center;
}

.v33-sidebar.is-closed .v33-sidebar__workspace::after,
.v33-sidebar.is-closed .v33-menu-item::after {
    content: attr(data-tip);
    position: absolute;
    left: 43px;
    padding: 5px 8px;
    white-space: nowrap;
    color: var(--bg-panel);
    background: var(--text-primary);
    border-radius: 4px;
    opacity: 0;
    pointer-events: none;
    transition: opacity .15s;
    z-index: 30;
}

.v33-sidebar.is-closed .v33-sidebar__workspace {
    position: relative;
    /* transform: translateX(8px); */
}

.v33-sidebar.is-closed .v33-sidebar__workspace:hover::after,
.v33-sidebar.is-closed .v33-menu-item:hover::after {
    opacity: 1;
}

.v33-sidebar.is-closed .v33-user {
    justify-content: center;
    padding: 5px 0;
}

.v33-sidebar.is-closed .v33-sidebar__menu {
    padding-left: 7px;
    padding-right: 7px;
}

.v33-sidebar__mode-picker {
    min-width: 120px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.v33-sidebar__mode-picker b {
    padding: 3px 6px 7px;
    font-size: 12px;
}

.v33-sidebar__mode-picker button {
    height: 30px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 7px;
    border-radius: 4px;
    font-size: 12px;
    text-align: left;
    background: transparent;
}

.v33-sidebar__mode-picker button:hover,
.v33-sidebar__mode-picker button.is-active {
    color: var(--sidebar-accent-foreground);
    background: var(--sidebar-accent);
}

.v33-sidebar__mode-picker button span {
    width: 12px;
    height: 12px;
    border: 1px solid var(--text-disabled);
    border-radius: 50%;
}

.v33-sidebar__mode-picker button.is-active span {
    border: 4px solid var(--sidebar-primary);
}

.v33-menu-slot,
.v33-menu-slot>.dm-popover,
.v33-menu-slot>.dm-tooltip {
    display: block;
}

.v33-submenu {
    min-width: 150px;
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.v33-submenu button {
    width: 100%;
    min-height: 30px;
    padding: 0 9px;
    border: 0;
    border-radius: 4px;
    color: var(--text-secondary);
    background: transparent;
    font-size: 12px;
    text-align: left;
}

.v33-submenu button:hover,
.v33-submenu button.is-active {
    background: var(--sidebar-accent);
    color: var(--sidebar-accent-foreground);
}

.v33-sidebar.is-closed .v33-menu-group h3 {
    display: block;
    height: 1px;
    padding: 0;
    margin: 10px 4px;
    overflow: hidden;
    background: var(--sidebar-border);
    color: transparent;
}

.v33-sidebar.is-closed .v33-menu-item {
    position: relative;
    justify-content: center;
    padding: 0;
}
.v33-menu-item__favorite {
    margin-left: auto;
    color: var(--text-tertiary);
    cursor: pointer;
    opacity: 0;
    transition: all .2s ease;
}

.v33-menu-item__favorite:hover {
    color: var(--warning);
}
.v33-menu-item:hover .v33-menu-item__favorite{
    opacity: 1;
}
.v33-submenu button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.v33-submenu button .dm-icon {
    flex: 0 0 auto;
    color: var(--text-tertiary);
    cursor: pointer;
}

.v33-submenu button .dm-icon:hover {
    color: var(--warning);
}

.v33-sidebar.is-closed .v33-menu-item__favorite {
    position: absolute;
    right: 2px;
    display: inline-flex;
    font-size: var(--font-size-sm);
}

.v33-menu-item__favorite.is-show{
    opacity: 1;
}
</style>
