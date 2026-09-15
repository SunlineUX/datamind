import { ref, computed } from 'vue';

/**
 * 主题管理：light（浅色）/ dark（深色）/ system（跟随系统）
 * 通过在 <html> 上设置 data-theme="light|dark" 驱动 CSS 变量切换，
 * 选择持久化到 localStorage。
 */

const THEME_STORAGE_KEY = 'dm-theme';
const THEME_MODES = ['light', 'dark', 'system'];

function readStoredMode() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_MODES.includes(stored) ? stored : 'system';
  } catch (e) {
    return 'system';
  }
}

// 模块级共享状态（所有组件共用同一份）
const themeMode = ref(readStoredMode());
const systemPrefersDark = ref(
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false
);

let initialized = false;

function applyTheme() {
  const resolved =
    themeMode.value === 'system'
      ? (systemPrefersDark.value ? 'dark' : 'light')
      : themeMode.value;
  document.documentElement.setAttribute('data-theme', resolved);
  document.documentElement.style.colorScheme = resolved;
}

function watchSystemTheme() {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e) => {
    systemPrefersDark.value = e.matches;
    if (themeMode.value === 'system') applyTheme();
  };
  if (media.addEventListener) media.addEventListener('change', handler);
  else if (media.addListener) media.addListener(handler); // 兼容旧版 Safari
}

function persistMode(mode) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch (e) { /* ignore */ }
}

export function useTheme() {
  if (!initialized) {
    watchSystemTheme();
    applyTheme();
    initialized = true;
  }

  // 实际生效的主题（system 会被解析为 light/dark）
  const resolvedTheme = computed(() =>
    themeMode.value === 'system'
      ? (systemPrefersDark.value ? 'dark' : 'light')
      : themeMode.value
  );

  function setTheme(mode) {
    if (!THEME_MODES.includes(mode)) return;
    themeMode.value = mode;
    persistMode(mode);
    applyTheme();
  }

  return {
    themeMode,
    resolvedTheme,
    setTheme,
    themeModes: THEME_MODES,
  };
}
