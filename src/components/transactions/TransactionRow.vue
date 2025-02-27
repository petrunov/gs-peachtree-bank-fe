<template>
  <tr class="hover:bg-gray-50 cursor-pointer" @click="onClick">
    <td
      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-l-[5px]"
      :class="borderColorClass"
    >
      {{ formattedDate }}
    </td>
    <td class="px-6 py-4 text-sm text-gray-900 break-words">
      <div class="font-bold mb-1">{{ transaction.beneficiary }}</div>
      {{ transaction.description }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-bold" :class="amountColorClass">
      {{ formattedAmount }}
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Transaction } from '../../services/api/types';

interface Props {
  transaction: Transaction;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const onClick = () => {
  emit('click', props.transaction.id);
};

const formattedDate = computed(() => {
  const date = new Date(props.transaction.date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
});

const formattedAmount = computed(() => {
  const value = parseFloat(props.transaction.amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    signDisplay: 'never',
  }).format(Math.abs(value));
});

const borderColorClass = computed(() => {
  if (props.transaction.state === 'sent') {
    return 'border-red-500';
  }

  if (props.transaction.state === 'paid') {
    return 'border-green-500';
  }

  return 'border-yellow-500';
});

const amountColorClass = computed(() => {
  return parseFloat(props.transaction.amount) < 0 ? 'text-red-600' : 'text-green-600';
});
</script>
