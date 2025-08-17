<template>
  <div class="sidebar">
    <TopBar :bookmark-count="bookmarkCount" :search-query="state.searchQuery"
      @update:search-query="updateSearchQuery" />

    <PinnedArea v-if="!state.searchQuery.trim()" :items="state.pinnedItems" :max-items="8" @pin="togglePinBookmark"
      @unpin="togglePinBookmark" @edit="handleEdit" @delete="(bookmark) => deleteBookmark(bookmark.id)" />

    <BookmarkArea :items="filteredBookmarks" :expanded-folders="state.expandedFolders" :search-query="state.searchQuery"
      @toggle-folder="toggleFolder" @pin="togglePinBookmark" @edit="handleEdit" @update="updateBookmark"
      @delete="deleteBookmark" />

    <EditBookmarkDialog v-model:visible="showEditDialog" :bookmark="editingBookmark" @save="handleSaveBookmark" />

    <div v-if="state.isLoading" class="loading">
      <div class="loading-spinner"></div>
      <span>加载中...</span>
    </div>

    <div v-if="state.error" class="error">
      <span>{{ state.error }}</span>
      <button @click="loadBookmarks" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBookmarks } from '@/src/composables/useBookmarks';
import type { BookmarkItem } from '@/src/types/bookmark.types';
import TopBar from '@/src/components/sidebar/TopBar.vue';
import PinnedArea from '@/src/components/sidebar/PinnedArea.vue';
import BookmarkArea from '@/src/components/sidebar/BookmarkArea.vue';
import EditBookmarkDialog from '@/src/components/sidebar/EditBookmarkDialog.vue';

const {
  state,
  bookmarkCount,
  filteredBookmarks,
  loadBookmarks,
  togglePinBookmark,
  toggleFolder,
  updateSearchQuery,
  updateBookmark,
  deleteBookmark
} = useBookmarks();

const showEditDialog = ref(false);
const editingBookmark = ref<BookmarkItem | null>(null);

const handleEdit = (bookmark: BookmarkItem) => {
  console.log('Sidebar: 处理编辑事件，显示编辑对话框', bookmark.title, bookmark);
  editingBookmark.value = bookmark;
  showEditDialog.value = true;
};

const handleSaveBookmark = (bookmark: BookmarkItem, changes: Partial<BookmarkItem>) => {
  updateBookmark(bookmark.id, changes);
};
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--background-color);
  overflow: hidden;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #ef4444;
  text-align: center;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);
}

.retry-btn:hover {
  background: var(--primary-hover);
}
</style>