# 🔖 书签侧边栏

基于 Vue 3 开发的现代化浏览器书签管理扩展，提供侧边栏式的直观操作体验。

[![Edge Add-on](https://img.shields.io/badge/Edge%20Add--on-可用-green?style=flat-square&logo=microsoftedge)](https://microsoftedge.microsoft.com/addons/detail/%E4%B9%A6%E7%AD%BE%E4%BE%A7%E8%BE%B9%E6%A0%8F/cibhcgolgfdmgagiibmkenfihaojfkld)
[![Vue 3](https://img.shields.io/badge/Vue%203-最新-blue?style=flat-square&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-支持-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![WXT](https://img.shields.io/badge/WXT-框架-purple?style=flat-square)](https://wxt.dev/)
[![Version](https://img.shields.io/badge/version-2.0.0-orange?style=flat-square)](https://github.com/qgming/siderbookmarks)

![书签侧边栏展示](show.png)

## 功能特性

- 📁 **文件夹管理**：支持多级文件夹结构，可展开/折叠
- 🔍 **智能搜索**：实时搜索书签标题和 URL，高亮匹配结果
- 📌 **固定功能**：将常用书签固定到顶部快速访问
- ✏️ **便捷编辑**：支持重命名、删除、移动书签
- 🎨 **简洁界面**：现代化设计，操作直观
- ⚡ **快速响应**：优化的性能，大量书签也能流畅使用

## 浏览器商店

- **Edge**: [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/%E4%B9%A6%E7%AD%BE%E4%BE%A7%E8%BE%B9%E6%A0%8F/cibhcgolgfdmgagiibmkenfihaojfkld)
- **Chrome**: [GitHub Releases](https://github.com/qgming/siderbookmarks/releases) 下载后开发者模式安装

## 快速开始

### 安装扩展

1. 克隆项目并构建：

```bash
git clone https://github.com/qgming/siderbookmarks.git
cd siderbookmarks
npm install
npm run build
```

2. 浏览器安装：

- 打开 Chrome → 扩展程序 (`chrome://extensions/`)
- 开启"开发者模式"
- 点击"加载已解压的扩展程序"
- 选择 `dist/` 文件夹

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 构建 Firefox 版本
npm run build:firefox
```

## 使用说明

1. **打开侧边栏**：点击浏览器工具栏的扩展图标
2. **搜索书签**：在顶部搜索框输入关键词
3. **固定书签**：点击书签卡片上的图钉图标
4. **编辑书签**：右键书签或点击编辑图标
5. **管理文件夹**：点击文件夹名称展开/折叠内容

## 技术实现

- **前端框架**：Vue 3 + TypeScript
- **扩展框架**：WXT (Web Extension Tools)
- **样式方案**：原生 CSS + Vue 单文件组件
- **构建工具**：Vite

## 项目结构

```
├── entrypoints/          # 扩展入口
│   ├── sidebar/         # 侧边栏页面
│   └── background.ts    # 后台脚本
├── src/
│   ├── components/      # Vue组件
│   ├── composables/     # 组合式函数
│   └── services/        # 书签服务
├── public/              # 静态资源
└── wxt.config.ts       # 扩展配置
```

## 所需权限

- `bookmarks` - 读取和管理书签
- `storage` - 保存用户设置
- `tabs` - 打开书签链接
- `sidePanel` - 使用侧边栏
- `favicon` - 获取网站图标
