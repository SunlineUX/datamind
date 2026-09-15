<template>
  <div :class="wrapperClasses" ref="wrapperRef">
    <div
      :class="selectorClasses"
      @click="handleToggle"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div v-if="showPlaceholder" class="x-select-selection-placeholder">
        {{ placeholder }}
      </div>
      <div v-else class="x-select-selection-item">
        <template v-if="multiple">
          <span v-for="item in selectedItems" :key="item.value" class="x-select-selection-item-content">
            <span class="x-select-selection-item-label">{{ item.label }}</span>
            <span class="x-select-selection-item-remove" @click.stop="handleRemove(item)">
              <svg viewBox="64 64 896 896" focusable="false" data-icon="close" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path d="M563.8 512l262.5-312.9c4.4-5.2.4-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.5 0-10.5 7.8-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.5 0 10.5-7.8 6.1-13.1L563.8 512z"></path>
              </svg>
            </span>
          </span>
        </template>
        <template v-else>
          {{ selectedLabel }}
        </template>
      </div>
      <span v-if="showArrow" class="x-select-arrow">
        <svg v-if="!loading" viewBox="64 64 896 896" focusable="false" data-icon="down" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
        </svg>
        <svg v-else viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true" class="x-select-arrow-loading">
          <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.4-117-34-175.9-22.6-59.1-55.2-112.3-96.8-157.9-41.7-45.6-89.7-82.1-142.8-108.4-53.1-26.3-110.4-41.4-169.7-44.8-59.3-3.4-118.3 5.4-174.2 25.9-55.9 20.5-106.6 51.4-149.9 91.4-43.3 40-78.6 87.3-104.2 139.8-25.6 52.5-41.2 109.6-45.5 168.2-4.3 58.6 3.4 117.7 22.7 173.1 19.3 55.4 49.2 105.9 88.4 149 39.2 43.1 86.2 78.2 138.4 103.7 52.2 25.5 109.2 41.1 167.7 45.4 58.5 4.3 117.6-3.4 173.1-22.7 55.4-19.3 105.9-49.2 149-88.4 43.1-39.2 78.2-86.2 103.7-138.4 25.5-52.2 41.1-109.2 45.4-167.7 0-19.9 16.1-36 36-36s36 16.1 36 36c-4.7 66.9-22.7 131.7-53.3 190.9-30.6 59.2-73.4 111.6-126.2 153.9-52.8 42.3-114.1 73.6-179.8 91.9-65.7 18.3-134.7 22.3-202.2 11.7-67.5-10.6-131.8-35.6-189.1-73.3-57.3-37.7-106.4-87.2-144.1-144.8-37.7-57.6-62.5-122.1-72.8-189.7-10.3-67.6-6.1-136.6 12.3-202.2 18.4-65.6 49.8-126.8 92.2-179.5 42.4-52.7 94.9-95.4 154.2-125.9 59.3-30.5 124.2-48.4 191.1-53 66.9-4.6 133.9 3.5 197.4 23.7 63.5 20.2 121.6 52.2 171.3 94.5 49.7 42.3 90.1 94.3 119.1 152.7 29 58.4 46.3 122.3 50.2 187.8 0 19.9-16.1 36-36 36z"></path>
        </svg>
      </span>
      <span v-if="allowClear && !disabled && hasValue" class="x-select-clear" @click.stop="handleClear">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="close-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true">
          <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.6-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.6 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
        </svg>
      </span>
    </div>
    <Teleport to="body">
      <Transition name="x-select-dropdown">
        <div v-if="open" ref="dropdownRef" :class="dropdownClasses" :style="dropdownStyle">
          <div v-if="showSearch && filterable" class="x-select-dropdown-search">
            <input
              ref="searchInputRef"
              v-model="searchValue"
              :placeholder="searchPlaceholder"
              class="x-select-search-input"
              @input="handleSearch"
            />
          </div>
          <div v-if="loading" class="x-select-dropdown-loading">
            <svg viewBox="0 0 1024 1024" focusable="false" data-icon="loading" width="1em" height="1em" fill="currentColor" aria-hidden="true">
              <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.4-117-34-175.9-22.6-59.1-55.2-112.3-96.8-157.9-41.7-45.6-89.7-82.1-142.8-108.4-53.1-26.3-110.4-41.4-169.7-44.8-59.3-3.4-118.3 5.4-174.2 25.9-55.9 20.5-106.6 51.4-149.9 91.4-43.3 40-78.6 87.3-104.2 139.8-25.6 52.5-41.2 109.6-45.5 168.2-4.3 58.6 3.4 117.7 22.7 173.1 19.3 55.4 49.2 105.9 88.4 149 39.2 43.1 86.2 78.2 138.4 103.7 52.2 25.5 109.2 41.1 167.7 45.4 58.5 4.3 117.6-3.4 173.1-22.7 55.4-19.3 105.9-49.2 149-88.4 43.1-39.2 78.2-86.2 103.7-138.4 25.5-52.2 41.1-109.2 45.4-167.7 0-19.9 16.1-36 36-36s36 16.1 36 36c-4.7 66.9-22.7 131.7-53.3 190.9-30.6 59.2-73.4 111.6-126.2 153.9-52.8 42.3-114.1 73.6-179.8 91.9-65.7 18.3-134.7 22.3-202.2 11.7-67.5-10.6-131.8-35.6-189.1-73.3-57.3-37.7-106.4-87.2-144.1-144.8-37.7-57.6-62.5-122.1-72.8-189.7-10.3-67.6-6.1-136.6 12.3-202.2 18.4-65.6 49.8-126.8 92.2-179.5 42.4-52.7 94.9-95.4 154.2-125.9 59.3-30.5 124.2-48.4 191.1-53 66.9-4.6 133.9 3.5 197.4 23.7 63.5 20.2 121.6 52.2 171.3 94.5 49.7 42.3 90.1 94.3 119.1 152.7 29 58.4 46.3 122.3 50.2 187.8 0 19.9-16.1 36-36 36z"></path>
            </svg>
            <span>{{ loadingText }}</span>
          </div>
          <div v-else-if="filteredOptions.length === 0" class="x-select-dropdown-empty">
            <slot name="notFoundContent">{{ notFoundContent }}</slot>
          </div>
          <ul v-else class="x-select-dropdown-list">
            <li
              v-for="option in filteredOptions"
              :key="option.value"
              :class="optionClasses(option)"
              @click="handleSelect(option)"
            >
              <div class="x-select-option-content">
                <slot name="option" :option="option">
                  <span v-if="option.label" class="x-select-option-label">{{ option.label }}</span>
                  <span v-if="option.description" class="x-select-option-description">{{ option.description }}</span>
                </slot>
              </div>
              <span v-if="isSelected(option)" class="x-select-option-check">
                <svg viewBox="64 64 896 896" focusable="false" data-icon="check" width="1em" height="1em" fill="currentColor" aria-hidden="true">
                  <path d="M912 190h-69.9c-9.8 0-19.1 4.5-25.1 12.2L404.7 724.5 207 474c-6.1-7.7-15.3-12.2-25.1-12.2H112c-6.7 0-10.4 7.7-6.3 12.9l273.9 347c12.8 16.2 39 16.2 51.7 0l488.8-611.1c4.1-5.2.4-12.9-6.3-12.9z"></path>
                </svg>
              </span>
            </li>
          </ul>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'

