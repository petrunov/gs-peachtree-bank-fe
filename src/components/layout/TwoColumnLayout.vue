<template>
  <div class="flex gap-6 h-full">
    <!-- Left column -->
    <div class="w-3/12 bg-white rounded-lg shadow-lg p-6">
      <slot name="left-column">
        <div class="text-gray-500">Left column content</div>
      </slot>
    </div>

    <!-- Right column -->
    <div class="w-9/12 bg-white rounded-lg shadow-lg p-6">
      <slot name="right-column">
        <div class="text-gray-500">Right column content</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
// TwoColumnLayout component
</script>
