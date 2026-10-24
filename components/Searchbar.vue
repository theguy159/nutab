<script setup lang="ts">
import { useStore, SEARCH_ENGINES } from '~/composables/useStore'

const { settings } = useStore()
const query = ref('')

function doSearch() {
  const q = query.value.trim()
  if (!q) return
  const template = settings.value.searchEngine === 'custom'
    ? settings.value.customSearchUrl
    : SEARCH_ENGINES[settings.value.searchEngine]
  if (!template) return
  window.location = template.replace('{q}', encodeURIComponent(q))
}
</script>

<template>
  <div class="searchbar">
    <input placeholder="Search" v-model="query" @keyup.enter="doSearch" name="nutab_search" autofocus />
  </div>
</template>

<style scoped>
.searchbar {
  --chamfer: 1.2rem;
  width: min(74rem, 90vw);
  margin: 0 auto 3.5rem;
  padding: 2px;
  background: linear-gradient(
    120deg,
    color-mix(in srgb, var(--accent) 75%, transparent),
    color-mix(in srgb, var(--accent) 25%, transparent)
  );
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
  filter: drop-shadow(0 0 .8rem color-mix(in srgb, var(--accent) 20%, transparent));
  transition: filter .25s ease;
}

.searchbar:focus-within {
  filter: drop-shadow(0 0 1.4rem color-mix(in srgb, var(--accent) 40%, transparent));
}

input {
  width: 100%;
  background: #020507;
  border: none;
  outline: none;
  color: #e8f7fa;
  font-size: 2.2rem;
  padding: 1rem 1.6rem;
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
}

input::placeholder {
  color: rgb(232 247 250 / .35);
}
</style>
