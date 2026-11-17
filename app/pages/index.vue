<script setup lang="ts">
interface Shop {
  id: number
  name: string
  logo_url: string | null
  suburb: string
  city: { name: string }
  primary_vendor_type: { name: string, icon: string }
}

interface ApiResponse<T> {
  data: T
}

useHead({
  title: 'Buy4Me — Tell us what to buy',
  meta: [{ name: 'description', content: 'Send your shopping list, see a clear quote, and have a verified assistant shop and deliver for you.' }]
})

const config = useRuntimeConfig()
const { data: shopResponse, status: shopStatus, error: shopError } = await useFetch<ApiResponse<Shop[]>>(
  `${config.public.apiBase}/api/v1/shops`,
  { key: 'customer-active-shops' }
)
const shops = computed(() => shopResponse.value?.data ?? [])
const brokenShopLogos = ref(new Set<number>())

function markShopLogoUnavailable(shopId: number) {
  brokenShopLogos.value = new Set([...brokenShopLogos.value, shopId])
}

if (import.meta.client) {
  watch(shops, (records) => {
    for (const shop of records) {
      if (!shop.logo_url || brokenShopLogos.value.has(shop.id)) continue

      const logo = new Image()
      logo.onerror = () => markShopLogoUnavailable(shop.id)
      logo.src = shop.logo_url
    }
  }, { immediate: true })
}

const patternIcons = [
  { icon: 'lucide:shopping-basket', style: 'left: 4%; top: 18%; transform: rotate(-12deg)' },
  { icon: 'lucide:apple', style: 'left: 15%; top: 72%; transform: rotate(8deg)' },
  { icon: 'lucide:milk', style: 'left: 29%; top: 12%; transform: rotate(-8deg)' },
  { icon: 'lucide:croissant', style: 'left: 38%; top: 78%; transform: rotate(14deg)' },
  { icon: 'lucide:pill', style: 'left: 52%; top: 16%; transform: rotate(25deg)' },
  { icon: 'lucide:hammer', style: 'left: 63%; top: 76%; transform: rotate(-18deg)' },
  { icon: 'lucide:coffee', style: 'left: 77%; top: 10%; transform: rotate(8deg)' },
  { icon: 'lucide:shirt', style: 'left: 89%; top: 67%; transform: rotate(-12deg)' }
]

const steps = [
  {
    title: 'Tell us what you need',
    body: 'Choose a shop, add your shopping list, and tell us where it should be delivered.',
    icon: 'lucide:list-plus'
  },
  {
    title: 'Review and approve your quote',
    body: 'See the item estimate, shopping service fee, and delivery charge before you pay.',
    icon: 'lucide:receipt-text'
  },
  {
    title: 'Receive your shopping',
    body: 'Your assistant shops, confirms the receipt, and brings everything to your door.',
    icon: 'lucide:shopping-bag'
  }
]
</script>

