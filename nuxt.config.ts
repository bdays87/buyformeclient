import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/fonts', '@nuxt/icon/module', '@nuxt/image'],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8001'
    }
  },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss() as any]
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true }
})
