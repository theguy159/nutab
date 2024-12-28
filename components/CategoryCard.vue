<script setup>
defineProps(['title', 'links'])

function getFavicon(link) {
  return link.icon ? link.icon : `/favicons/${new URL(link.href).hostname.replace(/\./g, '_')}.ico`;
}
function useFallback(event) {
  event.target.src = '/favicons/default.png';
}
</script>
<template>
  <div class="card">
    <h2>{{ title }}:</h2>
    <ul>
      <li v-for="link in links">
        <img :src="getFavicon(link)" @error="useFallback" alt="Favicon">
        <a :href="link.href">{{link.title}}</a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
}
.card {
  border: .2rem solid #eee;
  border-radius: 1rem;
  padding: 1rem;
}
h2 {
  font-size: 2vw;
  font-weight: bold;
}
a {
  font-size: 1.2vw;
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
li img {
  object-fit: cover;
  width: 1.2vw;
  height: 1.2vw;
}
li {
  display: grid;
  grid-template-columns: 1.2vw 1fr;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}
</style>
