<template>
  <div class="h-full flex flex-col">
    <h1 class="text-xl font-bold text-white p-4 bg-[#0C8397] w-full">Recent Transactions</h1>

    <div class="p-6">
      <!-- Loading and Error States -->
      <div v-if="loading" class="bg-white flex-grow flex items-center justify-center">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0C8397]"
          ></div>
          <p class="mt-2 text-gray-600">Loading transactions...</p>
        </div>
      </div>

      <div v-else-if="error" class="bg-white flex-grow p-6">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong class="font-bold">Error:</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
      </div>

      <!-- Transactions Table -->
      <div v-else-if="transactions.length" class="bg-white flex-grow overflow-auto">
        <table class="w-full divide-y divide-gray-200 table-fixed">
          <colgroup>
            <col class="w-48" />
            <!-- Date column width -->
            <col class="w-auto" />
            <!-- Details column - takes remaining space -->
            <col class="w-36" />
            <!-- Amount column width -->
          </colgroup>

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
      <div v-else class="bg-white flex-grow p-8 text-center">
        <p class="text-gray-500">No transactions found.</p>
      </div>

      <!-- Detail Page Link -->
      <div class="bg-white p-4 border-t border-gray-200">
        <router-link
          to="/detail"
          class="text-white bg-[#0C8397] hover:bg-[#0A7082] focus:ring-4 focus:ring-[#0C8397]/50 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none"
        >
          Go to Detail Page
        </router-link>
      </div>
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
