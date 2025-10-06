<template>
  <div class="loading-card items-center justify-center flex h-[80vh] w-full">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.loader {
  width: fit-content;
  font-size: 40px;
  font-family: system-ui, sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  color: #0000;
  -webkit-text-stroke: 1px #1f3f77;
  --l: #0000 45%, #1f3f77 0 55%, #0000 0;
  --g: 0/300% 100% no-repeat text;
  background: linear-gradient(-60deg, var(--l)) var(--g), linear-gradient(60deg, var(--l)) var(--g);
  animation: l7 4s linear infinite;
}
.loader:before {
  content: 'Kraunasi...';
}
@keyframes l7 {
  0% {
    background-position: 100%, 0;
  }
  50% {
    background-position: 0, 0;
  }
  to {
    background-position: 0, 100%;
  }
}
</style>
