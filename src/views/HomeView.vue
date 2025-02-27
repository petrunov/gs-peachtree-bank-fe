<template>
  <div class="h-full flex flex-col">
    <transaction-header title="Recent Transactions" />

    <div class="p-6">
      <!-- Loading and Error States -->
      <loading-state v-if="loading" message="Loading transactions..." />
      <error-state v-else-if="error" :message="error" />

      <!-- Content when data is loaded -->
      <div v-if="!loading && !error">
        <!-- Search and Sort Controls -->
        <search-and-sort-controls
          :is-searching="isSearching"
          :sort-column="sortColumn"
          :sort-direction="sortDirection"
          :initial-search-query="searchQuery"
          @search="handleSearch"
          @sort="handleSort"
        />

        <!-- Transactions Table -->
        <transaction-table
          v-if="transactions.length"
          :transactions="transactions"
          @row-click="navigateToDetail"
        />

        <!-- Empty State -->
        <empty-state v-else />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getTransactions, searchAccountsAndTransactions } from '../services/modules/transactions';
import type { Transaction } from '../services/api/types';

// Import components
import TransactionHeader from '../components/transactions/TransactionHeader.vue';
import LoadingState from '../components/transactions/LoadingState.vue';
import ErrorState from '../components/transactions/ErrorState.vue';
import SearchAndSortControls from '../components/transactions/SearchAndSortControls.vue';
import TransactionTable from '../components/transactions/TransactionTable.vue';
import EmptyState from '../components/transactions/EmptyState.vue';

// Props
const props = defineProps<{
  refreshTrigger?: number;
}>();

// Get router instance
const router = useRouter();

// State
const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const isSearching = ref(false);

// Sorting state
const sortColumn = ref<'date' | 'beneficiary' | 'amount' | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

// Navigate to detail page with transaction ID as query parameter
const navigateToDetail = (transactionId: number) => {
  router.push({
    path: '/detail',
    query: { transaction_id: transactionId.toString() },
  });
};

// Handle search from child component
const handleSearch = (query: string) => {
  searchQuery.value = query;

  if (!query.trim()) {
    loadAllTransactions();
    return;
  }

  isSearching.value = true;
  searchAccountsAndTransactions(query)
    .then(response => {
      transactions.value = response.data.transactions;

      if (transactions.value.length === 0 && response.data.accounts.length === 0) {
        // No results found
        console.log('No results found for query:', query);
      }
    })
    .catch(err => {
      console.error('Search failed:', err);
      error.value = 'Failed to search. Please try again.';
    })
    .finally(() => {
      isSearching.value = false;
    });
};

// Handle sort from child component
const handleSort = (column: 'date' | 'beneficiary' | 'amount') => {
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

// Expose the function to parent components
defineExpose({ loadAllTransactions });

// Watch for changes to the refresh trigger
watch(
  () => props.refreshTrigger,
  () => {
    if (props.refreshTrigger && props.refreshTrigger > 0) {
      loadAllTransactions();
    }
  },
);

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
