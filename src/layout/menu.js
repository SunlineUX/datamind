/**
 * 侧边栏菜单配置（按业务区块分组，组间用分隔线划分）
 * - 分组：每组 { key, items }，items 内为菜单项
 * - 菜单项 to：路由地址（挂靠 router 中 AppLayout 的 children），点击跳转；不填则仅高亮
 * - 菜单项 children：二级菜单（最多两级），子项通过 to 挂靠路由
 * - labelKey：文案 key（通用文案在 src/locales，页面文案在 src/locales/pages）
 */
export const menuGroups = [
  {
    key: 'entry',
    items: [
      { key: 'home', icon: 'Home', labelKey: 'layout.nav.home', to: '/home' },
      { key: 'search', icon: 'Search', labelKey: 'layout.nav.search', to: '/search' },
    ],
  },
  {
    key: 'dev',
    items: [
      { key: 'develop', icon: 'Code', labelKey: 'layout.nav.develop', to: '/develop' },
      {
        key: 'ops',
        icon: 'CodeMonitor',
        labelKey: 'layout.nav.ops',
        children: [
          { key: 'ops-realtime', labelKey: 'layout.nav.realtime', to: '/ops/realtime' },
          { key: 'ops-batch', labelKey: 'layout.nav.batch', to: '/ops/batch' },
          { key: 'ops-realtime-monitor', labelKey: 'layout.nav.realtimeMonitor', to: '/ops/realtime-monitor' },
        ],
      },
      { key: 'ops-ai', icon: 'AiGenerate', labelKey: 'layout.nav.ai', to: '/ai' },
    ],
  },
  {
    key: 'asset',
    items: [
      { key: 'workflow', icon: 'Dataflow01', labelKey: 'layout.nav.workflow' },
      { key: 'datasource', icon: 'Database01', labelKey: 'layout.nav.datasource' },
      { key: 'assets', icon: 'LayersThree', labelKey: 'layout.nav.assets' },
    ],
  },
  {
    key: 'system',
    items: [
      { key: 'settings', icon: 'Setting', labelKey: 'layout.nav.settings' },
    ],
  },
];
