<script setup>
import { defineAsyncComponent, onMounted, ref } from 'vue';

import AppLogo from '@/components/AppLogo.vue';

const AppConfig = defineAsyncComponent(() => import('@/components/AppConfig.vue'));

const sidebar = ref(false);
const alwaysOnTop = ref(false);
const isMaximized = ref(false);

const menubarItems = ref([
  {
    label: 'Chat',
    items: [
      {
        label: 'New',
        icon: 'pi pi-fw pi-plus'
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash'
      },
      {
        separator: true
      },
      {
        label: 'Export',
        icon: 'pi pi-fw pi-external-link'
      }
    ]
  },
  {
    label: 'MCP',
    items: [
      {
        label: 'Prompts',
        items: [
          {
            label: 'Ping all hosts',
            icon: 'pi pi-bookmark'
          }
        ]
      },
      {
        label: 'Tools',
        items: [
          {
            label: 'Ping all hosts',
            icon: 'pi pi-wrench'
          }
        ]
      }
    ]
  },

  {
    label: 'Options',
    command: () => {
      sidebar.value = !sidebar.value;
    }
  }
]);

const onAlwaysOnTop = () => {
  alwaysOnTop.value = !alwaysOnTop.value;
  window.app.ontop(alwaysOnTop.value);
};

const onMinimize = () => {
  window.app.minimize();
};

const onMaximize = () => {
  window.app.maximize();
};

const onClose = async () => {
  window.app.close();
};

onMounted(() => {
  window.app.on('isMaximized', () => {
    isMaximized.value = true;
  });

  window.app.on('isRestored', () => {
    isMaximized.value = false;
  });
});
</script>

<template>
  <Menubar
    :model="menubarItems"
    breakpoint="400px"
    class="rounded-none! border-none!"
    :buttonProps="{
      class: 'bg-transparent rounded-sm! border-none! text-2xl!'
    }"
  >
    <template #start>
      <AppLogo width="100" height="30" />
    </template>

    <template #end>
      <div class="flex items-center justify-center">
        <Button
          severity="contrast"
          variant="text"
          icon="pi pi-thumbtack"
          :class="['mx-2', alwaysOnTop ? 'text-emerald-500!' : 'text-neutral-500!']"
          v-tooltip.bottom="'Always On Top'"
          @click="onAlwaysOnTop"
        />

        <Button severity="contrast" variant="text" @click="onMinimize">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path fill="currentColor" d="M20,14H4V10H20" />
            </svg>
          </template>
        </Button>

        <Button severity="contrast" variant="text" @click="onMaximize">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M4,8H8V4H20V16H16V20H4V8M16,8V14H18V6H10V8H16M6,12V18H14V12H6Z"
                v-if="isMaximized"
              />
              <path fill="currentColor" d="M4,4H20V20H4V4M6,8V18H18V8H6Z" v-else />
            </svg>
          </template>
        </Button>

        <Button severity="contrast" variant="text" @click="onClose" class="hover:bg-red-500/50!">
          <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
              <path
                fill="currentColor"
                d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
              />
            </svg>
          </template>
        </Button>
      </div>
    </template>
  </Menubar>

  <AppConfig v-model:visible="sidebar" v-if="sidebar" />
</template>
