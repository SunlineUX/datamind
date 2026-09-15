<template>
  <span
    ref="triggerRef"
    class="dm-popover"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :style="{ width: block ? '100%' : 'auto' }"
  >
    <span :class="block ? 'dm-popover__trigger-full-width' : 'dm-popover__trigger'" @click="handleTriggerClick"><slot /></span>

    <Teleport to="body">
      <!-- :duration 显式指定过渡时长，收起移除不依赖 transitionend 事件 -->
      <Transition name="dm-popover-fade" :duration="150">
        <div
          v-if="visible"
          ref="panelRef"
          class="dm-popover__panel"
          :style="panelStyle"
          role="dialog"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <span class="dm-popover__arrow" :class="[`is-${arrowClass}`]" :style="arrowStyle" />
          <div v-if="$slots.title || title" class="dm-popover__title">
            <slot name="title">{{ title }}</slot>
          </div>
          <div class="dm-popover__inner">
            <slot name="content">{{ content }}</slot>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue';
import { usePopupPosition } from './_util/usePopupPosition';

/**
 * DmPopover —— 气泡卡片
 * 白底卡片（标题 + 内容区）+ 箭头，支持 hover / click 触发，空间不足自动翻转方向。
 *
 * 用法：
 *   <DmPopover title="标题" content="内容"><DmButton>悬浮</DmButton></DmPopover>
 *   <DmPopover trigger="click" placement="right">
 *     <DmButton>点击</DmButton>
 *     <template #content>任意内容</template>
 *   </DmPopover>
 */
const props = defineProps({
  /** 标题（也可用 #title 插槽） */
  title: { type: String, default: '' },
  /** 内容（也可用 #content 插槽） */
  content: { type: String, default: '' },
  /** 触发方式：hover / click */
  trigger: { type: String, default: 'hover' },
  /** 位置：同 DmTooltip 的 12 方向 */
  placement: { type: String, default: 'top' },
  /** 受控显示（传入后内部触发失效） */
  open: { type: Boolean, default: undefined },
  /** 显示延迟（ms，仅 hover） */
  mouseEnterDelay: { type: Number, default: 100 },
  /** 隐藏延迟（ms，仅 hover） */
  mouseLeaveDelay: { type: Number, default: 150 },
  disabled: { type: Boolean, default: false },
  /** 是否全宽显示 */
  block: { type: Boolean, default: false },
});

const emit = defineEmits(['openChange']);

const triggerRef = ref(null);
const inner = ref(false);
let timer = null;

const visible = computed(() => (props.open !== undefined ? !!props.open : inner.value));

const { panelRef, panelStyle, arrowClass, arrowStyle, open: syncOpen, close: syncClose } =
  usePopupPosition(triggerRef, () => ({ placement: props.placement, arrow: true, gap: 4 }));

watch(visible, (v) => {
  emit('openChange', v);
  if (v) syncOpen();
  else syncClose();
});

function clearTimer() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

// ---- hover 触发 ----
function handleMouseEnter() {
  if (props.disabled || props.trigger !== 'hover' || props.open !== undefined) return;
  clearTimer();
  timer = setTimeout(() => { inner.value = true; }, props.mouseEnterDelay);
}

function handleMouseLeave() {
  if (props.trigger !== 'hover' || props.open !== undefined) return;
  clearTimer();
  timer = setTimeout(() => { inner.value = false; }, props.mouseLeaveDelay);
}

// ---- click 触发 ----
function handleTriggerClick() {
  if (props.disabled || props.trigger !== 'click' || props.open !== undefined) return;
  clearTimer();
  inner.value = !inner.value;
}

function handleOutsideMouseDown(e) {
  const trigger = triggerRef.value;
  const panel = panelRef.value;
  if (!trigger?.contains(e.target) && !panel?.contains(e.target)) inner.value = false;
}

function startOutsideListen() {
  document.addEventListener('mousedown', handleOutsideMouseDown);
}

function stopOutsideListen() {
  document.removeEventListener('mousedown', handleOutsideMouseDown);
}

watch(visible, (v) => {
  if (props.trigger === 'click' && props.open === undefined) {
    if (v) startOutsideListen();
    else stopOutsideListen();
  }
});

onBeforeUnmount(() => {
  clearTimer();
  stopOutsideListen();
});
</script>

<style scoped>
.dm-popover {
  display: inline-block;
}

.dm-popover__trigger {
  display: inline-flex;
}

.dm-popover__panel {
  min-width: 160px;
  max-width: 320px;
  padding: 12px;
  font-size: 14px;
  text-align: left;
  background: var(--bg-overlay);
  border: 1px solid var(--border-lighter);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow);
  z-index: calc(var(--z-popup) + 100);
}

.dm-popover__title {
  position: relative;
  padding-bottom: 8px;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-lighter);
}

.dm-popover__inner {
  color: var(--text-secondary);
  line-height: 1.5714;
  word-break: break-all;
}

/* 箭头（border 三角，颜色跟随卡片） */
.dm-popover__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  border-color: transparent;
}
.dm-popover__arrow.is-top { border-width: 0 5px 5px; border-bottom-color: var(--bg-overlay); }
.dm-popover__arrow.is-bottom { border-width: 5px 5px 0; border-top-color: var(--bg-overlay); }
.dm-popover__arrow.is-left { border-width: 5px 0 5px 5px; border-right-color: var(--bg-overlay); }
.dm-popover__arrow.is-right { border-width: 5px 5px 5px 0; border-left-color: var(--bg-overlay); }

/* 淡入 + 轻微缩放动画 */
.dm-popover-fade-enter-active,
.dm-popover-fade-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.dm-popover-fade-enter-from,
.dm-popover-fade-leave-to { opacity: 0; transform: scale(0.96); }
</style>
