<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Home Page</h1>

    <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Welcome to our Application</h2>
      <p class="mb-4">
        This is a Vue.js application with TypeScript, ESLint, Prettier, and pre-commit hooks.
      </p>
      <p class="mb-4">
        It also includes Tailwind CSS and Flowbite for styling, and Axios for API requests.
      </p>

      <div class="flex justify-center mt-6">
        <router-link
          to="/detail"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Go to Detail Page
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// You can add component logic here
</script>
