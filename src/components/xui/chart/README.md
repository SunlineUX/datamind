# XUI 柱状图组件

基于原生 JavaScript + SVG 实现的跨框架柱状图组件，支持 Vue、React 和原生 HTML+JS 项目。

## 特性

- 🎨 基于 SVG 渲染，清晰度高，支持缩放
- 🚀 原生 JavaScript 实现，无框架依赖
- 🔧 丰富的配置选项
- 📱 响应式设计
- ✨ 流畅的动画效果
- 🎯 支持 Vue、React 和原生 JS 项目
- 🖱️ 交互事件支持（点击、悬停）
- 💡 内置提示框

## 安装

```bash
npm install @xui/components
```

## 使用方式

### 1. 原生 JavaScript

```html
<!DOCTYPE html>
<html>
<head>
  <title>柱状图示例</title>
</head>
<body>
  <div id="chart"></div>
  
  <script src="./chart.js"></script>
  <script>
    const chart = new BarChart('#chart', {
      data: [
        { label: '一月', value: 120 },
        { label: '二月', value: 200 },
        { label: '三月', value: 150 }
      ],
      title: '月度销售数据',
      xAxisLabel: '月份',
      yAxisLabel: '销售额 (万元)'
    });
  </script>
</body>
</html>
```

### 2. Vue 3

```vue
<template>
  <XBarChart
    :data="chartData"
    :options="chartOptions"
    @bar-click="handleBarClick"
    @bar-hover="handleBarHover"
    ref="chartRef"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XBarChart } from '@xui/components'

const chartData = ref([
  { label: '一月', value: 120 },
  { label: '二月', value: 200 },
  { label: '三月', value: 150 }
])

const chartOptions = ref({
  title: '月度销售数据',
  xAxisLabel: '月份',
  yAxisLabel: '销售额 (万元)'
})

const chartRef = ref()

const handleBarClick = (item, index) => {
  console.log('点击了柱子:', item, index)
}

const handleBarHover = (item, index) => {
  console.log('悬停在柱子上:', item, index)
}

// 调用实例方法
const updateChart = () => {
  chartRef.value?.update(newData)
}

const resizeChart = () => {
  chartRef.value?.resize(800, 500)
}
</script>
```

### 3. React

```tsx
import React, { useRef } from 'react'
import { BarChartComponent } from '@xui/components'

function App() {
  const chartRef = useRef<BarChartRef>(null)

  const data = [
    { label: '一月', value: 120 },
    { label: '二月', value: 200 },
    { label: '三月', value: 150 }
  ]

  const options = {
    title: '月度销售数据',
    xAxisLabel: '月份',
    yAxisLabel: '销售额 (万元)'
  }

  const handleBarClick = (item, index) => {
    console.log('点击了柱子:', item, index)
  }

  const handleBarHover = (item, index) => {
    console.log('悬停在柱子上:', item, index)
  }

  return (
    <BarChartComponent
      data={data}
      options={options}
      onBarClick={handleBarClick}
      onBarHover={handleBarHover}
      ref={chartRef}
    />
  )
}
```

## 配置选项

### ChartOptions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| width | number | 600 | 图表宽度 |
| height | number | 400 | 图表高度 |
| padding | object | {top: 40, right: 40, bottom: 60, left: 60} | 图表内边距 |
| data | ChartData[] | [] | 图表数据 |
| colors | string[] | ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'] | 柱状图颜色数组 |
| barWidth | number | 40 | 柱子宽度 |
| barGap | number | 20 | 柱子间距 |
| showGrid | boolean | true | 是否显示网格线 |
| showAxis | boolean | true | 是否显示坐标轴 |
| showTooltip | boolean | true | 是否显示提示框 |
| animationDuration | number | 500 | 动画持续时间 (ms) |
| animationEasing | string | 'easeInOutQuad' | 动画缓动函数 |
| title | string | '' | 图表标题 |
| xAxisLabel | string | '' | X 轴标签 |
| yAxisLabel | string | '' | Y 轴标签 |
| onBarClick | function | null | 柱子点击事件回调 |
| onBarHover | function | null | 柱子悬停事件回调 |

### ChartData

| 属性 | 类型 | 说明 |
|------|------|------|
| label | string | 数据标签 |
| value | number | 数据值 |

## API 方法

### update(newData)

更新图表数据

```javascript
chart.update([
  { label: '一月', value: 200 },
  { label: '二月', value: 300 }
])
```

### updateOptions(newOptions)

更新图表配置

```javascript
chart.updateOptions({
  colors: ['#ff0000', '#00ff00'],
  barWidth: 50
})
```

### resize(width, height)

调整图表大小

```javascript
chart.resize(800, 500)
```

### destroy()

销毁图表实例

```javascript
chart.destroy()
```

## 事件

### barClick

柱子点击事件

```javascript
onBarClick: (item, index) => {
  console.log(item) // { label: '一月', value: 120 }
  console.log(index) // 0
}
```

### barHover

柱子悬停事件

```javascript
onBarHover: (item, index) => {
  console.log(item) // { label: '一月', value: 120 }
  console.log(index) // 0
}
```

## 示例

查看完整示例：

- 原生 JS 示例: [example.html](./example.html)
- Vue 示例: [XBarChart.vue](./XBarChart.vue)
- React 示例: [BarChart.tsx](./BarChart.tsx)

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT
