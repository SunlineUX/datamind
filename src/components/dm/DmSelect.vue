<template>
  <div
    ref="triggerRef"
    :class="selectClasses"
    :tabindex="showSearch && open ? -1 : 0"
    role="combobox"
    :aria-expanded="open"
    :aria-disabled="disabled"
    @click="handleTriggerClick"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    @keydown="handleKeydown"
  >
    <div class="dm-select__selector">
      <!-- 可搜索：打开时输入 -->
      <input
        v-if="showSearch && open"
        ref="searchRef"
        v-model="searchQuery"
        class="dm-select__search"
        :placeholder="selectedOption ? selectedOption.label : placeholderText"
        :disabled="disabled"
        @keydown.stop="handleKeydown"
      />
      <template v-else>
        <span v-if="selectedOption" class="dm-select__value">{{ selectedOption.label }}</span>
        <span v-else class="dm-select__placeholder">{{ placeholderText }}</span>
      </template>

      <!-- 清空 -->
      <span v-if="showClear" class="dm-select__clear" role="button" :aria-label="t('common.close')" @click.stop="handleClear">
        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
        </svg>
      </span>
      <!-- 箭头 -->
      <span v-else class="dm-select__arrow" :class="{ 'is-open': open }" aria-hidden="true">
        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
        </svg>
      </span>
    </div>

    <!-- 下拉面板 -->
    <Teleport to="body">
      <Transition name="dm-select-slide">
        <div
          v-if="open"
          ref="panelRef"
          class="dm-select__dropdown"
          :style="panelStyle"
          role="listbox"
          @mousedown.prevent
        >
          <div
            v-for="(option, index) in filteredOptions"
            :key="option.value"
            :class="optionClasses(option, index)"
            role="option"
            :aria-selected="option.value === modelValue"
            @mouseenter="activeIndex = index"
            @click="handleOptionClick(option)"
          >
            <span class="dm-select__option-label">{{ option.label }}</span>
            <span v-if="option.value === modelValue" class="dm-select__option-check" aria-hidden="true">
              <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474a32 32 0 00-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 37.4 16.2 50.3 0l488.4-618.9c4.1-5.1.4-12.8-6.3-12.8z" />
              </svg>
            </span>
          </div>
          <div v-if="!filteredOptions.length" class="dm-select__empty">{{ t('common.noData') }}</div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useLocale } from '../../composables/useLocale';
import { usePopupPosition } from './_util/usePopupPosition';

const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: undefined },
  /** 选项：[{ label, value, disabled? }] */
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  /** 尺寸：large / middle / small */
  size: { type: String, default: 'middle' },
  disabled: { type: Boolean, default: false },
  /** 显示清空图标 */
  allowClear: { type: Boolean, default: false },
  /** 可搜索（按 label 过滤） */
  showSearch: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue', 'change', 'clear', 'openChange']);

const { t } = useLocale();

const triggerRef = ref(null);
const searchRef = ref(null);
const open = ref(false);
const searchQuery = ref('');
const activeIndex = ref(-1);
const hovering = ref(false);

const { panelRef, panelStyle, open: syncOpen, close: syncClose } = usePopupPosition(
  triggerRef,
  () => ({ placement: 'bottomLeft', matchWidth: true })
);

const placeholderText = computed(() => props.placeholder || t('common.pleaseSelect'));
const selectedOption = computed(() => props.options.find((o) => o.value === props.modelValue));
const hasValue = computed(() => props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== '');
const showClear = computed(() => props.allowClear && hasValue.value && !props.disabled && hovering.value);

