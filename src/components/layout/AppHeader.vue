<template>
  <header class="w-full bg-white py-10 shadow-md">
    <div class="container pl-[6.25rem] flex items-center">
      <router-link to="/" class="cursor-pointer">
        <img src="/images/logo.png" alt="Bank Logo" class="h-10" />
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>
