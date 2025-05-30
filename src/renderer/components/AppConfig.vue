<script setup>
import { computed } from 'vue';
import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

defineProps(['visible']);
defineEmits(['update:visible']);

const isInitAgent = computed(() => {
  return appStore.isOnLine && appStore.isAgent;
});

const toggleTheme = event => {
  appStore.appTheme = event.value;
};

const handleReset = () => {
  console.log('OpenAI Reset');
};
</script>

<template>
  <Drawer
    position="right"
    class="w-[30rem]!"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="text-surface-900 dark:text-surface-100 flex content-center font-semibold">
        <div class="flex items-center justify-center">
          <p class="inline-block text-xl">Options</p>
        </div>
      </div>
    </template>

    <Divider class="m-0! mb-8!" />

    <div class="flex flex-col gap-y-4 px-4">
      <div class="flex flex-col gap-y-2" v-if="isInitAgent">
        <p class="flex h-full items-center text-lg font-semibold">OpenAI API</p>
        <div class="flex flex-1 flex-col items-center justify-center gap-y-2">
          <Button
            size="large"
            severity="secondary"
            label="Reset OpenAI API"
            class="my-2 w-full"
            @click="handleReset"
          />
        </div>
      </div>

      <Divider />

      <div class="flex flex-col gap-y-2">
        <p class="flex h-full items-center text-lg font-semibold">Theme style</p>
        <div class="flex-1 justify-center">
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
    </div>
  </Drawer>
</template>
