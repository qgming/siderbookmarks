<template>
  <div class="top-bar">
    <div class="left-section">
      <span class="count">{{ bookmarkCount }}</span>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input v-model="localSearchQuery" type="text" placeholder="搜索书签..." class="search-input"
          @input="handleSearch" />
        <button v-if="localSearchQuery" class="clear-btn" @click="clearSearch">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  bookmarkCount: number;
  searchQuery: string;
}

interface Emits {
  (e: 'update:searchQuery', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const localSearchQuery = ref(props.searchQuery);

watch(() => props.searchQuery, (newQuery) => {
  localSearchQuery.value = newQuery;
});

const handleSearch = () => {
  emit('update:searchQuery', localSearchQuery.value);
};

const clearSearch = () => {
  localSearchQuery.value = '';
  emit('update:searchQuery', '');
};
</script>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  height: 44px;
  gap: 12px;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.count {
  font-size: 13px;
  color: var(--text-secondary);
  background: var(--background-color);
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

.search-container {
  flex: 1;
  min-width: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 8px;
  width: 14px;
  height: 14px;
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 6px 28px 6px 28px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 13px;
  background: var(--background-color);
  transition: var(--transition);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.search-input::placeholder {
  color: var(--text-secondary);
  font-size: 12px;
}

.clear-btn {
  position: absolute;
  right: 6px;
  width: 16px;
  height: 16px;
  padding: 0;
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.clear-btn:hover {
  color: var(--text-primary);
}

.clear-btn svg {
  width: 12px;
  height: 12px;
}
</style>