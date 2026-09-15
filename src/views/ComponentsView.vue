<template>
  <div class="demo-page">
    <header class="demo-header">
      <div class="demo-header__main">
        <h1 class="demo-title">{{ t('components.title') }}</h1>
        <p class="demo-desc">{{ t('components.desc') }}</p>
      </div>

      <div class="demo-header__settings">
        <span class="demo-label">{{ t('theme.label') }}</span>
        <DmSelect
          class="demo-theme-select"
          :model-value="themeMode"
          :options="themeOptions"
          @update:model-value="setTheme"
        />

        <span class="demo-label">{{ t('language.label') }}</span>
        <DmDropdown :menu="localeMenu" trigger="click" placement="bottomRight" @click="setLocale">
          <DmButton>
            {{ LANGUAGE_NAMES[locale] }}
            <svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
            </svg>
          </DmButton>
        </DmDropdown>
      </div>
    </header>

    <!-- Button -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.button.title') }}</h2>
      <div class="demo-row">
        <DmButton type="primary">{{ t('components.button.primary') }}</DmButton>
        <DmButton>{{ t('components.button.default') }}</DmButton>
        <DmButton type="dashed">{{ t('components.button.dashed') }}</DmButton>
        <DmButton type="text">{{ t('components.button.text') }}</DmButton>
        <DmButton type="link">{{ t('components.button.link') }}</DmButton>
      </div>
      <div class="demo-row">
        <DmButton type="primary" danger>{{ t('components.button.danger') }}</DmButton>
        <DmButton danger>{{ t('components.button.danger') }}</DmButton>
        <DmButton type="primary" loading>{{ t('components.button.loading') }}</DmButton>
        <DmButton disabled>{{ t('components.button.disabled') }}</DmButton>
      </div>
      <div class="demo-row">
        <DmButton type="primary" size="large">{{ t('components.button.large') }}</DmButton>
        <DmButton type="primary" size="small">{{ t('components.button.small') }}</DmButton>
      </div>
    </section>

    <!-- Input -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.input.title') }}</h2>
      <div class="demo-grid">
        <DmInput v-model="inputValue" :placeholder="t('components.input.placeholder')" allow-clear />
        <DmInput v-model="inputValue2" :placeholder="t('components.input.prefixSuffix')">
          <template #prefix>
            <svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00143 906c0 3.9.7 7.7 2.1 11.3 1.4 3.6 3.4 6.8 6 9.6 2.6 2.8 5.7 5 9.2 6.6 3.5 1.6 7.2 2.4 11 2.4h672c3.9 0 7.6-.8 11-2.4 3.5-1.6 6.6-3.8 9.2-6.6 2.6-2.8 4.6-6 6-9.6 1.4-3.6 2.1-7.4 2.1-11.3 0-49.4-9.7-97.3-28.9-142.4zM512 198c90.5 0 164 73.5 164 164s-73.5 164-164 164-164-73.5-164-164 73.5-164 164-164z" />
            </svg>
          </template>
          <template #suffix>{{ inputValue2.length }}/20</template>
        </DmInput>
        <DmInput v-model="inputValue3" type="password" :placeholder="t('components.input.password')" allow-clear />
        <DmInput v-model="searchValue" type="search" :placeholder="t('components.input.search')" allow-clear />
        <DmInput v-model="iconValue" prefix-icon="user" suffix-icon="key" :placeholder="t('components.input.iconProps')" />
        <DmInput disabled :placeholder="t('components.input.disabled')" />
        <DmInput
          v-model="textareaValue"
          type="textarea"
          :rows="3"
          :placeholder="t('components.input.textarea')"
        />
      </div>
    </section>

    <!-- Select -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.select.title') }}</h2>
      <div class="demo-grid demo-grid-3">
        <DmSelect v-model="selectValue" :options="selectOptions" :placeholder="t('components.select.placeholder')" />
        <DmSelect v-model="selectValue" :options="selectOptions" :placeholder="t('components.select.allowClear')" allow-clear />
        <DmSelect v-model="selectValue" :options="selectOptions" :placeholder="t('components.select.searchable')" show-search />
        <DmSelect :options="selectOptions" :placeholder="t('components.select.disabled')" disabled />
      </div>
    </section>

    <!-- Dropdown -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.dropdown.title') }}</h2>
      <div class="demo-row">
        <DmDropdown :menu="dropdownMenu" @click="onDropdownClick">
          <DmButton>
            {{ t('components.dropdown.hoverTrigger') }}
            <svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
            </svg>
          </DmButton>
        </DmDropdown>

        <DmDropdown :menu="dropdownMenu" trigger="click" @click="onDropdownClick">
          <DmButton type="primary">
            {{ t('components.dropdown.clickTrigger') }}
            <svg viewBox="64 64 896 896" width="12" height="12" fill="currentColor" aria-hidden="true">
              <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
            </svg>
          </DmButton>
        </DmDropdown>

        <span v-if="dropdownClicked" class="demo-clicked">click: {{ dropdownClicked }}</span>
      </div>
    </section>

    <!-- Tooltip -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.tooltip.title') }}</h2>
      <div class="demo-row">
        <DmTooltip :title="t('components.tooltip.text')" placement="top">
          <DmButton>{{ t('components.tooltip.top') }}</DmButton>
        </DmTooltip>
        <DmTooltip :title="t('components.tooltip.text')" placement="bottom">
          <DmButton>{{ t('components.tooltip.bottom') }}</DmButton>
        </DmTooltip>
        <DmTooltip :title="t('components.tooltip.text')" placement="left">
          <DmButton>{{ t('components.tooltip.left') }}</DmButton>
        </DmTooltip>
        <DmTooltip :title="t('components.tooltip.text')" placement="right">
          <DmButton>{{ t('components.tooltip.right') }}</DmButton>
        </DmTooltip>
        <DmTooltip :title="t('components.tooltip.text')">
          <DmButton disabled>{{ t('components.tooltip.disabled') }}</DmButton>
        </DmTooltip>
      </div>
    </section>

    <!-- Popover -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.popover.title') }}</h2>
      <div class="demo-row">
        <DmPopover :title="t('components.popover.hoverTitle')" :content="t('components.popover.content')" placement="top">
          <DmButton>{{ t('components.popover.hoverTrigger') }}</DmButton>
        </DmPopover>
        <DmPopover trigger="click" placement="right" :title="t('components.popover.clickTitle')">
          <DmButton type="primary">{{ t('components.popover.clickTrigger') }}</DmButton>
          <template #content>
            <div>{{ t('components.popover.content') }}</div>
            <DmButton size="small" style="margin-top: 8px">{{ t('common.confirm') }}</DmButton>
          </template>
        </DmPopover>
      </div>
    </section>

    <!-- Divider -->
    <section class="demo-section">
      <h2 class="demo-section-title">{{ t('components.divider.title') }}</h2>
      <div style="display:flex;flex-direction:column;margin-bottom:16px;">
        <DmDivider line-type="solid" />
        <DmDivider line-type="dashed" />
        <DmDivider line-type="dotted" />
      </div>
      <div class="demo-row" style="justify-content:center;">
        <span>{{ t('components.divider.text') }}</span>
        <DmDivider direction="vertical" line-type="solid" />
        <span>{{ t('components.divider.text') }}</span>
        <DmDivider direction="vertical" line-type="dashed" />
        <span>{{ t('components.divider.text') }}</span>
        <DmDivider direction="vertical" line-type="dotted" />
        <span>{{ t('components.divider.text') }}</span>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { DmButton, DmInput, DmSelect, DmDropdown, DmTooltip, DmPopover, DmDivider } from '../components/dm';
