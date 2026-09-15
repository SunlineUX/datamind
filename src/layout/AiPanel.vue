<template>
  <aside
    ref="aiRef"
    class="dm-ai"
    :class="{ 'is-resizing': isResizing }"
    :style="panelStyle"
  >
    <!-- 调整宽度手柄（仅在左侧，因 AiPanel 固定在右边缘） -->
    <div
      class="dm-ai__handle"
      @mousedown="handleMouseDown"
    >
      <span class="dm-ai__handle-bar"></span>
    </div>
    <!-- 头部 -->
    <header class="dm-ai__header">
      <span class="dm-ai__brand">Nova</span>
      <div class="dm-ai__actions">
        <button class="dm-icon-btn"><Icon name="maximize" :size="14" /></button>
        <button class="dm-icon-btn"><Icon name="clock" :size="14" /></button>
        <button class="dm-icon-btn" @click="emit('collapse')">
          <Icon name="x" :size="14" />
        </button>
      </div>
    </header>

    <!-- 消息列表 -->
    <div ref="bodyRef" class="dm-ai__body">
      <template v-for="msg in messages" :key="msg.id">
        <!-- 用户消息 -->
        <div v-if="msg.role === 'user'" class="dm-ai__user-row">
          <div class="dm-ai__user-bubble">
            <div v-if="msg.attachments?.length" class="dm-ai__attachments">
              <div v-for="att in msg.attachments" :key="att" class="dm-ai__attachment">
                <Icon name="file-text" :size="13" />
                <span class="dm-ai__attachment-name">{{ tr(att) }}</span>
                <span class="dm-ai__attachment-count">{{ t('ai.attachmentCount', { n: msg.attachments.length }) }}</span>
              </div>
            </div>
            <p class="dm-ai__user-text">{{ tr(msg.textKey || msg.text) }}</p>
          </div>
        </div>

        <!-- 助手消息 -->
        <div v-else class="dm-ai__msg">
          <!-- 深度思考 -->
          <div v-if="msg.thinkingKey" class="dm-ai__thinking">
            <button class="dm-ai__thinking-toggle" @click="msg.thinkingOpen = !msg.thinkingOpen">
              {{ t('ai.thinking') }}
              <span :class="['dm-ai__chevron', { 'is-open': msg.thinkingOpen }]">
                <Icon name="chevron-up" :size="12" />
              </span>
            </button>
            <p v-show="msg.thinkingOpen" class="dm-ai__thinking-summary">{{ tr(msg.thinkingKey) }}</p>
          </div>

          <!-- 内容块 -->
          <template v-for="(block, i) in msg.blocks" :key="i">
            <!-- 文本 -->
            <p v-if="block.type === 'text'" class="dm-ai__text">{{ tr(block.textKeys) }}</p>

            <!-- 命令执行卡片 -->
            <div v-else-if="block.type === 'command'" class="dm-ai__card">
              <button class="dm-ai__card-header" @click="block.open = !block.open">
                <Icon name="terminal" :size="13" />
                <span class="dm-ai__card-title">{{ t('ai.command') }}</span>
                <span :class="['dm-ai__chevron', { 'is-open': block.open }]">
                  <Icon name="chevron-up" :size="12" />
                </span>
              </button>
              <div v-show="block.open" class="dm-ai__card-body">
                <div class="dm-ai__command">
                  <code>{{ block.command }}</code>
                  <button class="dm-icon-btn dm-ai__copy" @click="copyCommand(block)">
                    <Icon :name="copied === block ? 'check' : 'copy'" :size="13" />
                  </button>
                </div>
              </div>
            </div>

            <!-- 执行成功卡片 -->
            <div v-else-if="block.type === 'success'" class="dm-ai__card">
              <button class="dm-ai__card-header" @click="block.open = !block.open">
                <Icon name="check-circle" :size="13" class="is-success" />
                <span class="dm-ai__card-title">{{ t('ai.success') }}</span>
                <span :class="['dm-ai__chevron', { 'is-open': block.open }]">
                  <Icon name="chevron-up" :size="12" />
                </span>
              </button>
              <div v-show="block.open" class="dm-ai__card-body">
                <p class="dm-ai__success-title">{{ tr(block.titleKey) }}</p>
                <p class="dm-ai__success-desc">{{ tr(block.descKey) }}</p>
                <div class="dm-ai__filelist">
                  <code v-for="f in block.files" :key="f">{{ f }}</code>
                </div>
              </div>
            </div>

            <!-- 生成文件列表 -->
            <div v-else-if="block.type === 'files'" class="dm-ai__files">
              <p class="dm-ai__files-note">{{ tr(block.noteKey) }}</p>
              <div v-for="(f, fi) in block.items" :key="fi" class="dm-ai__file-row">
                <Icon name="file" :size="14" class="dm-ai__file-row-icon" />
                <span class="dm-ai__file-name">{{ tr(f.nameKey) }}</span>
                <span class="dm-ai__file-space">{{ tr(f.spaceKey) }}</span>
                <span class="dm-ai__diff is-add">+{{ f.added }}</span>
                <span class="dm-ai__diff is-del">-{{ f.removed }}</span>
                <Icon name="chevron-right" :size="13" class="dm-ai__file-arrow" />
              </div>
            </div>
          </template>
        </div>
      </template>
    </div>

    <!-- 底部输入区 -->
    <footer class="dm-ai__footer">
      <div v-if="pendingVisible" class="dm-ai__pending">
        <Icon name="swap" :size="13" />
        <span class="dm-ai__pending-text">{{ t('ai.generatedFiles', { n: pendingCount }) }}</span>
        <button class="dm-icon-btn" @click="pendingVisible = false"><Icon name="x" :size="13" /></button>
        <button class="dm-ai__pending-confirm" @click="pendingVisible = false">
          <Icon name="check" :size="14" />
        </button>
      </div>

      <div class="dm-ai__input">
        <textarea
          v-model="input"
          class="dm-ai__textarea"
          :placeholder="t('ai.inputPlaceholder')"
          rows="2"
          @keydown="handleKeydown"
        />
        <div class="dm-ai__input-bar">
          <div class="dm-ai__input-left">
            <button class="dm-icon-btn"><Icon name="paperclip" :size="14" /></button>
            <button class="dm-icon-btn"><Icon name="at" :size="14" /></button>
            <button class="dm-icon-btn"><Icon name="hash" :size="14" /></button>
          </div>
          <div class="dm-ai__input-right">
            <span class="dm-ai__plan">
              <Icon name="compass" :size="12" />
              {{ t('ai.plan') }}
            </span>
            <DmDropdown :menu="modelMenu" trigger="click" placement="topRight" @click="model = $event">
              <button class="dm-ai__model">
                {{ model }}
                <Icon name="chevron-down" :size="11" />
              </button>
            </DmDropdown>
            <button class="dm-ai__send" @click="handleSend">
              <Icon name="send" :size="14" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  </aside>
