<template>
  <div class="bg-white flex-grow overflow-auto h-[calc(50vh)]">
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
        <transaction-row
          v-for="transaction in transactions"
          :key="transaction.id"
          :transaction="transaction"
          @click="onRowClick"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import TransactionRow from './TransactionRow.vue';
import type { Transaction } from '../../services/api/types';

// Define props
interface Props {
  transactions: Transaction[];
}

defineProps<Props>();

// Define emits
const emit = defineEmits<{
  (e: 'rowClick', id: number): void;
}>();

// Handle row click
const onRowClick = (id: number) => {
  emit('rowClick', id);
};
</script>
