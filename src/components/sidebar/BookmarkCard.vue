<template>
  <div class="bookmark-card" :class="{
    'is-folder': bookmark.isFolder,
    'is-pinned': isPinned,
    'icon-only': showOnlyIcon
  }" :style="cardStyle" @click="handleClick">
    <div class="bookmark-icon">
      <img v-if="shouldShowIcon && !bookmark.isFolder" :src="faviconUrl" :alt="bookmark.title" class="favicon"
        @error="handleImageError" @load="handleImageLoad" />
      <div v-else-if="bookmark.isFolder" class="folder-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>
      <div v-else class="initial-icon">
        {{ getInitial(bookmark.title) }}
      </div>
    </div>

    <div v-if="!showOnlyIcon" class="bookmark-content">
      <div class="bookmark-title" :title="bookmark.title">
        {{ bookmark.title }}
      </div>
      <div v-if="bookmark.url" class="bookmark-url" :title="bookmark.url">
        {{ getDomain(bookmark.url) }}
      </div>
    </div>

    <div v-if="showActions && !showOnlyIcon && !isPinned" class="bookmark-actions">
      <div class="action-buttons-container">
        <button class="action-btn edit-btn" @click.stop="handleEdit" title="编辑">
          <img src="/editor.svg" alt="编辑" class="action-icon" />
        </button>
        <button class="action-btn delete-btn" @click.stop="handleDelete" title="删除">
          <img src="/delate.svg" alt="删除" class="action-icon" />
        </button>
        <button class="action-btn pin-btn" :class="{ 'is-pinned': isPinned }" @click.stop="handlePin"
          :title="isPinned ? '取消置顶' : '置顶'">
          <img src="/pin.svg" alt="置顶" class="pin-icon" :class="{ 'is-pinned': isPinned }" />
        </button>
      </div>
    </div>

    <div v-if="showActions && showOnlyIcon && !isPinned" class="icon-only-actions">
      <div class="action-buttons-container">
        <button class="action-btn edit-btn" @click.stop="handleEdit" title="编辑">
          <img src="/editor.svg" alt="编辑" class="action-icon" />
        </button>
        <button class="action-btn delete-btn" @click.stop="handleDelete" title="删除">
          <img src="/delate.svg" alt="删除" class="action-icon" />
        </button>
        <button class="action-btn pin-btn" :class="{ 'is-pinned': isPinned }" @click.stop="handlePin"
          :title="isPinned ? '取消置顶' : '置顶'">
          <img src="/pin.svg" alt="置顶" class="pin-icon" :class="{ 'is-pinned': isPinned }" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { BookmarkItem } from '@/src/types/bookmark.types';
import { getInitial, getDomain, getFaviconUrlWithFallback } from '@/src/utils/favicon';
import { getImageColor, convertToRGBA } from '@/src/utils/color';

interface Props {
  bookmark: BookmarkItem;
  isPinned?: boolean;
  showActions?: boolean;
  showOnlyIcon?: boolean;
}

