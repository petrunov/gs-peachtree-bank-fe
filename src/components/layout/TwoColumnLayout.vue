<template>
  <div class="flex gap-10">
    <!-- Left column - height auto-sized to content -->
    <div class="w-3/12">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <slot name="left-column"> </slot>
      </div>
    </div>

    <!-- Right column - full height -->
    <div class="w-9/12 h-full bg-white rounded-lg shadow-lg">
      <slot name="right-column"> </slot>
    </div>
  </div>
</template>
