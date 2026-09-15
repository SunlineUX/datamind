<template>
  <div ref="chartContainer" class="xui-bar-chart-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { BarChart, type ChartData, type ChartOptions } from './index'

interface Props {
  data: ChartData[]
  options?: ChartOptions
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({})
})

const emit = defineEmits<{
  barClick: [item: ChartData, index: number]
  barHover: [item: ChartData, index: number]
}>()

const chartContainer = ref<HTMLDivElement>()
let chartInstance: BarChart | null = null

const initChart = () => {
  if (!chartContainer.value) return
  
  const mergedOptions = {
    ...props.options,
    data: props.data,
    onBarClick: (item: ChartData, index: number) => {
      emit('barClick', item, index)
    },
    onBarHover: (item: ChartData, index: number) => {
      emit('barHover', item, index)
    }
  }
  
  chartInstance = new BarChart(chartContainer.value, mergedOptions)
}

const updateChart = () => {
  if (!chartInstance) return
  chartInstance.update(props.data)
}

const updateOptions = () => {
  if (!chartInstance) return
  chartInstance.updateOptions({
    ...props.options,
    data: props.data,
    onBarClick: (item: ChartData, index: number) => {
      emit('barClick', item, index)
    },
    onBarHover: (item: ChartData, index: number) => {
      emit('barHover', item, index)
    }
  })
}

const resize = (width: number, height: number) => {
  if (!chartInstance) return
  chartInstance.resize(width, height)
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, updateOptions, { deep: true })

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})

defineExpose({
  resize,
  update: updateChart,
  updateOptions,
  getInstance: () => chartInstance
})
</script>

<style scoped lang="less">
.xui-bar-chart-container {
  width: 100%;
  height: 100%;
}
</style>
