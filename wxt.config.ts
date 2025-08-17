import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    name: '书签侧边栏',
    description: '现代化的浏览器书签管理侧边栏',
    version: '2.0.0',
    permissions: [
      'bookmarks',
      'storage',
      'tabs',
      'sidePanel',
      'favicon'
    ],
    side_panel: {
      default_path: 'sidebar.html'
    },
    action: {
      default_title: '打开书签侧边栏',
      default_icon: {
        16: 'icon/16.png',
        32: 'icon/32.png',
        48: 'icon/48.png',
        128: 'icon/128.png'
      }
    },
    icons: {
      16: 'icon/16.png',
      32: 'icon/32.png',
      48: 'icon/48.png',
      128: 'icon/128.png'
    },
    web_accessible_resources: [
      {
        resources: ['_favicon/*'],
        matches: ['<all_urls>']
      }
    ]
  }
});
