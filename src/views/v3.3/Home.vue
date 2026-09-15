<template>
  <div class="v33-home">
    <section class="v33-home__hero"><div class="v33-section-title"><span></span><b>{{ t('v33.homePage.positioning') }}</b></div><div class="v33-module-map"><button v-for="module in homeModules" :key="module.key" class="v33-module"><DmIcon :name="module.icon" :size="17" :color="module.color" /><span>{{ t(`v33.module.${module.key}`) }}</span></button></div></section>
    <section class="v33-home__stats"><div class="v33-section-title"><span></span><b>{{ t('v33.homePage.stats') }}</b></div><div class="v33-stat-grid"><div v-for="stat in stats" :key="stat.key" class="v33-stat"><strong :style="{ color: stat.color }">{{ stat.value }}</strong><small>{{ t(`v33.homePage.${stat.key}`) }}</small></div></div></section>
    <section class="v33-home__list v33-notices"><div class="v33-list-head"><b><DmIcon name="Bell" :size="15" />{{ t('v33.homePage.notices') }}</b><a>{{ t('v33.more') }}</a></div><div v-for="notice in notices" :key="notice.key" class="v33-list-row"><em :class="`is-${notice.type}`">{{ t(`v33.homePage.${notice.tagKey}`) }}</em><span><b>{{ t(`v33.homePage.${notice.titleKey}`) }}</b><small>{{ t(`v33.homePage.${notice.timeKey}`) }}</small></span></div></section>
    <section class="v33-home__list v33-guides"><div class="v33-list-head"><b><DmIcon name="Book" :size="15" />{{ t('v33.homePage.guides') }}</b><a>{{ t('v33.more') }}</a></div><div v-for="guide in guides" :key="guide.key" class="v33-guide-row"><DmIcon :name="guide.icon" :size="23" color="var(--brand)" /><span><b>{{ t(`v33.homePage.${guide.titleKey}`) }}</b><small>{{ t(`v33.homePage.${guide.descKey}`) }}</small></span></div></section>
  </div>
</template>

<script setup>
import { DmIcon } from '@/components/dm';
import { homeModules } from './layout/menu';
import { useLocale } from '@/composables/useLocale';

const { t } = useLocale();
const stats = [{ key: 'source', value: 128, color: '#1474df' }, { key: 'dataset', value: 56, color: '#28a77c' }, { key: 'model', value: 34, color: '#f39a17' }, { key: 'api', value: 18, color: '#e3273b' }, { key: 'runs', value: 1240, color: '#7567e8' }, { key: 'storage', value: '2.3TB', color: '#1474df' }];
const notices = [{ key: 'notice1', tagKey: 'system', type: 'blue', titleKey: 'notice1', timeKey: 'time1' }, { key: 'notice2', tagKey: 'alert', type: 'red', titleKey: 'notice2', timeKey: 'time2' }, { key: 'notice3', tagKey: 'notice', type: 'green', titleKey: 'notice3', timeKey: 'time3' }, { key: 'notice4', tagKey: 'approval', type: 'orange', titleKey: 'notice4', timeKey: 'time4' }];
const guides = [{ key: 'guide1', icon: 'Rocket', titleKey: 'guide1', descKey: 'guide1Desc' }, { key: 'guide2', icon: 'Brain', titleKey: 'guide2', descKey: 'guide2Desc' }, { key: 'guide3', icon: 'Folder', titleKey: 'guide3', descKey: 'guide3Desc' }, { key: 'guide4', icon: 'FileText', titleKey: 'guide4', descKey: 'guide4Desc' }];

</script>

<style scoped>
.v33-home {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%; padding: 24px; display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(290px, .75fr); grid-template-rows: 315px 258px; gap: 16px; overflow: auto; color: #252b35;
}
.v33-home__hero, .v33-home__stats, .v33-home__list { background: #fff; border: 1px solid #e5e9f0; border-radius: 9px; overflow: hidden; }.v33-home__hero { padding: 12px 10px 8px; }.v33-home__stats { padding: 12px 14px; }.v33-section-title { display: flex; align-items: center; gap: 8px; height: 23px; font-size: 13px; }.v33-section-title > span { width: 4px; height: 15px; border-radius: 2px; background: #1674df; }.v33-module-map { height: calc(100% - 27px); margin-top: 6px; padding: 26px 22px; display: grid; grid-template-columns: repeat(5, minmax(80px, 1fr)); grid-auto-rows: 52px; gap: 9px 10px; background: #f2f6fd; border-radius: 10px; }.v33-module { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; border: 1px solid #cfe0f7; border-radius: 7px; background: linear-gradient(#fff, #f5f9ff); color: #3f4d60; box-shadow: 0 2px 4px #b8c9df55; cursor: pointer; font-size: 10px; }.v33-module:hover { border-color: #6ba8ed; transform: translateY(-1px); }.v33-stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 15px; }.v33-stat { height: 64px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; background: #f8f9fc; border-radius: 8px; }.v33-stat strong { font-size: 18px; }.v33-stat small { color: #8b95a7; font-size: 11px; }.v33-home__list { min-width: 0; }.v33-notices { grid-column: 1; }.v33-guides { grid-column: 2; }.v33-list-head { height: 38px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-bottom: 1px solid #edf0f4; font-size: 13px; }.v33-list-head b { display: flex; align-items: center; gap: 7px; }.v33-list-head b .dm-icon { color: #277fe4; }.v33-list-head a { color: #929baa; font-size: 12px; }.v33-list-row, .v33-guide-row { min-height: 54px; display: flex; align-items: center; gap: 10px; padding: 7px 14px; border-bottom: 1px solid #f0f2f5; }.v33-list-row em { width: 27px; padding: 3px 0; border-radius: 3px; color: #fff; font-style: normal; text-align: center; font-size: 10px; }.v33-list-row em.is-blue { background: #1678de; }.v33-list-row em.is-red { background: #df2034; }.v33-list-row em.is-green { background: #25a97c; }.v33-list-row em.is-orange { background: #f39a17; }.v33-list-row span, .v33-guide-row span { display: flex; flex-direction: column; min-width: 0; gap: 2px; }.v33-list-row b, .v33-guide-row b { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 500; }.v33-list-row small, .v33-guide-row small { color: #9ba4b1; font-size: 11px; }.v33-guide-row { min-height: 54px; }.v33-guide-row > .dm-icon { flex-shrink: 0; }.v33-guide-row b { font-size: 13px; }
@media (max-width: 900px) { .v33-home { grid-template-columns: 1fr; grid-template-rows: auto; }.v33-notices, .v33-guides { grid-column: 1; }.v33-module-map { grid-template-columns: repeat(4, 1fr); } }

</style>
