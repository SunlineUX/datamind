<template>
  <Teleport to="body">
    <Transition name="x-modal-fade">
      <div v-if="visible" :class="maskClasses" @click="handleMaskClick"></div>
    </Transition>
    <Transition name="x-modal-zoom">
      <div v-if="visible" :class="wrapClasses" @click.self="handleMaskClick">
        <div :class="modalClasses" :style="modalStyles">
          <div v-if="!hideHeader" :class="`${prefixCls}-header`">
            <div :class="`${prefixCls}-title`">
              <slot name="title">{{ title }}</slot>
            </div>
            <button v-if="closable" :class="`${prefixCls}-close`" @click="handleClose">
              <span>{{ closeIcon || '×' }}</span>
            </button>
          </div>
          <div :class="`${prefixCls}-body`">
            <slot></slot>
          </div>
          <div v-if="!hideFooter" :class="`${prefixCls}-footer`">
            <slot name="footer">
              <!-- <button v-if="cancelText" :class="`${prefixCls}-btn ${prefixCls}-btn-cancel`" @click="handleCancel">
                {{ cancelText }}
              </button>
              <button v-if="okText" :class="`${prefixCls}-btn ${prefixCls}-btn-ok`" @click="handleOk">
                {{ okText }}
              </button> -->
              <Button v-if="cancelText" @click="handleCancel">
                {{ cancelText }}
              </Button>  
              <Button v-if="okText" type="primary" @click="handleOk">
                {{ okText }}
              </Button>  
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import Button from '../basic/XButton.vue'

interface ModalProps {
  visible?: boolean
  title?: string
  closable?: boolean
  closeIcon?: string
  maskClosable?: boolean
  okText?: string
  cancelText?: string
  width?: number | string
  centered?: boolean
  hideHeader?: boolean
  hideFooter?: boolean
  destroyOnClose?: boolean
}

const props = withDefaults(defineProps<ModalProps>(), {
  visible: false,
  closable: true,
  maskClosable: true,
  okText: 'OK',
  cancelText: 'Cancel',
  width: 520,
  centered: false,
  hideHeader: false,
  hideFooter: false,
  destroyOnClose: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  ok: []
  cancel: []
  close: []
}>()

const prefixCls = 'x-modal'

const maskClasses = computed(() => [
  `${prefixCls}-mask`,
  {
    [`${prefixCls}-mask-hidden`]: !props.visible
  }
])

const wrapClasses = computed(() => [
  `${prefixCls}-wrap`,
  {
    [`${prefixCls}-wrap-centered`]: props.centered
  }
])

const modalClasses = computed(() => [
  prefixCls
])

const modalStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width
}))

const handleClose = () => {
  emit('update:visible', false)
  emit('close')
}

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('cancel')
  handleClose()
}

const handleMaskClick = () => {
  if (props.maskClosable) {
    handleClose()
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, { immediate: true })
</script>

<style scoped lang="less">
.x-modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);

  &-hidden {
    display: none;
  }
}

.x-modal-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;

  &-centered {
    align-items: center;
    padding-top: 0;
  }
}

.x-modal {
  position: relative;
  width: auto;
  margin: 0 auto;
  background: var(--color-bg-container);
  border-radius: var(--x-radius-base);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  outline: none;

  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--color-border);
    border-radius: var(--x-radius-base) var(--x-radius-base) 0 0;
  }

  &-title {
    margin: 0;
    color: var(--color-text);
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    word-wrap: break-word;
  }

  &-close {
    border: 0;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: var(--color-textSecondary);
    transition: color 0.3s;
    padding: 0;

    &:hover {
      color: var(--color-text);
    }
  }

  &-body {
    padding: 24px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--color-text);
  }

  &-footer {
    padding: 10px 16px;
    border-top: 1px solid var(--color-border);
    border-radius: 0 0 var(--x-radius-base) var(--x-radius-base);
    text-align: right;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  &-btn {
    padding: 4px 15px;
    font-size: 14px;
    border-radius: var(--x-radius-base);
    border: 1px solid var(--color-border);
    background: var(--color-bg-container);
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    &-ok {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;

      &:hover {
        background: var(--color-primaryHover);
        border-color: var(--color-primaryHover);
        color: #fff;
      }
    }
  }
}

.x-modal-fade-enter-active,
.x-modal-fade-leave-active {
  transition: opacity 0.3s;
}

.x-modal-fade-enter-from,
.x-modal-fade-leave-to {
  opacity: 0;
}

.x-modal-zoom-enter-active,
.x-modal-zoom-leave-active {
  transition: all 0.3s;
}

.x-modal-zoom-enter-from,
.x-modal-zoom-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>
