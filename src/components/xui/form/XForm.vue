<template>
  <form :class="formClasses" @submit.prevent="handleSubmit">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'

export interface FormProps {
  layout?: 'horizontal' | 'vertical' | 'inline'
  labelCol?: Record<string, any>
  wrapperCol?: Record<string, any>
  labelAlign?: 'left' | 'right' | 'top'
  colon?: boolean
  requiredMark?: boolean | 'optional'
  hideRequiredMark?: boolean
  model?: Record<string, any>
  rules?: Record<string, any[]>
  validateTrigger?: string | string[]
  scrollToFirstError?: boolean
}

const props = withDefaults(defineProps<FormProps>(), {
  layout: 'horizontal',
  labelCol: () => ({ span: 5 }),
  wrapperCol: () => ({ span: 19 }),
  labelAlign: 'top',
  colon: true,
  requiredMark: true,
  hideRequiredMark: false,
  model: () => ({}),
  rules: () => ({}),
  validateTrigger: 'change',
  scrollToFirstError: true
})

const emit = defineEmits<{
  submit: [event: Event]
  finish: [values: Record<string, any>]
  finishFailed: [errorInfo: any]
}>()

const formClasses = computed(() => [
  'x-form',
  `x-form-${props.layout}`
])

const fields = ref<any[]>([])

const addField = (field: any) => {
  if (field) {
    fields.value.push(field)
  }
}

const removeField = (field: any) => {
  if (field) {
    fields.value = fields.value.filter(f => f !== field)
  }
}

const validate = async (nameList?: string[]) => {
  const promises: Promise<any>[] = []

  if (nameList) {
    nameList.forEach(name => {
      const field = fields.value.find(f => f.name === name)
      if (field) {
        promises.push(field.validate())
      }
    })
  } else {
    fields.value.forEach(field => {
      promises.push(field.validate())
    })
  }

  try {
    await Promise.all(promises)
    return true
  } catch (error) {
    return false
  }
}

const validateFields = async (nameList?: string[]) => {
  const values: Record<string, any> = {}
  const promises: Promise<any>[] = []

  if (nameList) {
    nameList.forEach(name => {
      const field = fields.value.find(f => f.name === name)
      if (field) {
        promises.push(
          field.validate().then(() => {
            values[name] = props.model?.[name]
          })
        )
      }
    })
  } else {
    fields.value.forEach(field => {
      promises.push(
        field.validate().then(() => {
          values[field.name] = props.model?.[field.name]
        })
      )
    })
  }

  try {
    await Promise.all(promises)
    return values
  } catch (error) {
    throw error
  }
}

const resetFields = (nameList?: string[]) => {
  if (nameList) {
    nameList.forEach(name => {
      const field = fields.value.find(f => f.name === name)
      if (field && props.model) {
        props.model[name] = field.initialValue
        field.clearValidate()
      }
    })
  } else {
    fields.value.forEach(field => {
      if (props.model) {
        props.model[field.name] = field.initialValue
        field.clearValidate()
      }
    })
  }
}

const clearValidate = (nameList?: string[]) => {
  if (nameList) {
    nameList.forEach(name => {
      const field = fields.value.find(f => f.name === name)
      if (field) {
        field.clearValidate()
      }
    })
  } else {
    fields.value.forEach(field => {
      field.clearValidate()
    })
  }
}

const scrollToField = (name: string) => {
  const field = fields.value.find(f => f.name === name)
  if (field && field.$el) {
    field.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const handleSubmit = async (event: Event) => {
  emit('submit', event)

  try {
    const values = await validateFields()
    emit('finish', values)
  } catch (error) {
    emit('finishFailed', error)

    if (props.scrollToFirstError) {
      const firstErrorField = fields.value.find(f => f.error)
      if (firstErrorField) {
        scrollToField(firstErrorField.name)
      }
    }
  }
}

provide('x-form', {
  props,
  addField,
  removeField,
  model: props.model,
  rules: props.rules
})

defineExpose({
  validate,
  validateFields,
  resetFields,
  clearValidate,
  scrollToField
})
</script>

<style scoped lang="less">
.x-form {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum';

  &-horizontal {
    display: flex;
    flex-wrap: wrap;
    gap: var(--x-spacing-xl);
  }

  &-vertical {
    display: block;
  }

  &-inline {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