</template>

<script setup>
import { nextTick, ref, onMounted, onBeforeUnmount } from 'vue';
import DmDropdown from '../components/dm/DmDropdown.vue';
import { Icon } from './icons';
import { useLocale } from '../composables/useLocale';

const emit = defineEmits(['collapse', 'send', 'resize']);

const { t } = useLocale();

const bodyRef = ref(null);
const input = ref('');
const copied = ref(null);
const model = ref('GLM-5.2');
const pendingVisible = ref(true);
const pendingCount = ref(2);

const modelMenu = [
  { key: 'GLM-5.2', label: 'GLM-5.2' },
  { key: 'GLM-5.3', label: 'GLM-5.3' },
  { key: 'DM CLI Agent', label: 'DM CLI Agent' },
];

// ===== 宽度可拖拽 =====
const MIN_WIDTH = 280;   // 最小宽度
const MAX_WIDTH = 640;   // 最大宽度
const DEFAULT_WIDTH = 400;
const LS_KEY = 'dm-ai.panelWidth';

const isResizing = ref(false);
const aiRef = ref(null);
let startX = 0;
let startWidth = 0;
let currentWidth = DEFAULT_WIDTH;

function loadWidth() {
  try {
    const saved = parseInt(localStorage.getItem(LS_KEY), 10);
    if (!isNaN(saved)) currentWidth = clamp(saved);
  } catch (e) { /* ignore */ }
}
function clamp(w) { return Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, w)); }

// 面板动态宽度样式
const panelStyle = ref({ width: `${clamp(currentWidth)}px` });

function handleMouseDown(e) {
  e.preventDefault();
  e.stopPropagation();
  isResizing.value = true;
  startX = e.clientX;
  startWidth = aiRef.value ? aiRef.value.getBoundingClientRect().width : currentWidth;
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  document.addEventListener('mouseleave', handleMouseUp);
  document.body.style.userSelect = 'none';
  document.body.style.cursor = 'col-resize';
}

function handleMouseMove(e) {
  if (!isResizing.value) return;
  // 向左拖动减少宽度（AiPanel 固定在右侧，左边界调整）
  const delta = startX - e.clientX;
  const newWidth = clamp(startWidth + delta);
  currentWidth = newWidth;
  panelStyle.value.width = `${newWidth}px`;
  emit('resize', newWidth);
}

