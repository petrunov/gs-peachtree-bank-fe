<template>
  <div class="h-full flex flex-col">
    <h1 class="text-xl font-bold text-white p-4 bg-[#0C8397] w-full">
      Details for transaction {{ transactionId }}
    </h1>

    <div class="p-6">
      <div class="bg-white shadow-md rounded-lg p-6 mb-6">
        <div v-if="loading" class="flex justify-center my-8">
          <div role="status">
            <svg
              aria-hidden="true"
              class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>

        <div
          v-else-if="error"
          class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
          role="alert"
        >
          <span class="font-medium">Error!</span> {{ error }}
        </div>

        <div v-else-if="transaction" class="overflow-x-auto relative">
          <!-- Transaction details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <h2 class="text-lg font-semibold mb-2">Transaction Information</h2>
              <div class="space-y-2">
                <p><span class="font-medium">ID:</span> {{ transaction.id }}</p>
                <p><span class="font-medium">Date:</span> {{ formatDate(transaction.date) }}</p>
                <p>
                  <span class="font-medium">Amount:</span>
                  <span
                    :class="parseFloat(transaction.amount) < 0 ? 'text-red-600' : 'text-green-600'"
                    >{{ formatAmount(transaction.amount) }}</span
                  >
                </p>
                <p>
                  <span class="font-medium">Status:</span>
                  <span class="capitalize">{{ transaction.state }}</span>
                </p>
              </div>
            </div>
            <div>
              <h2 class="text-lg font-semibold mb-2">Details</h2>
              <div class="space-y-2">
                <p><span class="font-medium">Beneficiary:</span> {{ transaction.beneficiary }}</p>
                <p><span class="font-medium">Description:</span> {{ transaction.description }}</p>
                <p>
                  <span class="font-medium">From Account:</span> {{ transaction.from_account_id }}
                </p>
                <p><span class="font-medium">To Account:</span> {{ transaction.to_account_id }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- No back button needed as logo will be the navigation -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getTransactionById } from '../services/modules/transactions';
import type { Transaction } from '../services/api/types';

// Get route to access query parameters
const route = useRoute();

// State
const loading = ref(true);
const error = ref<string | null>(null);
const transaction = ref<Transaction | null>(null);

// Computed property for transaction ID
const transactionId = computed(() => {
  const id = route.query.transaction_id;

  // Validate that transaction_id is a string and can be parsed as a number
  if (typeof id !== 'string' || isNaN(parseInt(id))) {
    error.value = 'Invalid transaction ID';
    return null;
  }

  return parseInt(id);
});

// Fetch transaction data
const fetchTransactionData = async () => {
  // Reset state
  loading.value = true;
  error.value = null;
  transaction.value = null;

  // Validate transaction ID
  if (!transactionId.value) {
    loading.value = false;
    return;
  }

  try {
    const response = await getTransactionById(transactionId.value);
    transaction.value = response.data;
  } catch (err) {
    console.error('Failed to fetch transaction:', err);
    error.value = 'Failed to load transaction details. Please try again later.';
  } finally {
    loading.value = false;
  }
};

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

// Fetch data on component mount
onMounted(() => {
  fetchTransactionData();
});
</script>
