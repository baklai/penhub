<script setup>
import { computed, onMounted } from 'vue';

import AppConnect from '@/components/AppConnect.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppTerminal from '@/components/AppTerminal.vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

const isConnected = computed(() => {
  return appStore.isOnLine && appStore.isAgent;
});

onMounted(async () => {
  await appStore.connect();
});
</script>

<template>
  <div class="flex h-screen w-full flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1">
      <AppTerminal v-if="isConnected" />
      <AppConnect v-else />
    </main>
    <AppFooter class="flex-none" />
  </div>
</template>
