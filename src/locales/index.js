import zhCN from './zh-CN';
import enUS from './en-US';

// 各页面文案独立维护，在此汇总合并
import homeZh from './pages/home/page-zh-CN';
import homeEn from './pages/home/page-en-US';
import componentsZh from './pages/components/page-zh-CN';
import componentsEn from './pages/components/page-en-US';
import developZh from './pages/develop/page-zh-CN';
import developEn from './pages/develop/page-en-US';

/** 全部语言包（通用文案在 zh-CN/en-US 维护，页面文案在 pages/<页面>/page-*.js 维护） */
export const locales = {
  'zh-CN': { ...zhCN, ...homeZh, ...componentsZh, ...developZh },
  'en-US': { ...enUS, ...homeEn, ...componentsEn, ...developEn },
};

/** 语言展示名（始终以该语言自身显示，不随当前语言变化） */
export const LANGUAGE_NAMES = {
  'zh-CN': '中文',
  'en-US': 'English',
};

export const DEFAULT_LOCALE = 'zh-CN';
