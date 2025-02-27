<script setup lang="ts">
import { ref } from 'vue';
import AppHeader from './components/layout/AppHeader.vue';
import MainLayout from './components/layout/MainLayout.vue';
import TwoColumnLayout from './components/layout/TwoColumnLayout.vue';
import TransactionForm from './components/transactions/TransactionForm.vue';

// Refresh trigger for transactions list
const refreshTrigger = ref(0);

// Handle transaction added event
const handleTransactionAdded = () => {
  // Increment the refresh trigger to notify components to refresh
  refreshTrigger.value++;
};
</script>

<template>
  <div class="min-h-screen">
    <AppHeader />

    <MainLayout backgroundImage="/images/background.jpg">
      <TwoColumnLayout>
        <template #left-column>
          <TransactionForm @transaction-added="handleTransactionAdded" />
        </template>

        <template #right-column>
          <div class="h-full">
            <router-view :refresh-trigger="refreshTrigger" />
          </div>
        </template>
      </TwoColumnLayout>
    </MainLayout>
  </div>
</template>
