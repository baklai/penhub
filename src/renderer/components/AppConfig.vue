<script setup>
import { ref, computed } from 'vue';

import AppConnect from '@/components/AppConnect.vue';
import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

defineProps(['visible']);
defineEmits(['update:visible']);

const isInitAgent = computed(() => {
  return appStore.isOnLine && appStore.isAgent;
});

const models = ref([
  { name: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
  { name: 'gpt-4', value: 'gpt-4' },
  { name: 'gpt-4o', value: 'gpt-4o' }
]);

const handleContinue = async () => {
  if (appStore.apiKey && appStore.apiModel) {
    await appStore.connect();
  }
};

const toggleTheme = event => {
  appStore.appTheme = event.value;
};

const handleReset = async () => {
  await appStore.disconnect();
};
</script>

<template>
  <Drawer
    position="left"
    class="w-[30rem]!"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="text-surface-900 dark:text-surface-100 flex content-center font-semibold">
        <div class="flex items-center justify-center">
          <p class="text-md inline-block uppercase"><i class="pi pi-cog" /> Options</p>
        </div>
      </div>
    </template>

    <Divider class="m-0! mb-8!" />

    <div class="flex flex-col gap-y-4 px-4">
      <div class="flex flex-col gap-y-2">
        <p>GPT Agent</p>
        <div class="flex flex-col items-center justify-center gap-y-4" v-if="!isInitAgent">
          <FloatLabel variant="in" class="w-full">
            <InputText id="api-key" v-model="appStore.apiKey" variant="filled" class="w-full" />
            <label for="api-key">OpenAI API Key</label>
          </FloatLabel>

          <FloatLabel class="w-full" variant="in">
            <Select
              v-model="appStore.apiModel"
              inputId="in_label"
              :options="models"
              optionLabel="name"
              optionValue="value"
              class="w-full"
              variant="filled"
            />
            <label for="in_label">OpenAI API Model</label>
          </FloatLabel>

          <Button
            size="large"
            severity="secondary"
            label="Continue"
            class="my-2 w-full"
            @click="handleContinue"
          />
        </div>
        <Button
          severity="contrast"
          label="Disconnect"
          class="my-2 w-full"
          @click="handleReset"
          v-else
        />
      </div>

      <div class="flex flex-col gap-y-2">
        <p>Theme style</p>
        <SelectButton
          optionLabel="name"
          optionValue="value"
          :options="[
            { name: 'system', value: 'system' },
            { name: 'light', value: 'light' },
            { name: 'dark', value: 'dark' }
          ]"
          v-model="appStore.appTheme"
          :pt="{ root: { class: ['w-full'] }, pctogglebutton: { root: { class: ['w-1/2'] } } }"
          @change="toggleTheme"
        />
      </div>
    </div>
  </Drawer>
</template>
