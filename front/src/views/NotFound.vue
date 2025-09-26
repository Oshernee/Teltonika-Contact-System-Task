<template>
  <section class="min-h-max py-32 flex items-center justify-center">
    <div class="text-center px-32 py-16 border border-gray-100 rounded-2xl shadow-lg bg-white">
      <h1 class="text-9xl font-bold text-primary mb-4 font-roboto">404</h1>
      <h2 class="text-3xl text-text/70 mb-8 font-roboto">Puslapis nerastas</h2>
      <router-link to="/" custom v-slot="{ navigate }">
        <button
          @click="navigate"
          class="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 font-roboto"
        >
          Grįžti į pradžią
        </button>
      </router-link>
    </div>
  </section>
</template>
