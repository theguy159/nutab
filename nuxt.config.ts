// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [ '@nuxt/fonts', ],
  fonts: {
    families: [
      { name: 'Orbitron', provider: 'google', weights: [ '400', '700' ] },
      { name: 'Anta', provider: 'google' },
    ],
  },
})
