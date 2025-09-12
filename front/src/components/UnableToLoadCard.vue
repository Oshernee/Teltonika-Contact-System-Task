<template>
  <div class="bg-white rounded-2xl shadow-lg p-12 max-w-md text-center border border-gray-100">
    <h3 class="text-2xl font-semibold text-gray-800 mb-3">Duomenų nepavyko užkrauti</h3>
    <p class="text-gray-600 mb-6 leading-relaxed">
      Atsiprašome, bet darbuotojo duomenų nepavyko gauti. Bandykite dar kartą arba grįžkite į
      pagrindinį puslapį.
    </p>
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <button
        @click="$router.go(-1)"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Grįžti atgal
      </button>
    </div>
  </div>
</template>
