<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Add New Transaction</h2>

    <form @submit.prevent="submitNewTransaction" class="space-y-4">
      <!-- From Account -->
      <div>
        <label for="from-account" class="block text-sm font-medium text-gray-700 mb-1">
          FROM ACCOUNT
        </label>
        <div v-if="loadingAccounts" class="py-2 text-sm text-gray-500">
          <div
            class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"
          ></div>
          Loading accounts...
        </div>
        <div v-else-if="accountsError" class="py-2 text-sm text-red-600">
          {{ accountsError }}
        </div>
        <select
          v-else
          id="from-account"
          v-model="newTransaction.fromAccount"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0C8397] focus:ring-[#0C8397] sm:text-sm"
          required
        >
          <option value="" disabled>Select account</option>
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id.toString()"
            :disabled="account.id.toString() === newTransaction.toAccount"
          >
            {{ account.account_name }} ({{ account.account_number }})
          </option>
        </select>
      </div>

      <!-- To Account -->
      <div>
        <label for="to-account" class="block text-sm font-medium text-gray-700 mb-1">
          TO ACCOUNT
        </label>
        <div v-if="loadingAccounts" class="py-2 text-sm text-gray-500">
          <div
            class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300 mr-2"
          ></div>
          Loading accounts...
        </div>
        <div v-else-if="accountsError" class="py-2 text-sm text-red-600">
          {{ accountsError }}
        </div>
        <select
          v-else
          id="to-account"
          v-model="newTransaction.toAccount"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0C8397] focus:ring-[#0C8397] sm:text-sm"
          required
        >
          <option value="" disabled>Select account</option>
          <option
            v-for="account in accounts"
            :key="account.id"
            :value="account.id.toString()"
            :disabled="account.id.toString() === newTransaction.fromAccount"
          >
            {{ account.account_name }} ({{ account.account_number }})
          </option>
        </select>
      </div>

      <!-- Amount -->
      <div>
        <label for="amount" class="block text-sm font-medium text-gray-700 mb-1"> AMOUNT </label>
        <div class="relative rounded-md shadow-sm">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span class="text-gray-500 sm:text-sm">€</span>
          </div>
          <input
            type="text"
            id="amount"
            v-model="newTransaction.amount"
            @input="formatAmount"
            class="block w-full pl-7 pr-12 py-2 rounded-md border-gray-300 focus:border-[#0C8397] focus:ring-[#0C8397] sm:text-sm"
            placeholder="0.00"
            required
            pattern="^[0-9]+(\.[0-9]{1,2})?$"
            title="Please enter a valid amount with up to two decimal places"
          />
        </div>
        <p v-if="amountError" class="mt-1 text-sm text-red-600">{{ amountError }}</p>
      </div>

      <!-- Beneficiary -->
      <div>
        <label for="beneficiary" class="block text-sm font-medium text-gray-700 mb-1">
          BENEFICIARY
        </label>
        <input
          type="text"
          id="beneficiary"
          v-model="newTransaction.beneficiary"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0C8397] focus:ring-[#0C8397] sm:text-sm"
          placeholder="Enter beneficiary name"
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
          DESCRIPTION
        </label>
        <textarea
          id="description"
          v-model="newTransaction.description"
          rows="2"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-[#0C8397] focus:ring-[#0C8397] sm:text-sm"
          placeholder="Enter transaction description"
          required
        ></textarea>
      </div>

      <!-- Submit Button -->
      <div class="pt-2">
        <button
          type="submit"
          class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0C8397] hover:bg-[#0A7082] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C8397]"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <div
              class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
            ></div>
            Processing...
          </span>
          <span v-else>Add Transaction</span>
        </button>
      </div>

      <p v-if="submitError" class="mt-2 text-sm text-red-600">{{ submitError }}</p>
      <p v-if="submitSuccess" class="mt-2 text-sm text-green-600">
        Transaction added successfully!
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAccounts } from '../../services/modules/accounts';
import { createTransaction } from '../../services/modules/transactions';
import type { Account } from '../../services/api/types';

const emit = defineEmits<{
  (e: 'transactionAdded'): void;
}>();

const accounts = ref<Account[]>([]);
const loadingAccounts = ref(true);
const accountsError = ref<string | null>(null);

const newTransaction = ref({
  fromAccount: '',
  toAccount: '',
  amount: '',
  beneficiary: '',
  description: '',
});
const amountError = ref<string | null>(null);
const isSubmitting = ref(false);
const submitError = ref<string | null>(null);
const submitSuccess = ref(false);

const fetchAccounts = async () => {
  loadingAccounts.value = true;
  accountsError.value = null;

  try {
    const response = await getAccounts({
      limit: 100,
      offset: 0,
      sort_by: 'account_number',
      sort_order: 'asc',
    });

    accounts.value = response.data;
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
    accountsError.value = 'Failed to load accounts. Please try again later.';
  } finally {
    loadingAccounts.value = false;
  }
};

onMounted(() => {
  fetchAccounts();
});

const formatAmount = () => {
  let value = newTransaction.value.amount.replace(/[^\d.]/g, '');

  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  if (parts.length > 1 && parts[1].length > 2) {
    value = parts[0] + '.' + parts[1].substring(0, 2);
  }

  newTransaction.value.amount = value;

  if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
    amountError.value = 'Please enter a valid amount with up to two decimal places';
  } else {
    amountError.value = null;
  }
};

const submitNewTransaction = async () => {
  submitError.value = null;
  submitSuccess.value = false;

  if (
    !newTransaction.value.fromAccount ||
    !newTransaction.value.toAccount ||
    !newTransaction.value.amount ||
    !newTransaction.value.beneficiary ||
    !newTransaction.value.description
  ) {
    submitError.value = 'Please fill in all fields';
    return;
  }

  if (amountError.value) {
    return;
  }

  isSubmitting.value = true;

  try {
    let formattedAmount = newTransaction.value.amount;
    if (!formattedAmount.includes('.')) {
      formattedAmount += '.00';
    } else if (formattedAmount.split('.')[1].length === 1) {
      formattedAmount += '0';
    }

    const toAccount = accounts.value.find(
      account => account.id.toString() === newTransaction.value.toAccount,
    );

    if (!toAccount) {
      throw new Error('Selected account not found');
    }

    await createTransaction({
      amount: formattedAmount,
      beneficiary: newTransaction.value.beneficiary,
      description: newTransaction.value.description,
      from_account_id: parseInt(newTransaction.value.fromAccount),
      to_account_id: parseInt(newTransaction.value.toAccount),
    });

    submitSuccess.value = true;

    newTransaction.value = {
      fromAccount: '',
      toAccount: '',
      amount: '',
      beneficiary: '',
      description: '',
    };

    emit('transactionAdded');

    setTimeout(() => {
      submitSuccess.value = false;
    }, 3000);
  } catch (error) {
    console.error('Failed to add transaction:', error);
    submitError.value = 'Failed to add transaction. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};
</script>
