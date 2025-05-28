<script setup>
import Terminal from 'primevue/terminal';
import ContextMenu from 'primevue/contextmenu';
import TerminalService from 'primevue/terminalservice';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

const items = ref([
  {
    label: 'Translate',
    icon: 'pi pi-language'
  },
  {
    label: 'Speech',
    icon: 'pi pi-volume-up',
    items: [
      {
        label: 'Start',
        icon: 'pi pi-caret-right'
      },
      {
        label: 'Stop',
        icon: 'pi pi-pause'
      }
    ]
  },
  {
    separator: true
  },
  {
    label: 'Print',
    icon: 'pi pi-print'
  }
]);

const commandHandler = async text => {
  let response;

  TerminalService.emit('response', `⌛ Loading...`);

  switch (text) {
    case 'exit':
    case 'quit':
      window.app.close();
      return;

    case 'help':
      response = 'Help command: ' + 'Available commands: exit, quit, help';
      break;

    default:
      const data = await appStore.sendQuery(text);

      response = data.response;

      break;
  }

  TerminalService.emit('response', response);
};

onMounted(async () => {
  TerminalService.on('command', commandHandler);
});

onBeforeUnmount(() => {
  TerminalService.off('command', commandHandler);
});
</script>

<template>
  <Terminal
    welcomeMessage="Welcome to PenHub Terminal Service"
    prompt="query $"
    aria-label="Penhub Terminal Service"
    :pt="{
      root: 'min-h-full! w-full! overflow-y-scroll! rounded-none! border-none!',
      welcomemessage: 'text-neutral-500 text-sm',
      prompt: 'text-emerald-600 font-bold text-sm',
      response: 'text-neutral-500 text-sm'
    }"
  />

  <ContextMenu global :model="items" />
</template>
