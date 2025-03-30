<script setup>
defineProps(['title', 'links'])
const basePath = import.meta.env.MODE === 'development' ? '' : '/nutab';

import favicons from '~/public/favicons/favicons.json';

function getFavicon(link) {
  const hostname = new URL(link.href).hostname.replace(/\./g, '_');
  const faviconFile = favicons[hostname] || `${hostname}.ico`;
  
  return link.icon ? `${basePath}${link.icon}` : `${basePath}/favicons/${faviconFile}`;
}

function useFallback(event) {
  event.target.src = `${basePath}/default_favicon.png`;
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
  font-size: clamp(1.5rem, 2vw, 2.5rem);
  font-weight: bold;
}
a {
  display: grid;
  grid-template-columns: clamp(1rem, 1.2vw, 2rem) 1fr;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  font-size: clamp(1rem, 1.2vw, 1.5rem);
  color: inherit;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
li img {
  object-fit: cover;
  width: clamp(1rem, 1.2vw, 2rem);
  height: clamp(1rem, 1.2vw, 2rem);
}
</style>
