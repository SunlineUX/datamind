<template>
  <span
    ref="triggerRef"
    class="dm-dropdown"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown.esc="closePanel"
  >
    <span class="dm-dropdown__trigger" @click="handleTriggerClick"><slot /></span>

    <Teleport to="body">
      <Transition name="dm-dropdown-slide">
        <div
          v-if="open"
          ref="panelRef"
          class="dm-dropdown__panel"
          :style="panelStyle"
          role="menu"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <slot name="overlay">
            <template v-for="item in menu" :key="item.key">
              <div v-if="item.divided" class="dm-dropdown__divider" role="separator" />
              <div
                :class="itemClasses(item)"
                role="menuitem"
                :aria-disabled="item.disabled"
                @click="handleItemClick(item)"
              >
                {{ item.label }}
              </div>
            </template>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup>
import { onBeforeUnmount, ref } from 'vue';
import { usePopupPosition } from './_util/usePopupPosition';

const props = defineProps({
  /** 菜单项：[{ key, label, disabled?, danger?, divided? }] */
  menu: { type: Array, default: () => [] },
  /** 触发方式：hover / click */
  trigger: { type: String, default: 'hover' },
  /** 浮层位置：bottomLeft / bottomCenter / bottomRight / topLeft / topCenter / topRight */
  placement: { type: String, default: 'bottomLeft' },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['click', 'openChange']);

const triggerRef = ref(null);
const open = ref(false);
let closeTimer = null;

const { panelRef, panelStyle, open: syncOpen, close: syncClose } = usePopupPosition(
  triggerRef,
  () => ({ placement: props.placement, matchWidth: false })
);

function setOpen(visible) {
  if (open.value === visible) return;
  open.value = visible;
  emit('openChange', visible);
  // 外点关闭仅 click 触发需要（hover 移出即关闭）
  if (visible && props.trigger === 'click') startOutsideListen();
  if (!visible) stopOutsideListen();
  if (visible) syncOpen();
  else syncClose();
}

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

function handleMouseEnter() {
  clearCloseTimer();
  if (props.trigger === 'hover' && !props.disabled) setOpen(true);
}

function handleMouseLeave() {
  if (props.trigger !== 'hover') return;
  clearCloseTimer();
  closeTimer = setTimeout(() => setOpen(false), 150);
}

function handleTriggerClick() {
  if (props.disabled) return;
  if (props.trigger !== 'click') return;
  setOpen(!open.value);
}

function handleItemClick(item) {
  if (item.disabled) return;
  emit('click', item.key, item);
  if (props.trigger === 'click') setOpen(false);
}

function closePanel() {
  setOpen(false);
}

function itemClasses(item) {
  return [
    'dm-dropdown__menu-item',
    { 'is-disabled': !!item.disabled, 'is-danger': !!item.danger },
  ];
}

function handleOutsideMouseDown(e) {
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger?.contains(e.target) && !panel?.contains(e.target)) setOpen(false);
}

function startOutsideListen() {
  document.addEventListener('mousedown', handleOutsideMouseDown);
}

function stopOutsideListen() {
  document.removeEventListener('mousedown', handleOutsideMouseDown);
}

onBeforeUnmount(() => {
  clearCloseTimer();
  stopOutsideListen();
});
</script>

<style scoped>
.dm-dropdown {
  display: inline-block;
}

.dm-dropdown__trigger {
  display: inline-flex;
}

.dm-dropdown__panel {
  min-width: 120px;
  padding: 4px;
  background: var(--bg-overlay);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  z-index: var(--z-popup);
}

.dm-dropdown__menu-item {
  padding: 5px 12px;
  font-size: 14px;
  line-height: 22px;
  color: var(--text-primary);
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.dm-dropdown__menu-item:hover { background: var(--bg-hover); }

.dm-dropdown__menu-item.is-danger { color: var(--error); }
.dm-dropdown__menu-item.is-danger:hover { background: var(--bg-hover); }

.dm-dropdown__menu-item.is-disabled {
  color: var(--text-disabled);
  cursor: not-allowed;
}
.dm-dropdown__menu-item.is-disabled:hover { background: transparent; }

.dm-dropdown__divider {
  height: 1px;
  margin: 4px 0;
  background: var(--border-lighter);
}

/* 展开动画 */
.dm-dropdown-slide-enter-active,
.dm-dropdown-slide-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dm-dropdown-slide-enter-from,
.dm-dropdown-slide-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
