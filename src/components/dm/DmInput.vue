<template>
  <!-- 文本域 -->
  <textarea
    v-if="type === 'textarea'"
    :class="textareaClasses"
    :value="modelValue"
    :placeholder="placeholderText"
    :disabled="disabled"
    :readonly="readonly"
    :rows="rows"
    :maxlength="maxLength"
    @input="handleInput"
    @change="handleChange"
    @focus="handleFocus"
    @blur="handleBlur"
    @keydown.enter="handleEnter"
  />

  <!-- 单行输入 -->
  <span v-else :class="wrapperClasses" @mouseenter="hovering = true" @mouseleave="hovering = false">
    <span v-if="hasPrefix" class="dm-input__prefix">
      <slot name="prefix">
        <Icon v-if="prefixIcon" :name="prefixIcon" :size="14" />
        <template v-else>{{ prefix }}</template>
      </slot>
    </span>
    <input
      ref="inputRef"
      class="dm-input__inner"
      :type="innerType"
      :value="modelValue"
      :placeholder="placeholderText"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxLength"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.enter="handleEnter"
    />
    <span v-if="showClear" class="dm-input__clear" role="button" :aria-label="t('common.close')" @click.stop="handleClear">
      <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" aria-hidden="true">
        <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9c-4.4 5.2-.7 13.1 6.1 13.1h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
      </svg>
    </span>
    <span v-if="hasSuffix" class="dm-input__suffix" :class="{ 'is-icon': !!resolvedSuffixIcon }">
      <slot name="suffix">
        <Icon v-if="resolvedSuffixIcon" :name="resolvedSuffixIcon" :size="14" />
        <template v-else>{{ suffix }}</template>
      </slot>
    </span>
  </span>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue';
import { Icon } from '../../layout/icons';
import { useLocale } from '../../composables/useLocale';

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  /** 原生类型：text / password / search / number 等；textarea 单独分支；search 以 text 渲染并自带后置搜索图标 */
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  /** 尺寸：large / middle / small */
  size: { type: String, default: 'middle' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  /** 显示清空图标 */
  allowClear: { type: Boolean, default: false },
  maxLength: { type: Number, default: undefined },
  /** type=textarea 时的行数 */
  rows: { type: Number, default: 3 },
  /** 前缀文本（与 #prefix 插槽二选一，插槽优先） */
  prefix: { type: String, default: '' },
  /** 后缀文本（与 #suffix 插槽二选一，插槽优先） */
  suffix: { type: String, default: '' },
  /** 前缀图标名（layout/icons 的 Icon） */
  prefixIcon: { type: String, default: '' },
  /** 后缀图标名（layout/icons 的 Icon）；type=search 时默认 search */
  suffixIcon: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur', 'pressEnter', 'clear']);

const { t } = useLocale();
const slots = useSlots();

const inputRef = ref(null);
const focused = ref(false);
const hovering = ref(false);

const placeholderText = computed(() => props.placeholder || t('common.pleaseEnter'));
const hasValue = computed(() => props.modelValue !== '' && props.modelValue != null);
const showClear = computed(
  () => props.allowClear && !props.disabled && !props.readonly && hasValue.value && (hovering.value || focused.value)
);

/** search 类型以原生 text 渲染（避免浏览器自带清除按钮等样式干扰），并默认后置搜索图标 */
const isSearch = computed(() => props.type === 'search');
const innerType = computed(() => (isSearch.value ? 'text' : props.type));
const resolvedSuffixIcon = computed(() => props.suffixIcon || (isSearch.value ? 'search' : ''));

const hasPrefix = computed(() => !!slots.prefix || !!props.prefixIcon || !!props.prefix);
const hasSuffix = computed(() => !!slots.suffix || !!resolvedSuffixIcon.value || !!props.suffix);

const wrapperClasses = computed(() => [
  'dm-input',
  `dm-input-${props.size}`,
  {
    'is-disabled': props.disabled,
    'is-focused': focused.value,
    'has-prefix': hasPrefix.value,
  },
]);

const textareaClasses = computed(() => [
  'dm-textarea',
  `dm-input-${props.size}`,
  { 'is-disabled': props.disabled },
]);

function handleInput(e) {
  emit('update:modelValue', e.target.value);
  emit('input', e.target.value, e);
}

function handleChange(e) {
  emit('change', e.target.value, e);
}

function handleFocus(e) {
  focused.value = true;
  emit('focus', e);
}

function handleBlur(e) {
  focused.value = false;
  emit('blur', e);
}

function handleEnter(e) {
  emit('pressEnter', e);
}

function handleClear() {
  emit('update:modelValue', '');
  emit('change', '');
  emit('clear');
  inputRef.value?.focus();
}

defineExpose({ focus: () => inputRef.value?.focus(), blur: () => inputRef.value?.blur() });
</script>

<style scoped>
.dm-input {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  transition: all 0.2s;
}

.dm-input-large { height: 40px; font-size: 16px; border-radius: var(--radius-lg); }
.dm-input-small { height: 24px; font-size: 12px; padding: 2px 7px; border-radius: var(--radius-sm); }

.dm-input:hover:not(.is-disabled) { border-color: var(--brand-hover); }
.dm-input.is-focused:not(.is-disabled) {
  border-color: var(--brand);
  box-shadow: var(--ring);
}

.dm-input.is-disabled {
  color: var(--text-disabled);
  background: var(--bg-dark);
  cursor: not-allowed;
}

/* 内部输入框 */
.dm-input__inner {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  caret-color: var(--text-primary);
}
.dm-input__inner::placeholder { color: var(--text-disabled); }
.dm-input.is-disabled .dm-input__inner { cursor: not-allowed; }

/* 前后缀 */
.dm-input__prefix,
.dm-input__suffix {
  display: inline-flex;
  align-items: center;
  color: var(--text-secondary);
}
.dm-input__prefix { margin-right: 8px; }
.dm-input__suffix { margin-left: 8px; }
/* 图标态后缀（如 search 类型默认搜索图标）颜色更淡 */
.dm-input__suffix.is-icon { color: var(--text-tertiary); }

/* 清空图标 */
.dm-input__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 4px;
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s, color 0.2s;
}
.dm-input:hover .dm-input__clear,
.dm-input.is-focused .dm-input__clear { opacity: 1; pointer-events: auto; }
.dm-input__clear:hover { color: var(--text-secondary); }

/* 文本域 */
.dm-textarea {
  display: block;
  width: 100%;
  min-height: 32px;
  padding: 4px 11px;
  font-size: 14px;
  color: var(--text-primary);
  background: var(--bg-panel);
  border: 1px solid var(--border-main);
  border-radius: var(--radius);
  outline: 0;
  resize: vertical;
  transition: all 0.2s;
}
.dm-textarea::placeholder { color: var(--text-disabled); }
.dm-textarea:hover:not(.is-disabled) { border-color: var(--brand-hover); }
.dm-textarea:focus:not(.is-disabled) {
  border-color: var(--brand);
  box-shadow: var(--ring);
}
.dm-textarea.is-disabled {
  color: var(--text-disabled);
  background: var(--bg-dark);
  cursor: not-allowed;
}
.dm-textarea.dm-input-small { font-size: 12px; padding: 2px 7px; border-radius: var(--radius-sm); }
.dm-textarea.dm-input-large { font-size: 16px; padding: 7px 11px; border-radius: var(--radius-lg); }
</style>
