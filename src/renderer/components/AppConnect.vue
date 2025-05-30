<script setup>
import { ref } from 'vue';

import AppLogo from '@/components/AppLogo.vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

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
</script>

<template>
  <div class="flex h-full flex-col items-center justify-center bg-white dark:bg-black">
    <div class="flex w-[30rem] flex-1 flex-col items-center justify-center gap-y-2">
      <Card style="width: 25rem; overflow: hidden">
        <template #header>
          <AppLogo class="mx-auto mt-4" />
        </template>

        <template #content>
          <div class="flex flex-col items-center justify-center gap-y-4">
            <p class="text-center text-sm text-neutral-500 dark:text-neutral-400">
              Please enter your
              <a href="https://platform.openai.com" target="_blank" class="font-bold">OpenAI API</a>
              key and select a model to continue.
            </p>

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
          </div>
        </template>

        <template #footer>
          <Button
            size="large"
            severity="secondary"
            label="Continue"
            class="my-2 w-full"
            @click="handleContinue"
          />
        </template>
      </Card>
    </div>
  </div>
</template>
