<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import Sidebar from './components/Sidebar.vue'

const sidebarOpen = ref(false)
</script>

<template>
  <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
  <div class="app-layout">
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
