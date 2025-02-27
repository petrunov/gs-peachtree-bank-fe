<template>
  <main
    class="main-container w-full h-[calc(100vh-120px)] bg-cover bg-center px-25 py-15"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
    }"
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
