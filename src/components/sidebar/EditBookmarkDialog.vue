<template>
  <div v-if="visible" class="dialog-overlay" @click.self="handleClose">
    <div class="dialog-container">
      <div class="dialog-header">
        <h3>编辑书签</h3>
        <button class="close-btn" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <div class="form-group">
          <label for="bookmark-title">名称</label>
          <input id="bookmark-title" v-model="form.title" type="text" placeholder="请输入书签名称" maxlength="100"
            @keyup.enter="handleSave" />
        </div>

        <div class="form-group">
          <label for="bookmark-url">链接</label>
          <input id="bookmark-url" v-model="form.url" type="url" placeholder="请输入网址" @keyup.enter="handleSave" />
        </div>
      </div>

      <div class="dialog-footer">
        <button class="btn btn-secondary" @click="handleClose">取消</button>
        <button class="btn btn-primary" @click="handleSave" :disabled="!isValid">
          保存
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { BookmarkItem } from '@/src/types/bookmark.types';

interface Props {
  visible: boolean;
  bookmark: BookmarkItem | null;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'save', bookmark: BookmarkItem, changes: Partial<BookmarkItem>): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref({
  title: '',
  url: ''
});

const isValid = computed(() => {
  return form.value.title.trim() !== '' &&
    (props.bookmark?.isFolder || form.value.url.trim() !== '');
});

watch(() => props.bookmark, (newBookmark) => {
  if (newBookmark) {
    form.value = {
      title: newBookmark.title || '',
      url: newBookmark.url || ''
    };
  }
}, { immediate: true });

const handleClose = () => {
  emit('update:visible', false);
};

const handleSave = () => {
  if (!isValid.value || !props.bookmark) return;

  const changes: Partial<BookmarkItem> = {
    title: form.value.title.trim(),
    url: form.value.url.trim()
  };

  emit('save', props.bookmark, changes);
  handleClose();
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-container {
  background: var(--surface-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.dialog-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  width: 24px;
  height: 24px;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  transition: var(--transition);
}

.close-btn:hover {
  color: var(--text-primary);
}

.close-btn svg {
  width: 16px;
  height: 16px;
}

.dialog-content {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 14px;
  background: var(--surface-color);
  color: var(--text-primary);
  transition: var(--transition);
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 8px 16px;
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-hover);
  border-color: var(--primary-hover);
}

.btn-secondary {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-secondary:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}
</style>