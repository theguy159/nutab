<script setup>
  import config from '~/assets/config.json';
  useHead({
    title: 'Nutab',
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/nutab/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/nutab/favicon-16x16.png' },
      { rel: 'apple-touch-icon', href: '/nutab/apple-touch-icon.png' },
      { rel: 'manifest', href: '/nutab/site.webmanifest' },
    ]
  });
  const showSearchbar = ref(true);
  const loaded = ref(false);
  onMounted(() => {
    showSearchbar.value = JSON.parse(localStorage.getItem('showSearchbar')) ?? true;
    loaded.value = true;
  });
</script>
<template>
  <div v-if="loaded">
    <NuxtRouteAnnouncer />
    <Clock format="HH:mm" />
    <Searchbar v-if="showSearchbar" />
    <div class="categories">
      <CategoryCard v-for="category in config.categories" :key="category.title" :title="category.title" :links="category.links" />
    </div>
  </div>
</template>
<style>
/* -- reset start -- */
/* makes sizing simpler */

*,
*::before,
*::after {
  box-sizing: border-box;
}

/* remove default spacing */
/* force styling of type through styling, rather than elements */

* {
  margin: 0;
  padding: 0;
  font: inherit;
}

/* dark mode user-agent-styles */

html {
  color-scheme: dark light;
}

/* min body height */

body {
  min-height: 100vh;
}

/* responsive images/videos */
img,
picture,
svg,
video {
  display: block;
  max-width: 100%;
}
/* -- reset end -- */

body {
  background: #000;
  color: #eee;
  font-family: "Anta", sans-serif;
}
.categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
  gap: 2rem;
  max-width: 90vw;
  margin: 0 auto;
}
</style>
