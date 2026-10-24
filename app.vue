<script setup lang="ts">
  import { useStore } from '~/composables/useStore'

  const { categories, settings, editMode, loaded, load, addCategory } = useStore();
  const showSettings = ref(false);

  const base = useRuntimeConfig().app.baseURL.replace(/\/+$/, '');
  useHead({
    title: 'Nutab',
    link: [
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${base}/favicon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${base}/favicon-16x16.png` },
      { rel: 'apple-touch-icon', href: `${base}/apple-touch-icon.png` },
      { rel: 'manifest', href: `${base}/site.webmanifest` },
    ]
  });

  // The open card visually covers the next card's strip, so :hover alone
  // can't sweep left-to-right. Track the pointer instead: a card becomes
  // active once the cursor crosses into its strip, wherever it visually is.
  // With the pointer outside the deck no card is active and the whole deck
  // rests fully visible (overlapping, but every card's links peek out).
  const deckEl = ref<HTMLElement | null>(null);
  const activeIndex = ref<number | null>(null);

  function pickCard(clientX: number, jump = false) {
    const el = deckEl.value;
    const n = categories.value.length;
    if (!el || n < 2) return;
    const rect = el.getBoundingClientRect();
    const cardW = (el.querySelector<HTMLElement>('.card')?.offsetWidth ?? 0);
    const offset = (rect.width - cardW) / (n - 1);
    if (offset <= 0) return;
    const x = clientX - rect.left;
    const a = activeIndex.value;
    if (a === null || jump) {
      activeIndex.value = Math.min(n - 1, Math.max(0, Math.floor(x / offset)));
      return;
    }
    // advance one card per pointer event so a fast sweep opens every card
    // in turn instead of jumping to whichever index the x-position maps to;
    // rightward switches trigger near the right edge because the open card
    // covers the next card's strip, leftward only at the left edge since
    // the cards to the left are fully visible and directly hoverable
    const left = a * offset;
    if (x > left + cardW * 0.8) activeIndex.value = Math.min(n - 1, a + 1);
    else if (x < left) activeIndex.value = Math.max(0, a - 1);
  }

  function onDeckMove(e: MouseEvent) {
    pickCard(e.clientX);
  }

  // clicks/taps are deliberate: open the clicked card directly
  function onDeckClick(e: MouseEvent) {
    pickCard(e.clientX, true);
  }

  function clearDeck() {
    activeIndex.value = null;
  }

  onMounted(load);
</script>
<template>
  <div v-if="loaded" class="app" :class="{ editing: editMode }" :style="{ '--accent': settings.accent }">
    <NuxtRouteAnnouncer />
    <div class="toolbar">
      <button class="tool-btn" :class="{ active: editMode }" :title="editMode ? 'Finish editing' : 'Edit links'" @click="editMode = !editMode">
        {{ editMode ? 'Done' : 'Edit' }}
      </button>
      <button class="tool-btn" title="Settings" @click="showSettings = true">&#9881;</button>
    </div>
    <Clock />
    <Searchbar v-if="settings.showSearchbar" />
    <div ref="deckEl" class="categories" @mousemove="onDeckMove" @click="onDeckClick" @mouseleave="clearDeck">
      <CategoryCard
        v-for="(category, i) in categories"
        :key="category.id"
        :category="category"
        :class="{ active: i === activeIndex }"
        :style="{ '--i': i, '--n': categories.length }"
      />
      <button v-if="editMode" class="add-category" @click="addCategory">+ Add category</button>
    </div>
    <SettingsPanel v-if="showSettings" @close="showSettings = false" />
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
  color-scheme: dark;
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

/*
 * Viewport-proportional scaling: 1rem is 1/120th of the viewport width, but
 * capped at 1/62nd of the viewport height so the single card row always fits
 * vertically (matters on tall or ultrawide screens). Every rem-based size
 * below therefore lands in exactly the same place on any monitor with the
 * same aspect ratio.
 */
html {
  font-size: clamp(10px, min(calc(100vw / 120), calc(100vh / 62)), 60px);
}

:root {
  --accent: #22d3ee;
  --chamfer: 1.4rem;
}

body {
  background: #000;
  color: #d7e4e8;
  font-family: "Anta", sans-serif;
}

.app {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
  padding-top: 1.2rem;
}

/* editing needs wide rows, so fall back to a scrollable two-column grid */
.app.editing {
  height: auto;
  min-height: 100dvh;
  overflow: visible;
}

/* cascading deck: every card keeps its full width, later cards sit on top of
 * earlier ones so each card's title strip stays peeking out; hovering a card
 * lifts it fully in front */
.categories {
  --card-w: 22rem;
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  max-width: 92vw;
  margin: 0 auto;
  padding-bottom: 1.6rem;
}

/* while a card is open, dim the rest of the deck and hide their links so the
 * stacked cards read as labelled tabs; at rest the full deck stays visible */
.app:not(.editing) .categories:has(.card.active) .card:not(.active) {
  opacity: .45;
}

.app:not(.editing) .categories:has(.card.active) .card:not(.active) ul {
  opacity: 0;
}

.app.editing .categories {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-content: start;
  gap: 2rem;
  padding-bottom: 4rem;
}

.app.editing .card {
  position: static;
  width: auto;
  height: auto;
  transform: none;
  opacity: 1;
}

.toolbar {
  position: fixed;
  top: 1.2rem;
  right: 1.5rem;
  display: flex;
  gap: .7rem;
  z-index: 20;
}

.tool-btn {
  font-family: "Orbitron", sans-serif;
  font-size: 1.05rem;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--accent);
  background: #04090b;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  padding: .5rem 1.1rem;
  cursor: pointer;
  clip-path: polygon(.7rem 0, 100% 0, 100% calc(100% - .7rem), calc(100% - .7rem) 100%, 0 100%, 0 .7rem);
}

.tool-btn:hover,
.tool-btn.active {
  background: color-mix(in srgb, var(--accent) 14%, #04090b);
}

.add-category {
  min-height: 10rem;
  background: transparent;
  border: 2px dashed color-mix(in srgb, var(--accent) 45%, transparent);
  color: var(--accent);
  font-family: "Orbitron", sans-serif;
  font-size: 1.4rem;
  letter-spacing: .1em;
  cursor: pointer;
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
}

.add-category:hover {
  background: color-mix(in srgb, var(--accent) 8%, transparent);
}
</style>
