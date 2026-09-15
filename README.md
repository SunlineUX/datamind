# DataMind - 数据开发平台

基于 Vue 3 + Vite 构建的数据开发平台前端工程，采用 `<script setup>` 单文件组件开发模式。

## 技术栈

- **框架**：Vue 3（`<script setup>` SFC）
- **构建工具**：Vite
- **路由**：Vue Router
- **状态管理**：Pinia
- **国际化**：自研 i18n 方案，支持 `zh-CN` / `en-US`
- **主题**：支持浅色 / 深色 / 跟随系统三种模式
- **包管理**：pnpm

## 主要功能模块

- **首页 / 搜索**：平台入口与全局检索
- **数据开发**：在线数据开发工作台
- **数据运维**：实时任务、批量任务、实时加工监控
- **AI & ML**：AI 与机器学习相关能力
- **资产目录**：工作流、数据源、资产目录管理
- **设置**：平台与用户配置

## 目录结构

```
src/
├── assets/          # 静态资源、全局样式、字体图标
├── components/
│   ├── dm/          # 平台基础组件库（Button、Input、Select 等）
│   └── xui/         # 扩展 UI 组件库（basic / chart / form / layout / navigation …）
├── composables/     # 组合式函数（useLocale、useTheme）
├── layout/          # 应用框架（AppLayout、Sidebar、AiPanel、WorkPanel）
├── locales/         # 国际化文案（zh-CN / en-US 及页面级文案）
├── router/          # 路由配置
├── store/           # Pinia 状态
├── views/           # 页面（Home、Search、Develop、RealtimeMonitor、ComponentsView 等）
├── App.vue
└── main.js
```

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务
pnpm dev

# 构建生产包
pnpm build

# 本地预览构建产物
pnpm preview
```

## 说明

本仓库为前端工程，采用 Vue 3 `<script setup>` 语法。如需了解 `<script setup>` 的更多用法，可参考 [Vue 官方文档](https://vuejs.org/api/sfc-script-setup.html)。
