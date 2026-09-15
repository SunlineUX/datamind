<template>
  <button
    :class="classes"
    :type="nativeType"
    :disabled="mergedDisabled"
    @click="handleClick"
  >
    <span v-if="loading" class="dm-btn__loading" aria-hidden="true" />
    <slot v-else name="icon" />
    <span v-if="$slots.default" class="dm-btn__content"><slot /></span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  /** 按钮类型：primary / default / dashed / text / link */
  type: { type: String, default: 'default' },
  /** 尺寸：large / middle / small */
  size: { type: String, default: 'middle' },
  /** 危险按钮 */
  danger: { type: Boolean, default: false },
  /** 加载中 */
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** 宽度撑满父容器 */
  block: { type: Boolean, default: false },
  nativeType: { type: String, default: 'button' },
});

const emit = defineEmits(['click']);

const mergedDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() => [
  'dm-btn',
  `dm-btn-${props.type}`,
  `dm-btn-${props.size}`,
  {
    'is-danger': props.danger,
    'is-loading': props.loading,
    'is-disabled': mergedDisabled.value,
    'is-block': props.block,
  },
]);

function handleClick(e) {
  if (mergedDisabled.value) {
    e.preventDefault();
    return;
  }
  emit('click', e);
}
</script>

<style scoped>
.dm-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  padding: 4px 15px;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  user-select: none;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: var(--radius);
  color: var(--text-primary);
  background: var(--bg-panel);
  border-color: var(--border-main);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.02);
  transition: all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 尺寸 */
.dm-btn-large { height: 40px; padding: 6.43px 15px; font-size: 16px; border-radius: var(--radius-lg); }
.dm-btn-small { height: 24px; padding: 0 7px; font-size: 12px; border-radius: var(--radius-sm); }

/* 主要按钮 */
.dm-btn-primary {
  color: var(--text-on-primary);
  background: var(--brand);
  border-color: var(--brand);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--brand) 12%, transparent);
}
.dm-btn-primary:hover { background: var(--brand-hover); border-color: var(--brand-hover); }
.dm-btn-primary:active { background: var(--brand-active); border-color: var(--brand-active); }
.dm-btn-secondary {
  color: var(--text-primary);
  background: var(--btn-sub);
  border-color: var(--btn-sub);
  box-shadow: 0 2px 0 color-mix(in srgb, var(--btn-sub) 12%, transparent);
}
.dm-btn-secondary:hover { background: var(--brand-light); border-color: var(--brand-light); color: var(--brand); }
.dm-btn-secondary:active { background: var(--brand-focus); border-color: var(--brand-focus); color: var(--brand); }

/* 虚线按钮 */
.dm-btn-dashed { border-style: dashed; }

/* 文本按钮 / 链接按钮 */
.dm-btn-text,
.dm-btn-link {
  height: auto;
  padding: 4px 8px;
  box-shadow: none;
  background: transparent;
  border-color: transparent;
}
.dm-btn-text { color: var(--text-primary); }
.dm-btn-link { color: var(--brand); height: 32px; }

.dm-btn-text:hover { background: var(--bg-hover); }
.dm-btn-dashed:hover,
.dm-btn-default:hover,
.dm-btn-link:hover { color: var(--brand-hover); border-color: var(--brand-hover); }
.dm-btn-text:hover { color: var(--text-primary); border-color: transparent; }

.dm-btn-dashed:active,
.dm-btn-default:active,
.dm-btn-link:active { color: var(--brand-active); border-color: var(--brand-active); }

/* 危险按钮 */
.dm-btn.is-danger.dm-btn-primary { color: var(--text-on-primary); background: var(--error); border-color: var(--error); box-shadow: 0 2px 0 color-mix(in srgb, var(--error) 12%, transparent); }
.dm-btn.is-danger.dm-btn-primary:hover { background: var(--error-hover); border-color: var(--error-hover); }
.dm-btn.is-danger.dm-btn-primary:active { background: var(--error-active); border-color: var(--error-active); }
.dm-btn.is-danger.dm-btn-default,
.dm-btn.is-danger.dm-btn-dashed { color: var(--error); border-color: var(--error); box-shadow: none; }
.dm-btn.is-danger.dm-btn-default:hover,
.dm-btn.is-danger.dm-btn-dashed:hover { color: var(--error-hover); border-color: var(--error-hover); }
.dm-btn.is-danger.dm-btn-text,
.dm-btn.is-danger.dm-btn-link { color: var(--error); border-color: transparent; box-shadow: none; }
.dm-btn.is-danger.dm-btn-text:hover { color: var(--error); background: var(--bg-hover); }
.dm-btn.is-danger.dm-btn-link:hover { color: var(--error-hover); }

/* 禁用 */
.dm-btn.is-disabled,
.dm-btn.is-disabled:hover,
.dm-btn.is-disabled:active {
  cursor: not-allowed;
  color: var(--text-disabled);
  background: var(--bg-dark);
  border-color: var(--border-main);
  box-shadow: none;
}
.dm-btn.is-danger.is-disabled,
.dm-btn.is-danger.is-disabled:hover { color: var(--text-disabled); background: var(--bg-dark); border-color: var(--border-main); }
.dm-btn-text.is-disabled,
.dm-btn-link.is-disabled,
.dm-btn-text.is-disabled:hover,
.dm-btn-link.is-disabled:hover { background: transparent; border-color: transparent; }

/* 焦点 */
.dm-btn:not(.is-disabled):focus-visible {
  outline: 0;
  box-shadow: var(--ring);
}

/* 块级 */
.dm-btn.is-block { display: flex; width: 100%; }

/* 加载动画 */
.dm-btn__loading {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: dm-btn-spin 0.6s linear infinite;
}
.dm-btn__content { display: flex; align-items: center; gap: 2px }

@keyframes dm-btn-spin {
  to { transform: rotate(360deg); }
}
</style>
