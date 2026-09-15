<template>
  <div class="json-form">
    <!-- 步骤条：5 个步骤整合展示，点击定位到对应分区 -->
    <div class="json-form__steps">
      <template v-for="(section, index) in schema.sections" :key="section.key">
        <span v-if="index > 0" class="json-form__step-line" />
        <div class="json-form__step" @click="scrollTo(section.key)">
          <span class="json-form__step-no">{{ index + 1 }}</span>
          <span class="json-form__step-title">{{ t(section.titleKey) }}</span>
        </div>
      </template>
    </div>

    <!-- 分区表单 -->
    <div class="json-form__body">
      <section
        v-for="(section, index) in schema.sections"
        :key="section.key"
        :ref="(el) => (sectionEls[section.key] = el)"
        class="json-form__section"
      >
        <div class="json-form__section-head">
          <span class="json-form__section-no">{{ index + 1 }}</span>
          <span class="json-form__section-title">{{ t(section.titleKey) }}</span>
        </div>
        <div class="json-form__grid">
          <div
            v-for="field in section.fields"
            :key="field.key"
            :class="['json-form__field', { 'is-full': field.type === 'textarea' || field.type === 'table' }]"
          >
            <label class="json-form__label">
              <span v-if="field.required" class="json-form__required">*</span>
              {{ t(field.labelKey) }}
            </label>

            <DmInput v-if="field.type === 'input'" v-model="formData[field.key]" :placeholder="field.placeholder" />
            <DmInput v-else-if="field.type === 'textarea'" v-model="formData[field.key]" type="textarea" :rows="3" />
            <DmSelect v-else-if="field.type === 'select'" v-model="formData[field.key]" :options="toOptions(field.options)" />

            <!-- 表格字段：可增删行 -->
            <div v-else-if="field.type === 'table'" class="json-form__table">
              <div class="json-form__table-row json-form__table-head">
                <span
                  v-for="col in field.columns"
                  :key="col.key"
                  class="json-form__table-cell"
                  :style="colWidth(col)"
                >{{ t(col.labelKey) }}</span>
                <span class="json-form__table-cell json-form__table-op" />
              </div>
              <div v-for="(row, ri) in formData[field.key]" :key="ri" class="json-form__table-row">
                <span
                  v-for="col in field.columns"
                  :key="col.key"
                  class="json-form__table-cell"
                  :style="colWidth(col)"
                >
                  <DmInput v-if="col.type === 'input'" v-model="row[col.key]" size="small" />
                  <DmSelect v-else-if="col.type === 'select'" v-model="row[col.key]" size="small" :options="toOptions(col.options)" />
                </span>
                <span class="json-form__table-cell json-form__table-op">
                  <button class="json-form__row-del" :title="t('common.close')" @click="formData[field.key].splice(ri, 1)">
                    <DmIcon name="Close" :size="13" />
                  </button>
                </span>
              </div>
              <button class="json-form__row-add" @click="formData[field.key].push({})">
                <DmIcon name="CircleAdd" :size="12" />
                {{ t('develop.form.addRow') }}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 底部操作 -->
    <div class="json-form__footer">
      <span v-if="saved" class="json-form__saved">
        <DmIcon name="CouponCheck" :size="14" />
        {{ t('develop.form.saved') }}
      </span>
      <DmButton type="primary" size="small" @click="handleSave">{{ t('develop.form.save') }}</DmButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { DmButton, DmInput, DmSelect, DmIcon } from '@/components/dm';
import { useLocale } from '@/composables/useLocale';

const props = defineProps({
  /** 表单 JSON schema：{ sections: [{ key, titleKey, fields }] } */
  schema: { type: Object, required: true },
  /** 表单数据（同节点共享引用，编辑即更新） */
  formData: { type: Object, required: true },
});

const emit = defineEmits(['save']);

const { t } = useLocale();

const sectionEls = {};
const saved = ref(false);
let savedTimer = null;

/** [{ value, labelKey }] → DmSelect 选项 */
function toOptions(options) {
  return (options || []).map((o) => ({ value: o.value, label: t(o.labelKey) }));
}

/** 表格列宽（select 列窄一些） */
function colWidth(col) {
  return col.type === 'select' ? { width: '140px' } : {};
}

function scrollTo(key) {
  sectionEls[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleSave() {
  emit('save');
  saved.value = true;
  clearTimeout(savedTimer);
  savedTimer = setTimeout(() => { saved.value = false; }, 1500);
}
</script>

<style scoped>
.json-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}

/* 步骤条 */
.json-form__steps {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-lighter);
  flex-shrink: 0;
  overflow-x: auto;
}
.json-form__step {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  flex-shrink: 0;
}
.json-form__step-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 12px;
  color: var(--brand);
  background: var(--brand-light);
  border-radius: 50%;
}
.json-form__step-title {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
}
.json-form__step:hover .json-form__step-title { color: var(--text-primary); }
.json-form__step-line {
  flex: 1;
  min-width: 16px;
  height: 1px;
  background: var(--border-lighter);
}

/* 分区 */
.json-form__body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.json-form__section {
  padding: 16px;
  border: 1px solid var(--border-lighter);
  border-radius: var(--radius-md, 8px);
  scroll-margin-top: 8px;
}
.json-form__section-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}
.json-form__section-no {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  color: var(--brand);
  background: var(--brand-light);
  border-radius: 50%;
}
.json-form__section-title {
  font-size: 14px;
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
}

/* 字段栅格 */
.json-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
}
.json-form__field.is-full { grid-column: 1 / -1; }
.json-form__label {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  color: var(--text-secondary);
}
.json-form__required {
  margin-right: 2px;
  color: var(--danger, #f5483b);
}

/* 表格字段 */
.json-form__table {
  border: 1px solid var(--border-lighter);
  border-radius: var(--radius);
  overflow: hidden;
}
.json-form__table-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-bottom: 1px solid var(--border-lighter);
}
.json-form__table-head {
  background: var(--bg-layout);
  padding: 8px;
}
.json-form__table-row:last-of-type { border-bottom: 0; }
.json-form__table-cell {
  flex: 1;
  min-width: 0;
}
.json-form__table-op { flex: 0 0 28px; }
.json-form__table-head .json-form__table-cell {
  font-size: 12px;
  color: var(--text-tertiary);
}
.json-form__row-del {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: 0;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s;
}
.json-form__row-del:hover { color: var(--danger, #f5483b); background: var(--bg-hover); }
.json-form__row-add {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  padding: 6px 0;
  border: 0;
  background: transparent;
  font-size: 12px;
  color: var(--brand);
  cursor: pointer;
  transition: background 0.15s;
}
.json-form__row-add:hover { background: var(--bg-hover); }

/* 底部 */
.json-form__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px 16px;
  border-top: 1px solid var(--border-lighter);
  flex-shrink: 0;
}
.json-form__saved {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--success);
}
</style>
