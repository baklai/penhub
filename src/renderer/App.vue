<script setup>
import { computed, onMounted, ref } from 'vue';

import AppConnect from '@/components/AppConnect.vue';
import AppFooter from '@/components/AppFooter.vue';
import AppHeader from '@/components/AppHeader.vue';
import AppLoading from '@/components/AppLoading.vue';
import AppTerminal from '@/components/AppTerminal.vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

const isAppMounted = ref(true);

const isInitAgent = computed(() => {
  return appStore.isOnLine && appStore.isAgent;
});

onMounted(async () => {
  await appStore.connect();

  isAppMounted.value = false;
});
</script>

<template>
  <div class="flex h-screen w-full flex-col overflow-hidden">
    <AppHeader />
    <main class="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <AppLoading v-if="isAppMounted" />
      <AppTerminal v-else-if="isInitAgent" />
      <AppConnect v-else />
    </main>
    <AppFooter class="flex-none" />
  </div>
</template>
