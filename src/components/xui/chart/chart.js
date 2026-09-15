class BarChart {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    this.options = this.mergeOptions(options);
    this.data = this.options.data || [];
    this.svg = null;
    this.tooltip = null;
    
    this.init();
  }

  mergeOptions(options) {
    const defaultOptions = {
      width: 600,
      height: 400,
      padding: { top: 40, right: 40, bottom: 60, left: 60 },
      data: [],
      colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#13c2c2'],
      barWidth: 40,
      barGap: 20,
      showGrid: true,
      showAxis: true,
      showTooltip: true,
      animationDuration: 500,
      animationEasing: 'easeInOutQuad',
      title: '',
      xAxisLabel: '',
      yAxisLabel: '',
      onBarClick: null,
      onBarHover: null
    };
    
    return { ...defaultOptions, ...options };
  }

  init() {
    this.createSVG();
    this.createTooltip();
    this.render();
  }

  createSVG() {
    const { width, height } = this.options;
    
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.svg.setAttribute('class', 'xui-bar-chart');
    this.svg.style.display = 'block';
    
    this.container.appendChild(this.svg);
  }

  createTooltip() {
    if (!this.options.showTooltip) return;
    
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'xui-chart-tooltip';
    this.tooltip.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 1000;
      white-space: nowrap;
    `;
    
    document.body.appendChild(this.tooltip);
  }

  render() {
    this.clear();
    this.renderTitle();
    this.renderGrid();
    this.renderAxis();
    this.renderBars();
  }

  clear() {
    while (this.svg.firstChild) {
      this.svg.removeChild(this.svg.firstChild);
    }
  }

  renderTitle() {
    if (!this.options.title) return;
    
    const { width, padding, title } = this.options;
    const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleElement.setAttribute('x', width / 2);
    titleElement.setAttribute('y', padding.top / 2);
    titleElement.setAttribute('text-anchor', 'middle');
    titleElement.setAttribute('class', 'xui-chart-title');
    titleElement.style.cssText = 'font-size: 16px; font-weight: bold; fill: #333;';
    titleElement.textContent = title;
    
    this.svg.appendChild(titleElement);
  }

  renderGrid() {
    if (!this.options.showGrid) return;
    
    const { width, height, padding } = this.options;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = this.getMaxValue();
    const gridCount = 5;
    
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartHeight / gridCount) * i;
      const value = maxValue - (maxValue / gridCount) * i;
      
      const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      gridLine.setAttribute('x1', padding.left);
      gridLine.setAttribute('y1', y);
      gridLine.setAttribute('x2', width - padding.right);
      gridLine.setAttribute('y2', y);
      gridLine.setAttribute('stroke', '#e8e8e8');
      gridLine.setAttribute('stroke-width', '1');
      gridLine.setAttribute('stroke-dasharray', '4,4');
      gridLine.setAttribute('class', 'xui-chart-grid-line');
      
      this.svg.appendChild(gridLine);
    }
  }

  renderAxis() {
    if (!this.options.showAxis) return;
    
    this.renderXAxis();
    this.renderYAxis();
  }

  renderXAxis() {
    const { width, height, padding, xAxisLabel } = this.options;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', padding.left);
    xAxis.setAttribute('y1', height - padding.bottom);
    xAxis.setAttribute('x2', width - padding.right);
    xAxis.setAttribute('y2', height - padding.bottom);
    xAxis.setAttribute('stroke', '#333');
    xAxis.setAttribute('stroke-width', '1');
    xAxis.setAttribute('class', 'xui-chart-x-axis');
    
    this.svg.appendChild(xAxis);
    
    if (xAxisLabel) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', width / 2);
      label.setAttribute('y', height - 10);
      label.setAttribute('text-anchor', 'middle');
      label.style.cssText = 'font-size: 12px; fill: #666;';
      label.textContent = xAxisLabel;
      
      this.svg.appendChild(label);
    }
  }

  renderYAxis() {
    const { width, height, padding, yAxisLabel } = this.options;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = this.getMaxValue();
    const gridCount = 5;
    
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', padding.left);
    yAxis.setAttribute('y1', padding.top);
    yAxis.setAttribute('x2', padding.left);
    yAxis.setAttribute('y2', height - padding.bottom);
    yAxis.setAttribute('stroke', '#333');
    yAxis.setAttribute('stroke-width', '1');
    yAxis.setAttribute('class', 'xui-chart-y-axis');
    
    this.svg.appendChild(yAxis);
    
    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + (chartHeight / gridCount) * i;
      const value = maxValue - (maxValue / gridCount) * i;
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', padding.left - 10);
      label.setAttribute('y', y + 4);
      label.setAttribute('text-anchor', 'end');
      label.style.cssText = 'font-size: 11px; fill: #666;';
      label.textContent = Math.round(value);
      
      this.svg.appendChild(label);
    }
    
    if (yAxisLabel) {
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', 15);
      label.setAttribute('y', height / 2);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('transform', `rotate(-90, 15, ${height / 2})`);
      label.style.cssText = 'font-size: 12px; fill: #666;';
      label.textContent = yAxisLabel;
      
      this.svg.appendChild(label);
    }
  }

  renderBars() {
    const { width, height, padding, barWidth, barGap, colors, animationDuration } = this.options;
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = this.getMaxValue();
    
    const totalBarWidth = barWidth + barGap;
    const startX = padding.left + (chartWidth - this.data.length * totalBarWidth) / 2;
    
    this.data.forEach((item, index) => {
      const x = startX + index * totalBarWidth;
      const barHeight = (item.value / maxValue) * chartHeight;
      const y = height - padding.bottom - barHeight;
      const color = colors[index % colors.length];
      
      const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bar.setAttribute('x', x);
      bar.setAttribute('y', height - padding.bottom);
      bar.setAttribute('width', barWidth);
      bar.setAttribute('height', 0);
      bar.setAttribute('fill', color);
      bar.setAttribute('rx', '4');
      bar.setAttribute('ry', '4');
      bar.setAttribute('class', 'xui-chart-bar');
      bar.style.cursor = 'pointer';
      bar.style.transition = `all ${animationDuration}ms ${this.options.animationEasing}`;
      
      this.svg.appendChild(bar);
      
      setTimeout(() => {
        bar.setAttribute('y', y);
        bar.setAttribute('height', barHeight);
      }, 50);
      
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', x + barWidth / 2);
      label.setAttribute('y', height - padding.bottom + 20);
      label.setAttribute('text-anchor', 'middle');
      label.style.cssText = 'font-size: 11px; fill: #666;';
      label.textContent = item.label;
      
      this.svg.appendChild(label);
      
      if (this.options.showTooltip) {
        bar.addEventListener('mouseenter', (e) => this.showTooltip(e, item, color));
        bar.addEventListener('mouseleave', () => this.hideTooltip());
      }
      
      if (this.options.onBarClick) {
        bar.addEventListener('click', () => this.options.onBarClick(item, index));
      }
      
      if (this.options.onBarHover) {
        bar.addEventListener('mouseenter', () => this.options.onBarHover(item, index));
      }
    });
  }

  showTooltip(event, item, color) {
    if (!this.tooltip) return;
    
    const rect = this.container.getBoundingClientRect();
    const x = rect.left + event.clientX - this.container.getBoundingClientRect().left;
    const y = rect.top + event.clientY - this.container.getBoundingClientRect().top;
    
    this.tooltip.innerHTML = `
      <div style="margin-bottom: 4px; font-weight: bold;">${item.label}</div>
      <div style="display: flex; align-items: center;">
        <span style="display: inline-block; width: 8px; height: 8px; background: ${color}; border-radius: 50%; margin-right: 6px;"></span>
        <span>数值: ${item.value}</span>
      </div>
    `;
    
    this.tooltip.style.left = `${event.clientX + 10}px`;
    this.tooltip.style.top = `${event.clientY - 10}px`;
    this.tooltip.style.opacity = '1';
  }

  hideTooltip() {
    if (!this.tooltip) return;
    this.tooltip.style.opacity = '0';
  }

  getMaxValue() {
    if (this.data.length === 0) return 100;
    return Math.max(...this.data.map(item => item.value)) * 1.1;
  }

  update(newData) {
    this.data = newData;
    this.render();
  }

  updateOptions(newOptions) {
    this.options = this.mergeOptions(newOptions);
    this.render();
  }

  resize(width, height) {
    this.options.width = width;
    this.options.height = height;
    this.svg.setAttribute('width', width);
    this.svg.setAttribute('height', height);
    this.render();
  }

  destroy() {
    if (this.tooltip) {
      document.body.removeChild(this.tooltip);
    }
    if (this.container && this.svg) {
      this.container.removeChild(this.svg);
    }
  }
}

export default BarChart

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarChart;
}
