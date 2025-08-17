<template>
  <div class="bookmark-area">
    <div class="bookmark-header" v-if="searchQuery">
      <h3 class="bookmark-title">搜索结果</h3>
      <span class="bookmark-count">{{ totalResults }} 个结果</span>
    </div>

    <div class="bookmark-list">
      <template v-if="searchQuery">
        <BookmarkCard v-for="item in items" :key="item.id" :bookmark="item" :show-actions="true"
          @click="openBookmark(item)" @pin="handlePin" @edit="handleEdit" @delete="handleDelete" />
      </template>
      <template v-else>
        <template v-for="item in items" :key="item.id">
          <BookmarkFolder v-if="item.isFolder && item.children" :folder="item" :level="0"
            :expanded-folders="expandedFolders" @toggle-folder="handleToggleFolder" @pin="handlePin" @edit="handleEdit"
            @update="handleUpdate" @delete="handleDeleteFolder" />

          <BookmarkCard v-else-if="!item.isFolder" :bookmark="item" :show-actions="true" @click="openBookmark(item)"
            @pin="handlePin" @edit="handleEdit" @delete="handleDelete" />
        </template>
      </template>
    </div>

    <div v-if="items.length === 0" class="empty-state">
      <div v-if="searchQuery">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>没有找到匹配的书签</p>
      </div>
      <div v-else>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
        <p>暂无书签</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { BookmarkItem } from '@/src/types/bookmark.types';
import BookmarkCard from '@/src/components/sidebar/BookmarkCard.vue';
import BookmarkFolder from './BookmarkFolder.vue';

interface Props {
  items: BookmarkItem[];
  expandedFolders: Set<string>;
  searchQuery?: string;
}

interface Emits {
  (e: 'toggleFolder', folderId: string): void;
  (e: 'pin', bookmark: BookmarkItem): void;
  (e: 'edit', bookmark: BookmarkItem): void;
  (e: 'update', id: string, changes: Partial<BookmarkItem>): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const totalResults = computed(() => {
  if (props.searchQuery) {
    return props.items.length;
  }
  return countAllItems(props.items);
});

const handleToggleFolder = (folderId: string) => {
  emit('toggleFolder', folderId);
};

const handlePin = (bookmark: BookmarkItem) => {
  emit('pin', bookmark);
};

const handleEdit = (bookmark: BookmarkItem) => {
  console.log('BookmarkArea: 处理编辑事件', bookmark.title, bookmark);
  emit('edit', bookmark);
};

const handleUpdate = (id: string, changes: Partial<BookmarkItem>) => {
  emit('update', id, changes);
};

const handleDelete = (bookmark: BookmarkItem) => {
  emit('delete', bookmark.id);
};

const handleDeleteFolder = (id: string) => {
  emit('delete', id);
};

const openBookmark = (bookmark: BookmarkItem) => {
  if (bookmark.url) {
    chrome.tabs.create({ url: bookmark.url });
  }
};


const countAllItems = (items: BookmarkItem[]): number => {
  let count = 0;
  for (const item of items) {
    if (!item.isFolder) {
      count++;
    }
    if (item.children) {
      count += countAllItems(item.children);
    }
  }
  return count;
};
</script>

<style scoped>
.bookmark-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

.bookmark-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding: 0 4px;
}

.bookmark-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.bookmark-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.bookmark-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
  text-align: center;
}

.empty-state svg {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}
</style>