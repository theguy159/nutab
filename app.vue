<script setup>
  import config from '~/assets/config.json'
</script>
<template>
  <div>
    <NuxtRouteAnnouncer />
    <Clock format="HH:mm" />
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
  font-family: Anta, sans-serif;
}
.categories {
  display: grid;
  grid-template-columns: repeat(4, minmax(10rem, 1fr));
  gap: 2rem;
  max-width: 75vw;
  margin: 0 auto;
}
</style>
