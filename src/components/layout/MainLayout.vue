<template>
  <main
    class="w-full h-[calc(100vh-4rem)] bg-cover bg-center p-8"
    :style="{ backgroundImage: `url(${backgroundImage})` }"
  >
    <slot>
      <!-- Default content -->
      <two-column-layout />
    </slot>
  </main>
</template>

<script setup lang="ts">
import TwoColumnLayout from './TwoColumnLayout.vue';

// Define props
interface Props {
  backgroundImage?: string;
}

// Set default props
const props = withDefaults(defineProps<Props>(), {
  backgroundImage: '/background.jpg',
});
</script>
