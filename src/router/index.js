import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '../layout/AppLayout.vue';
import HomeView from '../views/AIVersion/HomeView.vue';
import PlaceholderView from '../views/AIVersion/PlaceholderView.vue';
import { useLocale } from '../composables/useLocale';

const routes = [
  {
    path: '/',
    component: AppLayout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomeView,
        meta: { titleKey: 'app.title' }
      },
      // 侧边栏二级菜单页面（菜单配置见 src/layout/menu.js）
      {
        path: 'ops/realtime',
        name: 'ops-realtime',
        component: PlaceholderView,
        meta: { titleKey: 'layout.nav.realtime' }
      },
      {
        path: 'ops/batch',
        name: 'ops-batch',
        component: PlaceholderView,
        meta: { titleKey: 'layout.nav.batch' }
      },
      {
        path: 'ops/realtime-monitor',
        name: 'ops-realtime-monitor',
        component: () => import('../views/AIVersion/RealtimeMonitor.vue'),
        meta: { titleKey: 'layout.nav.realtimeMonitor' }
      },
      {
        path: 'ai',
        name: 'ai',
        component: () => import('../views/AIVersion/AiPanelView.vue'),
        meta: { titleKey: 'layout.nav.ai' }
      },
      {
        path: 'develop',
        name: 'develop',
        component: () => import('../views/AIVersion/Develop.vue'),
        meta: { titleKey: 'layout.nav.develop' }
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('../views/AIVersion/Search.vue'),
        meta: { titleKey: 'layout.nav.search' }
      },
      // {
      //   path: 'design',
      //   name: 'components',
      //   component: () => import('../views/ComponentsView.vue'),
      //   meta: { titleKey: 'components.title' }
      // }
    ]
  },
  {
    path: '/design',
    name: 'components',
    component: () => import('../views/ComponentsView.vue'),
    meta: { titleKey: 'components.title' }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.afterEach((to) => {
  const { t } = useLocale();
  document.title = t(to.meta.titleKey || 'app.title');
});

export default router;