interface SelectOption {
  value: string | number
  label?: string
  description?: string
  disabled?: boolean
}

interface SelectProps {
  modelValue?: string | number | (string | number)[]
  options?: SelectOption[]
  placeholder?: string
  disabled?: boolean
  allowClear?: boolean
  showSearch?: boolean
  filterable?: boolean
  searchPlaceholder?: string
  loading?: boolean
  loadingText?: string
  notFoundContent?: string
  multiple?: boolean
  size?: 'large' | 'middle' | 'small'
  bordered?: boolean
  virtual?: boolean
  listHeight?: number
}

const props = withDefaults(defineProps<SelectProps>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: '请选择',
  disabled: false,
  allowClear: false,
  showSearch: false,
  filterable: false,
  searchPlaceholder: '请搜索',
  loading: false,
  loadingText: '加载中...',
  notFoundContent: '暂无数据',
  multiple: false,
  size: 'middle',
  bordered: true,
  virtual: false,
  listHeight: 256
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | (string | number)[]]
  change: [value: string | number | (string | number)[], option: SelectOption | SelectOption[]]
  search: [value: string]
  blur: []
  focus: []
  clear: []
  dropdownVisibleChange: [open: boolean]
}>()

const wrapperRef = ref<HTMLElement>()
const dropdownRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()
const open = ref(false)
const searchValue = ref('')
const hoverValue = ref(false)
const dropdownPosition = ref<{ top: number; left: number; placement: 'bottom' | 'top' }>({ top: 0, left: 0, placement: 'bottom' })

