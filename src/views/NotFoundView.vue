<template>
  <div class="h-full flex flex-col">
    <h1 class="text-xl font-bold text-white p-4 bg-[#0C8397] w-full">Page Not Found</h1>

    <div class="p-6">
      <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">404</h2>
          <p class="text-gray-600 mb-6">
            The page you are looking for does not exist or has been moved.
          </p>
          <router-link
            to="/"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0C8397] hover:bg-[#0A7082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C8397]"
          >
            Return to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional logic needed for this component
</script>
