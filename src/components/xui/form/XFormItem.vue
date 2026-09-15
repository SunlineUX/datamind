<template>
  <div :class="itemClasses">
    <FormLabel
      v-if="hasLabel"
      :required="isRequired"
      :colon="colon"
      :label-col="labelCol"
      :label-align="labelAlign"
      :label="label"
    >
      <slot name="label">{{ label }}</slot>
    </FormLabel>
    <div :class="wrapperClasses" :style="wrapperStyle">
      <div class="x-form-item-control-input">
        <div class="x-form-item-control-input-content">
          <slot></slot>
        </div>
      </div>
      <div v-if="error" class="x-form-item-explain x-form-item-explain-error">
        {{ error }}
      </div>
      <div v-if="help" class="x-form-item-explain x-form-item-explain-help">
        {{ help }}
      </div>
      <div v-if="extra" class="x-form-item-extra">
        {{ extra }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, watch, useSlots } from 'vue'
import FormLabel from './XFormLabel.vue'

interface FormItemProps {
  label?: string
  name?: string
  required?: boolean
  rules?: any[]
  validateStatus?: '' | 'success' | 'warning' | 'error' | 'validating'
  help?: string
  extra?: string
  labelCol?: Record<string, any>
  wrapperCol?: Record<string, any>
  labelAlign?: 'left' | 'right' | 'top'
  colon?: boolean
}

const props = withDefaults(defineProps<FormItemProps>(), {
  label: '',
  name: '',
  required: false,
  rules: () => [],
  validateStatus: '',
  help: '',
  extra: '',
  labelCol: undefined,
  wrapperCol: undefined,
  labelAlign: undefined,
  colon: undefined
})

const slots = useSlots()
const formContext: any = inject('x-form', null)

const error = ref('')
const initialValue = ref<any>(undefined)
const isRequired = computed(() => {
  if (props.required) return true
  if (props.rules.some((rule: any) => rule.required)) return true
  return false
})

const hasLabel = computed(() => {
  return props.label !== '' || !!slots.label || labelAlign.value !== ''
})

const colon = computed(() => {
  if (props.colon !== undefined) return props.colon
  return formContext?.props.colon ?? true
})

const labelCol = computed(() => {
  if (props.labelCol) return props.labelCol
  return formContext?.props.labelCol ?? { span: 5 }
})

const wrapperCol = computed(() => {
  if (props.wrapperCol) return props.wrapperCol
  return formContext?.props.wrapperCol ?? { span: 19 }
})

const labelAlign = computed(() => {
  if (props.labelAlign) return props.labelAlign
  return formContext?.props.labelAlign ?? 'top'
})

const itemClasses = computed(() => {
  const classes = ['x-form-item']

  if (labelAlign.value === 'top') {
    classes.push('x-form-item-top')
  }

  if (props.validateStatus) {
    classes.push(`x-form-item-has-${props.validateStatus}`)
  }

  if (error.value) {
    classes.push('x-form-item-has-error')
  }

  if (isRequired.value) {
    classes.push('x-form-item-required')
  }

  return classes
})

const wrapperClasses = computed(() => {
  const classes = ['x-form-item-control']

  if (labelAlign.value === 'top') {
    classes.push('x-form-item-control-top')
  } else {
    classes.push('x-form-item-control-horizontal')
  }

  return classes
})

const wrapperStyle = computed(() => {
  const styles: Record<string, any> = {}

  if (labelAlign.value !== 'top' && wrapperCol.value) {
    if (wrapperCol.value.span) {
      styles.flex = `0 0 ${(wrapperCol.value.span / 24) * 100}%`
      styles.maxWidth = `${(wrapperCol.value.span / 24) * 100}%`
    }
    if (wrapperCol.value.offset) {
      styles.marginLeft = `${(wrapperCol.value.offset / 24) * 100}%`
    }
  }

  return styles
})

const validate = async () => {
  if (!props.name) return true

  const value = formContext?.model?.[props.name]
  const allRules = [...props.rules, ...(formContext?.rules?.[props.name] || [])]

  if (allRules.length === 0) {
    error.value = ''
    return true
  }

  for (const rule of allRules) {
    if (rule.required && (value === undefined || value === null || value === '')) {
      error.value = rule.message || `${props.label} is required`
      return false
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      error.value = rule.message || `${props.label} format is invalid`
      return false
    }

    if (rule.validator) {
      try {
        await rule.validator(null, value)
        error.value = ''
      } catch (err: any) {
        error.value = err.message || rule.message || `${props.label} validation failed`
        return false
      }
    }

    if (rule.min && value && value.length < rule.min) {
      error.value = rule.message || `${props.label} must be at least ${rule.min} characters`
      return false
    }

    if (rule.max && value && value.length > rule.max) {
      error.value = rule.message || `${props.label} must be at most ${rule.max} characters`
      return false
    }
  }

  error.value = ''
  return true
}

const clearValidate = () => {
  error.value = ''
}

onMounted(() => {
  if (formContext && props.name) {
    initialValue.value = formContext.model?.[props.name]
    formContext.addField({
      name: props.name,
      validate,
      clearValidate,
      initialValue: initialValue.value,
      error
    })
  }
})

onUnmounted(() => {
  if (formContext && props.name) {
    formContext.removeField({
      name: props.name,
      validate,
      clearValidate
    })
  }
})

watch(() => formContext?.model?.[props.name], () => {
  if (formContext?.props.validateTrigger === 'change') {
    validate()
  }
})

defineExpose({
  validate,
  clearValidate,
  name: props.name,
  error,
  initialValue
})
</script>

<style scoped lang="less">
.x-form-item {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';
  margin-bottom: 24px;
  vertical-align: top;
  display: flex;
  flex-direction: row;

  &-top {
    flex-direction: column;
  }

  &::before {
    display: table;
    content: '';
  }

  &::after {
    display: table;
    clear: both;
    content: '';
  }

  &-required {
    ::v-deep(.x-form-item-label::before) {
      display: inline-block;
      margin-right: 4px;
      color: #ff4d4f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  &-has-error {
    ::v-deep(.x-input),
    ::v-deep(.x-input:hover),
    ::v-deep(.x-input:focus) {
      border-color: #ff4d4f;
    }

    ::v-deep(.x-input:focus) {
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
    }
  }

  &-has-success {
    ::v-deep(.x-input) {
      border-color: #52c41a;
    }

    ::v-deep(.x-input:focus) {
      box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
    }
  }

  &-has-warning {
    ::v-deep(.x-input),
    ::v-deep(.x-input:hover),
    ::v-deep(.x-input:focus) {
      border-color: #faad14;
    }

    ::v-deep(.x-input:focus) {
      box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.2);
    }
  }

  &-control {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    &-horizontal {
      flex-direction: row;
      align-items: flex-start;
    }
    
    &-top {
      flex-direction: column;
      width: 100%;
    }
  }

  &-control-input {
    display: flex;
    align-items: center;
    min-height: 32px;
    flex-wrap: wrap;
    width: 100%;

    &-content {
      flex: auto;
      max-width: 100%;
    }
  }

  &-explain {
    color: var(--color-textSecondary);
    transition: color 0.3s;
    font-size: 14px;
    line-height: 1.5715;
    margin-top: 4px;

    &-error {
      color: #ff4d4f;
    }

    &-help {
      color: var(--color-textSecondary);
    }
  }

  &-extra {
    color: var(--color-textSecondary);
    font-size: 14px;
    line-height: 1.5715;
    margin-top: 4px;
  }
}
</style>