const innerValue = computed({
  get: () => props.modelValue,
  set: (val: string | number | (string | number)[]) => emit('update:modelValue', val)
})

const hasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(innerValue.value) && innerValue.value.length > 0
  }
  return innerValue.value !== undefined && innerValue.value !== ''
})

const showPlaceholder = computed(() => !hasValue.value)

const showArrow = computed(() => !props.multiple || props.showSearch)

const selectedItems = computed(() => {
  if (props.multiple && Array.isArray(innerValue.value)) {
    return innerValue.value.map(val => props.options.find(opt => opt.value === val)).filter(Boolean) as SelectOption[]
  }
  return []
})

const selectedLabel = computed(() => {
  const option = props.options.find(opt => opt.value === innerValue.value)
  return option?.label || String(innerValue.value || '')
})

const filteredOptions = computed(() => {
  if (!props.filterable || !searchValue.value) {
    return props.options
  }
  const searchLower = searchValue.value.toLowerCase()
  return props.options.filter(option => {
    const label = option.label || String(option.value)
    return label.toLowerCase().includes(searchLower)
  })
})

const wrapperClasses = computed(() => [
  'x-select',
  `x-select-${props.size}`,
  {
    'x-select-disabled': props.disabled,
    'x-select-open': open.value,
    'x-select-focused': open.value || hoverValue.value,
    'x-select-borderless': !props.bordered,
    'x-select-multiple': props.multiple
  }
])

const selectorClasses = computed(() => [
  'x-select-selector',
  {
    'x-select-selector-disabled': props.disabled
  }
])

const dropdownClasses = computed(() => [
  'x-select-dropdown',
  `x-select-dropdown-${props.size}`,
  `x-select-dropdown-${dropdownPosition.value.placement}`,
  {
    'x-select-dropdown-multiple': props.multiple
  }
])

const dropdownStyle = computed(() => ({
  top: `${dropdownPosition.value.top}px`,
  left: `${dropdownPosition.value.left}px`,
  width: `${wrapperRef.value?.offsetWidth || 0}px`,
  maxHeight: `${props.listHeight}px`
}))

const calculateDropdownPosition = () => {
  if (!wrapperRef.value) return

  const wrapperRect = wrapperRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.offsetHeight || props.listHeight
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  const spaceBelow = windowHeight - wrapperRect.bottom
  const spaceAbove = wrapperRect.top

  let top = 0
  let placement: 'bottom' | 'top' = 'bottom'

  if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
    top = wrapperRect.top - dropdownHeight
    placement = 'top'
  } else {
    top = wrapperRect.bottom
    placement = 'bottom'
  }

  let left = wrapperRect.left
  
  if (left < 0) {
    left = 8
  } else if (left + wrapperRect.width > windowWidth) {
    left = windowWidth - wrapperRect.width - 8
  }

  dropdownPosition.value = {
    top,
    left,
    placement
  }
}

