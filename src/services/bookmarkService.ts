import type { BookmarkItem } from '../types/bookmark.types';

export class BookmarkService {
  /**
   * 获取完整的书签树
   */
  static async getBookmarkTree(): Promise<BookmarkItem[]> {
    try {
      const bookmarkTree = await chrome.bookmarks.getTree();
      return this.transformBookmarkNodes(bookmarkTree);
    } catch (error) {
      console.error('获取书签失败:', error);
      throw new Error('无法获取书签数据');
    }
  }

  /**
   * 获取书签栏书签
   */
  static async getBookmarkBarItems(): Promise<BookmarkItem[]> {
    try {
      const bookmarkBar = await chrome.bookmarks.getSubTree('1');
      return this.transformBookmarkNodes(bookmarkBar);
    } catch (error) {
      console.error('获取书签栏失败:', error);
      return [];
    }
  }

  /**
   * 搜索书签
   */
  static async searchBookmarks(query: string): Promise<BookmarkItem[]> {
    if (!query.trim()) return [];
    
    try {
      const results = await chrome.bookmarks.search(query);
      return results.map(item => this.transformBookmarkItem(item));
    } catch (error) {
      console.error('搜索书签失败:', error);
      return [];
    }
  }

  /**
   * 创建新书签
   */
  static async createBookmark(bookmark: Partial<BookmarkItem>): Promise<BookmarkItem> {
    try {
      const newBookmark = await chrome.bookmarks.create({
        title: bookmark.title || '新书签',
        url: bookmark.url,
        parentId: bookmark.parentId
      });
      return this.transformBookmarkItem(newBookmark);
    } catch (error) {
      console.error('创建书签失败:', error);
      throw new Error('无法创建书签');
    }
  }

  /**
   * 更新书签
   */
  static async updateBookmark(id: string, changes: Partial<BookmarkItem>): Promise<BookmarkItem> {
    try {
      const updated = await chrome.bookmarks.update(id, {
        title: changes.title,
        url: changes.url
      });
      return this.transformBookmarkItem(updated);
    } catch (error) {
      console.error('更新书签失败:', error);
      throw new Error('无法更新书签');
    }
  }

  /**
   * 删除书签
   */
  static async deleteBookmark(id: string): Promise<void> {
    try {
      await chrome.bookmarks.remove(id);
    } catch (error) {
      console.error('删除书签失败:', error);
      throw new Error('无法删除书签');
    }
  }

  /**
   * 移动书签
   */
  static async moveBookmark(id: string, parentId: string, index?: number): Promise<void> {
    try {
      await chrome.bookmarks.move(id, {
        parentId,
        index
      });
    } catch (error) {
      console.error('移动书签失败:', error);
      throw new Error('无法移动书签');
    }
  }

  /**
   * 转换Chrome书签节点为我们的格式
   */
  private static transformBookmarkNodes(nodes: chrome.bookmarks.BookmarkTreeNode[]): BookmarkItem[] {
    const result: BookmarkItem[] = [];
    
    for (const node of nodes) {
      if (node.id === '0') {
        // 根节点，处理其子节点
        if (node.children) {
          result.push(...this.transformBookmarkNodes(node.children));
        }
      } else {
        const item = this.transformBookmarkItem(node);
        if (node.children && node.children.length > 0) {
          item.children = this.transformBookmarkNodes(node.children);
        }
        result.push(item);
      }
    }
    
    return result;
  }

  /**
   * 转换单个书签项
   */
  private static transformBookmarkItem(node: chrome.bookmarks.BookmarkTreeNode): BookmarkItem {
    return {
      id: node.id,
      title: node.title || '未命名',
      url: node.url,
      favicon: undefined, // 图标将在组件中实时获取
      isFolder: !node.url,
      parentId: node.parentId,
      dateAdded: node.dateAdded,
      index: node.index,
      children: node.children ? [] : undefined
    };
  }
}

// 本地存储服务
export class StorageService {
  private static readonly PINNED_KEY = 'pinned_bookmarks';
  private static readonly EXPANDED_KEY = 'expanded_folders';

  /**
   * 获取置顶书签
   */
  static async getPinnedBookmarks(): Promise<string[]> {
    try {
      const result = await chrome.storage.local.get(this.PINNED_KEY);
      return result[this.PINNED_KEY] || [];
    } catch (error) {
      console.error('获取置顶书签失败:', error);
      return [];
    }
  }

  /**
   * 保存置顶书签
   */
  static async savePinnedBookmarks(bookmarkIds: string[]): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.PINNED_KEY]: bookmarkIds
      });
    } catch (error) {
      console.error('保存置顶书签失败:', error);
    }
  }

  /**
   * 获取展开的文件夹
   */
  static async getExpandedFolders(): Promise<string[]> {
    try {
      const result = await chrome.storage.local.get(this.EXPANDED_KEY);
      return result[this.EXPANDED_KEY] || [];
    } catch (error) {
      console.error('获取展开文件夹失败:', error);
      return [];
    }
  }

  /**
   * 保存展开的文件夹
   */
  static async saveExpandedFolders(folderIds: string[]): Promise<void> {
    try {
      await chrome.storage.local.set({
        [this.EXPANDED_KEY]: folderIds
      });
    } catch (error) {
      console.error('保存展开文件夹失败:', error);
    }
  }
}