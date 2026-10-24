<script setup lang="ts">
import { useStore } from '~/composables/useStore'

const { settings } = useStore()

const now = ref(new Date())
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => (now.value = new Date()), 1000)
})

onBeforeUnmount(() => clearInterval(interval))

const formatted = computed(() => {
  const d = now.value
  return settings.value.clockFormat
    .replace('HH', String(d.getHours()).padStart(2, '0'))
    .replace('mm', String(d.getMinutes()).padStart(2, '0'))
    .replace('ss', String(d.getSeconds()).padStart(2, '0'))
})
</script>

<template>
  <div class="clock">{{ formatted }}</div>
</template>

<style scoped>
.clock {
  font-family: "Orbitron", sans-serif;
  font-size: 11rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-align: center;
  color: #e8f7fa;
  text-shadow:
    0 0 .4rem color-mix(in srgb, var(--accent) 80%, transparent),
    0 0 2.5rem color-mix(in srgb, var(--accent) 45%, transparent);
  margin: 3rem 0 3.5rem;
}
</style>
