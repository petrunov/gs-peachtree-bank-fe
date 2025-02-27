<template>
  <div class="bg-white flex-grow overflow-auto h-[calc(50vh)]">
    <table class="w-full divide-y divide-gray-200 table-fixed">
      <colgroup>
        <col class="w-48" />
        <col class="w-auto" />
        <col class="w-36" />
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

interface Props {
  transactions: Transaction[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'rowClick', id: number): void;
}>();

const onRowClick = (id: number) => {
  emit('rowClick', id);
};
</script>
