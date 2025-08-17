<template>
  <div class="bookmark-folder">
    <div class="folder-header" :class="{ 'is-expanded': isExpanded }" @click="toggle">
      <div class="folder-icon">
        <svg class="chevron-icon" :class="{ 'is-rotated': isExpanded }" viewBox="0 0 24 24" fill="none"
          stroke="currentColor">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <div class="folder-info">
        <div class="folder-name">{{ folder.title }}</div>
        <div class="folder-count">{{ itemCount }} 项</div>
      </div>
    </div>

    <div v-if="isExpanded && folder.children" class="folder-children" :style="{ paddingLeft: `${level * 6}px` }">
      <template v-for="item in folder.children" :key="item.id">
        <BookmarkFolder v-if="item.isFolder && item.children" :folder="item" :level="level + 1"
          :expanded-folders="expandedFolders" @toggle-folder="handleToggleFolder" @pin="handlePin" @edit="handleEdit"
          @update="handleUpdate" @delete="handleDelete" />

        <BookmarkCard v-else-if="!item.isFolder" :bookmark="item" :show-actions="true" @click="openBookmark(item)"
          @pin="handlePin" @edit="handleEdit" @delete="(bookmark) => handleDelete(bookmark.id)" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookmarkItem } from '@/src/types/bookmark.types';
import BookmarkCard from '@/src/components/sidebar/BookmarkCard.vue';

interface Props {
  folder: BookmarkItem;
  level?: number;
  expandedFolders: Set<string>;
}

interface Emits {
  (e: 'toggleFolder', folderId: string): void;
  (e: 'pin', bookmark: BookmarkItem): void;
  (e: 'edit', bookmark: BookmarkItem): void;
  (e: 'update', id: string, changes: Partial<BookmarkItem>): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
});

const emit = defineEmits<Emits>();

const isExpanded = computed(() => props.expandedFolders.has(props.folder.id));

const itemCount = computed(() => {
  if (!props.folder.children) return 0;
  return countItems(props.folder.children);
});

const toggle = () => {
  emit('toggleFolder', props.folder.id);
};

const handleToggleFolder = (folderId: string) => {
  emit('toggleFolder', folderId);
};

const handlePin = (bookmark: BookmarkItem) => {
  emit('pin', bookmark);
};

const handleUpdate = (id: string, changes: Partial<BookmarkItem>) => {
  emit('update', id, changes);
};

const handleEdit = (bookmark: BookmarkItem) => {
  console.log('BookmarkFolder: 传递编辑事件', bookmark.title, bookmark);
  emit('edit', bookmark);
};

const handleDelete = (id: string) => {
  emit('delete', id);
};

const openBookmark = (bookmark: BookmarkItem) => {
  if (bookmark.url) {
    chrome.tabs.create({ url: bookmark.url });
  }
};


const countItems = (items: BookmarkItem[]): number => {
  let count = 0;
  for (const item of items) {
    if (!item.isFolder) {
      count++;
    }
    if (item.children) {
      count += countItems(item.children);
    }
  }
  return count;
};
</script>

<style scoped>
.bookmark-folder {
  margin-bottom: 2px;
}

.folder-header {
  display: flex;
  align-items: center;
  padding: 5px 0px;
  cursor: pointer;
  transition: var(--transition);
  border-radius: var(--border-radius);
  margin: 2px 0;
}

.folder-header:hover {
  background: var(--background-color);
}

.folder-header.is-expanded {
  background: var(--background-color);
}

.folder-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  color: #f59e0b;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  transition: var(--transition);
}

.chevron-icon.is-rotated {
  transform: rotate(90deg);
}

.folder-icon svg:last-child {
  width: 20px;
  height: 20px;
}

.folder-info {
  flex: 1;
  min-width: 0;
}

.folder-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.folder-children {
  margin-top: 4px;
}

.folder-children .bookmark-card {
  margin: 2px 0;
  margin-left: 6px;
}

.folder-children .bookmark-folder {
  margin-left: 6px;
}
</style>