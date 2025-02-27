<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold text-center mb-8">Transactions</h1>

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
      <p class="mt-2">Loading transactions...</p>
    </div>

    <div
      v-else-if="error"
      class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
    >
      <strong class="font-bold">Error:</strong>
      <span class="block sm:inline"> {{ error }}</span>
    </div>

    <!-- Transactions Table -->
    <div v-else-if="transactions.length" class="bg-white shadow-md rounded-lg overflow-hidden">
      <table class="w-full divide-y divide-gray-200 table-fixed">
        <colgroup>
          <col class="w-48" />
          <!-- Date column width -->
          <col class="w-auto" />
          <!-- Details column - takes remaining space -->
          <col class="w-36" />
          <!-- Amount column width -->
        </colgroup>
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Details
            </th>
            <th
              class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Amount
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="transaction in transactions" :key="transaction.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(transaction.date) }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900 break-words">
              {{ transaction.description }}
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-right"
              :class="parseFloat(transaction.amount) < 0 ? 'text-red-600' : 'text-green-600'"
            >
              {{ formatAmount(transaction.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-md rounded-lg p-8 text-center">
      <p class="text-gray-500">No transactions found.</p>
    </div>

    <!-- Detail Page Link -->
    <div class="flex justify-center mt-6">
      <router-link
        to="/detail"
        class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      >
        Go to Detail Page
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getTransactions } from '../services/modules/transactions';
import type { Transaction } from '../services/api/types';

// State
const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Format date to a more readable format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format amount with currency symbol
const formatAmount = (amount: string): string => {
  const value = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'never',
  }).format(Math.abs(value));
};

// Fetch transactions on component mount
onMounted(async () => {
  try {
    const response = await getTransactions();
    transactions.value = response.data;
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    error.value = 'Failed to load transactions. Please try again later.';
  } finally {
    loading.value = false;
  }
});
</script>
