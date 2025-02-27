<template>
  <div class="flex gap-6 h-full">
    <!-- Left column -->
    <div class="w-3/12 bg-white rounded-lg shadow-lg p-6">
      <slot name="left-column"> </slot>
    </div>

    <!-- Right column -->
    <div class="w-9/12 bg-white rounded-lg shadow-lg p-6">
      <slot name="right-column"> </slot>
    </div>
  </div>
</template>
