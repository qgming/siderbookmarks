export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
  
  // 处理图标点击事件
  browser.action.onClicked.addListener(async (tab) => {
    console.log('图标被点击', { tabId: tab.id, url: tab.url });
    
    if (tab.id && tab.windowId) {
      try {
        // 打开侧边栏
        await browser.sidePanel.open({ windowId: tab.windowId });
        console.log('侧边栏已打开');
      } catch (error) {
        console.error('打开侧边栏失败:', error);
      }
    }
  });
  
  // 监听扩展安装事件
  browser.runtime.onInstalled.addListener((details) => {
    console.log('扩展已安装/更新', details);
  });
});
