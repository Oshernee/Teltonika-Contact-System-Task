<template>
  <div
    class="mx-16 my-8 bg-gray-50 text-left font-extralight flex flex-col items-start gap-8"
  >
    <text class="text-[56px] text-gray-900 font-thin">Kontaktų sistema</text>
    <SearchBar />
    <Filtering />
    <CardDisplayType />
    <TableDisplayType />
    <Pagination />
  </div>
</template>

<script setup lang="ts">
import SearchBar from "../components/SearchBar.vue";
import Filtering from "../components/Filtering.vue";
import CardDisplayType from "../components/CardDisplayType.vue";
import TableDisplayType from "../components/TableDisplayType.vue";
import Pagination from "../components/Pagination.vue";
</script>
