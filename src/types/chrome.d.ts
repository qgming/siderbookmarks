declare namespace chrome {
  namespace bookmarks {
    interface BookmarkTreeNode {
      id: string;
      parentId?: string;
      index?: number;
      url?: string;
      title: string;
      dateAdded?: number;
      children?: BookmarkTreeNode[];
    }

    function getTree(): Promise<BookmarkTreeNode[]>;
    function getSubTree(id: string): Promise<BookmarkTreeNode[]>;
    function search(query: string | { query?: string; url?: string; title?: string }): Promise<BookmarkTreeNode[]>;
    function create(bookmark: {
      title?: string;
      url?: string;
      parentId?: string;
      index?: number;
    }): Promise<BookmarkTreeNode>;
    function update(id: string, changes: {
      title?: string;
      url?: string;
    }): Promise<BookmarkTreeNode>;
    function remove(id: string): Promise<void>;
    function move(id: string, destination: {
      parentId?: string;
      index?: number;
    }): Promise<BookmarkTreeNode>;
  }

  namespace storage {
    interface StorageArea {
      get(keys?: string | string[] | { [key: string]: any } | null): Promise<{ [key: string]: any }>;
      set(items: { [key: string]: any }): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    const local: StorageArea;
    const sync: StorageArea;
  }

  namespace tabs {
    interface Tab {
      id?: number;
      index: number;
      windowId: number;
      openerTabId?: number;
      selected?: boolean;
      highlighted: boolean;
      active: boolean;
      pinned: boolean;
      audible?: boolean;
      discarded: boolean;
      autoDiscardable: boolean;
      mutedInfo?: MutedInfo;
      url?: string;
      title?: string;
      favIconUrl?: string;
      status?: string;
      incognito: boolean;
      width?: number;
      height?: number;
      sessionId?: string;
    }

    interface MutedInfo {
      muted: boolean;
      reason?: string;
      extensionId?: string;
    }

    interface CreateProperties {
      windowId?: number;
      index?: number;
      url?: string;
      active?: boolean;
      pinned?: boolean;
      openerTabId?: number;
    }

    function create(createProperties: CreateProperties): Promise<Tab>;
  }
}