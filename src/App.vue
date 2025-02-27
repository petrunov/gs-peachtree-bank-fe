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
          <div></div>
        </template>

        <template #right-column>
          <div class="h-full">
            <router-view />
          </div>
        </template>
      </TwoColumnLayout>
    </MainLayout>
  </div>
</template>