const filteredOptions = computed(() => {
  if (!props.showSearch || !searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter((o) => String(o.label).toLowerCase().includes(query));
});

const selectClasses = computed(() => [
  'dm-select',
  `dm-select-${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-open': open.value,
    'is-searching': props.showSearch && open.value,
  },
]);

function optionClasses(option, index) {
  return [
    'dm-select__option',
    {
      'is-selected': option.value === props.modelValue,
      'is-active': index === Math.min(activeIndex.value, filteredOptions.value.length - 1),
      'is-disabled': !!option.disabled,
    },
  ];
}

watch(() => props.disabled, (disabled) => { if (disabled && open.value) setOpen(false); });

watch(searchQuery, () => { activeIndex.value = 0; });

watch(activeIndex, (index) => {
  nextTick(() => {
    const panel = panelRef.value;
    if (!panel) return;
    const el = panel.children[index];
    el?.scrollIntoView?.({ block: 'nearest' });
  });
});

function setOpen(visible) {
  if (open.value === visible) return;
  open.value = visible;
  emit('openChange', visible);
  if (visible) {
    // 默认定位到当前选中项
    const currentIndex = props.options.findIndex((o) => o.value === props.modelValue);
    activeIndex.value = currentIndex >= 0 ? currentIndex : 0;
    searchQuery.value = '';
    syncOpen();
  } else {
    syncClose();
  }
}

function handleTriggerClick() {
  if (props.disabled) return;
  setOpen(!open.value);
  if (open.value && props.showSearch) nextTick(() => searchRef.value?.focus());
}

function handleKeydown(e) {
  if (props.disabled) return;
  const { key } = e;
  if (!open.value) {
    if (key === 'Enter' || key === ' ' || key === 'ArrowDown') {
      e.preventDefault();
      handleTriggerClick();
    }
    return;
  }
  if (key === 'Escape') {
    e.preventDefault();
    setOpen(false);
    triggerRef.value?.focus();
  } else if (key === 'ArrowDown' || key === 'ArrowUp') {
    e.preventDefault();
    const len = filteredOptions.value.length;
    if (!len) return;
    const step = key === 'ArrowDown' ? 1 : -1;
    let next = Math.min(activeIndex.value, len - 1);
    for (let i = 0; i < len; i++) {
      next = (next + step + len) % len;
      if (!filteredOptions.value[next].disabled) break;
    }
    activeIndex.value = next;
  } else if (key === 'Enter') {
    e.preventDefault();
    const option = filteredOptions.value[activeIndex.value];
    if (option && !option.disabled) selectOption(option);
  }
}

function handleOptionClick(option) {
  if (option.disabled) return;
  selectOption(option);
}

function selectOption(option) {
  emit('update:modelValue', option.value);
  emit('change', option.value, option);
  setOpen(false);
  triggerRef.value?.focus();
}

function handleClear() {
  emit('update:modelValue', undefined);
  emit('change', undefined);
  emit('clear');
}
</script>

<style scoped>
.dm-select {
  position: relative;
  display: inline-block;
  width: 100%;
  min-width: 0;
  outline: 0;
  cursor: pointer;
}

.dm-select__selector {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 11px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  transition: all 0.2s;
}

.dm-select-large .dm-select__selector { height: 40px; font-size: 16px; }
.dm-select-small .dm-select__selector { height: 24px; font-size: 12px; }

.dm-select:hover:not(.is-disabled) .dm-select__selector { border-color: var(--brand-hover); }
.dm-select.is-focused:not(.is-disabled) .dm-select__selector,
.dm-select:focus-visible:not(.is-disabled) .dm-select__selector {
  border-color: var(--brand);
  box-shadow: var(--ring);
}
.dm-select.is-open:not(.is-disabled) .dm-select__selector {
  border-color: var(--brand);
  box-shadow: var(--ring);
}

.dm-select.is-disabled { cursor: not-allowed; }
.dm-select.is-disabled .dm-select__selector {
  color: var(--text-disabled);
  background: var(--bg-dark);
  cursor: not-allowed;
}

/* 选中值 / 占位 */
.dm-select__value,
.dm-select__placeholder {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.dm-select__placeholder { color: var(--text-disabled); }
.dm-select.is-disabled .dm-select__value { color: var(--text-disabled); }

/* 搜索输入 */
.dm-select__search {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  caret-color: var(--text-primary);
}
.dm-select__search::placeholder { color: var(--text-disabled); }

/* 箭头 / 清空 */
.dm-select__arrow,
.dm-select__clear {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
  transition: color 0.2s, transform 0.2s;
}
.dm-select__arrow.is-open { transform: rotate(180deg); }
.dm-select__clear { cursor: pointer; }
.dm-select__clear:hover { color: var(--text-secondary); }

/* 下拉面板 */
.dm-select__dropdown {
  max-height: 256px;
  padding: 4px;
  overflow-y: auto;
  background: var(--bg-overlay);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: var(--z-popup);
}

.dm-select__option {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 24px;
  padding: 5px 12px;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.dm-select__option:hover,
.dm-select__option.is-active { background: var(--bg-hover); }
.dm-select__option.is-selected {
  color: var(--brand);
  background: transparent;
  font-weight: 600;
}
.dm-select__option.is-selected:hover { background: var(--bg-hover); }
.dm-select__option.is-disabled { color: var(--text-disabled); cursor: not-allowed; }
.dm-select__option.is-disabled:hover { background: transparent; }

.dm-select__option-label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dm-select__option-check { display: inline-flex; font-size: 12px; }

.dm-select__empty {
  padding: 12px 0;
  font-size: 14px;
  color: var(--text-tertiary);
  text-align: center;
}

/* 展开动画 */
.dm-select-slide-enter-active,
.dm-select-slide-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dm-select-slide-enter-from,
.dm-select-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
