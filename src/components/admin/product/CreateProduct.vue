<!-- @format -->

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { createProduct } from '../../../service/productService.js';
  import { getAllCategory } from '../../../service/categoryService.js';
  import SidebarAdmin from '../../../layout/SidebarAdmin.vue';

  const router = useRouter();
  const categories = ref([]);
  const loading = ref(false);
  const errorMessage = ref('');

  const products = ref({
    name: '',
    categoryId: '',
    price: '',
    image: '',
    description: '',
  });

  const fetchCategories = async () => {
    try {
      const response = await getAllCategory();
      categories.value = response.data || response || [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleCreate = async () => {
    if (!products.value.name.trim()) {
      errorMessage.value = 'Product name is required!';
      return;
    }

    try {
      loading.value = true;
      errorMessage.value = '';

      await createProduct(products.value);
      router.push('/productlist');
    } catch (error) {
      console.error('Create product fail..', error);
      errorMessage.value = 'Failed to create product. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchCategories();
  });
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex font-sans">
    <SidebarAdmin />
    <main class="flex-1 p-6 sm:p-8 overflow-y-auto">
      <div class="max-w-2xl mx-auto space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-slate-900">
              Create New Product
            </h1>
            <p class="text-sm text-slate-500">
              Add a new product to your store inventory
            </p>
          </div>
          <router-link
            to="/productlist"
            class="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition">
            &larr; Back to List
          </router-link>
        </div>
        <div
          class="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <form
            @submit.prevent="handleCreate"
            class="space-y-6">
            <div
              v-if="errorMessage"
              class="p-3 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-xl">
              {{ errorMessage }}
            </div>
            <div class="space-y-1.5">
              <label
                for="name"
                class="block text-sm font-semibold text-slate-700">
                Product Name <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="products.name"
                type="text"
                placeholder="e.g., Wireless Headphones..."
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="space-y-1.5">
              <label
                for="category"
                class="block text-sm font-semibold text-slate-700">
                Category <span class="text-red-500">*</span>
              </label>
              <select
                id="category"
                v-model="products.categoryId"
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition">
                <option
                  value=""
                  disabled>
                  Select a category
                </option>
                <option
                  v-for="cat in categories"
                  :key="cat.id || cat._id"
                  :value="cat.id || cat._id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
            <div class="space-y-1.5">
              <label
                for="price"
                class="block text-sm font-semibold text-slate-700">
                Price ($) <span class="text-red-500">*</span>
              </label>
              <input
                id="price"
                v-model="products.price"
                type="number"
                step="0.01"
                placeholder="0.00"
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="space-y-1.5">
              <label
                for="description"
                class="block text-sm font-semibold text-slate-700">
                Description
              </label>
              <input
                id="description"
                v-model="products.description"
                type="text"
                placeholder="Enter product description..."
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div class="space-y-1.5">
              <label
                for="image"
                class="block text-sm font-semibold text-slate-700">
                Image URL
              </label>
              <input
                id="image"
                v-model="products.image"
                type="text"
                placeholder="https://example.com/image.jpg"
                class="w-full py-2.5 px-3.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition" />
            </div>
            <div
              class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                :disabled="loading"
                class="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition disabled:opacity-50 cursor-pointer">
                {{ loading ? 'Creating...' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>
