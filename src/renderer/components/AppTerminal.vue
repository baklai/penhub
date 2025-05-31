<script setup>
import { marked } from 'marked';
import ContextMenu from 'primevue/contextmenu';
import Terminal from 'primevue/terminal';
import TerminalService from 'primevue/terminalservice';
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useAppStore } from '@/stores/appstore';

import 'github-markdown-css';

const appStore = useAppStore();

const contextMenuItems = ref([
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

  // TerminalService.emit('response', `⌛ Loading...`);

  switch (text) {
    case 'exit':
    case 'quit':
      window.app.close();
      return;

    case 'help':
      response = 'Help command: ' + 'Available commands: exit, quit, help';

      TerminalService.emit('response', response);
      break;

    default:
      appStore.statuscode = 'Send message...';

      const data = await appStore.sendQuery(text);

      const terminalCommands = document.querySelectorAll('.p-terminal-command-response');

      const terminalCommand = terminalCommands[terminalCommands.length - 1];

      terminalCommand.classList.add('markdown-body');

      terminalCommand.innerHTML = marked.parse(data.response, {
        async: false,
        breaks: false,
        extensions: null,
        gfm: true,
        hooks: null,
        pedantic: false,
        silent: false,
        tokenizer: null,
        walkTokens: null
      });

      appStore.statuscode = null;

      break;
  }
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
      root: 'min-h-full! w-full! overflow-y-scroll! rounded-none! border-none! select-text! ',
      welcomemessage: 'text-neutral-500 text-sm',
      prompt: 'text-emerald-600 font-bold text-sm',
      response: 'text-neutral-500 text-sm',
      command: 'text-neutral-800! dark:text-neutral-200! text-sm',
      commandtext: 'text-neutral-800! dark:text-neutral-200! text-sm!'
    }"
  />

  <ContextMenu global :model="contextMenuItems" />
</template>

<style>
.markdown-body {
  background-color: transparent !important;
  font-size: 12px !important;
  padding: 10px 20px !important;
}
</style>
