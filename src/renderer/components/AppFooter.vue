<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

onMounted(() => {});
</script>

<template>
  <Menubar class="rounded-none! border-none!">
    <template #start>
      <span class="text-sm text-neutral-500" v-if="appStore.statuscode">
        <i class="pi pi-spin pi-spinner" /> {{ appStore.statuscode }}
      </span>
    </template>
    <template #end>
      <div class="flex items-center justify-center gap-x-4">
        <i
          :class="[
            'pi pi-globe',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isWebSearch }
          ]"
          v-tooltip.top="{
            value: appStore.isWebSearch ? 'Web search active' : 'No Web search',
            pt: { text: 'text-sm' }
          }"
        />
        <i
          :class="[
            'pi pi-bookmark',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isPrompts }
          ]"
          v-tooltip.top="{
            value: appStore.isPrompts ? `Prompts: ${appStore.prompts.length}` : 'No prompts',
            pt: { text: 'text-sm' }
          }"
        />
        <i
          :class="['pi pi-wrench', 'text-neutral-500', { 'text-emerald-500!': appStore.isTools }]"
          v-tooltip.top="{
            value: appStore.isTools ? `Tools: ${appStore.tools.length}` : 'No tools',
            pt: { text: 'text-sm' }
          }"
        />
        <i
          :class="[
            'pi pi-microchip-ai',
            'text-neutral-500',
            { 'text-emerald-500!': appStore.isAgent }
          ]"
          v-tooltip.top="{
            value: appStore.isAgent ? 'GPT Agent' : 'No GPT Agent',
            pt: { text: 'text-sm' }
          }"
        />
        <i
          :class="['pi pi-wifi', 'text-neutral-500', { 'text-emerald-500!': appStore.isOnLine }]"
          v-tooltip.top="{
            value: appStore.isOnLine ? 'Online' : 'Offline',
            pt: { text: 'text-sm' }
          }"
        />
      </div>
    </template>
  </Menubar>
</template>
