<script setup>
  const query = defineModel();
  function doSearch() {
    const q = encodeURIComponent(query.value);
    const url = `https://kagi.com/search?q=${q}`;
    window.location = url;
  }
</script>

<template>
  <div class="searchbar">
    <input placeholder="Search" v-model="query" @keyup.enter="doSearch" name="nutab_search" autofocus></input>
  </div>
</template>

<style scoped>
.searchbar {
  font-size: clamp(2.4rem, 2vw, 4.80rem);
  width: 62vw;
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  margin-bottom: 3rem;
}
input {
  background-color: #000;
  border: .6rem solid #eee;
  padding: 1rem;
  outline: none;
}
</style>
