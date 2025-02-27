<template>
  <div class="bg-white flex-grow p-8 text-center">
    <p class="text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
// Define props
interface Props {
  message?: string;
}

// Set default props
const props = withDefaults(defineProps<Props>(), {
  message: 'No transactions found.',
});
</script>
