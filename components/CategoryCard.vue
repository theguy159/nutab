<script setup lang="ts">
import { useStore, uid } from '~/composables/useStore'
import type { CategoryConfig, LinkConfig } from '~/composables/useStore'
import { faviconUrl, normalizeHref, withBase } from '~/utils/favicon'

const props = defineProps<{ category: CategoryConfig }>()
const { categories, editMode } = useStore()

function removeCategory() {
  if (!confirm(`Delete category "${props.category.title}" and all its links?`)) return
  categories.value = categories.value.filter((c) => c.id !== props.category.id)
}

function addLink() {
  props.category.links.push({ id: uid(), title: 'New link', href: 'https://' })
}

function removeLink(link: LinkConfig) {
  props.category.links = props.category.links.filter((l) => l !== link)
}

function moveLink(index: number, dir: number) {
  const links = props.category.links
  const target = index + dir
  if (target < 0 || target >= links.length) return
  ;[links[index], links[target]] = [links[target], links[index]]
}

function moveToCategory(link: LinkConfig, targetId: string) {
  if (targetId === props.category.id) return
  const target = categories.value.find((c) => c.id === targetId)
  if (!target) return
  props.category.links = props.category.links.filter((l) => l !== link)
  target.links.push(link)
}

function useFallback(event: Event) {
  const img = event.target as HTMLImageElement
  if (img.dataset.fallback) return
  img.dataset.fallback = '1'
  img.src = withBase('/default_favicon.png')
}
</script>
<template>
  <div class="card">
    <div class="card-inner">
      <div class="card-head">
        <input v-if="editMode" v-model="category.title" class="edit-input title-input" />
        <h2 v-else>{{ category.title }}</h2>
        <button v-if="editMode" class="icon-btn danger" title="Delete category" @click="removeCategory">&#10005;</button>
      </div>
      <ul>
        <li v-for="(link, i) in category.links" :key="link.id">
          <a v-if="!editMode" :href="normalizeHref(link.href)">
            <img :src="faviconUrl(link)" @error="useFallback" alt="" />
            <span>{{ link.title }}</span>
          </a>
          <div v-else class="edit-row">
            <input v-model="link.title" class="edit-input" placeholder="Title" />
            <input v-model="link.href" class="edit-input" placeholder="https://example.com" @blur="link.href = normalizeHref(link.href)" />
            <input v-model="link.icon" class="edit-input" placeholder="Icon URL (optional)" />
            <div class="edit-actions">
              <button class="icon-btn" title="Move up" @click="moveLink(i, -1)">&#8593;</button>
              <button class="icon-btn" title="Move down" @click="moveLink(i, 1)">&#8595;</button>
              <select
                class="edit-input move-select"
                title="Move to category"
                :value="category.id"
                @change="moveToCategory(link, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.title }}</option>
              </select>
              <button class="icon-btn danger" title="Delete link" @click="removeLink(link)">&#10005;</button>
            </div>
          </div>
        </li>
      </ul>
      <button v-if="editMode" class="add-link" @click="addLink">+ Add link</button>
    </div>
  </div>
</template>

<style scoped>
/* chamfered sci-fi frame: accent gradient edge, dark inner panel */
.card {
  position: absolute;
  top: 0;
  bottom: 1.6rem;
  width: var(--card-w, 22rem);
  left: calc(var(--i, 0) * (100% - var(--card-w, 22rem)) / max(1, var(--n, 1) - 1));
  z-index: calc(var(--i, 0) + 1);
  padding: 2px;
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--accent) 80%, #fff 5%),
    color-mix(in srgb, var(--accent) 20%, transparent) 55%,
    color-mix(in srgb, var(--accent) 45%, transparent)
  );
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
  filter: drop-shadow(0 0 .6rem color-mix(in srgb, var(--accent) 18%, transparent));
  transition: transform .25s ease, opacity .25s ease, filter .25s ease;
}

/* the active card lifts fully in front of the deck */
.card.active {
  z-index: 100;
  transform: translateY(-.6rem);
  filter: drop-shadow(0 0 1.2rem color-mix(in srgb, var(--accent) 35%, transparent));
}

.card-inner {
  position: relative;
  height: 100%;
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
  background:
    repeating-linear-gradient(0deg, rgb(255 255 255 / 0.02) 0 1px, transparent 1px 4px),
    linear-gradient(
      165deg,
      color-mix(in srgb, var(--accent) 14%, #04080a) 0%,
      color-mix(in srgb, var(--accent) 7%, #04080a) 55%,
      color-mix(in srgb, var(--accent) 3%, #04080a) 100%
    );
  padding: 1.6rem;
}

ul {
  list-style-type: none;
  transition: opacity .25s ease;
}

.card-head {
  display: flex;
  align-items: center;
  gap: .6rem;
  margin-bottom: 1.2rem;
}

h2 {
  font-family: "Orbitron", sans-serif;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--accent);
  text-shadow: 0 0 1rem color-mix(in srgb, var(--accent) 45%, transparent);
}

a {
  display: grid;
  grid-template-columns: 1.6rem 1fr;
  align-items: center;
  gap: .8rem;
  margin: .7rem 0;
  font-size: 1.25rem;
  line-height: 1.3;
  color: inherit;
  text-decoration: none;
  transition: color .15s ease, text-shadow .15s ease;
}

a:hover {
  color: var(--accent);
  text-shadow: 0 0 .6rem color-mix(in srgb, var(--accent) 60%, transparent);
}

li img {
  object-fit: contain;
  width: 1.6rem;
  height: 1.6rem;
}

/* -- edit mode -- */
.title-input {
  flex: 1;
  font-family: "Orbitron", sans-serif;
  font-size: 1.5rem;
  letter-spacing: .1em;
  text-transform: uppercase;
}

.edit-row {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1.2fr auto;
  gap: .5rem;
  align-items: center;
  margin: .6rem 0;
}

.edit-input {
  background: #060b0d;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: #dfe9ec;
  padding: .45rem .6rem;
  font-size: 1.15rem;
  outline: none;
  min-width: 0;
}

.edit-input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 .5rem color-mix(in srgb, var(--accent) 35%, transparent);
}

.edit-actions {
  display: flex;
  align-items: center;
  gap: .3rem;
}

.icon-btn {
  background: transparent;
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  color: var(--accent);
  font-size: 1.1rem;
  line-height: 1;
  padding: .35rem .5rem;
  cursor: pointer;
}

.icon-btn:hover {
  background: color-mix(in srgb, var(--accent) 18%, transparent);
}

.icon-btn.danger {
  color: #ff5d73;
  border-color: rgb(255 93 115 / .4);
}

.icon-btn.danger:hover {
  background: rgb(255 93 115 / .15);
}

.move-select {
  font-size: 1rem;
  max-width: 8rem;
}

.add-link {
  margin-top: .8rem;
  background: transparent;
  border: 1px dashed color-mix(in srgb, var(--accent) 50%, transparent);
  color: var(--accent);
  padding: .5rem 1rem;
  font-size: 1.15rem;
  cursor: pointer;
}

.add-link:hover {
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
</style>