interface Emits {
  (e: 'click', bookmark: BookmarkItem): void;
  (e: 'pin', bookmark: BookmarkItem): void;
  (e: 'edit', bookmark: BookmarkItem): void;
  (e: 'delete', bookmark: BookmarkItem): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 跟踪图标加载状态
const imageError = ref(false);
const imageLoaded = ref(false);
const adaptiveColor = ref<string>('');

// 同步获取图标URL
const faviconUrl = computed(() => {
  if (!props.bookmark.url || props.bookmark.isFolder) {
    return '';
  }

  // 优先使用书签自带的图标
  if (props.bookmark.favicon && !imageError.value) {
    return props.bookmark.favicon;
  }

  // 使用带有fallback机制的图标获取
  return getFaviconUrlWithFallback(props.bookmark.url, 32);
});

// 检查是否应该显示图标
const shouldShowIcon = computed(() => {
  return faviconUrl.value && !imageError.value;
});

// 计算自适应背景样式
const cardStyle = computed(() => {
  if (props.isPinned && props.showOnlyIcon && adaptiveColor.value) {
    return {
      background: adaptiveColor.value,
      borderColor: adaptiveColor.value.replace('0.4', '0.6')
    };
  }

  // 默认样式
  if (props.isPinned && props.showOnlyIcon) {
    return {
      background: 'rgba(219, 234, 254, 0.4)',
      borderColor: '#bfdbfe'
    };
  }

  return {};
});

const handleClick = () => {
  emit('click', props.bookmark);
};

const handlePin = () => {
  emit('pin', props.bookmark);
};

const handleEdit = () => {
  console.log('BookmarkCard: 触发编辑事件', props.bookmark.title, props.bookmark);
  emit('edit', props.bookmark);
};

const handleDelete = () => {
  console.log('BookmarkCard: 触发删除事件', props.bookmark.title, props.bookmark);
  emit('delete', props.bookmark);
};


const handleImageError = (event: Event) => {
  console.warn('图标加载失败:', faviconUrl.value, '书签:', props.bookmark.title, props.bookmark.url);
  imageError.value = true;
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
};

const handleImageLoad = (event: Event) => {
  imageLoaded.value = true;

  // 只为置顶的图标卡片提取颜色
  if (props.isPinned && props.showOnlyIcon && props.bookmark.url) {
    extractColorFromImage(event.target as HTMLImageElement);
  }
};

const extractColorFromImage = (img: HTMLImageElement) => {
  try {
    getImageColor(img, (color) => {
      const rgbaColor = convertToRGBA(color, 0.4);
      adaptiveColor.value = rgbaColor;
    });
  } catch (error) {
    console.warn('颜色提取失败:', error);
    // 使用默认颜色
    adaptiveColor.value = 'rgba(219, 234, 254, 0.4)';
  }
};

// 组件挂载时检查是否需要提取颜色
onMounted(() => {
  // 如果图标已经加载完成，立即提取颜色
  if (imageLoaded.value && props.isPinned && props.showOnlyIcon && props.bookmark.url) {
    const img = document.querySelector(`img[alt="${props.bookmark.title}"]`) as HTMLImageElement;
    if (img && img.complete) {
      extractColorFromImage(img);
    }
  }
});
</script>

<style scoped>
.bookmark-card {
  display: flex;
  align-items: center;
  padding: 12px;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  position: relative;
}

.bookmark-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.bookmark-card.is-folder {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.bookmark-card.is-pinned {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.bookmark-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  padding: 6px;
  background: var(--surface-color);
}

.favicon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
}

.folder-icon {
  width: 16px;
  height: 16px;
  color: #f59e0b;
}

.initial-icon {
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 10px;
}

.bookmark-content {
  flex: 1;
  min-width: 0;
}

.bookmark-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.bookmark-url {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bookmark-actions {
  margin-left: 8px;
  opacity: 0;
  transition: var(--transition);
}

.bookmark-card:hover .bookmark-actions {
  opacity: 1;
}

.action-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
}

.action-btn {
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.action-btn:hover {
  color: var(--primary-color);
  background: rgba(59, 130, 246, 0.1);
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-icon {
  width: 14px;
  height: 14px;
  transition: var(--transition);
  filter: grayscale(100%) opacity(0.6);
}

.action-btn:hover .action-icon {
  filter: grayscale(0%) opacity(1);
}

.edit-btn:hover .action-icon {
  filter: grayscale(0%) opacity(1);
}

.delete-btn:hover .action-icon {
  filter: grayscale(0%) opacity(1);
}

.pin-icon {
  width: 16px;
  height: 16px;
  transition: var(--transition);
  filter: grayscale(100%) opacity(0.6);
}

.pin-icon.is-pinned {
  filter: grayscale(0%) opacity(1);
}

.pin-btn.is-pinned .pin-icon {
  filter: grayscale(0%) opacity(1);
}

.pin-btn:hover .pin-icon {
  filter: grayscale(0%) opacity(0.8);
}

.icon-only {
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 6px 4px;
  width: 100%;
  height: 60px;
  border-radius: 8px;
}

.icon-only .bookmark-icon {
  margin-right: 0;
  margin-bottom: 4px;
}

.icon-only .favicon,
.icon-only .initial-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.icon-only .folder-icon {
  width: 32px;
  height: 32px;
}

.icon-only .bookmark-icon {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  padding: 4px;
  background: var(--surface-color);
}

.icon-only-actions {
  position: absolute;
  top: 4px;
  right: 4px;
  opacity: 0;
  transition: var(--transition);
}

.icon-only:hover .icon-only-actions {
  opacity: 1;
}

.icon-only-actions .action-buttons-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 2px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px);
}

.icon-only-actions .action-btn {
  width: 18px;
  height: 18px;
  background: none;
  border-radius: 50%;
  box-shadow: none;
}

.icon-only-actions .action-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.icon-only-actions .action-btn svg {
  width: 10px;
  height: 10px;
}

.icon-only-actions .pin-icon {
  width: 10px;
  height: 10px;
}

.icon-only-actions .action-icon {
  width: 8px;
  height: 8px;
}
</style>