function handleMouseUp() {
  if (!isResizing.value) return;
  isResizing.value = false;
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
  try { localStorage.setItem(LS_KEY, String(currentWidth)); } catch (e) { /* ignore */ }
}

let uid = 0;

// 初始演示消息（存翻译 key，语言切换时实时取词）
const messages = ref([
  {
    id: ++uid,
    role: 'user',
    textKey: 'ai.demo.userText',
    attachments: ['ai.demo.attachment'],
  },
  {
    id: ++uid,
    role: 'assistant',
    thinkingKey: 'ai.demo.thinkingSummary',
    thinkingOpen: false,
    blocks: [
      { type: 'text', textKeys: ['ai.demo.thinkingNext'] },
      {
        type: 'command',
        open: true,
        command: "/bin/bash -lc 'cat $AIS_AGENT_HOME/skills/dm-sop/SKILL.md'",
      },
      {
        type: 'text',
        textKeys: ['ai.demo.spaceLine1', 'ai.demo.spaceLine2'],
      },
      {
        type: 'success',
        open: true,
        titleKey: 'ai.demo.successTitle',
        descKey: 'ai.demo.successDesc',
        files: ['AGENTS.md', 'knowledge-base', 'scripts', 'sop'],
      },
      {
        type: 'files',
        noteKey: 'ai.demo.resultNote',
        items: [
          { nameKey: 'ai.demo.file1', spaceKey: 'ai.space', added: 43, removed: 0 },
          { nameKey: 'ai.demo.file2', spaceKey: 'ai.space', added: 368, removed: 0 },
        ],
      },
    ],
  },
]);

// key（或 key 数组）→ 翻译文本；普通文本原样返回
function tr(value) {
  if (value == null) return '';
  if (Array.isArray(value)) return value.map((k) => t(k)).join('');
  return value.includes('.') ? t(value) : value;
}

function scrollToBottom() {
  nextTick(() => {
    const el = bodyRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

function handleSend() {
  const text = input.value.trim();
  if (!text) return;
  messages.value.push({ id: ++uid, role: 'user', text, attachments: [] });
  input.value = '';
  scrollToBottom();
  emit('send', text);
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSend();
  }
}

async function copyCommand(block) {
  try {
    await navigator.clipboard.writeText(block.command);
    copied.value = block;
    setTimeout(() => { copied.value = null; }, 1500);
  } catch (e) { /* ignore */ }
}

onMounted(() => {
  loadWidth();
  panelStyle.value.width = `${currentWidth}px`;
});

// 组件卸载时清理：还原 body 样式 + 移除监听
onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  document.removeEventListener('mouseleave', handleMouseUp);
  document.body.style.userSelect = '';
  document.body.style.cursor = '';
});
</script>

<style scoped>
.dm-ai {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: relative;
  height: 100%;
  transition: background-color 0.2s ease;
}

/* 拖拽中关闭过渡，避免拖动手柄时出现视觉抖动 */
.dm-ai.is-resizing {
  transition: none;
}

/* 调整宽度手柄：固定在面板最左侧 */
.dm-ai__handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  z-index: 10;
  /* 负外边距扩大可点击热区，不影响布局 */
  margin-left: -16.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}
.dm-ai__handle:hover,
.dm-ai.is-resizing .dm-ai__handle {
  background: transparent;
}

/* 中间的可见竖条手柄 */
.dm-ai__handle-bar {
  width: 3px;
  height: 32px;
  border-radius: 2px;
  background: var(--text-tertiary);
  transition: background-color 0.15s, width 0.15s, opacity 0.15s;
  opacity: 0.8;
}
.dm-ai__handle:hover .dm-ai__handle-bar,
.dm-ai.is-resizing .dm-ai__handle-bar {
  background: var(--brand);
  width: 4px;
  opacity: 1;
}

/* 头部 */
.dm-ai__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding-right: var(--space);
}

