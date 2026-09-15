<template>
  <span :class="tagClasses" @click="handleClick" @close="handleClose">
    <slot></slot>
    <span v-if="closable" class="x-tag-close-icon" @click.stop="handleClose">
      <slot name="closeIcon">
        <span class="x-tag-close-icon-x">×</span>
      </slot>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface TagProps {
  color?: string
  closable?: boolean
  closeIcon?: any
  visible?: boolean
  bordered?: boolean
}

const props = withDefaults(defineProps<TagProps>(), {
  color: '',
  closable: false,
  closeIcon: null,
  visible: true,
  bordered: true
})

const emit = defineEmits<{
  close: [event: MouseEvent]
  click: [event: MouseEvent]
}>()

const isPresetColor = computed(() => {
  const presetColors = [
    'pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple',
    'geekblue', 'magenta', 'volcano', 'gold', 'lime'
  ]
  return presetColors.includes(props.color || '')
})

const tagClasses = computed(() => [
  'x-tag',
  {
    [`x-tag-${props.color}`]: props.color && isPresetColor.value,
    'x-tag-has-color': props.color && !isPresetColor.value,
    'x-tag-closable': props.closable,
    'x-tag-bordered': props.bordered
  }
])

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}

const handleClose = (event: MouseEvent) => {
  emit('close', event)
}
</script>

<style scoped lang="less">
.x-tag {
  display: inline-block;
  height: auto;
  margin-right: 8px;
  padding: 0 7px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  background: #fafafa;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  cursor: default;
  transition: all 0.3s;

  &-has-color {
    background: transparent;
    border-color: transparent;
    color: #fff;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-bordered {
    background: #fff;
  }

  &-closable {
    padding-right: 24px;
  }

  &-close-icon {
    position: absolute;
    top: 0;
    right: 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    margin-left: 4px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: rgba(0, 0, 0, 0.85);
    }
  }

  &-close-icon-x {
    display: inline-block;
    font-weight: bold;
    line-height: 1;
  }

  &:hover {
    opacity: 0.85;
  }

  &-pink {
    color: #c41d7f;
    background: #fff0f6;
    border-color: #ffadd2;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-red {
    color: #cf1322;
    background: #fff1f0;
    border-color: #ffa39e;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-yellow {
    color: #d4b106;
    background: #feffe6;
    border-color: #fffb8f;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-orange {
    color: #d46b08;
    background: #fff7e6;
    border-color: #ffd591;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-cyan {
    color: #096dd9;
    background: #e6f7ff;
    border-color: #91d5ff;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-green {
    color: #389e0d;
    background: #f6ffed;
    border-color: #b7eb8f;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-blue {
    color: #096dd9;
    background: #e6f7ff;
    border-color: #91d5ff;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-purple {
    color: #531dab;
    background: #f9f0ff;
    border-color: #d3adf7;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-geekblue {
    color: #2f54eb;
    background: #f0f5ff;
    border-color: #adc6ff;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-magenta {
    color: #c41d7f;
    background: #fff0f6;
    border-color: #ffadd2;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-volcano {
    color: #d4380d;
    background: #fff2e8;
    border-color: #ffbb96;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-gold {
    color: #d48806;
    background: #fffbe6;
    border-color: #ffe58f;

    &.x-tag-bordered {
      background: #fff;
    }
  }

  &-lime {
    color: #5b8c00;
    background: #fcffe6;
    border-color: #eaff8f;

    &.x-tag-bordered {
      background: #fff;
    }
  }
}
</style>
