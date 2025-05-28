<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { useAppStore } from '@/stores/appstore';

const appStore = useAppStore();

const isOpen = ref(false);
const dropdownRef = ref(null);

function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

function handleClickOutside(event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative inline-block text-left">
    <button
      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white/60 hover:bg-[#383838] hover:text-white/80"
      v-tooltip.bottom="'View tools'"
      v-if="appStore.isTools"
      @click="toggleDropdown"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
        <path
          fill="currentColor"
          d="M21.71 20.29L20.29 21.71A1 1 0 0 1 18.88 21.71L7 9.85A3.81 3.81 0 0 1 6 10A4 4 0 0 1 2.22 4.7L4.76 7.24L5.29 6.71L6.71 5.29L7.24 4.76L4.7 2.22A4 4 0 0 1 10 6A3.81 3.81 0 0 1 9.85 7L21.71 18.88A1 1 0 0 1 21.71 20.29M2.29 18.88A1 1 0 0 0 2.29 20.29L3.71 21.71A1 1 0 0 0 5.12 21.71L10.59 16.25L7.76 13.42M20 2L16 4V6L13.83 8.17L15.83 10.17L18 8H20L22 4Z"
        />
      </svg>
    </button>

    <transition name="fade">
      <div
        v-if="isOpen"
        class="ring-opacity-5 absolute left-0 z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black"
      >
        <div class="py-2">
          <p
            v-for="tool of appStore.tools"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {{ tool.name }} - {{ tool.description }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