.dm-ai__brand {
  font-size: 18px;
  font-weight: 700;
  font-style: italic;
  background: linear-gradient(120deg, var(--brand), #722ed1);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.dm-ai__actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

/* 消息列表 */
.dm-ai__body {
  flex: 1;
  padding: var(--space-lg) var(--space) var(--space-lg) 0;
  overflow-y: auto;
}

.dm-ai__user-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.dm-ai__user-bubble {
  max-width: 88%;
  padding: var(--space);
  color: var(--text-primary);
  font-size: var(--font-size);
  background: var(--bg-darker);
  border-radius: var(--radius-lg) var(--radius-sm) var(--radius-lg) var(--radius-lg);
}

.dm-ai__attachments { 
  margin-bottom: 6px; 
  background: var(--bg-overlay);
}

.dm-ai__attachment {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}


.dm-ai__attachment-name {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dm-ai__attachment-count { color: var(--text-tertiary); white-space: nowrap; }
[data-theme='dark'] .dm-ai__attachment-count { color: var(--text-tertiary); }

.dm-ai__user-text { line-height: 1.6; }

/* 助手消息 */
.dm-ai__msg { margin-bottom: 20px; font-size: 13px; }

.dm-ai__thinking { margin-bottom: 8px; }

.dm-ai__thinking-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  font-size: 12px;
  color: var(--text-tertiary);
  cursor: pointer;
}
.dm-ai__thinking-toggle:hover { color: var(--text-secondary); }

.dm-ai__chevron {
  display: inline-flex;
  transition: transform 0.15s;
}
.dm-ai__chevron.is-open { transform: rotate(180deg); }

.dm-ai__thinking-summary {
  padding: 6px 0 0;
  color: var(--text-tertiary);
  line-height: 1.7;
}

.dm-ai__text {
  margin: 8px 0;
  color: var(--text-primary);
  line-height: 1.7;
}

/* 卡片（命令执行 / 执行成功） */
.dm-ai__card {
  margin: 10px 0;
  border: 1px solid var(--border-lighter);
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-panel);
}

.dm-ai__card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s;
}
.dm-ai__card-header:hover { background: var(--bg-hover); }

.dm-ai__card-title { flex: 1; text-align: left; }

.dm-ai__card-body { padding: 4px 12px 12px; }

.dm-ai__command {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: var(--bg-layout);
  border-radius: 6px;
}

.dm-ai__command code {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dm-ai__copy { flex-shrink: 0; }

.is-success { color: var(--success); }

.dm-ai__success-title {
  margin: 4px 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.dm-ai__success-desc {
  margin: 0 0 10px;
  font-size: 12px;
  color: var(--text-tertiary);
  line-height: 1.6;
}

.dm-ai__filelist {
  padding: 8px 10px;
  background: var(--bg-layout);
  border-radius: 6px;
}

.dm-ai__filelist code {
  display: block;
  padding: 2px 0;
  font-size: 12px;
  color: var(--text-secondary);
}

/* 生成文件 */
.dm-ai__files { margin: 10px 0; }

.dm-ai__files-note {
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.dm-ai__file-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
  border: 1px solid var(--border-lighter);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s;
}
.dm-ai__file-row:hover { background: var(--bg-hover); }

.dm-ai__file-row-icon { color: var(--success); flex-shrink: 0; }

.dm-ai__file-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: var(--text-primary);
}

.dm-ai__file-space {
  font-size: 11px;
  color: var(--text-disabled);
  white-space: nowrap;
}

.dm-ai__diff { font-size: 12px; white-space: nowrap; }
.dm-ai__diff.is-add { color: var(--success); }
.dm-ai__diff.is-del { color: var(--error); }

.dm-ai__file-arrow { color: var(--text-disabled); flex-shrink: 0; }

/* 底部输入区 */
.dm-ai__footer {
  padding: var(--space) var(--space) var(--space) 0;
}

.dm-ai__pending {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 6px 6px 12px;
  margin-bottom: 10px;
  font-size: 12px;
  color: var(--text-secondary);
  background: var(--bg-layout);
  border-radius: 8px;
}

.dm-ai__pending-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dm-ai__pending-confirm {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: var(--brand);
  cursor: pointer;
  transition: background 0.15s;
}
.dm-ai__pending-confirm:hover { background: var(--brand-hover); }

.dm-ai__input {
  border: 1px solid var(--border-main);
  border-radius: 10px;
  padding: 8px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.dm-ai__input:focus-within {
  border-color: var(--brand);
  box-shadow: var(--ring);
}

.dm-ai__textarea {
  display: block;
  width: 100%;
  border: 0;
  outline: 0;
  resize: none;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  line-height: 1.6;
}
.dm-ai__textarea::placeholder { color: var(--text-disabled); }

.dm-ai__input-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
}

.dm-ai__input-left,
.dm-ai__input-right {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dm-ai__plan {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  font-size: 12px;
  color: var(--text-secondary);
  border: 1px solid var(--border-main);
  border-radius: 6px;
  white-space: nowrap;
}

.dm-ai__model {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border: 0;
  background: transparent;
  font-size: 12px;
  color: var(--text-secondary);
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}
.dm-ai__model:hover { background: var(--bg-hover); }

.dm-ai__send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 4px;
  border: 0;
  border-radius: 8px;
  color: #fff;
  background: var(--brand);
  cursor: pointer;
  transition: background 0.15s;
}
.dm-ai__send:hover { background: var(--brand-hover); }
</style>
