<script setup lang="ts">
import AppHeader from './components/layout/AppHeader.vue';
import MainLayout from './components/layout/MainLayout.vue';
import TwoColumnLayout from './components/layout/TwoColumnLayout.vue';
</script>

<template>
  <div class="min-h-screen">
    <AppHeader />

    <MainLayout backgroundImage="/images/background.jpg">
      <TwoColumnLayout>
        <template #left-column>
          <div class="h-full">
            <h2 class="text-xl font-semibold mb-4">Left Column</h2>
            <p class="mb-4">This is the left column content (30% width).</p>
            <router-link to="/detail" class="text-blue-600 hover:text-blue-800">
              Go to Detail Page
            </router-link>
          </div>
        </template>

        <template #right-column>
          <div class="h-full">
            <h2 class="text-xl font-semibold mb-4">Right Column</h2>
            <p class="mb-4">This is the right column content (70% width).</p>
            <router-view />
          </div>
        </template>
      </TwoColumnLayout>
    </MainLayout>
  </div>
</template>
