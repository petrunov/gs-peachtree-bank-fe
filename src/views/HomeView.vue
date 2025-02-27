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

      <!-- Content when data is loaded -->
      <div v-if="!loading && !error">
        <!-- Search and Sort Controls -->
        <div class="flex items-center mb-4">
          <div class="relative flex-grow mr-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by typing..."
              class="w-full py-2 focus:outline-none border-b-2 border-gray-200"
            />
            <div v-if="isSearching" class="absolute right-0 top-2">
              <div
                class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#0C8397]"
              ></div>
            </div>
          </div>
          <div class="flex items-center">
            <span class="mr-2 text-gray-600">Sort:</span>
            <div class="inline-flex rounded-md shadow-sm">
              <button
                @click="sortTransactions('date')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-gray-100': sortColumn === 'date' }"
              >
                date{{ getSortIndicator('date') }}
              </button>
              <button
                @click="sortTransactions('beneficiary')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-gray-100': sortColumn === 'beneficiary' }"
              >
                beneficiary{{ getSortIndicator('beneficiary') }}
              </button>
              <button
                @click="sortTransactions('amount')"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 cursor-pointer"
                :class="{ 'bg-gray-100': sortColumn === 'amount' }"
              >
                amount{{ getSortIndicator('amount') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Transactions Table -->
        <div v-if="transactions.length" class="bg-white flex-grow overflow-auto">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactions, searchAccountsAndTransactions } from '../services/modules/transactions';
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
const searchQuery = ref('');
const isSearching = ref(false);
let searchTimeout: number | null = null;

// Sorting state
const sortColumn = ref<'date' | 'beneficiary' | 'amount' | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Sort transactions
const sortTransactions = (column: 'date' | 'beneficiary' | 'amount') => {
  // If clicking the same column, toggle direction
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    // If clicking a new column, set it as the sort column and reset direction to asc
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  // Sort the transactions array
  transactions.value = [...transactions.value].sort((a, b) => {
    let valueA, valueB;

    if (column === 'date') {
      valueA = new Date(a.date).getTime();
      valueB = new Date(b.date).getTime();
    } else if (column === 'beneficiary') {
      valueA = a.beneficiary.toLowerCase();
      valueB = b.beneficiary.toLowerCase();
    } else {
      // amount
      valueA = parseFloat(a.amount);
      valueB = parseFloat(b.amount);
    }

    // Sort based on direction
    if (sortDirection.value === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

// Get sort indicator for a column
const getSortIndicator = (column: 'date' | 'beneficiary' | 'amount') => {
  if (sortColumn.value !== column) {
    return '';
  }
  return sortDirection.value === 'asc' ? ' ▲' : ' ▼';
};

// Debounced search function
const debouncedSearch = (query: string) => {
  // Clear any existing timeout
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // If query is empty, load all transactions
  if (!query.trim()) {
    loadAllTransactions();
    return;
  }

  // Set a new timeout
  isSearching.value = true;
  searchTimeout = window.setTimeout(async () => {
    try {
      const response = await searchAccountsAndTransactions(query);
      transactions.value = response.data.transactions;

      if (transactions.value.length === 0 && response.data.accounts.length === 0) {
        // No results found
        console.log('No results found for query:', query);
      }
    } catch (err) {
      console.error('Search failed:', err);
      error.value = 'Failed to search. Please try again.';
    } finally {
      isSearching.value = false;
    }
  }, 300); // 300ms debounce time
};

// Watch for changes to search query
watch(searchQuery, newQuery => {
  debouncedSearch(newQuery);
});

// Load all transactions
const loadAllTransactions = async () => {
  try {
    const response = await getTransactions();
    transactions.value = response.data;
  } catch (err) {
    console.error('Failed to fetch transactions:', err);
    error.value = 'Failed to load transactions. Please try again later.';
  }
};

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
  // Sent transactions
  if (transaction.state === 'sent') {
    return 'border-red-500';
  }

  // Paid transactions
  if (transaction.state === 'paid') {
    return 'border-green-500';
  }

  // Received transactions
  return 'border-yellow-500'; // For 'received' state
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
