import { defineStore } from 'pinia';
import { computed, ref, watchEffect } from 'vue';

import useLocalStorage from '@/service/LocalStorage';

export const useAppStore = defineStore('appstore', () => {
  const apiKey = ref(useLocalStorage('app-apikey', null));
  const apiModel = ref(useLocalStorage('app-apimodel', 'gpt-3.5-turbo'));
  const appTheme = ref(useLocalStorage('app-theme', 'light'));

  const statuscode = ref();
  const connected = ref(false);
  const prompts = ref([]);
  const tools = ref([]);

  const isOnLine = computed(() => navigator.onLine);
  const isAgent = computed(() => connected.value);
  const isTools = computed(() => tools.value.length > 0);
  const isPrompts = computed(() => prompts.value.length > 0);

  async function connect() {
    if (!isOnLine.value && !apiKey.value && !apiModel.value) {
      return console.error('No internet connection or API key/model provided.');
    }
    const response = await window.agent.connect(apiKey.value, apiModel.value);

    connected.value = response.connected;

    if (response?.tools?.length > 0) {
      tools.value = [...response.tools];
    }

    if (response?.prompts?.length > 0) {
      prompts.value = [...response.prompts];
    }
  }

  async function disconnect() {
    const response = await window.agent.disconnect();

    connected.value = !response.disconnected;

    tools.value = [];

    prompts.value = [];

    apiKey.value = null;
    apiModel.value = null;
  }

  async function sendQuery(query) {
    const response = await window.agent.query(query);

    return response;
  }

  watchEffect(() => {
    if (appTheme.value !== 'system' && appTheme.value !== 'dark' && appTheme.value !== 'light') {
      appTheme.value = 'system';
    }

    window.app.theme(appTheme.value);
  });

  return {
    apiKey,
    apiModel,
    appTheme,
    tools,
    prompts,
    isAgent,
    isOnLine,
    isPrompts,
    isTools,
    statuscode,
    connect,
    disconnect,
    sendQuery
  };
});