<template>
  <div class="min-h-screen bg-base-100 text-base-content">
    <div class="shopping-hero relative overflow-hidden text-primary-content">
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 overflow-hidden">
        <Icon v-for="item in patternIcons" :key="item.style" :name="item.icon" :style="item.style" class="shopping-hero-icon absolute size-16 sm:size-20" />
      </div>

      <header class="relative z-10 border-b border-primary-content/20">
        <div class="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="navbar-start">
            <a href="#top" class="flex items-center gap-2.5" aria-label="Buy4Me home">
              <span class="grid size-10 place-items-center rounded-xl bg-base-100 font-black text-base-content">B4</span>
              <span class="text-xl font-black tracking-[-0.04em]">Buy4Me</span>
            </a>
          </div>
          <nav class="navbar-center hidden gap-1 md:flex" aria-label="Main navigation">
            <a href="#shops" class="btn btn-ghost btn-sm">Shops</a>
            <a href="#how-it-works" class="btn btn-ghost btn-sm">How it works</a>
          </nav>
          <div class="navbar-end">
            <button type="button" class="btn border-primary-content/35 bg-transparent text-primary-content hover:bg-primary-content/10">Sign in</button>
          </div>
        </div>
      </header>

      <main id="top" class="relative z-10">
        <section class="hero">
          <div class="hero-content mx-auto grid w-full max-w-7xl gap-9 px-4 py-10 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8 lg:py-14">
            <div class="max-w-xl text-center lg:text-left">
              <h1 class="text-4xl font-black leading-[1.04] tracking-[-0.055em] sm:text-5xl lg:text-6xl">Your list. Our trip. Delivered.</h1>
              <p class="mx-auto mt-5 max-w-lg text-base leading-7 text-primary-content/80 sm:text-lg lg:mx-0">
                Buy4Me connects you with a local shopping assistant who buys what you need from the shops you choose and delivers it to your door.
              </p>
              <div class="mt-7 flex justify-center lg:justify-start">
                <button type="button" class="btn btn-neutral btn-lg sm:min-w-48">Start a request<Icon name="lucide:arrow-right" class="size-5" /></button>
              </div>
            </div>

            <figure class="relative mx-auto w-full max-w-2xl lg:ml-auto">
              <div aria-hidden="true" class="absolute inset-x-[18%] bottom-[4%] h-[18%] rounded-full bg-neutral/20 blur-2xl" />
              <NuxtImg
                src="/images/buy4me-hero-shopping.png"
                alt="A Buy4Me assistant shops for groceries while a customer receives shopping at her door"
                width="1536"
                height="1024"
                format="webp"
                quality="88"
                preload
                class="relative z-10 h-auto w-full drop-shadow-2xl"
              />
            </figure>
          </div>
        </section>
      </main>
    </div>

    <section id="shops" class="relative z-20 -mt-10 pb-14 sm:-mt-12 sm:pb-18">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="card card-border bg-base-100 shadow-xl shadow-neutral/10">
          <div class="card-body p-5 sm:p-8">
            <div>
              <div><h2 class="text-3xl font-black tracking-[-0.04em] sm:text-4xl">Where should we shop?</h2><p class="mt-2 text-base-content/60">Choose a listed shop or simply name another one in your request.</p></div>
            </div>

            <div v-if="shopStatus === 'pending'" class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div v-for="index in 3" :key="index" class="card card-border overflow-hidden"><div class="skeleton h-44 w-full rounded-none" /><div class="card-body gap-3"><div class="skeleton h-5 w-2/3" /><div class="skeleton h-4 w-1/2" /></div></div>
            </div>
            <div v-else-if="shopError" role="alert" class="alert alert-warning alert-soft mt-7"><Icon name="lucide:triangle-alert" /><span>Shops are unavailable right now. You can still enter any shop in your request.</span></div>
            <div v-else class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article v-for="shop in shops" :key="shop.id" class="card card-border overflow-hidden bg-base-100">
                <figure class="h-44 bg-base-200 p-5">
                  <img
                    v-if="shop.logo_url && !brokenShopLogos.has(shop.id)"
                    :src="shop.logo_url"
                    :alt="`${shop.name} logo`"
                    class="h-full w-full object-contain"
                    @error="markShopLogoUnavailable(shop.id)"
                  >
                  <Icon v-else :name="shop.primary_vendor_type.icon || 'lucide:store'" class="size-16 text-base-content/25" />
                </figure>
                <div class="card-body gap-1 p-5"><h3 class="card-title text-lg">{{ shop.name }}</h3><p class="text-sm text-base-content/55">{{ shop.suburb }}, {{ shop.city.name }} · {{ shop.primary_vendor_type.name }}</p></div>
              </article>
              <article class="card card-dash min-h-64 bg-base-200/45">
                <div class="card-body items-center justify-center text-center">
                  <span class="grid size-14 place-items-center rounded-2xl bg-base-100"><Icon name="lucide:map-pin-plus" class="size-7" /></span>
                  <h3 class="card-title mt-2">Another shop?</h3>
                  <p class="max-w-xs text-sm leading-6 text-base-content/55">Enter its name in your request and we’ll confirm whether an assistant can shop there.</p>
                  <div class="card-actions mt-2"><a href="#top" class="btn btn-sm">Name a shop</a></div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="how-journey relative overflow-hidden bg-neutral py-16 text-neutral-content sm:py-20">
      <div class="relative z-10 mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-8">
        <div class="max-w-lg">
          <div class="flex items-center gap-3 text-sm font-bold text-accent">
            <span class="h-px w-9 bg-accent" />
            How Buy4Me works
          </div>
          <h2 class="mt-5 text-4xl font-black leading-tight tracking-[-0.045em] sm:text-5xl">From your list to your door.</h2>
          <p class="mt-5 max-w-md text-base leading-7 text-neutral-content/60">One request starts the whole journey. You see the cost before paying and stay informed until your shopping arrives.</p>
        </div>

        <ol class="relative">
          <li v-for="(step, index) in steps" :key="step.title" class="group relative grid grid-cols-[3.75rem_1fr] gap-5 pb-9 last:pb-0 sm:grid-cols-[4.5rem_1fr] sm:gap-7">
            <div v-if="index < steps.length - 1" aria-hidden="true" class="absolute top-15 bottom-0 left-[1.85rem] w-px bg-gradient-to-b from-accent/65 to-neutral-content/10 sm:left-[2.23rem]" />
            <span class="relative z-10 grid size-15 place-items-center rounded-full border border-accent/45 bg-accent text-accent-content shadow-lg shadow-neutral sm:size-18">
              <Icon :name="step.icon" class="size-6 sm:size-7" />
            </span>
            <div class="border-b border-neutral-content/10 pb-9 last:border-0 last:pb-0">
              <p class="text-sm font-bold text-accent">0{{ index + 1 }}</p>
              <h3 class="mt-1 text-xl font-black sm:text-2xl">{{ step.title }}</h3>
              <p class="mt-2 max-w-xl leading-7 text-neutral-content/60">{{ step.body }}</p>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <footer class="footer footer-vertical mx-auto max-w-7xl gap-3 px-4 py-8 sm:footer-horizontal sm:items-center sm:px-6 lg:px-8">
      <div class="flex items-center gap-2"><span class="grid size-8 place-items-center rounded-lg bg-neutral text-xs font-black text-neutral-content">B4</span><span class="font-black">Buy4Me</span></div>
      <p class="text-sm text-base-content/50 sm:ml-auto">Tell us what to buy. We’ll take it from there.</p>
    </footer>
  </div>
</template>