const isSelected = (option: SelectOption): boolean => {
  if (props.multiple && Array.isArray(innerValue.value)) {
    return innerValue.value.includes(option.value)
  }
  return innerValue.value === option.value
}

const optionClasses = (option: SelectOption) => [
  'x-select-option',
  {
    'x-select-option-disabled': option.disabled,
    'x-select-option-selected': isSelected(option)
  }
]

const handleToggle = () => {
  if (!props.disabled) {
    open.value = !open.value
    emit('dropdownVisibleChange', open.value)
    if (open.value) {
      nextTick(() => {
        calculateDropdownPosition()
        if (props.showSearch && props.filterable) {
          searchInputRef.value?.focus()
        }
      })
    }
  }
}

const handleSelect = (option: SelectOption) => {
  if (option.disabled) return

  if (props.multiple) {
    const currentValue = Array.isArray(innerValue.value) ? [...innerValue.value] : []
    const index = currentValue.indexOf(option.value)
    if (index > -1) {
      currentValue.splice(index, 1)
    } else {
      currentValue.push(option.value)
    }
    innerValue.value = currentValue
    emit('change', currentValue, currentValue.map(v => props.options.find(opt => opt.value === v)).filter(Boolean) as SelectOption[])
  } else {
    innerValue.value = option.value
    emit('change', option.value, option)
    open.value = false
  }
  emit('dropdownVisibleChange', false)
}

const handleRemove = (option: SelectOption) => {
  if (props.multiple && Array.isArray(innerValue.value)) {
    const currentValue = [...innerValue.value]
    const index = currentValue.indexOf(option.value)
    if (index > -1) {
      currentValue.splice(index, 1)
      innerValue.value = currentValue
      emit('change', currentValue, currentValue.map(v => props.options.find(opt => opt.value === v)).filter(Boolean) as SelectOption[])
    }
  }
}

const handleClear = () => {
  if (props.multiple) {
    innerValue.value = []
  } else {
    innerValue.value = ''
  }
  emit('clear')
  open.value = false
}

const handleSearch = () => {
  emit('search', searchValue.value)
}

const handleMouseEnter = () => {
  hoverValue.value = true
  emit('focus')
}

const handleMouseLeave = () => {
  hoverValue.value = false
  emit('blur')
}

