<template>
  <ul :class="paginationClasses" v-if="total > 0">
    <li
      v-if="showTotal"
      :class="['x-pagination-total-text']"
    >
      <slot name="total">
        共 {{ total }} 条
      </slot>
    </li>

    <li
      :class="itemClasses('prev')"
      @click="handlePrev"
      :disabled="current === 1"
    >
      <slot name="prevIcon">
        <a class="x-pagination-item-link">
          <span class="x-pagination-prev-icon">&lt;</span>
        </a>
      </slot>
    </li>

    <template v-for="page in pages" :key="page">
      <li
        v-if="page === '...'"
        :class="['x-pagination-item', 'x-pagination-item-ellipsis']"
      >
        <span class="x-pagination-item-link">...</span>
      </li>
      <li
        v-else
        :class="itemClasses(page)"
@click="handlePageChange(page as number)"
      >
        <a class="x-pagination-item-link">{{ page }}</a>
      </li>
    </template>

    <li
      :class="itemClasses('next')"
      @click="handleNext"
      :disabled="current === totalPages"
    >
      <slot name="nextIcon">
        <a class="x-pagination-item-link">
          <span class="x-pagination-next-icon">&gt;</span>
        </a>
      </slot>
    </li>

    <li
      v-if="showQuickJumper"
      :class="['x-pagination-options-quick-jumper']"
    >
      跳至
      <input
        type="number"
        :value="jumpPage"
        @change="handleJump"
        @keyup.enter="handleJump"
        :min="1"
        :max="totalPages"
      />
      页
    </li>

    <li
      v-if="showSizeChanger"
      :class="['x-pagination-options-size-changer']"
    >
      <select :value="pageSize" @change="handleSizeChange">
        <option v-for="size in pageSizeOptions" :key="size" :value="size">
          {{ size }} 条/页
        </option>
      </select>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

export interface PaginationProps {
  current?: number
  defaultCurrent?: number
  pageSize?: number
  defaultPageSize?: number
  total?: number
  showTotal?: boolean
  showSizeChanger?: boolean
  showQuickJumper?: boolean
  pageSizeOptions?: number[]
  disabled?: boolean
  hideOnSinglePage?: boolean
}

const props = withDefaults(defineProps<PaginationProps>(), {
  current: undefined,
  defaultCurrent: 1,
  pageSize: undefined,
  defaultPageSize: 10,
  total: 0,
  showTotal: false,
  showSizeChanger: false,
  showQuickJumper: false,
  pageSizeOptions: () => [10, 20, 50, 100],
  disabled: false,
  hideOnSinglePage: false
})

const emit = defineEmits<{
  change: [page: number, pageSize: number]
  showSizeChange: [current: number, size: number]
}>()

const internalCurrent = ref(props.defaultCurrent)
const internalPageSize = ref(props.defaultPageSize)
const jumpPage = ref(props.defaultCurrent)

const current = computed(() => props.current ?? internalCurrent.value)
const pageSize = computed(() => props.pageSize ?? internalPageSize.value)

const totalPages = computed(() => Math.ceil(props.total / pageSize.value))

const pages = computed(() => {
  const result: (number | string)[] = []
  const pageRange = 2

  if (totalPages.value <= 2 * pageRange + 1) {
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i)
    }
  } else {
    if (current.value <= pageRange + 2) {
      for (let i = 1; i <= pageRange + 2; i++) {
        result.push(i)
      }
      result.push('...')
      result.push(totalPages.value)
    } else if (current.value >= totalPages.value - pageRange - 1) {
      result.push(1)
      result.push('...')
      for (let i = totalPages.value - pageRange - 1; i <= totalPages.value; i++) {
        result.push(i)
      }
    } else {
      result.push(1)
      result.push('...')
      for (let i = current.value - pageRange; i <= current.value + pageRange; i++) {
        result.push(i)
      }
      result.push('...')
      result.push(totalPages.value)
    }
  }

  return result
})

const paginationClasses = computed(() => [
  'x-pagination',
  `x-pagination-${props.disabled ? 'disabled' : 'enabled'}`,
  {
    'x-pagination-mini': props.pageSizeOptions.length === 0
  }
])

const itemClasses = (page: number | string) => {
  return [
    'x-pagination-item',
    {
      'x-pagination-item-active': page === current.value,
      'x-pagination-item-disabled': props.disabled || page === 'prev' && current.value === 1 || page === 'next' && current.value === totalPages.value
    }
  ]
}

const handlePageChange = (page: number) => {
  if (props.disabled || page === current.value) return

  internalCurrent.value = page
  jumpPage.value = page
  emit('change', page, pageSize.value)
}

const handlePrev = () => {
  if (props.disabled || current.value === 1) return
  handlePageChange(current.value - 1)
}

const handleNext = () => {
  if (props.disabled || current.value === totalPages.value) return
  handlePageChange(current.value + 1)
}

const handleJump = (event: Event) => {
  const target = event.target as HTMLInputElement
  const page = parseInt(target.value)
  if (isNaN(page) || page < 1) {
    jumpPage.value = current.value
    return
  }
  if (page > totalPages.value) {
    handlePageChange(totalPages.value)
  } else {
    handlePageChange(page)
  }
}

const handleSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = parseInt(target.value)
  internalPageSize.value = newSize

  const newPage = Math.min(current.value, Math.ceil(props.total / newSize))
  internalCurrent.value = newPage
  jumpPage.value = newPage

  emit('showSizeChange', newPage, newSize)
  emit('change', newPage, newSize)
}

watch(() => props.current, (newVal) => {
  if (newVal !== undefined) {
    internalCurrent.value = newVal
    jumpPage.value = newVal
  }
})

watch(() => props.pageSize, (newVal) => {
  if (newVal !== undefined) {
    internalPageSize.value = newVal
  }
})

defineExpose({
  current,
  pageSize,
  totalPages
})
</script>

<style scoped lang="less">
.x-pagination {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.5715;
  color: var(--color-text);

  &-item {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 32px;
    height: 32px;
    margin: 0 4px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s;

    &-link {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0 6px;
      color: var(--color-text);
      text-decoration: none;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      background-color: #fff;
      transition: all 0.3s;
    }

    &:hover &-link {
      border-color: #1890ff;
      color: #1890ff;
    }

    &-active &-link {
      background-color: #1890ff;
      border-color: #1890ff;
      color: #fff;
    }

    &-disabled {
      cursor: not-allowed;

      &-link {
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        background-color: #f5f5f5;
      }

      &:hover &-link {
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
      }
    }

    &-ellipsis {
      cursor: default;

      &-link {
        border: none;
        background: transparent;
        color: rgba(0, 0, 0, 0.25);
      }
    }
  }

  &-total-text {
    margin-right: 16px;
    color: var(--color-text);
  }

  &-options-quick-jumper {
    margin-left: 16px;
    color: var(--color-text);

    input {
      width: 50px;
      height: 32px;
      margin: 0 8px;
      padding: 4px 11px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      text-align: center;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
      }

      &:focus {
        border-color: #40a9ff;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  &-options-size-changer {
    margin-left: 16px;

    select {
      height: 32px;
      padding: 4px 11px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      background-color: #fff;
      transition: all 0.3s;

      &:hover {
        border-color: #1890ff;
      }

      &:focus {
        border-color: #40a9ff;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }

  &-disabled {
    .x-pagination-item {
      cursor: not-allowed;

      &-link {
        border-color: #d9d9d9;
        color: rgba(0, 0, 0, 0.25);
        background-color: #f5f5f5;
      }
    }
  }
}
</style>
