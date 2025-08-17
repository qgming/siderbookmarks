<template>
  <div class="pinned-area" v-if="items.length > 0">
    <div class="pinned-grid">
      <BookmarkCard v-for="item in items" :key="item.id" :bookmark="item" :is-pinned="true" :show-actions="true"
        :show-only-icon="true" @click="openBookmark(item)" @pin="handleUnpin(item)" @edit="handleEdit"
        @delete="handleDelete" />
    </div>

    <!-- 空状态已移除，没有内容时组件将完全隐藏 -->
  </div>
</template>

<script setup lang="ts">
import type { BookmarkItem } from '@/src/types/bookmark.types';
import BookmarkCard from '@/src/components/sidebar/BookmarkCard.vue';

interface Props {
  items: BookmarkItem[];
  maxItems?: number;
  showEmpty?: boolean;
}

interface Emits {
  (e: 'pin', bookmark: BookmarkItem): void;
  (e: 'unpin', bookmark: BookmarkItem): void;
  (e: 'edit', bookmark: BookmarkItem): void;
  (e: 'delete', bookmark: BookmarkItem): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxItems: 8,
  showEmpty: true
});

const emit = defineEmits<Emits>();

const openBookmark = (bookmark: BookmarkItem) => {
  if (bookmark.url) {
    chrome.tabs.create({ url: bookmark.url });
  }
};

const handleUnpin = (bookmark: BookmarkItem) => {
  emit('unpin', bookmark);
};

const handleEdit = (bookmark: BookmarkItem) => {
  console.log('PinnedArea: 传递编辑事件', bookmark.title, bookmark);
  emit('edit', bookmark);
};

const handleDelete = (bookmark: BookmarkItem) => {
  emit('delete', bookmark);
};

</script>

<style scoped>
.pinned-area {
  padding: 12px;
  border-bottom: 1px solid var(--border-color);
}

.pinned-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  padding: 0 6px;
}

.pinned-grid .bookmark-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
}

.pinned-grid .bookmark-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--text-secondary);
  text-align: center;
}

.empty-state svg {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 12px;
  margin: 0;
}
</style>