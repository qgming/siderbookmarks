export interface BookmarkItem {
  id: string;
  title: string;
  url?: string;
  favicon?: string;
  isFolder: boolean;
  children?: BookmarkItem[];
  parentId?: string;
  dateAdded?: number;
  index?: number;
}

export interface BookmarkState {
  bookmarks: BookmarkItem[];
  pinnedItems: BookmarkItem[];
  searchQuery: string;
  expandedFolders: Set<string>;
  isLoading: boolean;
  error: string | null;
}

export interface ContextMenuItem {
  label: string;
  action: () => void;
  icon?: string;
  disabled?: boolean;
}

export interface BookmarkTreeNode extends BookmarkItem {
  level: number;
  isExpanded: boolean;
  hasChildren: boolean;
}

export interface SearchResult {
  items: BookmarkItem[];
  totalCount: number;
}