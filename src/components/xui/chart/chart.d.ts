export interface ChartData {
  label: string
  value: number
}

export interface ChartOptions {
  width?: number
  height?: number
  padding?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  data?: ChartData[]
  colors?: string[]
  barWidth?: number
  barGap?: number
  showGrid?: boolean
  showAxis?: boolean
  showTooltip?: boolean
  animationDuration?: number
  animationEasing?: string
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  onBarClick?: (item: ChartData, index: number) => void
  onBarHover?: (item: ChartData, index: number) => void
}

export default class BarChart {
  constructor(container: string | HTMLElement, options?: ChartOptions)
  update(newData: ChartData[]): void
  updateOptions(newOptions: ChartOptions): void
  resize(width: number, height: number): void
  destroy(): void
}
