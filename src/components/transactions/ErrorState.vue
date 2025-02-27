<template>
  <div class="bg-white flex-grow p-6">
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  message: string;
}

defineProps<Props>();
</script>
