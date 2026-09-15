import { ref, computed } from 'vue';
import { locales, DEFAULT_LOCALE } from '../locales';

/**
 * 国际化管理：zh-CN / en-US
 * 所有通用文字统一放在 src/locales 下维护，组件通过 t('a.b.c') 取词。
 * 语言选择持久化到 localStorage，默认跟随浏览器语言。
 */

const LOCALE_STORAGE_KEY = 'dm-locale';

function readStoredLocale() {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && locales[stored]) return stored;
  } catch (e) { /* ignore */ }
  const nav = typeof navigator !== 'undefined' ? navigator.language || '' : '';
  return nav.toLowerCase().startsWith('zh') ? 'zh-CN' : DEFAULT_LOCALE;
}

// 模块级共享状态（所有组件共用同一份）
const locale = ref(readStoredLocale());
document.documentElement.setAttribute('lang', locale.value);

function lookup(dict, key) {
  return key.split('.').reduce((obj, k) => (obj != null && obj[k] !== undefined ? obj[k] : undefined), dict);
}

function persistLocale(value) {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, value);
  } catch (e) { /* ignore */ }
}

export function useLocale() {
  const messages = computed(() => locales[locale.value] || locales[DEFAULT_LOCALE]);

  /**
   * 取翻译：t('components.button.title')，支持参数插值 t('ai.attachmentCount', { n: 2 })
   * 当前语言缺失时回退到默认语言，再缺失返回 key 本身。
   */
  function t(key, params) {
    let value = lookup(messages.value, key) ?? lookup(locales[DEFAULT_LOCALE], key);
    if (value === undefined) return key;
    if (params && typeof value === 'string') {
      value = value.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));
    }
    return value;
  }

  function setLocale(value) {
    if (!locales[value]) return;
    locale.value = value;
    document.documentElement.setAttribute('lang', value);
    persistLocale(value);
  }

  return {
    locale,
    messages,
    t,
    setLocale,
    localeCodes: Object.keys(locales),
  };
}
