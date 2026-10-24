<script setup lang="ts">
import { useStore } from '~/composables/useStore'

const emit = defineEmits<{ (e: 'close'): void }>()
const { settings, exportConfig, importConfig, resetConfig } = useStore()

const fileInput = ref<HTMLInputElement | null>(null)
const message = ref('')

const presets = ['#22d3ee', '#f59e0b', '#e879f9', '#4ade80', '#e5e7eb']

function pickFile() {
  fileInput.value?.click()
}

async function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  try {
    await importConfig(file)
    message.value = 'Config imported.'
  } catch {
    message.value = 'Could not read that file — is it a Nutab export?'
  }
}

function doReset() {
  if (!confirm('Reset all categories, links and settings to defaults?')) return
  resetConfig()
  message.value = 'Reset to defaults.'
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="panel">
      <div class="panel-inner">
        <div class="panel-head">
          <h2>Settings</h2>
          <button class="icon-btn" title="Close" @click="emit('close')">&#10005;</button>
        </div>

        <label class="row">
          <span>Search engine</span>
          <select v-model="settings.searchEngine" class="field">
            <option value="kagi">Kagi</option>
            <option value="duckduckgo">DuckDuckGo</option>
            <option value="google">Google</option>
            <option value="custom">Custom</option>
          </select>
        </label>

        <label v-if="settings.searchEngine === 'custom'" class="row">
          <span>Search URL (use {q})</span>
          <input v-model="settings.customSearchUrl" class="field" placeholder="https://example.com/search?q={q}" />
        </label>

        <label class="row">
          <span>Clock format</span>
          <input v-model="settings.clockFormat" class="field narrow" list="clock-formats" />
          <datalist id="clock-formats">
            <option value="HH:mm" />
            <option value="HH:mm:ss" />
          </datalist>
        </label>

        <label class="row">
          <span>Show searchbar</span>
          <input v-model="settings.showSearchbar" type="checkbox" class="check" />
        </label>

        <div class="row">
          <span>Accent color</span>
          <div class="accent-row">
            <input v-model="settings.accent" type="color" class="color" />
            <button
              v-for="p in presets"
              :key="p"
              class="swatch"
              :class="{ active: settings.accent === p }"
              :style="{ background: p }"
              :title="p"
              @click="settings.accent = p"
            />
          </div>
        </div>

        <div class="panel-actions">
          <button class="btn" @click="exportConfig">Export</button>
          <button class="btn" @click="pickFile">Import</button>
          <button class="btn danger" @click="doReset">Reset</button>
        </div>
        <p v-if="message" class="message">{{ message }}</p>

        <input ref="fileInput" type="file" accept="application/json,.json" class="hidden-file" @change="onFile" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / .75);
  backdrop-filter: blur(.3rem);
  display: grid;
  place-items: center;
  z-index: 30;
}

.panel {
  --chamfer: 1.6rem;
  width: min(46rem, 92vw);
  max-height: 90vh;
  overflow: auto;
  padding: 2px;
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--accent) 80%, #fff 5%),
    color-mix(in srgb, var(--accent) 25%, transparent)
  );
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
  filter: drop-shadow(0 0 1.5rem color-mix(in srgb, var(--accent) 30%, transparent));
}

.panel-inner {
  clip-path: polygon(var(--chamfer) 0, 100% 0, 100% calc(100% - var(--chamfer)), calc(100% - var(--chamfer)) 100%, 0 100%, 0 var(--chamfer));
  background:
    repeating-linear-gradient(0deg, rgb(255 255 255 / 0.02) 0 1px, transparent 1px 4px),
    linear-gradient(165deg, #0c171c 0%, #070d10 55%, #04080a 100%);
  padding: 2rem;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
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

.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 1.3rem;
}

.field {
  background: #060b0d;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  color: #dfe9ec;
  padding: .5rem .7rem;
  font-size: 1.2rem;
  outline: none;
  min-width: 0;
  flex: 1;
  max-width: 24rem;
}

.field:focus {
  border-color: var(--accent);
  box-shadow: 0 0 .5rem color-mix(in srgb, var(--accent) 35%, transparent);
}

.field.narrow {
  flex: 0 0 auto;
  width: 12rem;
}

.check {
  width: 1.6rem;
  height: 1.6rem;
  accent-color: var(--accent);
}

.accent-row {
  display: flex;
  align-items: center;
  gap: .5rem;
}

.color {
  width: 3.2rem;
  height: 2.2rem;
  background: #060b0d;
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  cursor: pointer;
}

.swatch {
  width: 2.2rem;
  height: 2.2rem;
  border: 1px solid rgb(255 255 255 / .2);
  cursor: pointer;
}

.swatch.active {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.panel-actions {
  display: flex;
  gap: .8rem;
  margin-top: 2rem;
}

.btn {
  font-family: "Orbitron", sans-serif;
  font-size: 1.05rem;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--accent);
  background: #04090b;
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  padding: .6rem 1.4rem;
  cursor: pointer;
  clip-path: polygon(.6rem 0, 100% 0, 100% calc(100% - .6rem), calc(100% - .6rem) 100%, 0 100%, 0 .6rem);
}

.btn:hover {
  background: color-mix(in srgb, var(--accent) 14%, #04090b);
}

.btn.danger {
  color: #ff5d73;
  border-color: rgb(255 93 115 / .4);
}

.btn.danger:hover {
  background: rgb(255 93 115 / .15);
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

.message {
  margin-top: 1rem;
  font-size: 1.15rem;
  color: var(--accent);
}

.hidden-file {
  display: none;
}
</style>
