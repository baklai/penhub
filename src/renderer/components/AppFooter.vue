<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

onMounted(() => {});
</script>

<template>
  <Menubar class="rounded-none! border-none!">
    <template #start>
      <span class="text-sm text-neutral-500"> <i class="pi pi-spin pi-spinner" /> Loading...</span>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-x-4">
        <i
          :class="[
            'pi pi-globe',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isWebSearch }
          ]"
          v-tooltip.top="'Web search'"
        />
        <i
          :class="[
            'pi pi-bookmark',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isPrompts }
          ]"
          v-tooltip.top="'Prompts'"
        />
        <i
          :class="['pi pi-wrench', 'text-neutral-500', { 'text-emerald-500!': appStore.isTools }]"
          v-tooltip.top="'Tools'"
        />
        <i
          :class="[
            'pi pi-microchip-ai',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isAgent }
          ]"
          v-tooltip.top="'OpenAI API'"
        />
        <i
          :class="['pi pi-wifi', 'text-neutral-500', { 'text-emerald-500!': appStore.isOnLine }]"
          v-tooltip.top="'Internet'"
        />
      </div>
    </template>
  </Menubar>
</template>
