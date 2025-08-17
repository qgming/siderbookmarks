import { ref, computed, onMounted } from 'vue';
import type { BookmarkItem, BookmarkState } from '@/src/types/bookmark.types';
import { BookmarkService, StorageService } from '@/src/services/bookmarkService';

export function useBookmarks() {
  const state = ref<BookmarkState>({
    bookmarks: [],
    pinnedItems: [],
    searchQuery: '',
    expandedFolders: new Set(),
    isLoading: false,
    error: null
  });

  // 计算属性
  const bookmarkCount = computed(() => {
    return countBookmarks(state.value.bookmarks);
  });

  const filteredBookmarks = computed(() => {
    if (!state.value.searchQuery.trim()) {
      return state.value.bookmarks;
    }
    
    const query = state.value.searchQuery.toLowerCase();
    return searchBookmarks(state.value.bookmarks, query);
  });

  const pinnedCount = computed(() => state.value.pinnedItems.length);

  // 方法
  const loadBookmarks = async () => {
    state.value.isLoading = true;
    state.value.error = null;
    
    try {
      const [bookmarks, pinnedIds, expandedFolders] = await Promise.all([
        BookmarkService.getBookmarkBarItems(),
        StorageService.getPinnedBookmarks(),
        StorageService.getExpandedFolders()
      ]);

      state.value.bookmarks = bookmarks;
      state.value.expandedFolders = new Set(expandedFolders);
      
      // 加载置顶书签
      await loadPinnedBookmarks(pinnedIds);
    } catch (error) {
      state.value.error = error instanceof Error ? error.message : '未知错误';
    } finally {
      state.value.isLoading = false;
    }
  };

  const loadPinnedBookmarks = async (pinnedIds: string[]) => {
    if (pinnedIds.length === 0) {
      state.value.pinnedItems = [];
      return;
    }

    try {
      const allBookmarks = await BookmarkService.getBookmarkTree();
      const flatBookmarks = flattenBookmarks(allBookmarks);
      
      state.value.pinnedItems = pinnedIds
        .map(id => flatBookmarks.find(bookmark => bookmark.id === id))
        .filter(Boolean) as BookmarkItem[];
    } catch (error) {
      console.error('加载置顶书签失败:', error);
      state.value.pinnedItems = [];
    }
  };

  const togglePinBookmark = async (bookmark: BookmarkItem) => {
    const isPinned = state.value.pinnedItems.some(item => item.id === bookmark.id);
    let newPinnedItems: BookmarkItem[];
    
    if (isPinned) {
      newPinnedItems = state.value.pinnedItems.filter(item => item.id !== bookmark.id);
    } else {
      if (state.value.pinnedItems.length >= 8) {
        // 如果已满8个，移除第一个（最早置顶的），添加新的
        newPinnedItems = [...state.value.pinnedItems.slice(1), bookmark];
      } else {
        newPinnedItems = [...state.value.pinnedItems, bookmark];
      }
    }
    
    state.value.pinnedItems = newPinnedItems;
    
    // 保存到本地存储
    const pinnedIds = newPinnedItems.map(item => item.id);
    await StorageService.savePinnedBookmarks(pinnedIds);
  };

  const toggleFolder = async (folderId: string) => {
    const newExpanded = new Set(state.value.expandedFolders);
    
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    
    state.value.expandedFolders = newExpanded;
    await StorageService.saveExpandedFolders(Array.from(newExpanded));
  };

  const updateSearchQuery = (query: string) => {
    state.value.searchQuery = query;
  };

  const createBookmark = async (bookmark: Partial<BookmarkItem>) => {
    try {
      const newBookmark = await BookmarkService.createBookmark(bookmark);
      await loadBookmarks();
      return newBookmark;
    } catch (error) {
      throw error;
    }
  };

  const updateBookmark = async (id: string, changes: Partial<BookmarkItem>) => {
    try {
      await BookmarkService.updateBookmark(id, changes);
      await loadBookmarks();
    } catch (error) {
      throw error;
    }
  };

  const deleteBookmark = async (id: string) => {
    try {
      await BookmarkService.deleteBookmark(id);
      
      // 同时从置顶列表中移除
      state.value.pinnedItems = state.value.pinnedItems.filter(item => item.id !== id);
      const pinnedIds = state.value.pinnedItems.map(item => item.id);
      await StorageService.savePinnedBookmarks(pinnedIds);
      
      await loadBookmarks();
    } catch (error) {
      throw error;
    }
  };

  // 工具函数
  function countBookmarks(items: BookmarkItem[]): number {
    let count = 0;
    for (const item of items) {
      if (!item.isFolder) {
        count++;
      }
      if (item.children) {
        count += countBookmarks(item.children);
      }
    }
    return count;
  }

  function filterBookmarks(items: BookmarkItem[], query: string): BookmarkItem[] {
    return items.filter(item => {
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesUrl = item.url?.toLowerCase().includes(query) || false;
      
      if (item.isFolder && item.children) {
        const filteredChildren = filterBookmarks(item.children, query);
        if (filteredChildren.length > 0) {
          return {
            ...item,
            children: filteredChildren
          };
        }
      }
      
      return matchesTitle || matchesUrl;
    });
  }

  function searchBookmarks(items: BookmarkItem[], query: string): BookmarkItem[] {
    const allBookmarks = flattenBookmarks(items);
    return allBookmarks.filter(item => {
      if (item.isFolder) return false; // 搜索时不返回文件夹
      
      const matchesTitle = item.title.toLowerCase().includes(query);
      const matchesUrl = item.url?.toLowerCase().includes(query) || false;
      
      return matchesTitle || matchesUrl;
    });
  }

  function flattenBookmarks(items: BookmarkItem[]): BookmarkItem[] {
    const result: BookmarkItem[] = [];
    
    for (const item of items) {
      result.push(item);
      if (item.children) {
        result.push(...flattenBookmarks(item.children));
      }
    }
    
    return result;
  }

  // 生命周期
  onMounted(() => {
    loadBookmarks();
  });

  return {
    state,
    bookmarkCount,
    filteredBookmarks,
    pinnedCount,
    loadBookmarks,
    togglePinBookmark,
    toggleFolder,
    updateSearchQuery,
    createBookmark,
    updateBookmark,
    deleteBookmark
  };
}