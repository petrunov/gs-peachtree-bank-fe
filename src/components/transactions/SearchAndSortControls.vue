<template>
  <div class="flex items-center mb-4">
    <!-- Search Input -->
    <div class="relative flex-grow mr-6">
      <input
        v-model="searchInputValue"
        type="text"
        placeholder="Search by typing..."
        class="w-full py-2 focus:outline-none border-b-2 border-gray-200"
        @input="onSearchInput"
      />
      <div v-if="isSearching" class="absolute right-0 top-2">
        <div
          class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-[#0C8397]"
        ></div>
      </div>
    </div>

    <!-- Sort Controls -->
    <div class="flex items-center">
      <span class="mr-2 text-gray-600">Sort:</span>
      <div class="inline-flex rounded-md shadow-sm">
        <button
          @click="onSortClick('date')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-gray-100': sortColumn === 'date' }"
        >
          date{{ getSortIndicator('date') }}
        </button>
        <button
          @click="onSortClick('beneficiary')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300 hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-gray-100': sortColumn === 'beneficiary' }"
        >
          beneficiary{{ getSortIndicator('beneficiary') }}
        </button>
        <button
          @click="onSortClick('amount')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 cursor-pointer"
          :class="{ 'bg-gray-100': sortColumn === 'amount' }"
        >
          amount{{ getSortIndicator('amount') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

interface Props {
  isSearching: boolean;
  sortColumn: 'date' | 'beneficiary' | 'amount' | null;
  sortDirection: 'asc' | 'desc';
  initialSearchQuery?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialSearchQuery: '',
});

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'sort', column: 'date' | 'beneficiary' | 'amount'): void;
}>();

const searchInputValue = ref(props.initialSearchQuery);
let searchTimeout: number | null = null;

watch(searchInputValue, newValue => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = window.setTimeout(() => {
    emit('search', newValue);
  }, 300);
});

const onSearchInput = () => {
  // Method kept for potential future logic
};

const onSortClick = (column: 'date' | 'beneficiary' | 'amount') => {
  emit('sort', column);
};

const getSortIndicator = (column: 'date' | 'beneficiary' | 'amount') => {
  if (props.sortColumn !== column) {
    return '';
  }
  return props.sortDirection === 'asc' ? ' ▲' : ' ▼';
};
</script>
