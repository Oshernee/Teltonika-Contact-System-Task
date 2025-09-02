<template>
  <div class="w-full flex gap-4">
    <div class="relative">
      <img
        :src="searchIcon"
        alt="Search"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
      />
      <input
        class="w-[574px] h-[56px] pl-10 pr-4 rounded-lg bg-background border border-gray-300 text-text placeholder-gray-500"
        type="text"
        placeholder="Search"
      />
    </div>
    <div class="relative">
      <button
        @click="toggleDropdown"
        class="w-[56px] h-[56px] px-4 rounded-lg bg-accent flex items-center justify-between"
      >
        <img
          :src="paginationCount"
          alt="Pagination Count"
          class="w-[56px] h-[56px]"
        />
      </button>
      <div
        v-if="showDropdown"
        class="absolute top-full left-0 w-[56px] bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10"
      >
        <div
          v-for="item in [5, 10, 25, 50, 100, 'ALL']"
          :key="item"
          @click="selectItem(item)"
          class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <button
      class="w-[56px] h-[56px] bg-accent rounded-lg flex items-center justify-center hover:bg-accent-dark"
    >
      <img v-if="ToCard" :src="toCard" alt="Search" />
      <img v-else-if="!ToCard" :src="toTable" alt="Search" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import searchIcon from "../assets/Search.svg";
import paginationCount from "../assets/PaginationCount.svg";
import toCard from "../assets/ToCard.svg";
import toTable from "../assets/ToTable.svg";

const showDropdown = ref(false);
const selectedItem = ref<number | string | null>(null);
const ToCard = true;

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const selectItem = (item: number | string) => {
  selectedItem.value = item;
  showDropdown.value = false;
  console.log("Selected item:", item);
};
</script>
