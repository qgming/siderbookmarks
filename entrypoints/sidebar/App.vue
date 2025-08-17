<template>
  <div class="sidebar-container">
    <Sidebar />
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/src/components/sidebar/Sidebar.vue';
</script>

<style scoped>
.sidebar-container {
  width: 100%;
  height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>