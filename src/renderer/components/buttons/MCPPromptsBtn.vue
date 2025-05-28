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
      v-tooltip.bottom="'View prompts'"
      v-if="appStore.isPromts"
      @click="toggleDropdown"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
        <path
          fill="currentColor"
          d="M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M11,18H13V15.87C14.73,15.43 16,13.86 16,12A4,4 0 0,0 12,8A4,4 0 0,0 8,12C8,13.86 9.27,15.43 11,15.87V18Z"
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