const handleClickOutside = (event: MouseEvent) => {
  if (wrapperRef.value && !wrapperRef.value.contains(event.target as Node) &&
      dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false
    emit('dropdownVisibleChange', false)
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', calculateDropdownPosition, true)
  window.addEventListener('resize', calculateDropdownPosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', calculateDropdownPosition, true)
  window.removeEventListener('resize', calculateDropdownPosition)
})

watch(() => open.value, (newVal) => {
  if (!newVal) {
    searchValue.value = ''
  } else {
    nextTick(() => {
      calculateDropdownPosition()
    })
  }
})
</script>

<style scoped lang="less">
.x-select {
  position: relative;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-size: 14px;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  font-variant: tabular-nums;
}

.x-select-selector {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  height: 32px;
  padding: 0 11px;
  background-color: var(--color-bg-container);
  border: 1px solid var(--color-form-border);
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  cursor: pointer;

  .x-select-borderless & {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
  }

  .x-select-disabled &,
  .x-select-selector-disabled {
    color: var(--color-textTertiary);
    background-color: var(--x-bgDisabled);
    cursor: not-allowed;
  }

  .x-select-open &,
  .x-select-focused & {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  .x-select-large & {
    height: 40px;
    padding: 0 11px;
    font-size: 16px;
  }

  .x-select-small & {
    height: 24px;
    padding: 0 7px;
  }
}

.x-select-selection-placeholder {
  flex: 1;
  overflow: hidden;
  color: var(--color-textTertiary);
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
}

.x-select-selection-item {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  .x-select-multiple & {
    flex: auto;
  }
}

.x-select-selection-item-content {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  margin: 2px 4px 2px 0;
  padding: 0 4px 0 8px;
  line-height: 20px;
  background: var(--x-bg);
  border: 1px solid var(--color-form-border);
  border-radius: 2px;
  transition: all 0.3s;
}

.x-select-selection-item-label {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.x-select-selection-item-remove {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
  color: var(--color-textTertiary);
  font-size: 10px;
  cursor: pointer;

  &:hover {
    color: var(--color-textTertiary);
  }

  svg {
    display: inline-block;
  }
}

.x-select-arrow {
  position: absolute;
  top: 50%;
  right: 11px;
  display: flex;
  align-items: center;
  height: 12px;
  margin-top: -6px;
  color: var(--color-textTertiary);
  font-size: 12px;
  line-height: 1;
  text-align: center;
  pointer-events: none;

  svg {
    display: inline-block;
  }
}

.x-select-arrow-loading {
  animation: select-loading-spin 1s linear infinite;
}

@keyframes select-loading-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.x-select-clear {
  position: absolute;
  top: 50%;
  right: 11px;
  z-index: 1;
  display: none;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  color: var(--color-textTertiary);
  font-size: 12px;
  line-height: 1;
  text-align: center;
  background: var(--color-bg-container);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s, color 0.3s;

  svg {
    display: inline-block;
  }

  &:hover {
    color: var(--color-textTertiary);
  }
}

.x-select:hover .x-select-clear {
  display: block;
  opacity: 1;
}

.x-select-dropdown {
  position: fixed;
  z-index: 1050;
  margin-top: 4px;
  margin-bottom: 4px;
  overflow: hidden;
  background-color: var(--color-elevated);
  border-radius: 6px;
  box-shadow: var(--color-elevatedShadow);
}

.x-select-dropdown-enter-active,
.x-select-dropdown-leave-active {
  transition: opacity 0.15s ease-out;
}

.x-select-dropdown-enter-from,
.x-select-dropdown-leave-to {
  opacity: 0;
}

.x-select-dropdown-search {
  padding: 8px;
  border-bottom: 1px solid var(--color-form-border);
}

.x-select-search-input {
  width: 100%;
  padding: 4px 11px;
  font-size: 14px;
  line-height: 1.5715;
  color: var(--color-text);
  background-color: var(--color-bg-container);
  border: 1px solid var(--color-form-border);
  border-radius: 4px;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  &::placeholder {
    color: var(--color-textTertiary);
  }
}

.x-select-dropdown-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0;
  color: var(--color-textTertiary);
  font-size: 14px;

  svg {
    margin-right: 8px;
    font-size: 16px;
    animation: select-loading-spin 1s linear infinite;
  }
}

.x-select-dropdown-empty {
  padding: 12px 0;
  color: var(--color-textTertiary);
  font-size: 14px;
  text-align: center;
}

.x-select-dropdown-list {
  max-height: 256px;
  margin: 0;
  padding: 4px 0;
  overflow-y: auto;
  overflow-x: hidden;
  list-style: none;
}

.x-select-option {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 12px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5715;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: var(--color-primaryLight);
  }

  &.x-select-option-selected {
    background-color: var(--color-primaryFocus);
    color: var(--color-primary);
    font-weight: 600;
  }

  &.x-select-option-disabled {
    color: var(--color-textTertiary);
    cursor: not-allowed;

    &:hover {
      background-color: transparent;
    }
  }
}

.x-select-option-content {
  flex: auto;
  overflow: hidden;
  text-overflow: ellipsis;
}

.x-select-option-label {
  display: block;
}

.x-select-option-description {
  display: block;
  font-size: 12px;
  color: var(--color-textTertiary); 
}

.x-select-option-check {
  display: none;
  color: var(--color-primary);

  svg {
    display: inline-block;
  }
}

.x-select-option-selected .x-select-option-check {
  display: block;
}
</style>
