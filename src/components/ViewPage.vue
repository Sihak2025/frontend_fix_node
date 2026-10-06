<!-- @format -->

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import Header from '../layout/Header.vue';
  import Footer from '../layout/Footer.vue';
  import { getAllProduct } from '../service/productService.js';
  import { getAllCategory } from '../service/categoryService.js';

  const router = useRouter();
  const products = ref([]);
  const categories = ref([]);
  const selectedCategory = ref('all');
  const loading = ref(false);

  // Slides for Banner
  const slides = [
    {
      image:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600',
      title: 'New Collection',
      description: 'Discover our latest products with premium quality',
    },
    {
      image:
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1600',
      title: 'Best Products',
      description: 'Quality products at great prices for everyone',
    },
    {
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600',
      title: 'Special Offers',
      description: 'Get amazing discounts on your favorite items today',
    },
  ];

  const currentSlide = ref(0);
  let interval = null;

  const startAutoSlide = () => {
    stopAutoSlide();
    interval = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  };

  const prevSlide = () => {
    currentSlide.value =
      (currentSlide.value - 1 + slides.length) % slides.length;
  };

  const goToSlide = (index) => {
    currentSlide.value = index;
    startAutoSlide();
  };

  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
      prevSlide();
      startAutoSlide();
    }
    if (event.key === 'ArrowRight') {
      nextSlide();
      startAutoSlide();
    }
  };

  // Function សម្រាប់កាត់តម្រឹមអក្សរ Description ឱ្យខ្លី
  const truncateText = (text, limit = 25) => {
    if (!text) return 'No description available';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // API product and category
  const fetchData = async () => {
    try {
      loading.value = true;
      const [prodRes, catRes] = await Promise.all([
        getAllProduct(),
        getAllCategory(),
      ]);
      products.value = prodRes.data || prodRes || [];
      categories.value = catRes.data || catRes || [];
    } catch (error) {
      console.error('Failed to fetch store data:', error);
    } finally {
      loading.value = false;
    }
  };

  // Filter products by selected category
  const filteredProducts = computed(() => {
    if (selectedCategory.value === 'all') {
      return products.value;
    }
    return products.value.filter(
      (p) =>
        p.categoryId === selectedCategory.value ||
        p.category?.id === selectedCategory.value,
    );
  });

  onMounted(() => {
    startAutoSlide();
    fetchData();
    window.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    stopAutoSlide();
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<template>
  <div
    class="min-h-screen bg-slate-50 font-sans flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
    <div>
      <Header />
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <section
          class="relative bg-slate-900 w-full overflow-hidden rounded-3xl border border-slate-200/80 shadow-lg"
          @mouseenter="stopAutoSlide"
          @mouseleave="startAutoSlide">
          <div class="relative h-[380px] sm:h-[480px] md:h-[540px]">
            <div
              v-for="(slide, index) in slides"
              :key="index"
              class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              :class="
                currentSlide === index
                  ? 'z-10 opacity-100'
                  : 'pointer-events-none z-0 opacity-0'
              ">
              <img
                :src="slide.image"
                :alt="slide.title"
                class="h-full w-full object-cover transform scale-105 transition-transform duration-1000" />
              <div
                class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent"></div>
              <div
                class="absolute inset-0 z-20 flex items-center justify-center px-6 text-center text-white">
                <div class="max-w-3xl space-y-4">
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 backdrop-blur-md">
                    Welcome to Shop Anh
                  </span>
                  <h1
                    class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
                    {{ slide.title }}
                  </h1>
                  <p
                    class="mx-auto max-w-xl text-sm sm:text-lg text-slate-300 font-medium">
                    {{ slide.description }}
                  </p>
                  <div class="pt-2">
                    <button
                      type="button"
                      class="rounded-2xl bg-indigo-600 px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0 cursor-pointer">
                      Explore Collection
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Previous slide"
            @click="
              prevSlide();
              startAutoSlide();
            "
            class="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/30 cursor-pointer">
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Next slide"
            @click="
              nextSlide();
              startAutoSlide();
            "
            class="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/30 cursor-pointer">
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            class="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
            <button
              v-for="(_, index) in slides"
              :key="`indicator-${index}`"
              type="button"
              @click="goToSlide(index)"
              class="h-2.5 rounded-full transition-all duration-300 cursor-pointer"
              :class="
                currentSlide === index
                  ? 'w-8 bg-indigo-500 shadow-md shadow-indigo-500/50'
                  : 'w-2.5 bg-white/40 hover:bg-white/70'
              "></button>
          </div>
        </section>
        <div
          class="flex items-center justify-between overflow-x-auto pb-2 scrollbar-none">
          <div class="flex items-center gap-2.5 min-w-max">
            <button
              type="button"
              @click="selectedCategory = 'all'"
              class="rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
              :class="
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              ">
              All categories
            </button>
            <button
              v-for="cat in categories"
              :key="cat.id"
              type="button"
              @click="selectedCategory = cat.id"
              class="rounded-2xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-sm"
              :class="
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              ">
              {{ cat.name }}
            </button>
          </div>
        </div>
        <section
          class="bg-white border border-slate-200/80 rounded-3xl shadow-sm p-6 sm:p-8 space-y-8">
          <div
            v-if="loading"
            class="py-20 text-center text-slate-400 font-medium">
            Loading products...
          </div>
          <div
            v-else-if="filteredProducts.length === 0"
            class="py-20 text-center space-y-2">
            <p class="text-lg font-semibold text-slate-700">
              No products found
            </p>
            <p class="text-sm text-slate-400">
              Try selecting another category or check back later.
            </p>
          </div>

          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <router-link
              v-for="product in filteredProducts"
              :key="product.id"
              :to="`/productdetail/${product.id}`"
              class="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
              <div
                class="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div
                  v-else
                  class="h-full w-full flex items-center justify-center text-slate-400 text-sm font-medium">
                  No Image Available
                </div>
                <span
                  class="absolute top-3 left-3 px-3 py-1 bg-blue-400 backdrop-blur-md text-slate-800 text-xs font-semibold rounded-lg shadow-sm">
                  {{ product.category?.name}}
                </span>
              </div>
              <div
                class="p-5 flex items-end justify-between bg-white border-t border-slate-100 gap-2">
                <div class="space-y-1">
                  <h3
                    class="font-bold text-slate-900 text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {{ product.name }}
                  </h3>
                  <p
                    class="text-xs text-slate-400 font-medium"
                    :title="product.description">
                    {{ truncateText(product.description, 25) }}
                  </p>
                  <span class="text-lg text-indigo-600 font-black block pt-1">
                    ${{ product.price }}
                  </span>
                </div>

                <span
                  class="rounded-xl bg-indigo-50 text-indigo-600 font-bold px-4 py-2.5 text-xs transition-all duration-200 hover:bg-indigo-600 hover:text-white shadow-sm cursor-pointer shrink-0">
                  Buy Now
                </span>
              </div>
            </router-link>
          </div>
          <div
            class="flex items-center justify-between pt-6 border-t border-slate-100 text-sm">
            <button
              type="button"
              class="inline-flex items-center text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm font-semibold rounded-xl px-4 py-2.5 transition cursor-pointer">
              <svg
                class="w-4 h-4 me-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 12h14M5 12l4-4m-4 4 4 4" />
              </svg>
              Previous
            </button>
            <div
              class="hidden sm:flex items-center gap-1 font-semibold text-slate-600">
              <span
                class="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white shadow-sm"
                >1</span
              >
              <span
                class="px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >2</span
              >
              <span
                class="px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >3</span
              >
              <span class="px-2 text-slate-400">...</span>
              <span
                class="px-3.5 py-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >4</span
              >
            </div>
            <button
              type="button"
              class="inline-flex items-center text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm font-semibold rounded-xl px-4 py-2.5 transition cursor-pointer">
              Next
              <svg
                class="w-4 h-4 ms-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4" />
              </svg>
            </button>
          </div>
        </section>
      </main>
    </div>
    <Footer />
  </div>
</template>
