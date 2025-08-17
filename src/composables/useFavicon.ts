import { computed } from 'vue';
import type { BookmarkItem } from '@/src/types/bookmark.types';
import { getChromeFaviconUrl, getFaviconUrlWithFallback } from '@/src/utils/favicon';

export function useFavicon() {
  /**
   * 获取单个书签的图标URL
   */
  const getFaviconForBookmark = computed(() => (bookmark: BookmarkItem): string => {
    if (!bookmark.url || bookmark.isFolder) {
      return '';
    }

    // 优先使用书签自带的图标
    if (bookmark.favicon) {
      return bookmark.favicon;
    }

    // 使用带有fallback机制的图标获取
    return getFaviconUrlWithFallback(bookmark.url, 32);
  });

  return {
    getFaviconForBookmark
  };
}