<template>
  <h1 class="text-xl font-bold text-white p-4 bg-[#0C8397] w-full">{{ title }}</h1>
</template>

<script setup lang="ts">
// Define props
interface Props {
  title?: string;
}

// Set default props
const props = withDefaults(defineProps<Props>(), {
  title: 'Recent Transactions',
});
</script>
