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
      <div class="flex flex-col gap-y-2" v-if="isInitAgent">
        <p>GPT Agent</p>
        <Button severity="contrast" label="Disconnect" class="my-2 w-full" @click="handleReset" />
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
