/**
 * 获取网站的域名
 * @param url 网站URL
 * @returns 域名
 */
export function getDomain(url: string): string {
  if (!url) return '';
  
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return '';
  }
}

/**
 * 获取网站的首字母（用于没有favicon时的占位符）
 * @param title 网站标题
 * @returns 首字母
 */
export function getInitial(title: string): string {
  if (!title) return '?';
  return title.charAt(0).toUpperCase();
}

/**
 * 格式化书签标题（如果为空则使用域名）
 * @param title 原始标题
 * @param url 网站URL
 * @returns 格式化后的标题
 */
export function formatBookmarkTitle(title: string, url?: string): string {
  if (title && title.trim()) {
    return title.trim();
  }
  
  if (url) {
    const domain = getDomain(url);
    return domain || '未命名书签';
  }
  
  return '未命名书签';
}

/**
 * 缓存对象，避免重复生成相同的URL
 */
const faviconCache = new Map<string, string>();

/**
 * 获取Chrome扩展的favicon URL
 * 使用Chrome官方推荐的favicon API，参考sidebar.js的实现方式
 */
export function getChromeFaviconUrl(url: string, size: number = 32): string {
  if (!url) return '';
  
  // 检查缓存
  const cacheKey = `${url}_${size}`;
  if (faviconCache.has(cacheKey)) {
    return faviconCache.get(cacheKey)!;
  }
  
  try {
    // 验证URL格式
    new URL(url);
    
    // 使用与sidebar.js相同的格式，更简洁高效
    const faviconUrl = `chrome-extension://${chrome.runtime.id}/_favicon?pageUrl=${encodeURIComponent(url)}&size=${size}`;
    
    // 缓存结果
    faviconCache.set(cacheKey, faviconUrl);
    return faviconUrl;
  } catch (error) {
    console.warn('生成Chrome favicon URL失败:', error);
    return '';
  }
}

/**
 * 获取本地默认图标URL作为fallback
 */
export function getLocalDefaultIcon(size: number = 32): string {
  try {
    // 优先使用扩展内的本地图标
    const iconPath = `/icon/${size}.png`;
    return chrome.runtime.getURL(iconPath);
  } catch (error) {
    console.warn('获取本地默认图标失败:', error);
    // 最后的fallback：使用字母占位符
    return '';
  }
}

/**
 * 获取字母占位符图标
 */
export function getLetterIcon(title: string): string {
  const initial = getInitial(title);
  // 创建SVG字母图标
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="4" fill="#3b82f6"/>
      <text x="16" y="22" font-family="Arial, sans-serif" font-size="16" font-weight="bold" 
            text-anchor="middle" fill="white">${initial}</text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

/**
 * 获取网站favicon的完整URL，使用Chrome官方API
 * 包含完整的fallback机制
 */
export function getFaviconUrlWithFallback(url: string, size: number = 32): string {
  if (!url) return getLetterIcon('?');
  
  // 特殊协议处理
  if (url.startsWith('chrome://') || url.startsWith('edge://') || url.startsWith('about:')) {
    return getLetterIcon('特殊');
  }
  
  // 文件协议处理
  if (url.startsWith('file://')) {
    return getLetterIcon('文件');
  }
  
  // 尝试获取Chrome favicon
  const chromeFavicon = getChromeFaviconUrl(url, size);
  if (chromeFavicon) {
    return chromeFavicon;
  }
  
  // 尝试本地默认图标
  const localIcon = getLocalDefaultIcon(size);
  if (localIcon) {
    return localIcon;
  }
  
  // 最后的fallback：字母图标
  return getLetterIcon(getDomain(url) || '?');
}

/**
 * 预加载favicon以提高性能
 */
export function preloadFavicon(url: string, size: number = 32): void {
  if (!url || typeof window === 'undefined') return;
  
  const faviconUrl = getFaviconUrlWithFallback(url, size);
  if (faviconUrl && !faviconUrl.startsWith('data:')) {
    const img = new Image();
    img.src = faviconUrl;
  }
}

/**
 * 清除favicon缓存
 */
export function clearFaviconCache(): void {
  faviconCache.clear();
}

/**
 * 获取缓存统计信息（用于调试）
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: faviconCache.size,
    keys: Array.from(faviconCache.keys())
  };
}