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
            <tr
              v-for="transaction in transactions"
              :key="transaction.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="navigateToDetail(transaction.id)"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-l-[5px]"
                :class="getTransactionBorderColor(transaction)"
              >
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-900 break-words">
                <div class="font-bold mb-1">{{ transaction.beneficiary }}</div>
                {{ transaction.description }}
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold"
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

      <!-- No Detail Page Link - Rows are clickable instead -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactions } from '../services/modules/transactions';
import type { Transaction } from '../services/api/types';

// Get router instance
const router = useRouter();

// Navigate to detail page with transaction ID as query parameter
const navigateToDetail = (transactionId: number) => {
  router.push({
    path: '/detail',
    query: { transaction_id: transactionId.toString() },
  });
};

// State
const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Format date to MMM DD format (e.g., Oct 19)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
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

// Determine transaction border color based on type
const getTransactionBorderColor = (transaction: Transaction): string => {
  if (transaction.state === 'sent') {
    return 'border-red-500';
  }

  if (transaction.state === 'paid') {
    return 'border-green-500';
  }

  return 'border-yellow-500';
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
