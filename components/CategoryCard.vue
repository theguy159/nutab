<script setup>
defineProps(['title', 'links'])

function getFavicon(link) {
  return link.icon ? link.icon : `/nutab/favicons/${new URL(link.href).hostname.replace(/\./g, '_')}.ico`;
}
function useFallback(event) {
  event.target.src = '/nutab/default_favicon.png';
}
</script>
<template>
  <div class="card">
    <h2>{{ title }}:</h2>
    <ul>
      <li v-for="link in links">
        <a :href="link.href">
          <img :src="getFavicon(link)" @error="useFallback" alt="Favicon" />
          <span>{{link.title}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
ul {
  list-style-type: none;
}
.card {
  border: .4rem solid #eee;
  border-radius: 0rem;
  padding: 1.6rem;
}
h2 {
  font-size: 2vw;
  font-weight: bold;
}
a {
  display: grid;
  grid-template-columns: 1.2vw 1fr;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
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
</style>
