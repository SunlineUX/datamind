<template>
  <div class="sql-editor">
    <!-- 工具栏：执行 + 格式化 -->
    <div class="sql-editor__toolbar">
      <DmButton size="small" type="primary" @click="handleRun">
        <template #icon><DmIcon name="ArrowRight" :size="13" /></template>
        {{ t('develop.editor.run') }}
      </DmButton>
      <DmButton size="small" @click="handleFormat">{{ t('develop.editor.format') }}</DmButton>
    </div>

    <!-- 编辑区：行号 + SQL 文本 -->
    <div class="sql-editor__body">
      <div ref="gutterRef" class="sql-editor__gutter">
        <div v-for="n in lineCount" :key="n" class="sql-editor__line-no">{{ n }}</div>
      </div>
      <textarea
        ref="taRef"
        class="sql-editor__textarea"
        :value="modelValue"
        :placeholder="t('develop.editor.placeholder')"
        spellcheck="false"
        @input="onInput"
        @scroll="syncScroll"
      />
    </div>

    <!-- 运行日志 -->
    <div v-if="logs.length && showLog" class="sql-editor__log">
      <div class="sql-editor__log-head">
        <DmIcon name="Terminal" :size="13" />
        <span>{{ t('develop.editor.runTitle') }}</span>
        <span class="sql-editor__spacer" />
        <button class="sql-editor__log-btn" @click="clearLogs">{{ t('develop.editor.clearLog') }}</button>
        <button class="sql-editor__log-btn" @click="showLog = false"><DmIcon name="ArrowDown" :size="13" /></button>
      </div>
      <div class="sql-editor__log-body">
        <div v-for="(log, i) in logs" :key="i" class="sql-editor__log-line" :class="`is-${log.level}`">
          <span class="sql-editor__log-time">{{ log.time }}</span>
          <span>{{ log.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { DmButton, DmIcon } from '@/components/dm';
import { useLocale } from '@/composables/useLocale';

const props = defineProps({
  /** SQL 内容 */
  modelValue: { type: String, default: '' },
  /** 运行日志：[{ time, text, level }] */
  logs: { type: Array, default: () => [] },
});

const emit = defineEmits(['update:modelValue', 'update:logs']);

const { t } = useLocale();

const gutterRef = ref(null);
const taRef = ref(null);
const showLog = ref(true);

const lineCount = computed(() => Math.max(1, props.modelValue.split('\n').length));

function onInput(e) {
  emit('update:modelValue', e.target.value);
}

/** 行号随编辑区滚动 */
function syncScroll() {
  if (gutterRef.value && taRef.value) {
    gutterRef.value.scrollTop = taRef.value.scrollTop;
  }
}

/** 轻量格式化：压缩空白、关键字大写、主关键字换行 */
function handleFormat() {
  const MAJORS = ['FROM', 'WHERE', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN', 'UNION ALL', 'UNION'];
  let s = props.modelValue.replace(/\s+/g, ' ').trim();
  s = s.replace(/\b(select|from|where|group by|order by|having|limit|insert into|create table|update|delete from|values|partitioned by|comment)\b/gi, (m) => m.toUpperCase());
  for (const k of MAJORS) {
    s = s.replace(new RegExp(`\\s+${k}\\b`, 'gi'), `\n${k}`);
  }
  emit('update:modelValue', s);
}

function nowTime() {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

/** 模拟运行：追加日志 */
function handleRun() {
  const rows = Math.floor(Math.random() * 200) + 1;
  const cost = (Math.random() * 2 + 0.3).toFixed(2);
  const text = `${t('develop.editor.runSuccess')}，${t('develop.editor.cost')} ${cost}s，${t('develop.editor.rows')} ${rows}`;
  emit('update:logs', [...props.logs, { time: nowTime(), text, level: 'success' }]);
}

function clearLogs() {
  emit('update:logs', []);
}
</script>

<style scoped>
.sql-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* 工具栏 */
.sql-editor__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px;
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
}

/* 编辑区 */
.sql-editor__body {
  flex: 1;
  display: flex;
  min-height: 0;
  overflow: hidden;
}
.sql-editor__gutter {
  width: 44px;
  flex-shrink: 0;
  padding: 12px 8px 12px 0;
  overflow: hidden;
  text-align: right;
  background: var(--bg-layout);
  border-right: 1px solid var(--border-lighter);
  user-select: none;
}
.sql-editor__line-no {
  height: 20px;
  font-size: 12px;
  line-height: 20px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  color: var(--text-disabled);
}
.sql-editor__textarea {
  flex: 1;
  padding: 12px;
  border: 0;
  outline: 0;
  resize: none;
  background: var(--bg-panel);
  color: var(--text-primary);
  font-size: 13px;
  line-height: 20px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  white-space: pre;
  overflow: auto;
}
.sql-editor__textarea::placeholder { color: var(--text-disabled); }

/* 运行日志 */
.sql-editor__log {
  height: 180px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.sql-editor__log-head {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.sql-editor__log-btn {
  display: inline-flex;
  align-items: center;
  padding: 2px 4px;
  border: 0;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}
.sql-editor__log-btn:hover { color: var(--text-primary); background: var(--bg-hover); }
.sql-editor__log-body {
  flex: 1;
  padding: 8px 12px;
  overflow-y: auto;
  background: var(--bg-dark);
}
.sql-editor__log-line {
  font-size: 12px;
  line-height: 20px;
  font-family: 'SF Mono', Menlo, Consolas, monospace;
  color: var(--text-secondary);
}
.sql-editor__log-line.is-success { color: var(--success); }
.sql-editor__log-time {
  margin-right: 8px;
  color: var(--text-disabled);
}
</style>
