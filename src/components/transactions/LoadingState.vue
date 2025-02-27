<template>
  <div class="bg-white flex-grow flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C8397]"></div>
      <p class="mt-2 text-gray-600">{{ message }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Loading...',
});
</script>
