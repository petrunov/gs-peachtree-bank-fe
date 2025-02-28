<template>
  <div class="h-full flex flex-col">
    <transaction-header title="Recent Transactions" />

    <div class="p-6">
      <!-- Loading and Error States -->
      <loading-state v-if="loading" message="Loading transactions..." />
      <error-state v-else-if="error" :message="error" />

      <!-- Content when data is loaded -->
      <div v-if="!loading && !error">
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
import type { Transaction } from '../services/api/types';
import { transactionService } from '../services/TransactionService';

import TransactionHeader from '../components/transactions/TransactionHeader.vue';
import LoadingState from '../components/transactions/LoadingState.vue';
import ErrorState from '../components/transactions/ErrorState.vue';
import SearchAndSortControls from '../components/transactions/SearchAndSortControls.vue';
import TransactionTable from '../components/transactions/TransactionTable.vue';
import EmptyState from '../components/transactions/EmptyState.vue';

const props = defineProps<{
  refreshTrigger?: number;
}>();

const router = useRouter();

const transactions = ref<Transaction[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const isSearching = ref(false);

const sortColumn = ref<'date' | 'beneficiary' | 'amount' | null>(null);
const sortDirection = ref<'asc' | 'desc'>('asc');

const navigateToDetail = (transactionId: number) => {
  router.push({
    path: '/detail',
    query: { transaction_id: transactionId.toString() },
  });
};

const handleSearch = (query: string) => {
  searchQuery.value = query;

  if (!query.trim()) {
    loadAllTransactions();
    return;
  }

  isSearching.value = true;
  transactionService
    .searchAccountsAndTransactions(query)
    .then(response => {
      // Get the transaction details directly from the API for each transaction
      const fetchPromises = response.data.transactions.map((transaction: any) =>
        transactionService
          .getTransactionById(transaction.id)
          .then((detailResponse: { data: Transaction }) => detailResponse.data)
          .catch((err: Error) => {
            console.error(`Failed to fetch details for transaction ${transaction.id}:`, err);
            return transaction; // Return original transaction if fetch fails
          }),
      );

      // Wait for all transaction details to be fetched
      Promise.all(fetchPromises)
        .then((detailedTransactions: Transaction[]) => {
          transactions.value = detailedTransactions;
        })
        .catch((err: Error) => {
          console.error('Error fetching transaction details:', err);
          // Fallback to original transactions if detailed fetch fails
          transactions.value = response.data.transactions;
        });
    })
    .catch((err: any) => {
      console.error('Search failed:', err);

      // Use specific error message from API if available
      if (err.apiError?.message) {
        error.value = err.apiError.message;
      } else {
        error.value = 'Failed to search. Please try again.';
      }
    })
    .finally(() => {
      isSearching.value = false;
    });
};

const handleSort = (column: 'date' | 'beneficiary' | 'amount') => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortDirection.value = 'asc';
  }

  transactions.value = [...transactions.value].sort((a, b) => {
    let valueA, valueB;

    if (column === 'date') {
      valueA = new Date(a.date).getTime();
      valueB = new Date(b.date).getTime();
    } else if (column === 'beneficiary') {
      valueA = a.beneficiary.toLowerCase();
      valueB = b.beneficiary.toLowerCase();
    } else {
      valueA = parseFloat(a.amount);
      valueB = parseFloat(b.amount);
    }

    if (sortDirection.value === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
};

const loadAllTransactions = async () => {
  try {
    const response = await transactionService.getTransactions();
    transactions.value = response.data;
  } catch (err: any) {
    console.error('Failed to fetch transactions:', err);

    // Use specific error message from API if available
    if (err.apiError?.message) {
      error.value = err.apiError.message;
    } else {
      error.value = 'Failed to load transactions. Please try again later.';
    }
  }
};

defineExpose({ loadAllTransactions });

watch(
  () => props.refreshTrigger,
  () => {
    if (props.refreshTrigger && props.refreshTrigger > 0) {
      loadAllTransactions();
    }
  },
);

onMounted(async () => {
  try {
    const response = await transactionService.getTransactions();
    transactions.value = response.data;
  } catch (err: any) {
    console.error('Failed to fetch transactions:', err);

    // Use specific error message from API if available
    if (err.apiError?.message) {
      error.value = err.apiError.message;
    } else {
      error.value = 'Failed to load transactions. Please try again later.';
    }
  } finally {
    loading.value = false;
  }
});
</script>