import { useTheme } from '../composables/useTheme';
import { useLocale } from '../composables/useLocale';
import { LANGUAGE_NAMES } from '../locales';

const { themeMode, setTheme } = useTheme();
const { locale, setLocale, t } = useLocale();

// 主题选项
const themeOptions = computed(() => [
  { value: 'light', label: t('theme.light') },
  { value: 'dark', label: t('theme.dark') },
  { value: 'system', label: t('theme.system') },
]);

// 语言菜单
const localeMenu = computed(() => [
  { key: 'zh-CN', label: LANGUAGE_NAMES['zh-CN'] },
  { key: 'en-US', label: LANGUAGE_NAMES['en-US'] },
]);

// Input
const inputValue = ref('');
const inputValue2 = ref('');
const inputValue3 = ref('');
const searchValue = ref('');
const iconValue = ref('');
const textareaValue = ref('');

// Select
const selectValue = ref();
const selectOptions = computed(() => [
  { value: 'apple', label: t('components.select.options.apple') },
  { value: 'banana', label: t('components.select.options.banana') },
  { value: 'cherry', label: t('components.select.options.cherry') },
  { value: 'grape', label: t('components.select.options.grape') },
  { value: 'mango', label: t('components.select.options.mango') },
]);

// Dropdown
const dropdownClicked = ref('');
const dropdownMenu = computed(() => [
  { key: 'action1', label: t('components.dropdown.item1') },
  { key: 'action2', label: t('components.dropdown.item2') },
  { key: 'action3', label: t('components.dropdown.item3') },
  { key: 'disabled', label: t('components.dropdown.disabledItem'), disabled: true },
  { key: 'danger', label: t('components.dropdown.dangerItem'), danger: true, divided: true },
]);

function onDropdownClick(key) {
  dropdownClicked.value = key;
}
</script>

<style scoped>
.demo-page {
  height: 100%;
  padding: 32px;
  overflow-y: auto;
  background: var(--bg-layout);
  transition: background-color 0.2s ease;
}

.demo-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.demo-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.demo-desc {
  max-width: 560px;
  color: var(--text-secondary);
  font-size: 13px;
}

.demo-header__settings {
  display: flex;
  align-items: center;
  gap: 8px;
}

.demo-label {
  color: var(--text-secondary);
  font-size: 13px;
}

.demo-theme-select {
  width: 130px;
}

.demo-section {
  padding: 20px 24px;
  margin-bottom: 16px;
  background: var(--bg-panel);
  border-radius: 8px;
  border: 1px solid var(--border-lighter);
  transition: background-color 0.2s ease;
}

.demo-section-title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.demo-row:last-child { margin-bottom: 0; }

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}

.demo-grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.demo-clicked {
  color: var(--text-tertiary);
  font-size: 13px;
}
</style>
